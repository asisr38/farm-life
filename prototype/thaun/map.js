/* Thaun prototype: MapLibre setup, pins, parcels and camera choreography. */
(function () {
  const M = (TH.map = {});
  const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
  /* Mapterhorn serves Copernicus GLO-30 up to z12 here; maxzoom must be explicit or the map asks for tiles that don't exist. */
  const DEM = { type: 'raster-dem', tiles: ['https://tiles.mapterhorn.com/{z}/{x}/{y}.webp'], tileSize: 512, maxzoom: 12, encoding: 'terrarium', attribution: '© Mapterhorn' };
  const SAT_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

  /* ---------- Device tier and motion ---------- */
  M.reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  M.tier = (() => {
    let cached;
    return () => {
      if (cached) return cached;
      const forced = new URLSearchParams(location.search).get('tier');
      if (forced) return (cached = forced);
      const c = document.createElement('canvas');
      const gl2 = !!c.getContext('webgl2');
      const mem = navigator.deviceMemory || 8;
      const cores = navigator.hardwareConcurrency || 8;
      const conn = navigator.connection || {};
      const slow = conn.saveData || /(^|-)2g|3g/.test(conn.effectiveType || '');
      if (!gl2 || mem <= 2 || slow) cached = 'low';
      else if (mem <= 4 || cores <= 4) cached = 'mid';
      else cached = 'high';
      return cached;
    };
  })();

  M.motionOK = () => !M.reducedMotion() && M.tier() !== 'low';

  /* ---------- Style ---------- */
  let baseStyle;
  const loadBase = () =>
    (baseStyle =
      baseStyle ||
      fetch(STYLE_URL)
        .then(r => r.json())
        .catch(() => null));

  async function buildStyle({ mode, globe }) {
    const base = await loadBase();
    const style = base
      ? JSON.parse(JSON.stringify(base))
      : { version: 8, sources: {}, layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#e9e4d8' } }] };
    style.sources.sat = {
      type: 'raster', tiles: [SAT_TILES], tileSize: 256, maxzoom: 19,
      attribution: 'Imagery © Esri, Maxar, Earthstar Geographics',
    };
    style.sources.dem = { ...DEM };
    style.sources.demHill = { ...DEM };

    const firstSymbol = style.layers.findIndex(l => l.type === 'symbol');
    const satLayer = {
      id: 'sat', type: 'raster', source: 'sat',
      layout: { visibility: mode === 'satellite' ? 'visible' : 'none' },
      paint: { 'raster-saturation': -0.08, 'raster-contrast': 0.06, 'raster-fade-duration': 200 },
    };
    style.layers.splice(firstSymbol < 0 ? style.layers.length : firstSymbol, 0, satLayer);
    const waterIdx = style.layers.findIndex(l => l.id === 'water');
    style.layers.splice(waterIdx < 0 ? 1 : waterIdx, 0, {
      id: 'hills', type: 'hillshade', source: 'demHill',
      layout: { visibility: mode === 'satellite' ? 'none' : 'visible' },
      paint: { 'hillshade-exaggeration': 0.35, 'hillshade-shadow-color': '#3d4a3f', 'hillshade-highlight-color': '#fffaf0' },
    });
    /* Grey extruded buildings look wrong over photographs, so they only show on the drawn map. */
    style.layers.forEach(l => { if (l.type === 'fill-extrusion') l.layout = { ...(l.layout || {}), visibility: mode === 'satellite' ? 'none' : 'visible' }; });
    if (globe) style.projection = { type: 'globe' };
    style.sky = {
      'sky-color': '#9fc3e6', 'horizon-color': '#f4dcc0', 'fog-color': '#f3e6d6',
      'sky-horizon-blend': 0.6, 'horizon-fog-blend': 0.5, 'fog-ground-blend': 0.6, 'atmosphere-blend': 0.8,
    };
    return style;
  }

  M.create = async (container, opts = {}) => {
    const { mode = 'map', terrain = true, globe = false, center = [85.33, 27.7], zoom = 11, pitch = 0, bearing = 0, interactive = true, maxPitch = 75, labels = 'all' } = opts;
    const style = await buildStyle({ mode, globe });
    /* Hero maps keep only country and city names so headline copy stays readable. */
    if (labels === 'minimal') style.layers = style.layers.filter(l => l.type !== 'symbol' || /country|city|capital/.test(l.id));
    const map = new maplibregl.Map({
      container, style, center, zoom, pitch, bearing, interactive,
      maxPitch: M.tier() === 'mid' ? Math.min(maxPitch, 60) : maxPitch,
      attributionControl: { compact: true, customAttribution: 'Terrain © Mapterhorn (Copernicus GLO-30) · Map © OpenFreeMap, OpenStreetMap' },
      pixelRatio: M.tier() === 'low' ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio,
      fadeDuration: 150,
    });
    map._th = { mode, terrainOn: false };
    TH.debugMap = map; /* latest map, for poking at in the console */
    await new Promise(res => map.once('load', res));
    if (opts.padding) map.setPadding(opts.padding);
    const attrib = container.querySelector('.maplibregl-ctrl-attrib');
    if (attrib) attrib.classList.remove('maplibregl-compact-show');
    if (terrain && M.tier() !== 'low') M.setTerrain(map, true);
    return map;
  };

  /* Resolves once tiles (including terrain) have loaded, or after a timeout. Animating before the
     ground elevation is known makes MapLibre's elevation compensation land the camera at the wrong zoom. */
  M.settled = (map, timeout = 5000) =>
    new Promise(res => {
      if (map.areTilesLoaded && map.areTilesLoaded() && !map.isMoving()) return res();
      const t = setTimeout(res, timeout);
      map.once('idle', () => { clearTimeout(t); res(); });
    });

  M.setTerrain = (map, on, exaggeration = 1.35) => {
    map._th.terrainOn = on;
    map.setTerrain(on ? { source: 'dem', exaggeration } : null);
  };

  M.setMode = (map, mode) => {
    map._th.mode = mode;
    map.setLayoutProperty('sat', 'visibility', mode === 'satellite' ? 'visible' : 'none');
    map.setLayoutProperty('hills', 'visibility', mode === 'satellite' ? 'none' : 'visible');
    map.getStyle().layers.filter(l => l.type === 'fill-extrusion').forEach(l => map.setLayoutProperty(l.id, 'visibility', mode === 'satellite' ? 'none' : 'visible'));
  };

  /* Resolves when this flight ends. The id in eventData keeps an earlier animation's
     moveend (fired when flyTo stops it) from resolving the wrong promise. */
  let flightId = 0;
  /* MapLibre refreshes the centre's ground elevation only after a camera change. Flying while it still
     reads 0 makes the end-of-flight elevation compensation land several zoom levels short. */
  M.groundReady = async (map, timeout = 4000) => {
    if (!map._th.terrainOn) return;
    const t0 = performance.now();
    while (alive(map) && map.getCenterElevation() === 0 && performance.now() - t0 < timeout) {
      map.jumpTo({ center: map.getCenter() });
      await new Promise(r => setTimeout(r, 150));
    }
  };
  M.fly = async (map, camera, opts = {}) => {
    if (M.motionOK()) await M.groundReady(map);
    return flyNow(map, camera, opts);
  };
  const flyNow = (map, camera, { duration = 2400, curve = 1.42, essential = false } = {}) =>
    new Promise(res => {
      if (!alive(map)) return res();
      if (!M.motionOK()) {
        map.jumpTo(camera);
        return res();
      }
      const id = ++flightId;
      let done = false;
      const finish = () => { if (done) return; done = true; map.off('moveend', onEnd); clearTimeout(timer); res(); };
      const onEnd = e => e.thFlight === id && finish();
      const timer = setTimeout(finish, duration + 2000);
      map.on('moveend', onEnd);
      map.flyTo({ ...camera, duration, curve, essential }, { thFlight: id });
    });

  /* ---------- Parcels ---------- */
  M.addParcels = (map, features, { id = 'parcels', minzoom = 13.5, interactive = true } = {}) => {
    map.addSource(id, { type: 'geojson', data: { type: 'FeatureCollection', features }, promoteId: 'id' });
    map.addLayer({
      id: `${id}-fill`, type: 'fill', source: id, minzoom,
      paint: {
        'fill-color': ['case', ['boolean', ['feature-state', 'active'], false], '#e39b2d', '#ffffff'],
        'fill-opacity': ['case', ['boolean', ['feature-state', 'active'], false], 0.28, ['boolean', ['feature-state', 'hover'], false], 0.2, 0.08],
      },
    });
    map.addLayer({
      id: `${id}-line`, type: 'line', source: id, minzoom,
      layout: { 'line-join': 'round' },
      paint: {
        'line-color': ['case', ['boolean', ['feature-state', 'active'], false], '#f5b14a', '#ffffff'],
        'line-width': ['interpolate', ['linear'], ['zoom'], 14, 1.2, 18, 3],
        'line-opacity': 0.95,
      },
    });
    if (interactive) {
      map.on('mouseenter', `${id}-fill`, () => (map.getCanvas().style.cursor = 'pointer'));
      map.on('mouseleave', `${id}-fill`, () => (map.getCanvas().style.cursor = ''));
    }
  };

  /* A removed map (the user navigated away mid-animation) has no style; any call on it throws. */
  const alive = map => !!(map && map.style);
  M.alive = alive;

  M.setParcelState = (map, id, featureId, state) => {
    if (featureId == null || !alive(map) || !map.getSource(id)) return;
    map.setFeatureState({ source: id, id: featureId }, state);
  };

  /* Draw a ring progressively, like a pen tracing the boundary. */
  M.drawOutline = (map, coords, { id = 'outline', duration = 1400, color = '#f5b14a' } = {}) =>
    new Promise(res => {
      const empty = { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } };
      if (!map.getSource(id)) {
        map.addSource(id, { type: 'geojson', data: empty });
        map.addLayer({ id: `${id}-glow`, type: 'line', source: id, layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': color, 'line-width': 12, 'line-opacity': 0.25, 'line-blur': 6 } });
        map.addLayer({ id: `${id}-line`, type: 'line', source: id, layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': color, 'line-width': 3.5 } });
        map.addSource(`${id}-fill`, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        map.addLayer({ id: `${id}-fill`, type: 'fill', source: `${id}-fill`, paint: { 'fill-color': color, 'fill-opacity': 0 } }, `${id}-glow`);
      }
      const line = turf.lineString(coords);
      const total = turf.length(line);
      const src = map.getSource(id);
      const finish = () => {
        if (!alive(map)) return res();
        src.setData(line);
        map.getSource(`${id}-fill`).setData(turf.polygon([coords]));
        map.setPaintProperty(`${id}-fill`, 'fill-opacity-transition', { duration: 600 });
        map.setPaintProperty(`${id}-fill`, 'fill-opacity', 0.18);
        res();
      };
      if (!M.motionOK()) return finish();
      const t0 = performance.now();
      const tick = now => {
        if (!alive(map)) return res();
        const t = Math.min(1, (now - t0) / duration);
        const e = 1 - Math.pow(1 - t, 3);
        if (t >= 1) return finish();
        const part = turf.lineSliceAlong(line, 0, Math.max(total * e, 1e-6));
        src.setData(part);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

  /* Slow orbit around the current centre. Returns a controller with a pause toggle. */
  M.orbit = (map, { degPerSec = 6 } = {}) => {
    let running = false, raf, last;
    const step = now => {
      if (!running) return;
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      map.setBearing((map.getBearing() + degPerSec * dt) % 360);
      raf = requestAnimationFrame(step);
    };
    const stopOnInput = () => api.stop();
    const api = {
      get running() { return running; },
      start() {
        if (running || !M.motionOK()) return;
        running = true; last = null;
        raf = requestAnimationFrame(step);
        api.onchange && api.onchange(true);
      },
      stop() {
        if (!running) return;
        running = false;
        cancelAnimationFrame(raf);
        api.onchange && api.onchange(false);
      },
      toggle() { running ? api.stop() : api.start(); },
      destroy() { api.stop(); map.off('mousedown', stopOnInput); map.off('touchstart', stopOnInput); },
    };
    map.on('mousedown', stopOnInput);
    map.on('touchstart', stopOnInput);
    return api;
  };

  /* ---------- Price pins (HTML markers) ---------- */
  M.pins = (map, listings, { label, onClick, onHover } = {}) => {
    const markers = new Map();
    const make = l => {
      const el = document.createElement('button');
      el.className = `pin pin-${l.type}`;
      el.type = 'button';
      el.dataset.id = l.id;
      el.innerHTML = `<span class="pin-dot"></span><span class="pin-label">${label(l)}</span>`;
      el.setAttribute('aria-label', `${l.title}, ${label(l)}`);
      el.addEventListener('click', e => { e.stopPropagation(); onClick && onClick(l); });
      el.addEventListener('mouseenter', () => onHover && onHover(l.id));
      el.addEventListener('mouseleave', () => onHover && onHover(null));
      const m = new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat(l.center).addTo(map);
      markers.set(l.id, { m, el, l });
    };
    listings.forEach(make);
    return {
      set(next) {
        const ids = new Set(next.map(l => l.id));
        for (const [id, { m }] of markers) if (!ids.has(id)) { m.remove(); markers.delete(id); }
        next.forEach(l => (markers.has(l.id) ? markers.get(l.id).el.querySelector('.pin-label').textContent = label(l) : make(l)));
      },
      relabel() { for (const { el, l } of markers.values()) el.querySelector('.pin-label').textContent = label(l); },
      active(id) { for (const [k, { el }] of markers) el.classList.toggle('is-active', k === id); },
      hover(id) { for (const [k, { el }] of markers) el.classList.toggle('is-hover', k === id); },
      seen(id) { const x = markers.get(id); x && x.el.classList.add('is-seen'); },
      destroy() { for (const { m } of markers.values()) m.remove(); markers.clear(); },
    };
  };
})();
