/* Thaun prototype: map search. */
(function () {
  const G = TH.geo, M = TH.map, A = TH.app, S = TH.state, t = A.t;

  const TYPES = ['land', 'farmland', 'house', 'flat', 'room'];
  const INTENT = { buy: 'sale', rent: 'rent', lease: 'lease' };
  const MAXES = [[0, 'Any price'], [5e4, '≤ रु 50K'], [1.5e5, '≤ रु 1.5L'], [1e7, '≤ रु 1 Cr'], [2e7, '≤ रु 2 Cr'], [5e7, '≤ रु 5 Cr']];

  let map, pins, f, moveSearch = false, activeId = null, mobile, sheetPos = 'half', cleanup = [];

  const isMobile = () => window.matchMedia('(max-width: 880px)').matches;

  function filtered(bounds) {
    const ids = f.ids ? f.ids.split(',') : null;
    return TH.all().filter(l => {
      if (ids) return ids.includes(l.id);
      if (f.intent && f.intent !== 'all' && l.intent !== INTENT[f.intent]) return false;
      if (f.type && l.type !== f.type) return false;
      if (f.area && l.areaId !== f.area) return false;
      if (f.max && +f.max && l.price > +f.max) return false;
      if (f.minAana && (!l.m2 || G.aana(l.m2) < +f.minAana)) return false;
      if (f.road && !(l.road && l.road.type && l.road.type !== 'footpath')) return false;
      if (f.verified && !['site', 'owner'].includes(A.level(l))) return false;
      if (f.owner && l.source !== 'owner') return false;
      if (f.remote && !l.remote) return false;
      if (bounds && !bounds.contains(l.center)) return false;
      return true;
    });
  }

  function syncHash() {
    const q = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => v && v !== 'all' && v !== '0' && q.set(k, v));
    history.replaceState(null, '', `#/explore${q.toString() ? '?' + q : ''}`);
  }

  function filtersHtml() {
    const chip = (k, v, label, icon) => `<button class="chip ${String(f[k] || '') === String(v) ? 'is-on' : ''}" data-f="${k}" data-v="${v}">${icon ? `<i data-lucide="${icon}"></i>` : ''}${label}</button>`;
    const toggle = (k, label, icon) => `<button class="chip ${f[k] ? 'is-on' : ''}" data-t="${k}">${icon ? `<i data-lucide="${icon}"></i>` : ''}${label}</button>`;
    const area = f.area && TH.AREAS.find(a => a.id === f.area);
    return `
      <div class="seg" id="fIntent">${['all', 'buy', 'rent', 'lease'].map(k => `<button data-k="${k}" class="${(f.intent || 'all') === k ? 'is-on' : ''}">${t('intent.' + k)}</button>`).join('')}</div>
      <div class="filter-row">${chip('type', '', 'All types')}${TYPES.map(ty => chip('type', ty, A.typeName(ty), { land: 'square-dashed', farmland: 'sprout', house: 'house', flat: 'building', room: 'door-open' }[ty])).join('')}</div>
      <div class="filter-row">
        ${toggle('verified', 'Verified', 'badge-check')}${toggle('owner', 'Owner-direct', 'house')}${toggle('remote', 'Video walk', 'video')}
        <select class="chip" id="fMax" aria-label="Maximum price">${MAXES.map(([v, l]) => `<option value="${v}" ${+f.max === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
        ${area ? `<button class="chip is-on" data-clear="area">${area.name} <i data-lucide="x"></i></button>` : ''}
        ${f.ids ? `<button class="chip is-on" data-clear="ids">Shared shortlist <i data-lucide="x"></i></button>` : ''}
      </div>`;
  }

  function renderList() {
    const list = filtered(moveSearch && map ? map.getBounds() : null);
    const res = document.getElementById('results');
    const count = document.getElementById('count');
    count.textContent = `${list.length} ${list.length === 1 ? 'place' : 'places'}${moveSearch ? ' in view' : ''}`;
    res.innerHTML = list.length
      ? list.map(l => A.card(l)).join('')
      : `<div class="empty"><i data-lucide="map-pinned"></i><b>Nothing here yet</b><span>Try a wider area or fewer filters. Thaun is starting with the Kathmandu Valley.</span><button class="btn btn-sm" data-reset>Clear filters</button></div>`;
    res.querySelectorAll('.lcard').forEach(c => {
      c.addEventListener('mouseenter', () => hover(c.dataset.id));
      c.addEventListener('mouseleave', () => hover(null));
    });
    const reset = res.querySelector('[data-reset]');
    reset && reset.addEventListener('click', () => { f = {}; refresh(true); });
    A.icons();
    return list;
  }

  function hover(id) {
    pins && pins.hover(id);
    if (!map) return;
    TH.all().forEach(l => l.parcel && M.setParcelState(map, 'parcels', l.id, { hover: l.id === id }));
    document.querySelectorAll('#results .lcard').forEach(c => c.classList.toggle('is-hover', c.dataset.id === id));
  }

  function select(l) {
    activeId = l ? l.id : null;
    pins && pins.active(activeId);
    TH.all().forEach(x => x.parcel && M.setParcelState(map, 'parcels', x.id, { active: x.id === activeId }));
    const mini = document.getElementById('mini');
    if (!l) { mini.classList.remove('is-open'); return; }
    S.seen.add(l.id); A.save('seen'); pins.seen(l.id);
    mini.innerHTML = `<button class="icon-btn mini-close" aria-label="Close" data-noopen><i data-lucide="x"></i></button>${A.card(l)}`;
    mini.classList.add('is-open');
    mini.querySelector('.mini-close').onclick = e => { e.stopPropagation(); select(null); };
    A.icons();
    const z = l.parcel ? Math.min(17.4, Math.max(map.getZoom(), 16.2)) : Math.max(map.getZoom(), 15);
    M.fly(map, { center: l.center, zoom: z, pitch: map._th.terrainOn ? 50 : 0, offset: isMobile() ? [0, 60] : [0, -80] }, { duration: 1600 });
    const card = document.querySelector(`#results .lcard[data-id="${l.id}"]`);
    if (card && !isMobile()) card.scrollIntoView({ behavior: M.reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
    if (isMobile()) setSheet('peek');
  }

  function refresh(fit) {
    syncHash();
    document.getElementById('filters').innerHTML = filtersHtml();
    wireFilters();
    const list = renderList();
    if (pins) pins.set(moveSearch ? filtered() : list);
    if (fit && map) fitTo(list);
  }

  function fitTo(list) {
    if (f.area) {
      const a = TH.AREAS.find(x => x.id === f.area);
      return M.fly(map, { center: a.center, zoom: 14.2, pitch: map._th.terrainOn ? 45 : 0 }, { duration: 1600 });
    }
    if (!list.length) return;
    const b = new maplibregl.LngLatBounds();
    list.forEach(l => b.extend(l.center));
    const pad = isMobile() ? { top: 80, bottom: window.innerHeight * 0.5, left: 40, right: 40 } : 90;
    map.fitBounds(b, { padding: pad, maxZoom: 15, duration: M.motionOK() ? 1400 : 0 });
  }

  function wireFilters() {
    const box = document.getElementById('filters');
    box.querySelectorAll('#fIntent button').forEach(b => b.addEventListener('click', () => { f.intent = b.dataset.k; refresh(true); }));
    box.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => { f[b.dataset.f] = b.dataset.v; refresh(true); }));
    box.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => { f[b.dataset.t] = f[b.dataset.t] ? '' : '1'; refresh(false); }));
    box.querySelectorAll('[data-clear]').forEach(b => b.addEventListener('click', () => { delete f[b.dataset.clear]; refresh(true); }));
    box.querySelector('#fMax').addEventListener('change', e => { f.max = e.target.value; refresh(false); });
    A.icons();
  }

  /* ---------- Mobile bottom sheet ---------- */
  function setSheet(pos) {
    const sheet = document.getElementById('sheet');
    if (!sheet || !isMobile()) return;
    sheetPos = pos;
    const h = sheet.offsetHeight;
    const y = { peek: h - 128, half: h * 0.42, full: 0 }[pos];
    sheet.style.setProperty('--sheet-y', `${y}px`);
  }
  function wireSheet() {
    const sheet = document.getElementById('sheet');
    const handle = document.getElementById('handle');
    let startY, startT, dragging = false;
    const current = () => new DOMMatrixReadOnly(getComputedStyle(sheet).transform).m42;
    const down = e => { if (!isMobile()) return; dragging = true; startY = e.clientY; startT = current(); sheet.classList.add('is-dragging'); handle.setPointerCapture(e.pointerId); };
    const move = e => { if (!dragging) return; const y = Math.max(0, Math.min(sheet.offsetHeight - 110, startT + e.clientY - startY)); sheet.style.setProperty('--sheet-y', `${y}px`); };
    const up = e => {
      if (!dragging) return;
      dragging = false; sheet.classList.remove('is-dragging');
      const y = current(), h = sheet.offsetHeight, v = e.clientY - startY;
      if (Math.abs(v) < 6) return setSheet(sheetPos === 'full' ? 'half' : sheetPos === 'half' ? 'full' : 'half');
      const targets = { full: 0, half: h * 0.42, peek: h - 128 };
      const pos = Object.entries(targets).sort((a, b) => Math.abs(a[1] - y) - Math.abs(b[1] - y))[0][0];
      setSheet(pos);
    };
    handle.addEventListener('pointerdown', down);
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
    handle.addEventListener('pointercancel', up);
    const onResize = () => setSheet(sheetPos);
    window.addEventListener('resize', onResize);
    cleanup.push(() => window.removeEventListener('resize', onResize));
    setSheet('half');
  }

  async function startMap() {
    const box = document.getElementById('map');
    try {
      map = await M.create(box, { mode: 'map', terrain: false, center: [85.34, 27.69], zoom: 11.2 });
    } catch {
      box.innerHTML = '<div class="empty">The map could not load. Check your connection.</div>';
      return;
    }
    if (!document.body.contains(box)) return map.remove();
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    map.addControl(new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true } }), 'bottom-right');
    const all = TH.all();
    M.addParcels(map, all.filter(l => l.parcel).map(l => l.parcel));
    addPriceLayer();
    pins = M.pins(map, filtered(), { label: A.pinLabel, onClick: select, onHover: hover });
    S.seen.forEach(id => pins.seen(id));
    map.on('click', 'parcels-fill', e => { const l = TH.byId(e.features[0].properties.id); l && select(l); });
    map.on('click', e => { if (!e.originalEvent.target.closest('.pin') && !map.queryRenderedFeatures(e.point, { layers: ['parcels-fill'] }).length) select(null); });
    map.on('moveend', () => { if (moveSearch) renderList(); hint(); });
    hint();
    fitTo(filtered());
    wireTools();
  }

  function hint() {
    const el = document.getElementById('hint');
    if (!el || !map) return;
    const z = map.getZoom();
    el.textContent = z < 13.5 ? 'Zoom in to see plot boundaries' : 'Outlines show each plot as traced by its owner';
  }

  function addPriceLayer() {
    map.addSource('prices', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: TH.AREAS.map(a => ({ type: 'Feature', properties: { mid: (a.band[0] + a.band[1]) / 2, label: `Rs ${a.band[0]}–${a.band[1]} L/aana` }, geometry: { type: 'Point', coordinates: a.center } })) },
    });
    map.addLayer({
      id: 'prices-heat', type: 'circle', source: 'prices', layout: { visibility: 'none' },
      paint: {
        'circle-radius': ['interpolate', ['exponential', 2], ['zoom'], 10, 26, 14, 300],
        'circle-color': ['interpolate', ['linear'], ['get', 'mid'], 6, '#7cc79f', 25, '#f5c273', 55, '#e06a3b'],
        'circle-opacity': 0.32, 'circle-blur': 0.75,
      },
    });
    map.addLayer({
      id: 'prices-label', type: 'symbol', source: 'prices', layout: { visibility: 'none', 'text-field': ['get', 'label'], 'text-font': ['Noto Sans Bold'], 'text-size': 12.5, 'text-offset': [0, 2.2] },
      paint: { 'text-color': '#1b2420', 'text-halo-color': '#fffdf8', 'text-halo-width': 1.8 },
    });
  }

  function wireTools() {
    const tools = document.getElementById('mapTools');
    tools.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
      M.setMode(map, b.dataset.mode);
      tools.querySelectorAll('[data-mode]').forEach(x => x.classList.toggle('is-on', x === b));
    }));
    const t3 = tools.querySelector('#t3d');
    t3.addEventListener('click', () => {
      if (M.tier() === 'low') return A.toast('3D terrain is off on this device to keep the map fast', 'gauge');
      const on = !map._th.terrainOn;
      M.setTerrain(map, on);
      t3.classList.toggle('is-on', on);
      M.fly(map, { pitch: on ? 58 : 0, bearing: on ? -15 : 0 }, { duration: 1200 });
    });
    const tp = tools.querySelector('#tprice');
    tp.addEventListener('click', () => {
      const on = !tp.classList.contains('is-on');
      tp.classList.toggle('is-on', on);
      ['prices-heat', 'prices-label'].forEach(id => map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none'));
      if (on) A.toast('Price bands per aana from the May 2026 Merokalam guide (indicative)', 'info');
    });
  }

  TH.views.explore = {
    mount(el, _p, query) {
      f = { ...query };
      moveSearch = false; activeId = null; cleanup = [];
      el.innerHTML = `
      <div class="explore">
        <aside class="explore-list" id="sheet">
          <div class="sheet-handle" id="handle" role="button" aria-label="Drag to resize the results"></div>
          <div class="filters" id="filters"></div>
          <div class="results-head"><span id="count" class="num"></span>
            <label class="check" style="font-size:13px"><input type="checkbox" id="moveSearch"> Search as I move the map</label></div>
          <div class="results" id="results"></div>
        </aside>
        <div class="explore-map">
          <div class="map" id="map"></div>
          <div class="map-tools" id="mapTools">
            <div class="seg"><button data-mode="map" class="is-on">Map</button><button data-mode="satellite">Satellite</button></div>
            <button class="chip" id="t3d"><i data-lucide="mountain"></i>3D terrain</button>
            <button class="chip" id="tprice"><i data-lucide="hexagon"></i>Price per aana</button>
          </div>
          <div class="mini" id="mini"></div>
          <div class="map-hint" id="hint"></div>
        </div>
      </div>`;
      document.getElementById('filters').innerHTML = filtersHtml();
      wireFilters();
      renderList();
      el.querySelector('#moveSearch').addEventListener('change', e => { moveSearch = e.target.checked; refresh(false); });
      wireSheet();
      startMap();
    },
    update(_p, query) {
      f = { ...query };
      refresh(true);
    },
    onPrefs() {
      pins && pins.relabel();
      renderList();
      const mini = document.getElementById('mini');
      if (activeId && mini.classList.contains('is-open')) select(TH.byId(activeId));
    },
    unmount() {
      cleanup.forEach(fn => fn());
      pins && pins.destroy();
      map && map.remove();
      map = pins = null;
    },
  };
})();
