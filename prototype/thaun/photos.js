/* Thaun prototype: listing photos.
   Sample listings use area photos from data-photos.js. Seller uploads are compressed in the browser,
   their GPS position is read from EXIF, and they are kept in IndexedDB so they survive a reload.
   Everything stays in this browser; nothing is uploaded anywhere. */
(function () {
  const P = (TH.photos = {});
  const DB = 'thaun', STORE = 'photos';
  const cache = new Map(); /* key → [{ id, src, thumb, w, h, gps, takenAt, kind: 'owner' }] */
  let db = null;
  P.persistent = false;

  /* ---------- IndexedDB (falls back to memory in private windows) ---------- */
  const open = () =>
    new Promise(resolve => {
      try {
        const req = indexedDB.open(DB, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  const tx = (mode, fn) =>
    new Promise(resolve => {
      if (!db) return resolve(null);
      try {
        const t = db.transaction(STORE, mode);
        const r = fn(t.objectStore(STORE));
        t.oncomplete = () => resolve(r && r.result);
        t.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });

  const hydrate = rows =>
    (rows || []).map(r => ({
      ...r,
      kind: 'owner',
      src: URL.createObjectURL(r.blob),
      thumb: URL.createObjectURL(r.thumbBlob || r.blob),
    }));

  P.init = async () => {
    db = await open();
    P.persistent = !!db;
    if (!db) return;
    const keys = (await tx('readonly', s => s.getAllKeys())) || [];
    for (const k of keys) cache.set(k, hydrate(await tx('readonly', s => s.get(k))));
  };

  P.save = async (key, items) => {
    cache.set(key, items);
    const rows = items.map(({ id, blob, thumbBlob, w, h, gps, takenAt }) => ({ id, blob, thumbBlob, w, h, gps, takenAt }));
    await tx('readwrite', s => s.put(rows, key));
  };
  P.clear = async key => {
    (cache.get(key) || []).forEach(p => { URL.revokeObjectURL(p.src); URL.revokeObjectURL(p.thumb); });
    cache.delete(key);
    await tx('readwrite', s => s.delete(key));
  };
  P.move = async (from, to) => {
    const items = cache.get(from) || [];
    cache.delete(from);
    await tx('readwrite', s => s.delete(from));
    if (items.length) await P.save(to, items);
  };
  P.owner = key => cache.get(key) || [];

  /* All photos for a listing: the owner's uploads first, then area photos. */
  P.forListing = l => {
    if (!l) return [];
    const own = P.owner(l.id);
    const area = (TH.SAMPLE_PHOTOS && TH.SAMPLE_PHOTOS[l.id]) || [];
    return [...own, ...area];
  };

  /* ---------- Processing an upload ---------- */
  const toBlob = (canvas, q) => new Promise(r => canvas.toBlob(r, 'image/jpeg', q));
  async function scaled(bitmap, max, q) {
    const k = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bitmap.width * k);
    c.height = Math.round(bitmap.height * k);
    c.getContext('2d').drawImage(bitmap, 0, 0, c.width, c.height);
    return { blob: await toBlob(c, q), w: c.width, h: c.height };
  }

  P.process = async file => {
    const buf = await file.arrayBuffer();
    const exif = readExif(buf);
    let bitmap;
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      bitmap = await createImageBitmap(file);
    }
    const full = await scaled(bitmap, 1600, 0.84);
    const small = await scaled(bitmap, 520, 0.78);
    bitmap.close && bitmap.close();
    const id = `ph-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    return {
      id, kind: 'owner', blob: full.blob, thumbBlob: small.blob, w: full.w, h: full.h,
      gps: exif.gps, takenAt: exif.takenAt,
      src: URL.createObjectURL(full.blob), thumb: URL.createObjectURL(small.blob),
    };
  };

  /* Where a photo was taken relative to the plot: inside, near (≤ 60 m), or how far away. */
  P.placement = (photo, parcel, center) => {
    if (!photo.gps) return { state: 'none', label: 'No location in photo' };
    const pt = turf.point(photo.gps);
    if (parcel && turf.booleanPointInPolygon(pt, parcel)) return { state: 'on', label: 'Taken on the plot' };
    const ref = parcel ? turf.pointToLineDistance(pt, turf.polygonToLine(parcel), { units: 'meters' }) : turf.distance(pt, center, { units: 'meters' });
    if (ref <= 60) return { state: 'near', label: `Taken ${Math.round(ref)} m from the boundary` };
    const d = ref >= 1000 ? `${(ref / 1000).toFixed(1)} km` : `${Math.round(ref)} m`;
    return { state: 'far', label: `Taken ${d} away` };
  };

  /* ---------- Minimal EXIF reader: GPS position and capture time only ---------- */
  function readExif(buf) {
    const out = { gps: null, takenAt: null };
    try {
      const v = new DataView(buf);
      if (v.getUint16(0) !== 0xffd8) return out;
      let off = 2;
      while (off + 4 < v.byteLength) {
        const marker = v.getUint16(off);
        const size = v.getUint16(off + 2);
        if (marker === 0xffe1 && v.getUint32(off + 4) === 0x45786966) return parseTiff(v, off + 10, out);
        if ((marker & 0xff00) !== 0xff00) break;
        off += 2 + size;
      }
    } catch { /* malformed EXIF: treat as no metadata */ }
    return out;
  }

  function parseTiff(v, start, out) {
    const le = v.getUint16(start) === 0x4949;
    const u16 = o => v.getUint16(start + o, le);
    const u32 = o => v.getUint32(start + o, le);
    const entries = ifd => {
      const n = u16(ifd), map = {};
      for (let i = 0; i < n; i++) {
        const e = ifd + 2 + i * 12;
        map[u16(e)] = { type: u16(e + 2), count: u32(e + 4), valueOff: e + 8 };
      }
      return map;
    };
    const rational = (o, i) => u32(o + i * 8) / (u32(o + i * 8 + 4) || 1);
    const ascii = t => {
      const o = t.count > 4 ? u32(t.valueOff) : t.valueOff;
      let s = '';
      for (let i = 0; i < t.count - 1; i++) s += String.fromCharCode(v.getUint8(start + o + i));
      return s;
    };
    const ifd0 = entries(u32(4));
    if (ifd0[0x8769]) {
      const ex = entries(u32(ifd0[0x8769].valueOff));
      if (ex[0x9003]) out.takenAt = ascii(ex[0x9003]).replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
    }
    if (ifd0[0x8825]) {
      const g = entries(u32(ifd0[0x8825].valueOff));
      if (g[2] && g[4]) {
        const dms = t => { const o = u32(t.valueOff); return rational(o, 0) + rational(o, 1) / 60 + rational(o, 2) / 3600; };
        const ref = t => String.fromCharCode(v.getUint8(start + t.valueOff));
        let lat = dms(g[2]), lng = dms(g[4]);
        if (g[1] && ref(g[1]) === 'S') lat = -lat;
        if (g[3] && ref(g[3]) === 'W') lng = -lng;
        if (lat || lng) out.gps = [lng, lat];
      }
    }
    return out;
  }
  P._readExif = readExif;
})();
