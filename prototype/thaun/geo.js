/* Thaun prototype: units, money, parcels, terrain sampling and line of sight. */
(function () {
  const G = (TH.geo = {});

  /* ---------- Land units ---------- */
  const ROPANI = 508.72, AANA = ROPANI / 16, PAISA = AANA / 4, DAAM = PAISA / 4;
  const BIGHA = 6772.63, KATTHA = BIGHA / 20, DHUR = KATTHA / 20;
  const SQFT = 0.09290304;
  G.UNITS = { ROPANI, AANA, PAISA, DAAM, BIGHA, KATTHA, DHUR, SQFT };

  G.rapdToM2 = ([r = 0, a = 0, p = 0, d = 0]) => r * ROPANI + a * AANA + p * PAISA + d * DAAM;
  G.m2ToRapd = m2 => {
    let daam = m2 / DAAM;
    const r = Math.floor(daam / 256); daam -= r * 256;
    const a = Math.floor(daam / 16); daam -= a * 16;
    const p = Math.floor(daam / 4); daam -= p * 4;
    let d = Math.round(daam * 10) / 10;
    if (d >= 4) d = 3.9;
    return [r, a, p, d];
  };
  G.m2ToBkd = m2 => {
    let dhur = m2 / DHUR;
    const b = Math.floor(dhur / 400); dhur -= b * 400;
    const k = Math.floor(dhur / 20); dhur -= k * 20;
    return [b, k, Math.round(dhur * 10) / 10];
  };
  G.fmtRapd = m2 => G.m2ToRapd(m2).join('-');
  G.fmtBkd = m2 => G.m2ToBkd(m2).join('-');
  G.aana = m2 => m2 / AANA;
  G.ropani = m2 => m2 / ROPANI;
  G.sqft = m2 => m2 / SQFT;
  G.rapdWords = m2 => {
    const [r, a, p, d] = G.m2ToRapd(m2);
    const parts = [];
    if (r) parts.push(`${r} ropani`);
    if (a) parts.push(`${a} aana`);
    if (p) parts.push(`${p} paisa`);
    if (d) parts.push(`${d} daam`);
    return parts.join(' ') || '0';
  };

  /* ---------- Numbers and money ---------- */
  const inGroup = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
  G.int = n => inGroup.format(Math.round(n));
  G.num = (n, digits = 0) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);

  const trim = n => (Math.round(n * 100) / 100).toString().replace(/\.0+$/, '').replace(/(\.\d)0$/, '$1');

  /* Compact NPR in lakh and crore: रु 1.2 Cr, रु 85 L, रु 45K.
     Non-breaking spaces keep the symbol, number and unit on one line. */
  const NB = '\u00a0';
  G.nprCompact = n => {
    const abs = Math.abs(n);
    if (abs >= 1e7) return `रु${NB}${trim(n / 1e7)}${NB}Cr`;
    if (abs >= 1e5) return `रु${NB}${trim(n / 1e5)}${NB}L`;
    if (abs >= 1e3) return `रु${NB}${trim(n / 1e3)}K`;
    return `रु${NB}${G.int(n)}`;
  };
  G.nprFull = n => `रु${NB}${G.int(n)}`;

  /* Compact international currency: $99.3K, £1.06M */
  G.fxCompact = (n, code) => {
    if (code === 'NPR') return G.nprCompact(n);
    const fx = TH.FX[code];
    const v = n / fx.rate;
    const abs = Math.abs(v);
    let s;
    if (abs >= 1e6) s = `${trim(v / 1e6)}M`;
    else if (abs >= 1e3) s = `${trim(v / 1e3)}K`;
    else s = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v);
    return `${fx.symbol.replace(' ', NB)}${s}`;
  };
  G.fxFull = (n, code) => {
    if (code === 'NPR') return G.nprFull(n);
    const fx = TH.FX[code];
    return `${fx.symbol.replace(' ', NB)}${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n / fx.rate)}`;
  };

  /* ---------- Parcels ---------- */
  function rng(seed) {
    let s = seed * 9301 + 49297;
    return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  }

  /* An irregular quadrilateral (sometimes a pentagon) of exactly areaM2, rotated by rot degrees. */
  G.makeParcel = (center, areaM2, seed = 1, rot = 0) => {
    const r = rng(seed);
    const n = r() > 0.7 ? 5 : 4;
    const aspect = 0.75 + r() * 0.6;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + Math.PI / n + (r() - 0.5) * 0.35;
      const rad = 1 + (r() - 0.5) * 0.25;
      pts.push([Math.cos(ang) * rad * aspect, Math.sin(ang) * rad]);
    }
    const t = (rot * Math.PI) / 180;
    const mPerDegLat = 110574;
    const mPerDegLng = 111320 * Math.cos((center[1] * Math.PI) / 180);
    const toLngLat = (x, y, k) => {
      const xr = x * Math.cos(t) - y * Math.sin(t);
      const yr = x * Math.sin(t) + y * Math.cos(t);
      return [center[0] + (xr * k) / mPerDegLng, center[1] + (yr * k) / mPerDegLat];
    };
    const ring = k => {
      const c = pts.map(([x, y]) => toLngLat(x, y, k));
      c.push(c[0]);
      return c;
    };
    const a1 = turf.area(turf.polygon([ring(1)]));
    const k = Math.sqrt(areaM2 / a1);
    return turf.polygon([ring(k)]);
  };

  G.edgeLengths = coords => {
    const out = [];
    for (let i = 0; i < coords.length - 1; i++) {
      const a = coords[i], b = coords[i + 1];
      const m = turf.distance(a, b, { units: 'kilometers' }) * 1000;
      out.push({ mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], m });
    }
    return out;
  };

  /* ---------- Tile math ---------- */
  const lngToX = (lng, z, size) => ((lng + 180) / 360) * size * 2 ** z;
  const latToY = (lat, z, size) => {
    const s = Math.sin((lat * Math.PI) / 180);
    return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * size * 2 ** z;
  };
  G.worldPx = (lng, lat, z, size = 256) => [lngToX(lng, z, size), latToY(lat, z, size)];

  /* ---------- Elevation (Mapterhorn terrarium, Copernicus GLO-30) ---------- */
  const DEM_URL = (z, x, y) => `https://tiles.mapterhorn.com/${z}/${x}/${y}.webp`;
  const DEM_SIZE = 512;
  const tiles = new Map();

  function loadTile(z, x, y) {
    const key = `${z}/${x}/${y}`;
    if (tiles.has(key)) return tiles.get(key);
    const p = new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = c.height = DEM_SIZE;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        resolve(ctx.getImageData(0, 0, DEM_SIZE, DEM_SIZE).data);
      };
      img.onerror = () => resolve(null);
      img.src = DEM_URL(z, x, y);
    });
    const entry = { promise: p, data: undefined };
    p.then(d => (entry.data = d));
    tiles.set(key, entry);
    return entry;
  }

  const pickZoom = distM => (distM < 9000 ? 12 : distM < 45000 ? 10 : 8);

  function tileKeyFor(lng, lat, z) {
    const [px, py] = G.worldPx(lng, lat, z, DEM_SIZE);
    return [z, Math.floor(px / DEM_SIZE), Math.floor(py / DEM_SIZE)];
  }

  /* Fetch every tile a set of sample points needs, in parallel. */
  async function ensure(points) {
    const want = new Map();
    for (const [lng, lat, z] of points) {
      const [tz, tx, ty] = tileKeyFor(lng, lat, z);
      want.set(`${tz}/${tx}/${ty}`, [tz, tx, ty]);
    }
    await Promise.all([...want.values()].map(([z, x, y]) => loadTile(z, x, y).promise));
  }

  function sample(lng, lat, z) {
    const [px, py] = G.worldPx(lng, lat, z, DEM_SIZE);
    const tx = Math.floor(px / DEM_SIZE), ty = Math.floor(py / DEM_SIZE);
    const entry = tiles.get(`${z}/${tx}/${ty}`);
    if (!entry || !entry.data) return null;
    const d = entry.data;
    const fx = Math.min(DEM_SIZE - 1.001, Math.max(0, px - tx * DEM_SIZE));
    const fy = Math.min(DEM_SIZE - 1.001, Math.max(0, py - ty * DEM_SIZE));
    const x0 = Math.floor(fx), y0 = Math.floor(fy), x1 = Math.min(x0 + 1, DEM_SIZE - 1), y1 = Math.min(y0 + 1, DEM_SIZE - 1);
    const h = (x, y) => {
      const i = (y * DEM_SIZE + x) * 4;
      return d[i] * 256 + d[i + 1] + d[i + 2] / 256 - 32768;
    };
    const ax = fx - x0, ay = fy - y0;
    return h(x0, y0) * (1 - ax) * (1 - ay) + h(x1, y0) * ax * (1 - ay) + h(x0, y1) * (1 - ax) * ay + h(x1, y1) * ax * ay;
  }

  const offset = ([lng, lat], dxM, dyM) => [
    lng + dxM / (111320 * Math.cos((lat * Math.PI) / 180)),
    lat + dyM / 110574,
  ];

  /* Slope, aspect and elevation range for a parcel, from ~30 m open elevation data. */
  G.terrainStats = async parcel => {
    const c = turf.centroid(parcel).geometry.coordinates;
    const step = 30;
    const grid = [];
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) grid.push(offset(c, i * step, j * step));
    const verts = parcel.geometry.coordinates[0];
    await ensure([...grid, ...verts].map(p => [p[0], p[1], 12]));
    const h = grid.map(p => sample(p[0], p[1], 12));
    if (h.some(v => v == null)) return null;
    const dzdx = ((h[2] + 2 * h[5] + h[8]) - (h[0] + 2 * h[3] + h[6])) / (8 * step);
    /* grid rows run south (j=-1) to north (j=1), so this is the northward gradient */
    const dzdy = ((h[6] + 2 * h[7] + h[8]) - (h[0] + 2 * h[1] + h[2])) / (8 * step);
    const slope = (Math.atan(Math.hypot(dzdx, dzdy)) * 180) / Math.PI;
    let aspect = (Math.atan2(-dzdx, -dzdy) * 180) / Math.PI;
    aspect = (aspect + 360) % 360;
    const vh = verts.map(p => sample(p[0], p[1], 12));
    return {
      elevation: Math.round(h[4]),
      slope: Math.round(slope * 10) / 10,
      aspect: Math.round(aspect),
      facing: G.compass(aspect),
      min: Math.round(Math.min(...vh)),
      max: Math.round(Math.max(...vh)),
    };
  };

  G.compass = deg => ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'][Math.round(deg / 45) % 8];
  G.slopeWord = s => (s < 3 ? 'Flat' : s < 8 ? 'Gentle' : s < 15 ? 'Moderate' : s < 25 ? 'Steep' : 'Very steep');

  /* ---------- Line of sight ---------- */
  const R = 6371000, K = 0.13;
  const drop = d => ((d * d) / (2 * R)) * (1 - K);
  const distances = maxM => {
    const out = [];
    for (let d = 200; d < maxM; d += d < 5000 ? 90 : d < 30000 ? 260 : 600) out.push(d);
    return out;
  };

  /* Horizon silhouette over a range of bearings, plus visibility of each named peak.
     Terrain only: buildings and trees are not modelled. */
  G.viewshed = async (origin, peaks, { eyeM = 1.7, onProgress } = {}) => {
    const withBearing = peaks.map(p => ({
      ...p,
      bearing: turf.bearing(origin, [p.lng, p.lat]),
      dist: turf.distance(origin, [p.lng, p.lat], { units: 'kilometers' }) * 1000,
    }));
    const bMin = Math.min(...withBearing.map(p => p.bearing)) - 12;
    const bMax = Math.max(...withBearing.map(p => p.bearing)) + 12;
    const stepDeg = 2;
    const maxDist = Math.max(...withBearing.map(p => p.dist)) + 5000;

    const rays = [];
    for (let b = bMin; b <= bMax + 0.001; b += stepDeg) rays.push({ b, ds: distances(Math.min(maxDist, 170000)) });
    const peakRays = withBearing.map(p => ({ peak: p, b: p.bearing, ds: distances(p.dist - 1500) }));

    const pts = [[origin[0], origin[1], 12]];
    const along = (b, d) => turf.destination(origin, d / 1000, b).geometry.coordinates;
    const allRays = [...rays, ...peakRays];
    for (const ray of allRays) {
      ray.coords = ray.ds.map(d => along(ray.b, d));
      ray.coords.forEach((c, i) => pts.push([c[0], c[1], pickZoom(ray.ds[i])]));
    }
    onProgress && onProgress(0.15);
    await ensure(pts);
    onProgress && onProgress(0.85);

    const h0 = sample(origin[0], origin[1], 12);
    if (h0 == null) return null;
    const eye = h0 + eyeM;

    const scan = ray => {
      let best = -90, at = null;
      ray.ds.forEach((d, i) => {
        const c = ray.coords[i];
        const h = sample(c[0], c[1], pickZoom(d));
        if (h == null) return;
        const ang = (Math.atan2(h - drop(d) - eye, d) * 180) / Math.PI;
        if (ang > best) { best = ang; at = { d, h: Math.round(h) }; }
      });
      return { best, at };
    };

    const horizon = rays.map(ray => ({ b: ray.b, ang: scan(ray).best }));
    const results = peakRays.map(({ peak, ...ray }) => {
      const { best, at } = scan(ray);
      const peakAng = (Math.atan2(peak.elev - drop(peak.dist) - eye, peak.dist) * 180) / Math.PI;
      return { ...peak, angle: peakAng, visible: peakAng > best + 0.02, blocker: peakAng > best + 0.02 ? null : at };
    });
    onProgress && onProgress(1);
    return { origin, ground: Math.round(h0), eyeM, horizon, peaks: results, bMin, bMax };
  };

  /* ---------- Aerial thumbnails (Esri World Imagery) ---------- */
  const IMG_URL = (z, x, y) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;

  /* Returns HTML for a w×h aerial crop centred on the listing, with the parcel outlined. */
  G.aerial = (center, parcel, w = 400, h = 260, opts = {}) => {
    let z = opts.zoom || 19;
    if (parcel && !opts.zoom) {
      const bb = turf.bbox(parcel);
      for (; z > 14; z--) {
        const [x0, y1] = G.worldPx(bb[0], bb[1], z);
        const [x1, y0] = G.worldPx(bb[2], bb[3], z);
        if (x1 - x0 < (opts.fitW || w * 0.55) && y1 - y0 < (opts.fitH || h * 0.55)) break;
      }
    } else if (!parcel && !opts.zoom) z = 18;
    const [cx, cy] = G.worldPx(center[0], center[1], z);
    const left = cx - w / 2, top = cy - h / 2;
    const tx0 = Math.floor(left / 256), tx1 = Math.floor((left + w) / 256);
    const ty0 = Math.floor(top / 256), ty1 = Math.floor((top + h) / 256);
    let imgs = '';
    for (let ty = ty0; ty <= ty1; ty++)
      for (let tx = tx0; tx <= tx1; tx++)
        imgs += `<img alt="" loading="lazy" decoding="async" src="${IMG_URL(z, tx, ty)}" style="left:${tx * 256 - left}px;top:${ty * 256 - top}px">`;
    let svg = '';
    if (parcel) {
      const d = parcel.geometry.coordinates[0]
        .map(([lng, lat], i) => {
          const [x, y] = G.worldPx(lng, lat, z);
          return `${i ? 'L' : 'M'}${(x - left).toFixed(1)},${(y - top).toFixed(1)}`;
        })
        .join('') + 'Z';
      svg = `<svg class="aerial-svg" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="${d}" class="aerial-parcel"/></svg>`;
    } else {
      svg = `<svg class="aerial-svg" viewBox="0 0 ${w} ${h}" aria-hidden="true"><circle cx="${w / 2}" cy="${h / 2}" r="9" class="aerial-dot"/></svg>`;
    }
    return `<div class="aerial" style="--w:${w}px;--h:${h}px"><div class="aerial-inner">${imgs}${svg}</div></div>`;
  };
})();
