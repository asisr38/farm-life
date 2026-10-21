/* Thaun prototype: home page. */
(function () {
  const G = TH.geo, M = TH.map, A = TH.app, S = TH.state, t = A.t;

  const FINAL = { center: [85.372, 27.668], zoom: 10.55, pitch: 62, bearing: -18 };
  const START = { center: [84.2, 27.9], zoom: 1.7, pitch: 0, bearing: 0 };
  /* On wide screens the valley sits right of the headline; on phones, above the search box. */
  const final = () => {
    const w = window.innerWidth, h = window.innerHeight;
    return { ...FINAL, padding: w > 880 ? { left: w * 0.42, top: 40, right: 0, bottom: h * 0.15 } : { top: 0, bottom: h * 0.45, left: 0, right: 0 } };
  };

  /* ---------- Keyword search parser (English, romanised Nepali and Devanagari) ---------- */
  const nd = s => s.replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d));
  A.parseSearch = (raw, intent) => {
    const s = nd(raw.toLowerCase());
    const f = { intent };
    if (/\b(rent|bhada|kotha)\b|भाडा|कोठा/.test(s)) f.intent = 'rent';
    if (/\b(lease|lij|bataiya)\b|लिज|बटैया/.test(s)) f.intent = 'lease';
    if (/\b(buy|kinne|sale)\b|किन्ने|बिक्री/.test(s)) f.intent = 'buy';
    if (/\b(farm|khet|krishi|farmland|agri)/.test(s) || /खेत|कृषि/.test(s)) f.type = 'farmland';
    else if (/\b(room|kotha)\b|कोठा/.test(s)) f.type = 'room';
    else if (/\b(flat|apartment|\d\s*bhk)\b|फ्ल्याट/.test(s)) f.type = 'flat';
    else if (/\b(house|ghar|bungalow|villa|home)\b|घर/.test(s)) f.type = 'house';
    else if (/\b(land|jagga|ghaderi|plot)\b|जग्गा|घडेरी/.test(s)) f.type = 'land';
    const area = TH.AREAS.find(a => s.includes(a.name.toLowerCase()) || s.includes(a.ne));
    if (area) f.area = area.id;
    const pm = s.match(/(?:under|below|within|max|upto|up to|भित्र)?\s*(?:rs\.?|npr|रु)?\s*([\d.]+)\s*(crore|cr|करोड|lakh|lac|l|लाख|k|hajar|हजार)\b/);
    if (pm) {
      const n = parseFloat(pm[1]);
      const u = pm[2];
      f.max = /cr|करोड/.test(u) ? n * 1e7 : /k|hajar|हजार/.test(u) ? n * 1e3 : n * 1e5;
    }
    const sm = s.match(/([\d.]+)\s*(aana|ana|आना|ropani|रोपनी)/);
    if (sm) f.minAana = parseFloat(sm[1]) * (/rop|रोप/.test(sm[2]) ? 16 : 1);
    if (/\broad|bato|बाटो/.test(s)) f.road = 1;
    if (/himal|mountain|view|हिमाल/.test(s)) f.view = 1;
    return f;
  };
  A.searchChips = f => {
    const c = [];
    if (f.intent && f.intent !== 'all') c.push(t('intent.' + f.intent));
    if (f.type) c.push(A.typeName(f.type));
    if (f.area) c.push(TH.AREAS.find(a => a.id === f.area).name);
    if (f.max) c.push(`≤ ${G.nprCompact(f.max)}`);
    if (f.minAana) c.push(`≥ ${f.minAana} aana`);
    if (f.road) c.push('Road access');
    if (f.view) c.push('Mountain view');
    return c;
  };
  A.filtersToHash = f => {
    const q = new URLSearchParams();
    for (const k of ['intent', 'type', 'area', 'max', 'minAana', 'road']) if (f[k] && f[k] !== 'all') q.set(k, f[k]);
    return `#/explore${q.toString() ? '?' + q : ''}`;
  };

  /* Sparkline: an illustrative 12-quarter trend seeded from the area id. */
  const spark = id => {
    let s = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
    const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    let v = 50; const pts = [];
    for (let i = 0; i < 12; i++) { v += (r() - 0.38) * 9; pts.push(v); }
    const lo = Math.min(...pts), hi = Math.max(...pts);
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${(i / 11) * 100},${24 - ((p - lo) / (hi - lo || 1)) * 20}`).join('');
    return `<svg class="spark" viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="none" stroke="#f5c273" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg>`;
  };

  /* Contour lines for the farm section background. */
  const contours = () => {
    let p = '';
    for (let i = 0; i < 14; i++) {
      const y = 30 + i * 46;
      p += `<path d="M-20 ${y} C 200 ${y - 40 + (i % 3) * 18}, 420 ${y + 50}, 640 ${y + 6} S 1040 ${y - 50}, 1260 ${y + 10}" />`;
    }
    return `<svg class="roots-lines" viewBox="0 0 1240 700" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2">${p}</g></svg>`;
  };

  let map, orbit, onScroll, captionTimer, skipped = false;

  TH.views.home = {
    mount(el) {
      skipped = false;
      const all = TH.all();
      const farms = all.filter(l => l.type === 'farmland').slice(0, 2);
      const remote = all.filter(l => l.remote && l.type !== 'farmland').slice(0, 3);
      const areas = ['budhanilkantha', 'godawari', 'bhaisepati', 'nagarkot'].map(id => TH.AREAS.find(a => a.id === id));
      const count = id => all.filter(l => l.areaId === id).length;

      el.innerHTML = `
      <section class="hero">
        <div class="hero-map" id="heroMap" aria-label="3D map of the Kathmandu Valley"></div>
        <div class="hero-shade"></div>
        <div class="intro-caption" id="cap" aria-live="polite"></div>
        <button class="btn btn-sm skip" id="skip" hidden><i data-lucide="fast-forward"></i>${t('skip')}</button>
        <div class="hero-copy">
          <h1 class="display reveal d1">${t('hero.title')}</h1>
          <p class="hero-sub reveal d2">${t('hero.sub')}</p>
          <form class="search reveal d3" id="search" autocomplete="off">
            <div class="search-top">
              <div class="seg" role="tablist" id="intent">
                ${['buy', 'rent', 'lease'].map((k, i) => `<button type="button" role="tab" data-k="${k}" class="${i === 0 ? 'is-on' : ''}">${t('intent.' + k)}</button>`).join('')}
              </div>
            </div>
            <div class="search-row">
              <div class="search-field">
                <i data-lucide="search" class="search-icon"></i>
                <input class="search-input" id="q" placeholder='${t(window.innerWidth < 560 ? 'search.phShort' : 'search.ph')}' aria-label="Search land and homes">
                <div class="suggest" id="suggest"></div>
              </div>
              <button class="btn btn-primary btn-lg" type="submit"><span class="hide-xs">${t('search.go')}</span><i data-lucide="arrow-right"></i></button>
            </div>
            <div class="parse" id="parse"><span>Type in English, romanised Nepali or नेपाली. We turn it into filters you can edit.</span></div>
          </form>
          <div class="audience reveal d4">
            <a class="aud" href="#/sell/1"><span class="aud-icon"><i data-lucide="pen-tool"></i></span><div><strong>${t('aud.sell.t')}</strong><span>${t('aud.sell.s')}</span></div><i data-lucide="arrow-up-right"></i></a>
            <a class="aud" href="#/abroad"><span class="aud-icon"><i data-lucide="globe-2"></i></span><div><strong>${t('aud.abroad.t')}</strong><span>${t('aud.abroad.s')}</span></div><i data-lucide="arrow-up-right"></i></a>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div><div class="eyebrow">Places people are looking</div><h2 class="display">Prices you can actually check</h2>
          <p class="lead">Market range per aana for each area, next to the government valuation. Every figure says where it came from.</p></div>
          <a class="btn" href="#/explore">Open the map <i data-lucide="map"></i></a>
        </div>
        <div class="grid-4">
          ${areas.map(a => `
            <a class="area-card" href="#/explore?area=${a.id}">
              ${G.aerial(a.center, null, 520, 420, { zoom: 15 })}
              <div class="area-card-body">
                <span>${a.district} · ${count(a.id)} listing${count(a.id) === 1 ? '' : 's'}</span>
                <strong>${S.lang === 'ne' ? a.ne : a.name}</strong>
                <span class="num">रु ${a.band[0]}–${a.band[1]} L / aana · govt ${a.gov} L</span>
                ${spark(a.id)}
              </div>
            </a>`).join('')}
        </div>
        <p class="muted" style="font-size:12.5px;margin-top:12px">Market bands: Merokalam land price guide, May 2026 (indicative). Government valuations and trend lines are illustrative in this prototype.</p>
      </section>

      <section class="section" style="padding-top:0">
        <div class="section-head"><div><div class="eyebrow">Trust</div><h2 class="display">Every badge says what was checked, and when</h2>
        <p class="lead">Badges expire. If a listing isn't re-confirmed within 30 days it shows as unconfirmed, and after 60 days it leaves the search.</p></div></div>
        <div class="grid-3">
          <div class="trust-card"><span class="tier-icon"><i data-lucide="sparkles"></i></span><h3 class="display">Listed</h3><ul>
            <li><i data-lucide="check"></i>Phone number confirmed</li><li><i data-lucide="check"></i>Photos checked for duplicates and phone numbers</li><li><i data-lucide="check"></i>Price compared with the area</li></ul></div>
          <div class="trust-card"><span class="tier-icon"><i data-lucide="badge-check"></i></span><h3 class="display">Owner-verified</h3><ul>
            <li><i data-lucide="check"></i>Owner identity checked</li><li><i data-lucide="check"></i>Lalpurja seen, kitta number matched to the drawn plot</li><li><i data-lucide="check"></i>Documents stay private to Thaun</li></ul></div>
          <div class="trust-card"><span class="tier-icon"><i data-lucide="shield-check"></i></span><h3 class="display">Site-verified</h3><ul>
            <li><i data-lucide="check"></i>Field agent walked the boundary with GPS</li><li><i data-lucide="check"></i>Road width measured, water checked</li><li><i data-lucide="check"></i>Geotagged photos from the visit</li></ul></div>
        </div>
      </section>

      <section class="section" style="padding-top:0">
        <div class="section-head"><div><div class="eyebrow">From abroad</div><h2 class="display">Shortlist from Sydney, Doha or Dallas</h2>
        <p class="lead">Prices in your currency, live video walks with a field agent, and shortlists you can share with family at home.</p></div>
        <a class="btn" href="#/abroad">What can I buy? <i data-lucide="arrow-right"></i></a></div>
        <div class="grid-3">${remote.map(l => A.card(l)).join('')}</div>
      </section>

      <section class="roots">
        ${contours()}
        <div class="section">
          <div class="roots-grid">
            <div>
              <div class="eyebrow">Our roots</div>
              <h2 class="display">Thaun grew out of a farm</h2>
              <p class="lead">We started as Kathmandu Valley Farm, helping families put idle valley land back to work. That's still at the heart of Thaun: farmland is never an afterthought here.</p>
              <div class="roots-models">
                <div class="roots-model"><i data-lucide="droplets"></i><div><strong>Water first</strong><span>No farmland listing is marked ready until the water has been checked in the dry season.</span></div></div>
                <div class="roots-model"><i data-lucide="scale"></i><div><strong>Honest numbers</strong><span>Every farm plan shows the base case, not the best case.</span></div></div>
                <div class="roots-model"><i data-lucide="handshake"></i><div><strong>Fair, recorded leases</strong><span>Fixed rent, bataiya harvest share or lease-to-own, written down and witnessed.</span></div></div>
              </div>
              <div style="display:flex;gap:10px;margin-top:22px;flex-wrap:wrap">
                <a class="btn btn-primary" href="#/farms">Explore Thaun Farms <i data-lucide="sprout"></i></a>
                <a class="btn" href="#/explore?type=farmland&intent=lease">Farmland on the map</a>
              </div>
            </div>
            <div class="grid-3" style="grid-template-columns:1fr;gap:14px">${farms.map(l => A.card(l, { row: true })).join('')}</div>
          </div>
        </div>
      </section>

      <footer class="footer"><div class="footer-inner">
        <div><b>Thaun ठाउँ</b> · prototype built from <code>PORTAL_PLAN.md</code>. Listings, people and government valuations are sample data.</div>
        <div>Imagery © Esri, Maxar, Earthstar Geographics · Terrain © Mapterhorn (Copernicus GLO-30) · Map © OpenFreeMap, OpenStreetMap contributors.</div>
      </div></footer>`;

      wireSearch(el);
      startMap(el);

      const topbar = document.getElementById('topbar');
      const hero = el.querySelector('.hero');
      onScroll = () => {
        /* Transparent only at the very top; once the page moves, hero copy would run under it. */
        const over = window.scrollY < 40;
        topbar.classList.toggle('is-over-map', over);
        if (window.scrollY > hero.offsetHeight - 80 && orbit) orbit.stop();
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    },
    unmount() {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(captionTimer);
      orbit && orbit.destroy();
      map && map.remove();
      map = orbit = null;
    },
  };

  function wireSearch(el) {
    let intent = 'buy';
    const q = el.querySelector('#q'), parse = el.querySelector('#parse'), sug = el.querySelector('#suggest');
    el.querySelectorAll('#intent button').forEach(b => b.addEventListener('click', () => {
      intent = b.dataset.k;
      el.querySelectorAll('#intent button').forEach(x => x.classList.toggle('is-on', x === b));
      update();
    }));
    const update = () => {
      const f = A.parseSearch(q.value, intent);
      const chips = A.searchChips(f);
      parse.innerHTML = q.value.trim()
        ? `<span>Searching for</span>${chips.map(c => `<span class="badge">${A.esc(c)}</span>`).join('')}`
        : `<span>Type in English, romanised Nepali or नेपाली. We turn it into filters you can edit.</span>`;
      const term = q.value.trim().toLowerCase().split(/\s+/).pop();
      const hits = term && term.length > 1 ? TH.AREAS.filter(a => a.name.toLowerCase().startsWith(term) || a.ne.startsWith(term)).slice(0, 5) : [];
      sug.innerHTML = hits.map(a => `<button type="button" data-area="${a.id}"><span>${a.name} <small>${a.ne}</small></span><small>${a.district}</small></button>`).join('');
      sug.classList.toggle('is-open', hits.length > 0);
    };
    q.addEventListener('input', update);
    q.addEventListener('blur', () => setTimeout(() => sug.classList.remove('is-open'), 150));
    sug.addEventListener('click', e => {
      const b = e.target.closest('[data-area]');
      if (!b) return;
      const a = TH.AREAS.find(x => x.id === b.dataset.area);
      const words = q.value.trim().split(/\s+/); words.pop(); words.push(a.name);
      q.value = words.join(' ') + ' ';
      q.focus(); update();
    });
    el.querySelector('#search').addEventListener('submit', e => {
      e.preventDefault();
      A.go(A.filtersToHash(A.parseSearch(q.value, intent)));
    });
  }

  async function startMap(el) {
    const played = sessionStorage.getItem('thaun:intro');
    const animate = M.motionOK() && !played;
    const box = el.querySelector('#heroMap');
    try {
      map = await M.create(box, { mode: 'satellite', globe: animate, labels: 'minimal', ...(animate ? START : final()), interactive: true });
    } catch (err) {
      box.innerHTML = G.aerial(FINAL.center, null, 1800, 1000, { zoom: 12 });
      return;
    }
    if (!document.body.contains(box)) return map.remove();
    map.scrollZoom.disable();
    addDots();

    const cap = el.querySelector('#cap'), skip = el.querySelector('#skip');
    const caption = text => { cap.textContent = text; cap.classList.toggle('is-on', !!text); };
    if (animate) {
      sessionStorage.setItem('thaun:intro', '1');
      skip.hidden = false;
      skip.onclick = () => { skipped = true; map.stop(); map.jumpTo(final()); caption(''); skip.hidden = true; settle(); };
      caption(S.lang === 'ne' ? 'नेपाल' : 'Nepal');
      await new Promise(r => setTimeout(r, 900));
      if (skipped || !map) return;
      await M.fly(map, { center: [85.42, 27.35], zoom: 8.3, pitch: 74, bearing: 6 }, { duration: 5200, curve: 1.6 });
      if (skipped || !map) return;
      caption(S.lang === 'ne' ? 'हिमालय' : 'The Himalaya');
      await new Promise(r => setTimeout(r, 1100));
      if (skipped || !map) return;
      caption(S.lang === 'ne' ? 'काठमाडौं उपत्यका' : 'The Kathmandu Valley');
      await M.fly(map, final(), { duration: 4200, curve: 1.2 });
      if (skipped || !map) return;
      captionTimer = setTimeout(() => caption(''), 1400);
      skip.hidden = true;
    }
    settle();
  }

  function settle() {
    if (!map) return;
    if (map.getProjection && map.getProjection() && map.getProjection().type === 'globe') map.setProjection({ type: 'mercator' });
    if (M.tier() === 'high' && M.motionOK() && window.scrollY < 200) {
      orbit = M.orbit(map, { degPerSec: 1.6 });
      orbit.start();
    }
  }

  function addDots() {
    const all = TH.all();
    map.addSource('dots', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: all.map(l => ({ type: 'Feature', properties: { id: l.id, farm: l.type === 'farmland' ? 1 : 0 }, geometry: { type: 'Point', coordinates: l.center } })) },
    });
    map.addLayer({ id: 'dots-glow', type: 'circle', source: 'dots', paint: { 'circle-radius': 12, 'circle-color': ['case', ['==', ['get', 'farm'], 1], '#7cc79f', '#f5b14a'], 'circle-opacity': 0.25, 'circle-blur': 0.8 } });
    map.addLayer({ id: 'dots', type: 'circle', source: 'dots', paint: { 'circle-radius': 4.5, 'circle-color': ['case', ['==', ['get', 'farm'], 1], '#7cc79f', '#f5b14a'], 'circle-stroke-color': '#fff', 'circle-stroke-width': 1.5 } });
    map.on('click', 'dots', e => A.go(`#/p/${e.features[0].properties.id}`));
    map.on('mouseenter', 'dots', () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', 'dots', () => (map.getCanvas().style.cursor = ''));
  }
})();
