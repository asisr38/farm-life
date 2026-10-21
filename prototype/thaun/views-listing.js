/* Thaun prototype: listing page. */
(function () {
  const G = TH.geo, M = TH.map, A = TH.app, S = TH.state;

  const FROZEN = ['nagarkot', 'dhulikhel', 'sundarijal']; /* illustrative subdivision-freeze status */
  const VALLEY_DISTRICTS = ['Kathmandu', 'Lalitpur', 'Bhaktapur'];

  let map, orbit, l, view, io, cleanup = [];

  /* ---------- Sections ---------- */
  function factsHtml() {
    const f = [];
    const fact = (icon, label, value, sub, id) => `<div class="fact"${id ? ` id="${id}"` : ''}><small><i data-lucide="${icon}"></i>${label}</small><strong class="num">${value}</strong><span>${sub || ''}</span></div>`;
    if (l.m2 && l.type !== 'flat' && l.type !== 'room') {
      const terai = false;
      f.push(fact('square-dashed', 'Area', G.fmtRapd(l.m2), `${G.int(l.m2)} m² · ${G.int(G.sqft(l.m2))} sq ft${terai ? ' · ' + G.fmtBkd(l.m2) + ' B-K-D' : ''}`));
    }
    if (l.beds) f.push(fact('bed-double', l.type === 'room' ? 'Rooms' : 'Bedrooms', l.beds, `${l.baths || 0} bath${l.floorNo ? ` · floor ${l.floorNo}` : l.floors ? ` · ${l.floors} storey` : ''}`));
    if (l.road && l.road.type) f.push(fact('route', 'Road', l.road.type === 'footpath' ? 'Footpath' : `${l.road.widthFt} ft`, l.road.type === 'blacktop' ? 'Blacktop at the gate' : l.road.toBlacktopM ? `${l.road.type === 'footpath' ? 'Footpath' : 'Gravel'}, ${l.road.toBlacktopM} m to blacktop` : ''));
    if (l.type !== 'flat' && l.type !== 'room') {
      f.push(fact('mountain', 'Elevation', '<span class="skeleton">1,400 m</span>', 'Loading terrain…', 'fElev'));
      f.push(fact('triangle-right', 'Slope', '<span class="skeleton">Gentle</span>', '', 'fSlope'));
      f.push(fact('compass', 'Faces', '<span class="skeleton">South</span>', '', 'fFacing'));
    }
    if (l.type === 'farmland') f.push(fact('droplets', 'Water', { 'year-round': 'Year-round', seasonal: 'Seasonal', unverified: 'Unverified', none: 'None' }[l.water] || '—', l.waterSource || ''));
    if (l.intent === 'rent') f.push(fact('wallet', 'Move-in cost', A.money(l.price * (1 + (l.deposit || 2))), `Rent + ${l.deposit || 2} months deposit · broker fee ${l.brokerFee === 0 || l.source === 'owner' ? 'रु 0' : 'ask'}`));
    return `<div class="facts">${f.join('')}</div>`;
  }

  function viewPanel() {
    if (!l.parcel && l.type !== 'land') return '';
    return `
      <section class="panel" id="viewPanel">
        <div class="panel-head">
          <div><h2 class="display">What you'll see from here</h2>
          <p class="panel-sub">Line of sight from this plot to the big peaks, worked out live from open elevation data.</p></div>
          <div class="seg" id="eye"><button data-eye="1.7" class="is-on">Standing</button><button data-eye="7.7">2nd-floor roof</button></div>
        </div>
        <div class="pano" id="pano"><svg viewBox="0 0 1000 250"></svg><div class="pano-busy" id="panoBusy"><div style="text-align:center">Working out the view from this plot…<div class="progress"><i id="panoProg"></i></div></div></div></div>
        <div class="peaks" id="peaks"></div>
        <p class="muted" style="font-size:12px;margin:12px 0 0">Terrain only, from Copernicus GLO-30 elevation data (about 30 m near the plot, coarser in the distance) with earth curvature and refraction. Buildings, trees and haze are not included. In the product this is computed once per listing on the server.</p>
      </section>`;
  }

  function priceBand() {
    if (l.intent !== 'sale' || !l.m2 || !l.area || (l.type !== 'land' && l.type !== 'farmland')) return '';
    const ask = l.price / 1e5 / G.aana(l.m2);
    const [lo, hi] = l.area.band, gov = l.area.gov;
    const min = Math.min(lo, gov, ask) * 0.85, max = Math.max(hi, ask) * 1.08;
    const pos = v => ((v - min) / (max - min)) * 100;
    const pct = ask > hi ? Math.round(((ask - hi) / hi) * 100) : ask < lo ? Math.round(((lo - ask) / lo) * 100) : 0;
    const verdict = ask > hi
      ? `<span class="badge badge-warn">${pct}% above the usual range</span> Ask what justifies it: road, view, or a building permit.`
      : ask < lo
        ? `<span class="badge badge-warn">${pct}% below the usual range</span> Cheap land has a reason. Check the road, the slope and the title before paying anything.`
        : `<span class="badge badge-owner">Within the usual range</span> for ${l.area.name}.`;
    return `
      <section class="panel" id="pricePanel">
        <h2 class="display">Is the price fair?</h2>
        <p class="panel-sub">Asking price per aana, next to what land in ${l.area.name} usually goes for and the government valuation that taxes are based on.</p>
        <div style="position:relative">
          <div class="band">
            <div style="position:absolute;top:0;bottom:0;left:${pos(lo)}%;width:${pos(hi) - pos(lo)}%;border-radius:99px;outline:2px solid var(--brand-2);outline-offset:2px"></div>
            <div class="band-mark gov" style="left:${pos(gov)}%"></div>
            <div class="band-tag below num" style="left:${pos(gov)}%">Govt रु ${gov} L</div>
            <div class="band-mark ask" style="left:${pos(ask)}%"></div>
            <div class="band-tag above num" style="left:${pos(ask)}%">Asking रु ${G.num(ask, 1)} L/aana</div>
          </div>
          <div class="band-ends num"><span>Usual range ${l.area.name}: रु ${lo}–${hi} L/aana</span></div>
        </div>
        <p style="margin:18px 0 0;font-size:14px">${verdict}</p>
        <p class="muted" style="font-size:12px;margin:10px 0 0">Usual range: Merokalam land price guide, May 2026 (indicative). Government valuation: illustrative prototype figure. In the product both come from dated, cited sources per ward.</p>
      </section>`;
  }

  function flagsHtml() {
    const flags = [];
    const flag = (icon, title, text, warn) => `<div class="flag ${warn ? 'is-warn' : ''}"><span class="flag-icon"><i data-lucide="${icon}"></i></span><div><b>${title}</b><span>${text}</span></div></div>`;
    if (l.type === 'land' || l.type === 'house' || l.type === 'farmland') {
      if (FROZEN.includes(l.areaId)) flags.push(flag('octagon-pause', 'Subdivision frozen in this municipality', 'The local government has not finished land-use classification, so plots here cannot be split until it does (Land Use Act 2019). Buying the whole parcel is unaffected. Status is illustrative in this prototype.', true));
      else flags.push(flag('check-circle-2', 'Land-use classification done', 'Subdivision is open in this municipality (illustrative status).'));
      if (l.m2 && l.m2 < 130 && l.type !== 'farmland') flags.push(flag('ruler', 'Smaller than 130 m²', 'Below the minimum for a new residential plot (Land Use Rules 2079). Existing plots can still be sold; check what the municipality will let you build.', true));
      if (l.road && l.road.widthFt && l.road.widthFt < 20 && l.type !== 'farmland') flags.push(flag('route', `Road narrower than 6 m (${l.road.widthFt} ft)`, 'Fine for an existing plot, but new plotting in the Valley needs 6 m roads (KVDA). Check the road-widening setback before you build.', true));
    }
    if (l.intent === 'sale' && l.price > 3e7) flags.push(flag('landmark', 'Deal above रु 3 crore', `A firm brokering this deal must hold a land-dealing licence (Land Revenue Act s.26A).${l.licence ? ` Licence shown: ${l.licence}.` : ''}`, !l.licence && l.source !== 'owner'));
    if (l.type === 'farmland' && l.water !== 'year-round') flags.push(flag('droplet-off', 'Dry-season water not confirmed', 'Thaun has not seen water on this plot in the dry season. Most valley farms that fail, fail on water. Ask for a dry-season visit before signing.', true));
    if (!flags.length) return '';
    return `<section class="panel"><h2 class="display">Before you commit</h2><p class="panel-sub">Rules and risks that apply to this listing.</p>${flags.join('')}</section>`;
  }

  function homeHtml() {
    if (!['house', 'flat', 'room'].includes(l.type)) return '';
    const rooms = l.type === 'room' ? ['Room 1', 'Room 2', 'Kitchen', 'Bathroom', 'Entrance'] : ['Living room', 'Kitchen', 'Bedroom', 'Bathroom', 'View'];
    const g = [['#38604f', '#9bb68f'], ['#7a5a3a', '#d8b48a'], ['#3e5470', '#9fb7d3'], ['#5b6e6a', '#c4d0cc'], ['#6c4e63', '#d1b3c4']];
    const details = [
      l.beds && ['Bedrooms', l.beds], l.baths && ['Bathrooms', l.baths], l.floors && ['Storeys', l.floors], l.floorNo && ['Floor', l.floorNo],
      l.built && ['Built', `${l.built} BS`], ['Furnished', l.furnished ? 'Yes' : 'No'], l.deposit && ['Deposit', `${l.deposit} months`],
      l.intent === 'rent' && ['Broker fee', l.brokerFee === 0 || l.source === 'owner' ? 'रु 0' : 'Ask the agent'],
    ].filter(Boolean);
    return `
      <section class="panel">
        <div class="panel-head"><div><h2 class="display">Inside</h2><p class="panel-sub">Photos are added by the lister. This prototype shows placeholders.</p></div>
        <button class="chip" id="tour360"><i data-lucide="rotate-3d"></i>360° tour</button></div>
        <div class="house-gallery">${rooms.map((r, i) => `<div style="--g1:${g[i][0]};--g2:${g[i][1]}"><i data-lucide="image"></i>${r}</div>`).join('')}</div>
        <div class="facts" style="margin-top:16px">${details.map(([k, v]) => `<div class="fact"><small>${k}</small><strong class="num">${v}</strong></div>`).join('')}</div>
      </section>`;
  }

  function plannerHtml() {
    if (l.type !== 'farmland') return '';
    const rop = Math.round(G.ropani(l.m2));
    return `
      <section class="panel">
        <h2 class="display">Farm it honestly</h2>
        <p class="panel-sub">From the Kathmandu Valley Farm playbook: base case first, and money only after a buyer is secured.</p>
        <div class="planner">
          <div class="scn" id="scn">${Object.entries(TH.FARM.scenarios).map(([k, v], i) => `<button data-k="${k}" class="${i === 0 ? 'is-on' : ''}"><b>${v.label}</b><small class="num">${G.nprCompact(v.per)}/ropani</small></button>`).join('')}</div>
          <p class="muted" id="scnNote" style="margin:0;font-size:13.5px"></p>
          <label class="field"><span>Ropani you farm: <b id="ropL" class="num">${rop}</b> of ${rop}</span><input class="range" type="range" id="rop" min="1" max="${rop}" value="${rop}"></label>
          <div class="planner-rows" id="rows"></div>
          <div class="callout"><i data-lucide="triangle-alert"></i><span>Most small farms run under 10% operating margin. Roughly 60% of organic output never reaches an organic-priced sale, so line up a buyer before you plant.</span></div>
        </div>
        <h3 style="margin:22px 0 8px;font-size:16px">Lease models offered</h3>
        <div class="roots-models" style="margin:0">${(l.leaseModels || []).map(k => { const m = TH.FARM.leaseModels[k]; return `<div class="can-row yes"><i data-lucide="handshake"></i><div><b>${m.name} <span class="muted" style="font-weight:500">${m.ne}</span></b><span>${m.text}</span></div></div>`; }).join('')}</div>
      </section>`;
  }

  function wirePlanner() {
    const box = document.getElementById('rows');
    if (!box) return;
    let cur = 'base';
    const calc = () => {
      const land = +document.getElementById('rop').value;
      document.getElementById('ropL').textContent = land;
      const sc = TH.FARM.scenarios[cur];
      document.getElementById('scnNote').textContent = sc.note;
      const lease = land * l.price, opex = land * TH.FARM.opexPerRopani, setup = land * TH.FARM.setupPerRopani, gross = land * sc.per;
      const rows = [['Year 1', gross * 0.4, opex * 0.6 + lease + setup], ['Year 2', gross * 0.8, opex * 0.8 + lease], ['Year 3', gross, opex + lease]];
      let cum = 0;
      const peak = Math.max(...rows.map(r => Math.abs(r[1] - r[2])), 1);
      box.innerHTML = rows.map(([y, g, e]) => {
        const net = g - e; cum += net;
        const w = (Math.abs(net) / peak) * 50;
        const signed = v => `${v < 0 ? '−' : '+'}${G.nprCompact(Math.abs(v))}`;
        return `<div class="planner-row">
          <div class="planner-top"><b>${y}</b><span class="num ${net < 0 ? 'neg' : 'pos'}">${signed(net)}</span></div>
          <div class="planner-bar"><i class="${net < 0 ? 'neg' : ''}" style="${net < 0 ? `right:50%;left:auto;width:${w}%` : `width:${w}%`}"></i></div>
          <div class="planner-meta num"><span>Gross ${G.nprCompact(g)}</span><span>Cost ${G.nprCompact(e)}</span><span>Running total <b class="${cum < 0 ? 'neg' : 'pos'}">${signed(cum)}</b></span></div>
        </div>`;
      }).join('');
    };
    document.getElementById('rop').addEventListener('input', calc);
    document.querySelectorAll('#scn button').forEach(b => b.addEventListener('click', () => {
      cur = b.dataset.k;
      document.querySelectorAll('#scn button').forEach(x => x.classList.toggle('is-on', x === b));
      calc();
    }));
    calc();
  }

  function contactHtml() {
    const name = l.source === 'owner' ? l.owner : l.agent;
    const initials = (name || '?').split(/\s+/).map(w => w[0]).slice(0, 2).join('');
    return `
      <section class="panel contact">
        <div class="who"><span class="avatar">${initials}</span><div><b>${A.esc(name)}</b><span>${A.sourceText(l)}${l.licence ? ` · ${l.licence}` : ''}</span></div></div>
        <button class="btn btn-primary btn-block" data-contact="whatsapp"><i data-lucide="message-circle"></i>Message on WhatsApp</button>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <button class="btn btn-sm" data-contact="viber"><i data-lucide="phone"></i>Viber</button>
          <button class="btn btn-sm" data-contact="visit"><i data-lucide="calendar"></i>Site visit</button>
        </div>
        ${l.remote ? `<button class="btn btn-brand btn-block" data-contact="video"><i data-lucide="video"></i>Book a live video walk</button>` : ''}
        <div class="private"><i data-lucide="shield"></i><span>Thaun never asks buyers or renters for form fees. Pay nothing before a site visit.</span></div>
      </section>`;
  }

  function ledgerHtml() {
    const fr = A.freshness(l);
    const kinds = Object.keys(TH.VERIFY).filter(k => (k !== 'water' || l.type === 'farmland') && (k !== 'road' || l.road));
    const lv = A.level(l);
    return `
      <section class="panel">
        <div class="panel-head" style="margin-bottom:6px"><h2 class="display" style="font-size:19px">Verification</h2>${A.levelBadge(l)}</div>
        <div class="ledger">${kinds.map(k => {
          const v = A.has(l, k);
          return `<div class="ledger-row ${v ? '' : 'is-missing'}"><i data-lucide="${v ? 'circle-check' : 'circle-dashed'}"></i><span>${TH.VERIFY[k].label}</span><time>${v ? A.date(v[1]) : 'Not yet'}</time></div>`;
        }).join('')}</div>
        ${lv === 'pending' ? `<div class="expiry"><i data-lucide="hourglass"></i>Waiting for Thaun's verification team</div>`
          : fr.stale ? `<div class="expiry is-stale"><i data-lucide="clock-alert"></i>Not re-confirmed for ${fr.age} days. Treat as unconfirmed.</div>`
            : A.has(l, 'reconfirmed')
              ? `<div class="expiry"><i data-lucide="refresh-cw"></i>Confirmed available ${fr.age === 0 ? 'today' : `${fr.age} days ago`} · next check due within ${fr.renewIn} days</div>`
              : `<div class="expiry"><i data-lucide="refresh-cw"></i>Listed ${fr.age === 0 ? 'today' : `${fr.age} days ago`} · must be re-confirmed within ${fr.renewIn} days</div>`}
      </section>`;
  }

  /* Who can do what, from NRN Rules 2066 r.11 and Civil Code s.432 (see PORTAL_MARKET_RESEARCH.md §5). */
  function eligibility(status) {
    const valley = l.area && VALLEY_DISTRICTS.includes(l.area.district);
    const rop = l.m2 ? G.ropani(l.m2) : 0;
    if (l.intent === 'rent') return status === 'foreign' ? 'Foreign nationals can rent homes in Nepal. Ask the owner about a written rental agreement.' : 'Renting is open to you. Ask for a written rental agreement.';
    if (l.intent === 'lease') return status === 'citizen' ? 'You can lease farmland. Thaun records the lease and the payments.' : 'Long-term land leases by non-citizens need legal advice first. A Thaun guide can explain the options.';
    if (status === 'citizen') return 'You can buy. From abroad, you can sign through a power of attorney made at a Nepali embassy.';
    if (status === 'nrn') {
      const cap = valley ? 2 : 4;
      const fits = rop <= cap;
      return `NRN cardholders can buy <b>one</b> residential property with Ministry of Foreign Affairs approval: up to <b>${cap} ropani</b> ${valley ? 'in the Kathmandu Valley' : 'in this kind of municipality'}. This plot is ${G.num(rop, 2)} ropani, ${fits ? 'within the cap.' : '<b>above the cap</b>.'}`;
    }
    return 'Foreign nationals cannot own land in Nepal without government approval (Civil Code 2074, s.432). You can rent homes, and Thaun can connect you with a lawyer for business routes.';
  }
  function eligHtml() {
    const st = S.status || 'nrn';
    return `
      <section class="elig" id="elig">
        <h3><i data-lucide="globe-2"></i>Buying from abroad?</h3>
        <div class="elig-opts" role="radiogroup" aria-label="Your status">${[['citizen', 'Nepali citizen'], ['nrn', 'NRN card'], ['foreign', 'Foreign national']].map(([k, n]) => `<button role="radio" aria-checked="${st === k}" data-st="${k}" class="${st === k ? 'is-on' : ''}">${n}</button>`).join('')}</div>
        <p id="eligText">${eligibility(st)}</p>
        <a href="#/abroad" style="font-size:13px;font-weight:600;text-decoration:underline">How buying from abroad works</a>
      </section>`;
  }

  function priceHead() {
    document.getElementById('lprice').textContent = A.price(l);
    document.getElementById('lpricesub').textContent = A.priceSub(l);
  }

  /* ---------- Hero map ---------- */
  async function startHero() {
    const box = document.getElementById('lmap');
    const poster = document.getElementById('poster');
    const start = { center: l.area ? l.area.center : l.center, zoom: 13.2, pitch: 30, bearing: -20 };
    try {
      map = await M.create(box, { mode: 'satellite', labels: 'minimal', ...start, maxPitch: 78 });
    } catch {
      return;
    }
    if (!document.body.contains(box)) return map.remove();
    map.scrollZoom.disable();
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    await M.settled(map, 4000);
    if (!map) return;
    poster.classList.add('is-gone');

    if (l.parcel) {
      const cam = map.cameraForBounds(turf.bbox(l.parcel), { padding: { top: 120, bottom: 140, left: 90, right: 90 } });
      const zoom = Math.min(cam.zoom, 18.6);
      await M.fly(map, { center: cam.center, zoom, pitch: 0, bearing: 0 }, { duration: 2600 });
      if (!map) return;
      await M.drawOutline(map, l.parcel.geometry.coordinates[0]);
      if (!map) return;
      if (M.tier() !== 'low') await M.fly(map, { center: cam.center, zoom: zoom - 0.6, pitch: 62, bearing: 35 }, { duration: 1800, curve: 1 });
    } else {
      new maplibregl.Marker({ element: Object.assign(document.createElement('div'), { className: 'pin pin-draft is-active', innerHTML: `<span class="pin-dot"></span><span class="pin-label">${A.pinLabel(l)}</span>` }), anchor: 'bottom' }).setLngLat(l.center).addTo(map);
      await M.fly(map, { center: l.center, zoom: 17.2, pitch: 55, bearing: 30 }, { duration: 2600 });
    }
    if (!map) return;
    orbit = M.orbit(map, { degPerSec: 5 });
    const ob = document.getElementById('orbitBtn');
    orbit.onchange = on => { ob.innerHTML = `<i data-lucide="${on ? 'pause' : 'play'}"></i>${on ? 'Pause' : 'Orbit'}`; A.icons(); };
    if (M.motionOK()) orbit.start();
    else orbit.onchange(false);
  }

  function wireHeroControls() {
    document.getElementById('orbitBtn').addEventListener('click', () => {
      if (!orbit) return;
      if (!M.motionOK()) return A.toast('Orbit is off because reduced motion is on, or this device is in the low graphics tier', 'gauge');
      orbit.toggle();
    });
    document.getElementById('dimBtn').addEventListener('click', e => {
      if (!map) return;
      const flat = map.getPitch() > 5;
      orbit && orbit.stop();
      M.fly(map, { pitch: flat ? 0 : 62, bearing: flat ? 0 : map.getBearing() }, { duration: 1000 });
      e.currentTarget.innerHTML = `<i data-lucide="${flat ? 'box' : 'square'}"></i>${flat ? '3D' : '2D'}`;
      A.icons();
    });
    document.getElementById('centerBtn').addEventListener('click', () => {
      if (!map) return;
      const b = l.parcel ? map.cameraForBounds(turf.bbox(l.parcel), { padding: 120 }) : { center: l.center, zoom: 17 };
      M.fly(map, { center: b.center, zoom: Math.min(b.zoom, 18.4), pitch: map.getPitch() }, { duration: 1000 });
    });
    document.getElementById('walkBtn').addEventListener('click', () => A.toast('Field mode: on your phone at the plot, your GPS dot shows whether you are inside the boundary. Works offline. (Phase 2)', 'footprints'));
  }

  /* ---------- Terrain stats and view ---------- */
  async function loadTerrain() {
    if (!l.parcel && l.type !== 'land') return;
    const parcel = l.parcel || turf.circle(l.center, 0.02);
    const s = await G.terrainStats(parcel).catch(() => null);
    const set = (id, v, sub) => { const el = document.getElementById(id); if (!el) return; el.querySelector('strong').innerHTML = v; el.querySelector('span:last-child').textContent = sub || ''; };
    if (!s) { set('fElev', '—', 'Terrain data unavailable'); set('fSlope', '—'); set('fFacing', '—'); return; }
    set('fElev', `${G.int(s.elevation)} m`, !l.parcel ? '' : s.max - s.min < 2 ? 'Level across the plot' : `Rises ${G.int(s.max - s.min)} m across the plot`);
    set('fSlope', `${G.slopeWord(s.slope)}`, `${s.slope}° average`);
    if (s.slope < 3) set('fFacing', 'Level', 'No slope, so sun from every side');
    else set('fFacing', s.facing[0].toUpperCase() + s.facing.slice(1), /east/.test(s.facing) ? 'Morning sun' : /west/.test(s.facing) ? 'Afternoon sun' : /south/.test(s.facing) ? 'Sun most of the day' : 'Cooler, softer light');
  }

  async function computeView(eyeM) {
    const busy = document.getElementById('panoBusy');
    const prog = document.getElementById('panoProg');
    if (!busy) return;
    busy.hidden = false;
    const origin = l.parcel ? turf.centroid(l.parcel).geometry.coordinates : l.center;
    const res = await G.viewshed(origin, TH.PEAKS, { eyeM, onProgress: p => (prog.style.width = `${p * 100}%`) }).catch(() => null);
    if (!document.getElementById('pano')) return;
    busy.hidden = true;
    if (!res) { document.getElementById('peaks').innerHTML = '<p class="muted">Elevation data could not be loaded.</p>'; return; }
    renderPano(res);
  }

  function renderPano(res) {
    const W = 1000, H = 250;
    const { horizon, peaks, bMin, bMax } = res;
    const vis = peaks.filter(p => p.visible);
    const hAngs = horizon.map(h => h.ang);
    const aMin = Math.min(...hAngs) - 0.8;
    const aMax = Math.max(...hAngs, ...vis.map(p => p.angle)) + 1.4;
    const x = b => ((b - bMin) / (bMax - bMin)) * W;
    const y = a => H - ((a - aMin) / (aMax - aMin)) * (H - 28) - 6;
    const ridge = `M0,${H} ` + horizon.map(h => `L${x(h.b).toFixed(1)},${y(h.ang).toFixed(1)}`).join(' ') + ` L${W},${H} Z`;
    const far = `M0,${H} ` + horizon.map((h, i) => `L${x(h.b).toFixed(1)},${(y(h.ang) - 10 - Math.sin(i * 0.9) * 4).toFixed(1)}`).join(' ') + ` L${W},${H} Z`;
    const ridgeAt = b => {
      let best = horizon[0];
      for (const h of horizon) if (Math.abs(h.b - b) < Math.abs(best.b - b)) best = h;
      return best.ang;
    };
    /* Labels that would collide step up in tiers. */
    const placed = [];
    const labelY = (px, base, w) => {
      let ly = base;
      while (placed.some(q => Math.abs(q.x - px) < (q.w + w) / 2 + 8 && Math.abs(q.y - ly) < 17)) ly -= 16;
      placed.push({ x: px, y: ly, w });
      return ly;
    };
    const marks = [...peaks].sort((a, b) => a.bearing - b.bearing).map(p => {
      const w = p.name.length * 7;
      const px = Math.min(W - w / 2 - 4, Math.max(w / 2 + 4, x(p.bearing)));
      if (p.visible) {
        const py = y(p.angle);
        const ly = labelY(px, py - 8, w);
        return `<path class="pano-snow" d="M${px - 16},${py + 16} L${px - 4},${py + 2} L${px},${py} L${px + 5},${py + 3} L${px + 18},${py + 16} Z"/>
          ${ly < py - 12 ? `<line x1="${px}" y1="${ly + 3}" x2="${px}" y2="${py - 2}" stroke="rgba(255,255,255,.5)"/>` : ''}
          <text class="pano-peak-label" x="${px}" y="${ly}" text-anchor="middle">${p.name}</text>`;
      }
      const py = y(ridgeAt(p.bearing)) - 4;
      const ly = labelY(px, py - 20, w);
      return `<path class="pano-ghost" d="M${px - 12},${py} L${px},${py - 14} L${px + 12},${py}"/>
        <text class="pano-peak-label is-hidden" x="${px}" y="${ly}" text-anchor="middle">${p.name}</text>`;
    }).join('');
    const ticks = [];
    for (let b = Math.ceil(bMin / 45) * 45; b <= bMax; b += 45) {
      const name = { '-90': 'W', '-45': 'NW', 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', '-135': 'SW', '-180': 'S' }[b];
      ticks.push(`<text x="${x(b)}" y="${H - 8}" text-anchor="middle" style="font:700 11px var(--font-ui);fill:rgba(255,255,255,.75)">${name}</text>`);
    }
    document.querySelector('#pano svg').innerHTML = `<path class="pano-ridge-far" d="${far}"/><path class="pano-ridge" d="${ridge}"/>${marks}${ticks.join('')}`;
    document.getElementById('peaks').innerHTML = peaks
      .sort((a, b) => a.bearing - b.bearing)
      .map(p => `<div class="peak"><i data-lucide="${p.visible ? 'eye' : 'eye-off'}" class="${p.visible ? 'yes' : 'no'}"></i><div><b>${S.lang === 'ne' ? p.ne : p.name} <small class="num">${G.int(p.elev)} m</small></b>
        <small class="num">${p.visible ? `Visible · ${G.int(p.dist / 1000)} km away` : p.blocker && p.blocker.d < 600 ? 'Hidden by rising ground just behind the plot' : p.blocker ? `Hidden by a ridge ${G.num(p.blocker.d / 1000, 1)} km away (${G.int(p.blocker.h)} m)` : 'Hidden'}</small></div></div>`)
      .join('');
    const n = vis.length;
    document.querySelector('#viewPanel .panel-sub').innerHTML = n
      ? `<b>${n} of ${peaks.length} named peaks</b> are in line of sight from ${res.eyeM > 2 ? 'a second-floor roof' : 'standing height'} on this plot, worked out live from open elevation data.`
      : `No named peaks are in line of sight from ${res.eyeM > 2 ? 'a second-floor roof' : 'standing height'} here. Nearby ridges block the northern horizon.`;
    A.icons();
  }

  /* ---------- View ---------- */
  view = {
    mount(el, [id]) {
      cleanup = [];
      l = TH.byId(id);
      if (!l) {
        el.innerHTML = `<div class="section"><div class="empty"><i data-lucide="map-pin-off"></i><b>This listing isn't here</b><span>It may have expired or been withdrawn.</span><a class="btn" href="#/explore">Back to the map</a></div></div>`;
        return;
      }
      if (S.status == null && S.currency !== 'NPR') S.status = 'nrn';
      el.innerHTML = `
        ${l.draft ? `<div style="background:var(--ink);color:var(--bg);padding:10px 20px;font-weight:600;font-size:14px;display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap"><i data-lucide="eye"></i>Preview: this is how buyers will see your listing <a class="btn btn-sm btn-primary" href="#/sell/6">Back to publishing</a></div>` : ''}
        <section class="l-hero" style="view-transition-name:hero">
          <div class="map" id="lmap"></div>
          <div class="l-hero-poster" id="poster">${G.aerial(l.center, l.parcel, 1800, 900)}</div>
          <div class="l-hero-top"><span class="badge badge-glass"><i data-lucide="satellite"></i>Satellite · 3D terrain</span>${l.parcel ? `<span class="badge badge-glass"><i data-lucide="pen-tool"></i>${l.mine ? 'Boundary traced by owner' : 'Boundary: sample shape'}</span>` : ''}</div>
          <div class="l-hero-controls">
            <button class="chip" id="orbitBtn"><i data-lucide="pause"></i>Pause</button>
            <button class="chip" id="dimBtn"><i data-lucide="square"></i>2D</button>
            <button class="chip" id="centerBtn"><i data-lucide="locate-fixed"></i>Recentre</button>
            ${l.parcel ? `<button class="chip" id="walkBtn"><i data-lucide="footprints"></i>Walk the boundary</button>` : '<span id="walkBtn" hidden></span>'}
          </div>
        </section>
        <div class="l-bar"><div class="l-bar-inner">
          <div style="min-width:0">
            <div class="where"><i data-lucide="map-pin"></i>${l.area ? `${l.area.name}, ${l.area.district}` : ''} · ${A.intentName(l.intent)} · ${l.posted === 0 ? 'new' : `listed ${l.posted} days ago`}</div>
            <h1 class="display">${A.esc(S.lang === 'ne' && l.ne ? l.ne : l.title)}</h1>
          </div>
          <div class="l-price"><strong class="num" id="lprice"></strong><span class="num" id="lpricesub"></span></div>
          <div class="l-actions">
            <button class="btn btn-sm ${S.saved.has(l.id) ? 'is-on' : ''}" data-save="${l.id}"><i data-lucide="heart"></i><span class="btn-label">${A.t('save')}</span></button>
            <button class="btn btn-sm" id="shareBtn"><i data-lucide="share-2"></i><span class="btn-label">${A.t('share')}</span></button>
          </div>
        </div></div>
        <div class="l-body">
          <div class="l-main">
            ${factsHtml()}
            <section class="panel"><h2 class="display">About this ${A.typeName(l.type).toLowerCase()}</h2><p style="margin:6px 0 0;color:var(--ink-2);font-size:15.5px;line-height:1.65">${A.esc(l.blurb || '')}</p>
              ${l.ne && S.lang !== 'ne' ? `<p class="muted" style="margin:10px 0 0" lang="ne">${l.ne}</p>` : ''}</section>
            ${homeHtml()}
            ${viewPanel()}
            ${priceBand()}
            ${plannerHtml()}
            ${flagsHtml()}
          </div>
          <aside class="l-aside">
            ${contactHtml()}
            ${ledgerHtml()}
            ${eligHtml()}
          </aside>
        </div>
        <div class="mobile-cta"><button class="btn" data-save="${l.id}"><i data-lucide="heart"></i>${A.t('save')}</button><button class="btn btn-primary" data-contact="whatsapp"><i data-lucide="message-circle"></i>${A.t('contact')}</button></div>`;

      priceHead();
      wireHeroControls();
      wirePlanner();
      el.querySelectorAll('[data-contact]').forEach(b => b.addEventListener('click', () => A.contact(l, b.dataset.contact)));
      el.querySelector('#shareBtn').addEventListener('click', async () => {
        const url = location.href;
        try { if (navigator.share) await navigator.share({ title: l.title, url }); else { await navigator.clipboard.writeText(url); A.toast('Link copied', 'link'); } } catch { /* cancelled */ }
      });
      el.querySelectorAll('#elig [data-st]').forEach(b => b.addEventListener('click', () => {
        S.status = b.dataset.st; A.save('status');
        el.querySelectorAll('#elig [data-st]').forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-checked', x === b); });
        el.querySelector('#eligText').innerHTML = eligibility(S.status);
      }));
      const t360 = el.querySelector('#tour360');
      t360 && t360.addEventListener('click', () => A.toast('360° tours arrive in Phase 2 (Photo Sphere Viewer). Gaussian-splat 3D in Phase 3.', 'rotate-3d'));
      el.querySelectorAll('#eye button').forEach(b => b.addEventListener('click', () => {
        el.querySelectorAll('#eye button').forEach(x => x.classList.toggle('is-on', x === b));
        computeView(+b.dataset.eye);
      }));

      startHero();
      loadTerrain();
      const vp = el.querySelector('#viewPanel');
      if (vp) {
        io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); computeView(1.7); } }, { rootMargin: '200px' });
        io.observe(vp);
      }
      if (!l.draft) { S.seen.add(l.id); A.save('seen'); }
      document.title = `${l.title} · Thaun`;
    },
    onPrefs() {
      priceHead();
      const pp = document.getElementById('pricePanel');
      if (pp) pp.outerHTML = priceBand();
      A.icons();
    },
    unmount() {
      io && io.disconnect();
      orbit && orbit.destroy();
      map && map.remove();
      map = orbit = io = null;
      cleanup.forEach(fn => fn());
      document.title = 'Thaun · Land, homes and farmland in Nepal';
    },
  };
  TH.views.listing = view;
})();
