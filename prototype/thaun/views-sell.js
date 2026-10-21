/* Thaun prototype: seller flow. Pin → trace → details → photos → verify → preview. */
(function () {
  const G = TH.geo, M = TH.map, A = TH.app, S = TH.state;
  const STEPS = 6;

  let map, step = 1, d, pinMarker, vertexMarkers = [], edgeMarkers = [], photos = [], orbit;

  const blank = () => ({
    intent: 'sale', type: 'land', place: null, pin: null, coords: [], closed: false, lalpurja: ['', '', '', ''],
    price: '', priceUnit: 'aana', road: { type: 'motorable', widthFt: 13, toBlacktopM: 0 }, water: 'year-round', leaseModels: ['fixed'],
    title: '', blurb: '', tier: 'owner', phone: '', consent: false, docs: {}, drone: false, photoCount: 0,
  });
  const persist = () => { S.draft = d; A.save('draft'); };

  /* ---------- Open Location Code (Plus Code), for sharing a pin without an address ---------- */
  const OLC = '23456789CFGHJMPQRVWX';
  function plusCode(lat, lng) {
    let la = Math.min(Math.max(lat, -90), 90) + 90, lo = ((lng + 180) % 360 + 360) % 360;
    let code = '', res = 20;
    for (let i = 0; i < 5; i++) {
      const a = Math.floor(la / res), b = Math.floor(lo / res);
      la -= a * res; lo -= b * res;
      code += OLC[a] + OLC[b];
      res /= 20;
      if (i === 3) code += '+';
    }
    return code;
  }

  /* ---------- Geometry helpers ---------- */
  const ring = () => (d.coords.length >= 3 ? [...d.coords.filter((_, i) => i < (d.closed ? d.coords.length - 1 : d.coords.length)), d.coords[0]] : null);
  const openCoords = () => (d.closed ? d.coords.slice(0, -1) : d.coords);
  const areaM2 = () => { const r = ring(); return r ? turf.area(turf.polygon([r])) : 0; };

  function renderDrawing() {
    if (!map || !map.getSource('draw')) return;
    const pts = openCoords();
    const r = ring();
    map.getSource('draw').setData({
      type: 'FeatureCollection',
      features: [
        ...(r ? [turf.polygon([r])] : []),
        ...(pts.length >= 2 ? [turf.lineString(d.closed ? r : pts)] : []),
      ],
    });
    vertexMarkers.forEach(m => m.remove());
    edgeMarkers.forEach(m => m.remove());
    vertexMarkers = pts.map((c, i) => {
      const el = document.createElement('div');
      el.className = `vertex ${i === 0 ? 'is-first' : ''}`;
      el.title = i === 0 && !d.closed ? 'Tap to close the shape' : 'Drag to adjust';
      const mk = new maplibregl.Marker({ element: el, draggable: step === 2 }).setLngLat(c).addTo(map);
      mk.on('drag', () => { const p = mk.getLngLat(); updateVertex(i, [p.lng, p.lat], true); });
      mk.on('dragend', () => persist());
      el.addEventListener('click', e => {
        e.stopPropagation();
        if (step === 2 && i === 0 && !d.closed && pts.length >= 3) closeShape();
      });
      return mk;
    });
    if (r && step <= 3) {
      edgeMarkers = G.edgeLengths(d.closed ? r : pts).map(({ mid, m }) => {
        const el = document.createElement('div');
        el.className = 'edge-label';
        el.textContent = `${Math.round(m / 0.3048)} ft`;
        return new maplibregl.Marker({ element: el }).setLngLat(mid).addTo(map);
      });
    }
    renderReadout();
  }
  function updateVertex(i, c, live) {
    if (d.closed) {
      d.coords[i] = c;
      if (i === 0) d.coords[d.coords.length - 1] = c;
    } else d.coords[i] = c;
    if (live) {
      const r = ring();
      map.getSource('draw').setData({ type: 'FeatureCollection', features: [...(r ? [turf.polygon([r]), turf.lineString(d.closed ? r : openCoords())] : [])] });
      edgeMarkers.forEach(m => m.remove());
      edgeMarkers = r ? G.edgeLengths(d.closed ? r : openCoords()).map(({ mid, m }) => new maplibregl.Marker({ element: Object.assign(document.createElement('div'), { className: 'edge-label', textContent: `${Math.round(m / 0.3048)} ft` }) }).setLngLat(mid).addTo(map)) : [];
      renderReadout();
    }
  }
  function closeShape() {
    d.closed = true;
    d.coords = [...d.coords, d.coords[0]];
    persist();
    renderDrawing();
    renderPanel();
    A.toast(`Boundary closed: ${G.rapdWords(areaM2())}`, 'check');
  }

  function renderReadout() {
    const box = document.getElementById('readout');
    if (!box) return;
    const m2 = areaM2();
    const terai = d.place && d.place.terai;
    if (step < 2 || !m2) { box.hidden = step !== 2; box.innerHTML = step === 2 ? `<small>Area</small><strong>—</strong><span>Tap at least three corners</span>` : ''; return; }
    box.hidden = false;
    box.innerHTML = `<small>${d.closed ? 'Your land' : 'Area so far'}</small>
      <strong class="num">${terai ? G.fmtBkd(m2) : G.fmtRapd(m2)}</strong>
      <span class="num">${terai ? 'bigha-kattha-dhur' : 'ropani-aana-paisa-daam'}</span>
      <span class="num">${G.int(m2)} m² · ${G.int(G.sqft(m2))} sq ft${terai ? ` · ${G.fmtRapd(m2)} R-A-P-D` : ''}</span>`;
    const cmp = document.getElementById('cmpResult');
    if (cmp) cmp.outerHTML = compareHtml();
  }

  function compareHtml() {
    const lp = d.lalpurja.map(v => +v || 0);
    const lpM2 = G.rapdToM2(lp);
    const m2 = areaM2();
    if (!lpM2 || !m2) return `<div class="compare-result" id="cmpResult"><span class="muted" style="font-weight:500">Enter the area written on your lalpurja to compare.</span></div>`;
    const diff = ((m2 - lpM2) / lpM2) * 100;
    const abs = Math.abs(diff);
    if (abs <= 5) return `<div class="compare-result ok" id="cmpResult"><i data-lucide="circle-check"></i>Matches your lalpurja (${diff >= 0 ? '+' : ''}${G.num(diff, 1)}%)</div>`;
    if (abs <= 10) return `<div class="compare-result warn" id="cmpResult"><i data-lucide="info"></i>${G.num(abs, 1)}% ${diff > 0 ? 'larger' : 'smaller'} than your lalpurja. Close, but check the corners.</div>`;
    return `<div class="compare-result warn" id="cmpResult"><i data-lucide="triangle-alert"></i>${G.num(abs, 0)}% ${diff > 0 ? 'larger' : 'smaller'} than your lalpurja. Buyers will see the difference, so adjust the corners or upload your naksa (map sheet).</div>`;
  }

  /* ---------- Steps ---------- */
  const choice = (group, value, label, icon, sub, on) => `<button class="choice ${on ? 'is-on' : ''}" data-${group}="${value}"><i data-lucide="${icon}"></i>${label}${sub ? `<small>${sub}</small>` : ''}</button>`;

  function stepHtml() {
    const m2 = areaM2();
    switch (step) {
      case 1: return `
        <div class="eyebrow">Step 1 of ${STEPS} · Location</div>
        <h2 class="display">Where is your land?</h2>
        <p>Search a ward, tole or landmark, then tap the exact spot on the satellite map. No street address needed.</p>
        <label class="field"><span>Search</span><input class="input" id="placeQ" placeholder="e.g. Gokarneshwar-9, Khokana, Bhatbhateni" value=""></label>
        <div class="places" id="places"></div>
        ${d.pin ? `<div class="private"><i data-lucide="map-pin"></i><span><b>Pinned.</b> <span class="num">${d.pin[1].toFixed(5)}, ${d.pin[0].toFixed(5)}</span> · Plus Code <b class="num">${plusCode(d.pin[1], d.pin[0])}</b><br>Drag the pin to fine-tune. Buyers see the exact plot only after you publish.</span></div>`
          : `<div class="callout info"><i data-lucide="hand"></i><span>Tap the map where your land is. You can zoom right in to see your house or field.</span></div>`}`;
      case 2: return `
        <div class="eyebrow">Step 2 of ${STEPS} · Boundary</div>
        <h2 class="display">Trace your boundary</h2>
        <p>Tap each corner of your land on the satellite image, then tap the first corner again to close it. Drag any corner to adjust.</p>
        <div class="compare">
          <span style="font-size:13px;font-weight:600">Area on your lalpurja <span class="muted" style="font-weight:500">(ropani-aana-paisa-daam)</span></span>
          <div class="rapd-inputs">${['Ropani', 'Aana', 'Paisa', 'Daam'].map((u, i) => `<label>${u}<input class="input num" inputmode="decimal" data-lp="${i}" value="${d.lalpurja[i]}"></label>`).join('')}</div>
          ${compareHtml()}
        </div>
        <div class="callout info"><i data-lucide="info"></i><span>Not sure exactly where the line runs? Trace what you know. Buyers see it labelled "Traced by owner" until a surveyor confirms it.</span></div>`;
      case 3: {
        const ask = A.draftTotal(d, m2);
        const area = d.coords.length > 3 ? A.nearestArea(turf.centroid(turf.polygon([ring()])).geometry.coordinates) : null;
        const perAana = ask && m2 ? ask / 1e5 / G.aana(m2) : 0;
        const units = d.intent === 'sale' ? [['aana', 'lakh per aana'], ['lakh', 'lakh total'], ['crore', 'crore total']] : d.intent === 'lease' ? [['npr', 'NPR per ropani per year']] : [['npr', 'NPR per month']];
        if (!units.find(u => u[0] === d.priceUnit)) d.priceUnit = units[0][0];
        return `
        <div class="eyebrow">Step 3 of ${STEPS} · Details</div>
        <h2 class="display">Tell buyers about it</h2>
        <div class="field"><span>I want to</span><div class="choice-grid">
          ${choice('intent', 'sale', 'Sell', 'tag', '', d.intent === 'sale')}${choice('intent', 'lease', 'Lease out', 'handshake', 'incl. farmland', d.intent === 'lease')}${choice('intent', 'rent', 'Rent out', 'key-round', '', d.intent === 'rent')}</div></div>
        <div class="field"><span>It is</span><div class="choice-grid">
          ${choice('type', 'land', 'Land', 'square-dashed', 'ghaderi / plot', d.type === 'land')}${choice('type', 'farmland', 'Farmland', 'sprout', 'khet / bari', d.type === 'farmland')}${choice('type', 'house', 'House', 'house', 'with land', d.type === 'house')}</div></div>
        <label class="field"><span>Price</span>
          <div class="input-group"><input class="input num" id="price" inputmode="decimal" placeholder="${d.priceUnit === 'aana' ? 'e.g. 22' : ''}" value="${d.price}">
          <select class="select" id="priceUnit">${units.map(([k, n]) => `<option value="${k}" ${d.priceUnit === k ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
          <small class="num" id="priceCalc">${d.intent === 'sale' && ask ? `= ${G.nprCompact(ask)} total · ${G.nprCompact(perAana * 1e5)} per aana` : d.intent === 'lease' && d.price ? `= ${G.nprCompact(+d.price * G.ropani(m2))} per year for ${G.num(G.ropani(m2), 1)} ropani` : ''}</small>
        </label>
        ${d.intent === 'sale' && area ? `<div class="compare" id="priceHelp">
          <span style="font-size:13px;font-weight:600">${area.name}: usual range रु ${area.band[0]}–${area.band[1]} L/aana · govt रु ${area.gov} L</span>
          ${perAana ? (perAana > area.band[1] ? `<div class="compare-result warn"><i data-lucide="trending-up"></i>Above the usual range. Listings priced in range get more enquiries.</div>` : perAana < area.band[0] ? `<div class="compare-result warn"><i data-lucide="trending-down"></i>Below the usual range. Buyers may ask why.</div>` : `<div class="compare-result ok"><i data-lucide="circle-check"></i>Within the usual range for ${area.name}.</div>`) : '<span class="muted" style="font-size:13px">Enter a price to compare.</span>'}
          <span class="muted" style="font-size:12px">Indicative guide (Merokalam, May 2026).</span></div>` : ''}
        <div class="field"><span>Road access</span>
          <div style="display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:8px">
            <select class="select" id="roadType">${[['blacktop', 'Blacktop'], ['motorable', 'Gravel, motorable'], ['footpath', 'Footpath only']].map(([k, n]) => `<option value="${k}" ${d.road.type === k ? 'selected' : ''}>${n}</option>`).join('')}</select>
            <input class="input num" id="roadW" inputmode="numeric" value="${d.road.widthFt}" aria-label="Road width in feet" placeholder="Width ft">
            <input class="input num" id="roadD" inputmode="numeric" value="${d.road.toBlacktopM || ''}" aria-label="Distance to blacktop in metres" placeholder="m to blacktop">
          </div><small>Width in feet · distance to the nearest blacktop in metres</small></div>
        <label class="field"><span>Water</span><select class="select" id="water">${[['year-round', 'Year-round'], ['seasonal', 'Seasonal'], ['none', 'None yet'], ['unsure', 'Not sure']].map(([k, n]) => `<option value="${k}" ${d.water === k ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
        ${d.type === 'farmland' && d.intent === 'lease' ? `<div class="field"><span>Lease models you'll accept</span><div class="choice-grid">${Object.entries(TH.FARM.leaseModels).map(([k, m]) => choice('model', k, m.name, 'handshake', m.ne, d.leaseModels.includes(k))).join('')}</div></div>` : ''}
        <label class="field"><span>Title</span><input class="input" id="title" value="${A.esc(d.title)}" placeholder="${A.esc(A.suggestTitle(d, m2))}"></label>
        <label class="field"><span>Description <button class="btn btn-sm btn-ghost" id="draftBlurb" style="height:26px;padding:0 8px"><i data-lucide="wand-sparkles"></i>Draft from my answers</button></span><textarea class="textarea" id="blurb" placeholder="What makes this place good to live on or farm?">${A.esc(d.blurb)}</textarea></label>`;
      }
      case 4: return `
        <div class="eyebrow">Step 4 of ${STEPS} · Photos</div>
        <h2 class="display">Show it</h2>
        <p>Phone photos are fine. Shoot from each corner, from the road, and the view.</p>
        <label class="dropzone" id="drop"><i data-lucide="image-plus"></i><b>Add photos</b><span class="muted" style="font-size:13px">Drag them here or tap to choose</span><input type="file" id="files" accept="image/*" multiple hidden></label>
        <div class="photos" id="photos">${photos.map(p => `<img src="${p}" alt="">`).join('')}</div>
        <div class="callout info"><i data-lucide="scan-search"></i><span>Thaun checks photos for duplicates and for phone numbers written on them, so buyers always come through the listing.</span></div>
        <button class="tier ${d.drone ? 'is-on' : ''}" id="drone"><i data-lucide="plane"></i><div><b>Add a drone 3D flyover</b><span>Buyers abroad can orbit your land in 3D. A pilot visits, and we turn the footage into a 3D scene.</span></div><span class="price">${d.drone ? 'Added' : 'Phase 3'}</span></button>`;
      case 5: return `
        <div class="eyebrow">Step 5 of ${STEPS} · Trust</div>
        <h2 class="display">Get the badge buyers look for</h2>
        <p>Verified listings rank higher and get more serious enquiries.</p>
        <div class="tiers">
          ${[['listed', 'sparkles', 'Listed', 'Phone confirmed. No badge.', 'Free'], ['owner', 'badge-check', 'Owner-verified', 'We check your ID and lalpurja against the plot.', 'Free at launch'], ['site', 'shield-check', 'Site-verified', 'A field agent walks your boundary and measures the road.', 'Fee TBD']]
          .map(([k, i, n, s, p]) => `<button class="tier ${d.tier === k ? 'is-on' : ''}" data-tier="${k}"><i data-lucide="${i}"></i><div><b>${n}</b><span>${s}</span></div><span class="price">${p}</span></button>`).join('')}
        </div>
        <label class="field"><span>Your mobile number</span><input class="input num" id="phone" inputmode="tel" placeholder="98XXXXXXXX" value="${A.esc(d.phone)}"><small>We send a one-time code. Buyers only see your number if you choose to show it.</small></label>
        ${d.tier !== 'listed' ? `
        <div class="field"><span>Private documents</span>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <label class="btn btn-sm ${d.docs.lalpurja ? 'btn-brand' : ''}"><i data-lucide="${d.docs.lalpurja ? 'circle-check' : 'file-up'}"></i>Lalpurja photo<input type="file" accept="image/*,.pdf" data-doc="lalpurja" hidden></label>
            <label class="btn btn-sm ${d.docs.id ? 'btn-brand' : ''}"><i data-lucide="${d.docs.id ? 'circle-check' : 'id-card'}"></i>Citizenship / NID<input type="file" accept="image/*,.pdf" data-doc="id" hidden></label>
          </div></div>
        <div class="private"><i data-lucide="lock"></i><span><b>Only Thaun's verification team sees these.</b> They are never shown to buyers, and the kitta number stays private.</span></div>` : ''}
        <label class="check"><input type="checkbox" id="consent" ${d.consent ? 'checked' : ''}><span>Thaun may use my details and documents only to verify and publish this listing (Individual Privacy Act 2075).</span></label>`;
      case 6: {
        const l = A.draftListing();
        return `
        <div class="eyebrow">Step 6 of ${STEPS} · Preview</div>
        <h2 class="display">Ready to publish</h2>
        <p>This is the card buyers will see on the map and in search.</p>
        ${l ? A.card(l) : ''}
        <div class="ledger">
          ${[['Location pinned', !!d.pin], ['Boundary traced', d.closed], ['Price set', !!d.price], ['Photos', photos.length > 0 || d.photoCount > 0], ['Phone and consent', !!d.phone && d.consent], ['Documents for verification', d.tier === 'listed' || (d.docs.lalpurja && d.docs.id)]]
          .map(([n, ok]) => `<div class="ledger-row ${ok ? '' : 'is-missing'}"><i data-lucide="${ok ? 'circle-check' : 'circle-dashed'}"></i><span>${n}</span><time>${ok ? 'Done' : 'Missing'}</time></div>`).join('')}
        </div>
        <a class="btn btn-block" href="#/p/draft"><i data-lucide="eye"></i>See the full buyer view</a>`;
      }
    }
    return '';
  }

  const canNext = () => {
    if (step === 1) return !!d.pin;
    if (step === 2) return d.closed && areaM2() > 10;
    if (step === 3) return !!d.price;
    if (step === 5) return !!d.phone && d.consent;
    return true;
  };

  function renderPanel() {
    const body = document.getElementById('sellBody');
    if (!body) return;
    body.innerHTML = stepHtml();
    document.querySelectorAll('#stepper i').forEach((s, i) => { s.className = i + 1 < step ? 'is-done' : i + 1 === step ? 'is-on' : ''; });
    const next = document.getElementById('next');
    next.disabled = !canNext();
    next.innerHTML = step === STEPS ? '<i data-lucide="rocket"></i>Publish' : 'Continue <i data-lucide="arrow-right"></i>';
    document.getElementById('back').style.visibility = step > 1 ? 'visible' : 'hidden';
    wireStep();
    A.icons();
  }

  function wireStep() {
    const body = document.getElementById('sellBody');
    const refreshNext = () => (document.getElementById('next').disabled = !canNext());
    if (step === 1) {
      const q = body.querySelector('#placeQ'), list = body.querySelector('#places');
      const show = () => {
        const s = q.value.trim().toLowerCase();
        const hits = TH.PLACES.filter(p => !s || p.label.toLowerCase().includes(s) || p.ne.includes(s)).slice(0, s ? 8 : 5);
        list.innerHTML = hits.map((p, i) => `<button class="place" data-i="${TH.PLACES.indexOf(p)}"><span>${p.label} <small>${p.ne}</small></span><small>${p.sub}</small></button>`).join('');
      };
      q.addEventListener('input', show);
      list.addEventListener('click', e => {
        const b = e.target.closest('[data-i]');
        if (!b) return;
        const p = TH.PLACES[+b.dataset.i];
        d.place = { label: p.label, center: p.center, terai: !!p.terai };
        persist();
        M.fly(map, { center: p.center, zoom: p.zoom + 1, pitch: 0, bearing: 0 }, { duration: 2000 });
        A.toast(`Now tap your land near ${p.label}`, 'hand');
      });
      show();
    }
    if (step === 2) {
      body.querySelectorAll('[data-lp]').forEach(inp => inp.addEventListener('input', () => {
        d.lalpurja[+inp.dataset.lp] = inp.value; persist();
        const c = document.getElementById('cmpResult'); c.outerHTML = compareHtml(); A.icons();
      }));
    }
    if (step === 3) {
      const rerender = () => { persist(); renderPanel(); };
      body.querySelectorAll('[data-intent]').forEach(b => b.addEventListener('click', () => { d.intent = b.dataset.intent; if (d.intent === 'lease' && d.type === 'land') d.type = 'farmland'; d.price = ''; rerender(); }));
      body.querySelectorAll('[data-type]').forEach(b => b.addEventListener('click', () => { d.type = b.dataset.type; rerender(); }));
      body.querySelectorAll('[data-model]').forEach(b => b.addEventListener('click', () => {
        const k = b.dataset.model;
        d.leaseModels = d.leaseModels.includes(k) ? d.leaseModels.filter(x => x !== k) : [...d.leaseModels, k];
        rerender();
      }));
      let tm;
      body.querySelector('#price').addEventListener('input', e => { d.price = e.target.value; persist(); refreshNext(); clearTimeout(tm); tm = setTimeout(() => { const pos = e.target.selectionStart; renderPanel(); const p = document.getElementById('price'); p.focus(); p.setSelectionRange(pos, pos); }, 500); });
      body.querySelector('#priceUnit').addEventListener('change', e => { d.priceUnit = e.target.value; rerender(); });
      body.querySelector('#roadType').addEventListener('change', e => { d.road.type = e.target.value; persist(); });
      body.querySelector('#roadW').addEventListener('input', e => { d.road.widthFt = +e.target.value || 0; persist(); });
      body.querySelector('#roadD').addEventListener('input', e => { d.road.toBlacktopM = +e.target.value || 0; persist(); });
      body.querySelector('#water').addEventListener('change', e => { d.water = e.target.value; persist(); });
      body.querySelector('#title').addEventListener('input', e => { d.title = e.target.value; persist(); });
      body.querySelector('#blurb').addEventListener('input', e => { d.blurb = e.target.value; persist(); });
      body.querySelector('#draftBlurb').addEventListener('click', e => {
        e.preventDefault();
        d.blurb = A.suggestBlurb(d, areaM2());
        body.querySelector('#blurb').value = d.blurb; persist();
      });
    }
    if (step === 4) {
      const drop = body.querySelector('#drop'), files = body.querySelector('#files');
      const add = list => {
        [...list].filter(f => f.type.startsWith('image/')).slice(0, 12).forEach(f => photos.push(URL.createObjectURL(f)));
        d.photoCount = photos.length; persist();
        body.querySelector('#photos').innerHTML = photos.map(p => `<img src="${p}" alt="">`).join('');
      };
      files.addEventListener('change', () => add(files.files));
      ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('is-over'); }));
      ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('is-over'); }));
      drop.addEventListener('drop', e => add(e.dataTransfer.files));
      body.querySelector('#drone').addEventListener('click', () => { d.drone = !d.drone; persist(); renderPanel(); });
    }
    if (step === 5) {
      body.querySelectorAll('[data-tier]').forEach(b => b.addEventListener('click', () => { d.tier = b.dataset.tier; persist(); renderPanel(); }));
      body.querySelector('#phone').addEventListener('input', e => { d.phone = e.target.value; persist(); refreshNext(); });
      body.querySelector('#consent').addEventListener('change', e => { d.consent = e.target.checked; persist(); refreshNext(); });
      body.querySelectorAll('[data-doc]').forEach(inp => inp.addEventListener('change', () => { if (inp.files.length) { d.docs[inp.dataset.doc] = true; persist(); renderPanel(); A.toast('Stored privately for verification (prototype: kept in this browser only)', 'lock'); } }));
    }
  }

  /* ---------- Map ---------- */
  function setStepMap() {
    if (!map) return;
    const box = document.getElementById('sellMap');
    box.classList.toggle('is-drawing', step === 1 || (step === 2 && !d.closed));
    const tools = document.getElementById('drawTools');
    tools.hidden = step !== 2;
    orbit && orbit.stop();
    if (step <= 2) {
      M.setTerrain(map, false);
      if (map.getPitch() > 1) M.fly(map, { pitch: 0, bearing: 0 }, { duration: 900 });
    }
    if (pinMarker) pinMarker.getElement().style.display = step === 1 || (step === 2 && !d.coords.length) ? '' : 'none';
    if (step === 2 && d.pin && openCoords().length === 0 && map.getZoom() < 17) M.fly(map, { center: d.pin, zoom: 18.2 }, { duration: 1400 });
    if (step >= 3 && d.closed) {
      const r = ring();
      const terrainWasOn = map._th.terrainOn;
      if (M.tier() !== 'low') M.setTerrain(map, true);
      const cam = map.cameraForBounds(turf.bbox(turf.polygon([r])), { padding: 120 });
      const target = step;
      (terrainWasOn ? Promise.resolve() : M.settled(map, 4000))
        .then(() => map && step === target && M.fly(map, { center: cam.center, zoom: Math.min(cam.zoom, 18.4) - 0.4, pitch: step === 6 ? 62 : 45, bearing: step === 6 ? 30 : -10 }, { duration: 1800 }))
        .then(() => { if (step === 6 && step === target && map) { orbit = orbit || M.orbit(map, { degPerSec: 5 }); orbit.start(); } });
    }
    renderDrawing();
  }

  async function startMap() {
    const box = document.getElementById('sellMap');
    const center = d.pin || (d.place && d.place.center) || [85.33, 27.69];
    try {
      map = await M.create(box, { mode: 'satellite', terrain: false, center, zoom: d.pin ? 17.5 : d.place ? 15.5 : 11.2, maxPitch: 75 });
    } catch {
      box.innerHTML = '<div class="empty">The map could not load.</div>';
      return;
    }
    if (!document.body.contains(box)) return map.remove();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true } }), 'top-right');
    map.addSource('draw', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.addLayer({ id: 'draw-fill', type: 'fill', source: 'draw', filter: ['==', '$type', 'Polygon'], paint: { 'fill-color': '#f5b14a', 'fill-opacity': 0.22 } });
    map.addLayer({ id: 'draw-line', type: 'line', source: 'draw', filter: ['==', '$type', 'LineString'], layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#f5b14a', 'line-width': 3 } });
    if (d.pin) placePin(d.pin);
    map.on('click', e => {
      const c = [e.lngLat.lng, e.lngLat.lat];
      if (step === 1) { placePin(c); d.pin = c; persist(); renderPanel(); }
      else if (step === 2 && !d.closed) {
        d.coords.push(c); persist(); renderDrawing(); renderPanel();
        if (pinMarker) pinMarker.getElement().style.display = 'none';
      }
    });
    setStepMap();
  }

  function placePin(c) {
    if (!pinMarker) {
      const el = document.createElement('div');
      el.className = 'pin pin-draft is-active';
      el.innerHTML = '<span class="pin-dot"></span><span class="pin-label">Your land</span>';
      pinMarker = new maplibregl.Marker({ element: el, anchor: 'bottom', draggable: true }).setLngLat(c).addTo(map);
      pinMarker.on('dragend', () => { const p = pinMarker.getLngLat(); d.pin = [p.lng, p.lat]; persist(); if (step === 1) renderPanel(); });
    } else pinMarker.setLngLat(c);
  }

  function go(n) {
    location.hash = `#/sell/${n}`;
  }

  function publish() {
    const id = `my-${Date.now().toString(36)}`;
    const listing = A.draftToListing(d, id);
    listing.draft = false;
    S.published = [...S.published, listing];
    A.save('published');
    S.draft = null; A.save('draft');
    photos = [];
    A.toast('Published. Thaun will verify it within two working days.', 'rocket');
    location.hash = `#/p/${id}`;
  }

  TH.views.sell = {
    mount(el, [n]) {
      d = S.draft || blank();
      step = Math.min(Math.max(+n || 1, 1), STEPS);
      while (step > 1 && !stepReachable(step)) step--;
      el.innerHTML = `
        <div class="sell">
          <section class="sell-panel">
            <div class="stepper" id="stepper">${Array.from({ length: STEPS }, () => '<i></i>').join('')}</div>
            <div class="sell-body" id="sellBody"></div>
            <div class="sell-foot">
              <button class="btn" id="back"><i data-lucide="arrow-left"></i>Back</button>
              <button class="btn btn-ghost btn-sm" id="reset" title="Start over"><i data-lucide="rotate-ccw"></i></button>
              <button class="btn btn-primary" id="next"></button>
            </div>
          </section>
          <section class="sell-map">
            <div class="map" id="sellMap"></div>
            <div class="readout" id="readout" hidden></div>
            <div class="draw-tools" id="drawTools" hidden>
              <button class="btn btn-sm" id="undo"><i data-lucide="undo-2"></i>Undo</button>
              <button class="btn btn-sm" id="clear"><i data-lucide="trash-2"></i>Clear</button>
              <button class="btn btn-sm btn-primary" id="finish"><i data-lucide="check"></i>Close shape</button>
            </div>
          </section>
        </div>`;
      el.querySelector('#back').addEventListener('click', () => go(step - 1));
      el.querySelector('#next').addEventListener('click', () => (step === STEPS ? publish() : go(step + 1)));
      el.querySelector('#reset').addEventListener('click', async () => {
        const v = await A.modal(`<h2 class="display">Start over?</h2><p class="muted" style="margin:0">This clears your pin, boundary and details.</p><div class="modal-actions"><button class="btn" data-v="no">Keep editing</button><button class="btn btn-primary" data-v="yes">Start over</button></div>`);
        if (v !== 'yes') return;
        d = blank(); persist(); photos = [];
        pinMarker && pinMarker.remove(); pinMarker = null;
        go(1); renderPanel(); setStepMap();
      });
      el.querySelector('#undo').addEventListener('click', () => {
        if (d.closed) { d.closed = false; d.coords.pop(); } else d.coords.pop();
        persist(); renderDrawing(); renderPanel(); setStepMap();
      });
      el.querySelector('#clear').addEventListener('click', () => { d.coords = []; d.closed = false; persist(); renderDrawing(); renderPanel(); setStepMap(); });
      el.querySelector('#finish').addEventListener('click', () => {
        if (openCoords().length < 3) return A.toast('Tap at least three corners first', 'hand');
        if (!d.closed) closeShape();
        setStepMap();
      });
      renderPanel();
      startMap();
    },
    update([n]) {
      const target = Math.min(Math.max(+n || 1, 1), STEPS);
      if (target > step && !canNext()) { history.replaceState(null, '', `#/sell/${step}`); return; }
      step = target;
      renderPanel();
      setStepMap();
      document.getElementById('sellBody').scrollTop = 0;
    },
    unmount() {
      orbit && orbit.destroy();
      vertexMarkers.forEach(m => m.remove()); edgeMarkers.forEach(m => m.remove());
      vertexMarkers = []; edgeMarkers = [];
      pinMarker = null;
      map && map.remove();
      map = orbit = null;
    },
  };

  function stepReachable(n) {
    if (n >= 2 && !d.pin) return false;
    if (n >= 3 && !d.closed) return false;
    if (n >= 4 && !d.price) return false;
    if (n >= 6 && !(d.phone && d.consent)) return false;
    return true;
  }
})();
