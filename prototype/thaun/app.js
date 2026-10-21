/* Thaun prototype: state, i18n, router and shared UI. Views live in views.js. */
(function () {
  const G = TH.geo, M = TH.map;
  const A = (TH.app = {});
  TH.views = TH.views || {};

  /* ---------- Persistence (per-viewer conveniences only) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('thaun:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('thaun:' + k, JSON.stringify(v)); } catch { /* private mode */ } },
  };
  A.store = store;

  const S = (TH.state = {
    lang: store.get('lang', 'en'),
    currency: store.get('currency', 'NPR'),
    theme: store.get('theme', 'auto'),
    status: store.get('status', null),
    saved: new Set(store.get('saved', [])),
    seen: new Set(store.get('seen', [])),
    published: store.get('published', []),
    draft: store.get('draft', null),
    guardSeen: store.get('guardSeen', false),
  });
  A.save = key => {
    const v = S[key];
    store.set(key, v instanceof Set ? [...v] : v);
  };

  /* ---------- i18n (chrome and key copy; listing content stays bilingual where provided) ---------- */
  const DICT = {
    en: {
      'nav.explore': 'Explore', 'nav.sell': 'List your land', 'nav.my': 'Your listings', 'nav.abroad': 'From abroad', 'nav.farms': 'Farms',
      'hero.title': 'Find your <em>thaun</em>.',
      'hero.sub': 'Land, homes and farmland across Nepal. Every listing sits on its real plot, in 3D, with a price you can check and a badge that means something.',
      'intent.all': 'All', 'intent.buy': 'Buy', 'intent.rent': 'Rent', 'intent.lease': 'Lease',
      'search.ph': 'Try "4 aana in Budhanilkantha under 2 crore"', 'search.phShort': 'e.g. 4 aana Budhanilkantha', 'search.go': 'Search',
      'aud.sell.t': 'Selling or leasing land?', 'aud.sell.s': 'Draw it on the map in five minutes',
      'aud.abroad.t': 'Looking from abroad?', 'aud.abroad.s': 'What you can buy, in your currency',
      'skip': 'Skip intro', 'saved': 'Saved', 'contact': 'Contact', 'save': 'Save', 'share': 'Share',
      'theme': 'Theme', 'lang.switch': 'ने',
    },
    ne: {
      'nav.explore': 'खोज्नुहोस्', 'nav.sell': 'जग्गा राख्नुहोस्', 'nav.my': 'तपाईंका सूची', 'nav.abroad': 'विदेशबाट', 'nav.farms': 'खेतीबारी',
      'hero.title': 'आफ्नो <em>ठाउँ</em> खोज्नुहोस्।',
      'hero.sub': 'नेपालभरिका जग्गा, घर र खेतीयोग्य जमिन। हरेक सूची आफ्नै वास्तविक कित्तामा, थ्रीडीमा, जाँच्न मिल्ने मूल्य र अर्थपूर्ण प्रमाणीकरणसहित।',
      'intent.all': 'सबै', 'intent.buy': 'किन्ने', 'intent.rent': 'भाडा', 'intent.lease': 'लिज',
      'search.ph': 'जस्तै "बुढानीलकण्ठमा ४ आना, २ करोडभित्र"', 'search.phShort': 'जस्तै ४ आना बुढानीलकण्ठ', 'search.go': 'खोज्नुहोस्',
      'aud.sell.t': 'जग्गा बेच्दै वा लिजमा दिँदै हुनुहुन्छ?', 'aud.sell.s': 'पाँच मिनेटमा नक्सामा कोर्नुहोस्',
      'aud.abroad.t': 'विदेशबाट हेर्दै हुनुहुन्छ?', 'aud.abroad.s': 'तपाईं के किन्न सक्नुहुन्छ, आफ्नै मुद्रामा',
      'skip': 'परिचय छोड्नुहोस्', 'saved': 'सुरक्षित', 'contact': 'सम्पर्क', 'save': 'सुरक्षित गर्नुहोस्', 'share': 'सेयर',
      'theme': 'थिम', 'lang.switch': 'EN',
    },
  };
  A.t = k => (DICT[S.lang] && DICT[S.lang][k]) || DICT.en[k] || k;
  const t = A.t;

  /* ---------- Listings ---------- */
  const PARCEL_TYPES = ['land', 'farmland', 'house'];
  function prep(l) {
    if (l._prepped) return l;
    const area = TH.AREAS.find(a => a.id === l.areaId) || nearestArea(l.center);
    const m2 = l.m2 || (l.rapd ? G.rapdToM2(l.rapd) : null);
    let parcel = null;
    if (l.parcelCoords) parcel = turf.polygon([l.parcelCoords]);
    else if (m2 && PARCEL_TYPES.includes(l.type)) parcel = G.makeParcel(l.center, m2, l.seed || 1, l.rot || 0);
    if (parcel) { parcel.id = l.id; parcel.properties = { id: l.id }; }
    return Object.assign(l, { _prepped: true, area, m2, parcel });
  }
  const daysSince = iso => Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 864e5));
  A.daysSince = daysSince;
  /* A seller's own listing keeps real dates; ages and badges are worked out from them on every read. */
  function live(l) {
    if (!l.mine || l.draft) return l;
    if (l.publishedAt) l.posted = daysSince(l.publishedAt);
    const checks = Object.entries(l.checks || {}).map(([k, iso]) => [k, daysSince(iso)]);
    if (l.reconfirmedAt) checks.push(['reconfirmed', daysSince(l.reconfirmedAt)]);
    l.verified = checks;
    return l;
  }
  A.isLive = l => !l.status || l.status === 'active';
  /* Only source fields are stored; derived ones (area, parcel) are rebuilt on load. */
  A.savePublished = () => {
    store.set('published', S.published.map(({ _prepped, area, parcel, verified, posted, ...rest }) => rest));
  };
  function nearestArea(c) {
    let best = TH.AREAS[0], bd = Infinity;
    for (const a of TH.AREAS) { const d = turf.distance(c, a.center); if (d < bd) { bd = d; best = a; } }
    return best;
  }
  A.nearestArea = nearestArea;
  TH.everything = () => [...TH.LISTINGS, ...S.published].map(prep).map(live);
  TH.all = () => TH.everything().filter(A.isLive);
  TH.byId = id => (id === 'draft' ? A.draftListing() : TH.everything().find(l => l.id === id));

  A.draftListing = () => {
    const d = S.draft;
    if (!d || !d.coords || d.coords.length < 4) return null;
    const l = A.draftToListing(d, 'draft');
    delete l._prepped;
    return prep(l);
  };
  A.draftToListing = (d, id) => {
    const parcel = turf.polygon([d.coords]);
    const m2 = turf.area(parcel);
    const center = turf.centroid(parcel).geometry.coordinates;
    return {
      id, intent: d.intent, type: d.type, center, m2, parcelCoords: d.coords,
      areaId: nearestArea(center).id,
      title: d.title || A.suggestTitle(d, m2), ne: '', price: A.draftTotal(d, m2) || 0,
      basis: d.intent === 'rent' ? 'month' : d.intent === 'lease' ? 'ropaniYear' : 'total',
      source: 'owner', owner: d.ownerName || 'You', road: d.road, water: d.water,
      leaseModels: d.leaseModels, verified: [], posted: 0, remote: !!d.drone, draft: id === 'draft', mine: true,
      blurb: d.blurb || A.suggestBlurb(d, m2), tier: d.tier, photos: d.photoCount || 0,
    };
  };
  A.draftTotal = (d, m2) => {
    const p = +d.price || 0;
    if (!p) return 0;
    if (d.priceUnit === 'aana') return p * 1e5 * G.aana(m2);
    if (d.priceUnit === 'lakh') return p * 1e5;
    if (d.priceUnit === 'crore') return p * 1e7;
    return p;
  };
  A.suggestTitle = (d, m2) => {
    const area = d.coords && d.coords.length > 3 ? nearestArea(turf.centroid(turf.polygon([d.coords])).geometry.coordinates).name : '';
    const size = m2 >= G.UNITS.ROPANI ? `${G.num(G.ropani(m2), 1)} ropani` : `${Math.round(G.aana(m2))} aana`;
    const kind = d.type === 'farmland' ? 'farmland' : d.type === 'house' ? 'house and land' : 'plot';
    return `${size} ${kind}${area ? ' in ' + area : ''}`;
  };
  A.suggestBlurb = (d, m2) => {
    const bits = [];
    bits.push(`${G.rapdWords(m2)} (${G.int(m2)} m²) traced by the owner on satellite imagery.`);
    if (d.road && d.road.type) bits.push(d.road.type === 'footpath' ? 'Reached by a footpath.' : `On a ${d.road.widthFt || '?'} ft ${d.road.type === 'blacktop' ? 'blacktop' : 'motorable'} road${d.road.toBlacktopM ? `, ${d.road.toBlacktopM} m from blacktop` : ''}.`);
    if (d.water) bits.push({ 'year-round': 'Water all year.', seasonal: 'Seasonal water.', none: 'No water source yet.', unsure: 'Water to be confirmed.' }[d.water] || '');
    return bits.join(' ');
  };

  /* ---------- Formatting ---------- */
  A.money = n => G.fxCompact(n, S.currency);
  A.price = l => {
    const v = A.money(l.price);
    if (l.basis === 'month') return `${v}/mo`;
    if (l.basis === 'ropaniYear') return `${v}/ropani/yr`;
    return v;
  };
  A.priceSub = l => {
    const bits = [];
    if (S.currency !== 'NPR') bits.push(l.basis === 'total' ? G.nprCompact(l.price) : `${G.nprCompact(l.price)}${l.basis === 'month' ? '/mo' : '/ropani/yr'}`);
    if (l.basis === 'total' && l.m2 && (l.type === 'land' || l.type === 'farmland')) bits.push(`${G.nprCompact(l.price / G.aana(l.m2))}/aana`);
    if (l.basis === 'ropaniYear' && l.m2) bits.push(`${G.nprCompact(l.price * G.ropani(l.m2))}/yr total`);
    return bits.join(' · ');
  };
  A.pinLabel = l => {
    const v = G.fxCompact(l.price, S.currency);
    if (l.basis === 'month') return `${v}/mo`;
    if (l.basis === 'ropaniYear') return `${v}/rop`;
    return v;
  };
  A.areaText = l => (l.m2 ? `${G.fmtRapd(l.m2)} · ${G.int(l.m2)} m²` : '');
  A.typeName = type => ({ land: 'Land', farmland: 'Farmland', house: 'House', flat: 'Flat', room: 'Room' }[type] || type);
  A.intentName = i => ({ sale: 'For sale', lease: 'For lease', rent: 'For rent' }[i] || i);
  A.date = days => new Date(Date.now() - days * 864e5).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  A.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Trust ---------- */
  const has = (l, k) => (l.verified || []).find(v => v[0] === k);
  A.has = has;
  A.level = l => {
    if (l.draft || (l.mine && !(l.verified || []).length)) return 'pending';
    if (has(l, 'site')) return 'site';
    if (has(l, 'owner') && has(l, 'certificate')) return 'owner';
    if (has(l, 'owner')) return 'id';
    return 'listed';
  };
  A.freshness = l => {
    const r = has(l, 'reconfirmed');
    const age = r ? r[1] : l.posted;
    return { age, stale: age > 30, renewIn: Math.max(0, 30 - age) };
  };
  A.levelBadge = l => {
    const lv = A.level(l);
    const stale = A.freshness(l).stale && lv !== 'pending' && lv !== 'listed';
    if (stale) return `<span class="badge badge-warn"><i data-lucide="clock-alert"></i>Unconfirmed</span>`;
    return {
      site: `<span class="badge badge-verified"><i data-lucide="shield-check"></i>Site-verified</span>`,
      owner: `<span class="badge badge-verified"><i data-lucide="badge-check"></i>Owner-verified</span>`,
      id: `<span class="badge badge-verified"><i data-lucide="user-check"></i>ID checked</span>`,
      listed: `<span class="badge"><i data-lucide="sparkles"></i>New · not verified</span>`,
      pending: `<span class="badge badge-accent"><i data-lucide="hourglass"></i>Verification pending</span>`,
    }[lv];
  };
  A.sourceBadge = l =>
    ({
      owner: `<span class="badge badge-owner"><i data-lucide="house"></i>Owner</span>`,
      agent: `<span class="badge"><i data-lucide="briefcase"></i>Agent</span>`,
      licensed: `<span class="badge"><i data-lucide="landmark"></i>Licensed agency</span>`,
      developer: `<span class="badge"><i data-lucide="building-2"></i>Developer</span>`,
    }[l.source] || '');
  A.sourceText = l =>
    ({ owner: 'Owner, listing directly', agent: 'Agent', licensed: 'Licensed agency', developer: 'Developer' }[l.source] || '');

  A.badges = l => {
    const out = [A.levelBadge(l), A.sourceBadge(l)];
    if (l.type === 'farmland') out.push(has(l, 'water') ? `<span class="badge badge-owner"><i data-lucide="droplets"></i>Water verified</span>` : `<span class="badge badge-warn"><i data-lucide="droplet-off"></i>Water unverified</span>`);
    if ((l.intent === 'rent') && (l.brokerFee === 0 || l.source === 'owner')) out.push(`<span class="badge badge-owner">0 broker fee</span>`);
    return out.join('');
  };

  A.meta = l => {
    const m = [];
    const ic = (i, s) => `<span><i data-lucide="${i}"></i>${s}</span>`;
    if (l.m2 && l.type !== 'flat' && l.type !== 'room') m.push(ic('square-dashed', `${G.fmtRapd(l.m2)}`));
    if (l.beds) m.push(ic('bed-double', `${l.beds} bed`));
    if (l.baths) m.push(ic('bath', `${l.baths} bath`));
    if (l.type === 'farmland' && l.marketKm) m.push(ic('truck', `${l.marketKm} km to market`));
    if (l.road && l.road.type && l.type !== 'flat' && l.type !== 'room') m.push(ic('route', l.road.type === 'footpath' ? 'Footpath' : `${l.road.widthFt} ft road`));
    m.push(ic('map-pin', l.area ? l.area.name : ''));
    return m.join('');
  };

  /* ---------- Card ---------- */
  /* Card media: the cover photo with a small satellite inset of the plot, or the satellite view alone. */
  A.cardMedia = (l, { row = false, w = 440, h = 275 } = {}) => {
    const photos = TH.photos.forListing(l);
    const aerial = row ? G.aerial(l.center, l.parcel, 460, 270, { fitW: 95, fitH: 95 }) : G.aerial(l.center, l.parcel, w, h);
    if (!photos.length) return `<div class="lcard-media">${aerial}</div>`;
    const cover = photos[0];
    const area = photos.every(p => p.kind === 'area');
    return `<div class="lcard-media">
        <img class="lcard-photo" src="${cover.thumb}" alt="${A.esc(cover.caption || l.title)}" loading="lazy" decoding="async">
        ${row ? '' : `<div class="lcard-inset" aria-hidden="true">${G.aerial(l.center, l.parcel, 220, 160, { fitW: 62, fitH: 46 })}</div>`}
        <span class="lcard-count"><i data-lucide="camera"></i>${photos.length}${area ? ' · area' : ''}</span>
      </div>`;
  };

  A.card = (l, { row = false, w = 440, h = 275 } = {}) => `
    <article class="lcard ${row ? 'lcard-row' : ''}" data-id="${l.id}" tabindex="0" aria-label="${A.esc(l.title)}">
      ${A.cardMedia(l, { row, w, h })}
      <div class="lcard-badges">${row ? A.levelBadge(l) : A.badges(l)}</div>
      <button class="icon-btn lcard-save ${S.saved.has(l.id) ? 'is-on' : ''}" data-save="${l.id}" aria-label="Save" aria-pressed="${S.saved.has(l.id)}"><i data-lucide="heart"></i></button>
      <div class="lcard-body">
        <div class="lcard-price"><strong class="num">${A.price(l)}</strong><span class="num">${A.priceSub(l)}</span></div>
        <div class="lcard-title">${A.esc(S.lang === 'ne' && l.ne ? l.ne : l.title)}</div>
        <div class="lcard-meta">${A.meta(l)}</div>
      </div>
    </article>`;

  /* ---------- Icons, toast, modal ---------- */
  A.icons = () => window.lucide && lucide.createIcons();
  let toastTimer;
  A.toast = (msg, icon = 'check') => {
    const el = document.getElementById('toast');
    el.innerHTML = `<i data-lucide="${icon}"></i><span>${msg}</span>`;
    A.icons();
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), 3200);
  };
  A.modal = html =>
    new Promise(resolve => {
      const wrap = document.createElement('div');
      wrap.className = 'modal-backdrop';
      wrap.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
      document.body.appendChild(wrap);
      A.icons();
      const close = v => { wrap.remove(); document.removeEventListener('keydown', onKey); resolve(v); };
      const onKey = e => e.key === 'Escape' && close(null);
      document.addEventListener('keydown', onKey);
      wrap.addEventListener('click', e => {
        if (e.target === wrap) return close(null);
        const b = e.target.closest('[data-v]');
        if (b) close(b.dataset.v);
      });
      const first = wrap.querySelector('button');
      first && first.focus();
    });

  /* Scam guard: shown at the first contact, as the plan asks. */
  A.contact = async (l, channel) => {
    if (!S.guardSeen) {
      const v = await A.modal(`
        <h2 class="display">Before you contact anyone</h2>
        <ul>
          <li><i data-lucide="shield-alert"></i><span><b>Never pay before a site visit.</b> No advance, no "form fee", no token money over the phone.</span></li>
          <li><i data-lucide="file-search"></i><span>Ask to see the <b>lalpurja</b> and check the kitta number matches the plot you are shown.</span></li>
          <li><i data-lucide="route"></i><span>Walk the boundary and the road yourself, or book a Thaun field agent to do it on video.</span></li>
          <li><i data-lucide="ban"></i><span>Thaun never charges buyers or renters to contact a lister.</span></li>
        </ul>
        <div class="modal-actions"><button class="btn" data-v="cancel">Not now</button><button class="btn btn-primary" data-v="ok">I understand, continue</button></div>`);
      if (v !== 'ok') return;
      S.guardSeen = true;
      A.save('guardSeen');
    }
    const who = l.source === 'owner' ? l.owner : l.agent;
    const msgs = {
      whatsapp: `Prototype: this would open WhatsApp with ${who}, with listing ${l.id} filled in.`,
      viber: `Prototype: this would open Viber with ${who}.`,
      video: `Prototype: a Thaun field agent would call you to book a live video walk of this ${A.typeName(l.type).toLowerCase()}.`,
      visit: `Prototype: you would pick a site-visit slot with ${who}.`,
    };
    A.toast(msgs[channel] || msgs.whatsapp, channel === 'video' ? 'video' : 'message-circle');
  };

  /* ---------- Photo viewer ---------- */
  /* Full-screen viewer with keyboard, swipe and thumbnails. ctx: { parcel, center, onShowOnMap } */
  A.lightbox = (photos, start = 0, ctx = {}) => {
    if (!photos.length) return;
    let i = start;
    const prevFocus = document.activeElement;
    const el = document.createElement('div');
    el.className = 'lb';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Photos');
    el.innerHTML = `
      <div class="lb-top"><span class="lb-count num" aria-live="polite"></span><button class="lb-btn" data-lb="close" aria-label="Close"><i data-lucide="x"></i></button></div>
      <div class="lb-stage"><img class="lb-img" alt=""><button class="lb-btn lb-prev" data-lb="prev" aria-label="Previous photo"><i data-lucide="chevron-left"></i></button><button class="lb-btn lb-next" data-lb="next" aria-label="Next photo"><i data-lucide="chevron-right"></i></button></div>
      <div class="lb-info"><div class="lb-caption"></div><div class="lb-meta"></div></div>
      <div class="lb-strip">${photos.map((p, k) => `<button data-k="${k}" aria-label="Photo ${k + 1}"><img src="${p.thumb}" alt="" loading="lazy"></button>`).join('')}</div>`;
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
    const img = el.querySelector('.lb-img');
    const show = k => {
      i = (k + photos.length) % photos.length;
      const p = photos[i];
      img.src = p.src;
      img.alt = p.caption || 'Listing photo';
      el.querySelector('.lb-count').textContent = `${i + 1} / ${photos.length}`;
      el.querySelector('.lb-caption').textContent = p.caption || (p.kind === 'owner' ? 'Photo from the owner' : '');
      let meta = '';
      if (p.kind === 'area') meta = `<span class="badge badge-glass">Area photo, not the plot</span><a href="${p.link}" target="_blank" rel="noopener">${A.esc(p.credit)} · ${A.esc(p.license)} <i data-lucide="external-link"></i></a>`;
      else {
        const pl = TH.photos.placement(p, ctx.parcel, ctx.center);
        meta = `<span class="badge ${pl.state === 'on' || pl.state === 'near' ? 'badge-owner' : pl.state === 'far' ? 'badge-warn' : 'badge-glass'}"><i data-lucide="${pl.state === 'none' ? 'map-pin-off' : 'map-pin'}"></i>${pl.label}</span>${p.takenAt ? `<span>Taken ${A.esc(p.takenAt.slice(0, 10))}</span>` : ''}`;
        if (p.gps && ctx.onShowOnMap) meta += `<button class="btn btn-sm" data-lb="map"><i data-lucide="map-pin"></i>Show on the map</button>`;
      }
      el.querySelector('.lb-meta').innerHTML = meta;
      el.querySelectorAll('.lb-strip button').forEach((b, k) => b.classList.toggle('is-on', k === i));
      const on = el.querySelector('.lb-strip .is-on');
      on && on.scrollIntoView({ block: 'nearest', inline: 'center', behavior: M.reducedMotion() ? 'auto' : 'smooth' });
      el.querySelectorAll('.lb-prev, .lb-next').forEach(b => (b.hidden = photos.length < 2));
      A.icons();
    };
    const close = () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      el.remove();
      prevFocus && prevFocus.focus && prevFocus.focus();
    };
    const onKey = e => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(i + 1);
      else if (e.key === 'ArrowLeft') show(i - 1);
      else if (e.key === 'Tab') {
        const f = [...el.querySelectorAll('button, a')].filter(x => !x.hidden);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-lb], [data-k]');
      if (!b) { if (e.target === el || e.target.classList.contains('lb-stage')) close(); return; }
      if (b.dataset.k != null) return show(+b.dataset.k);
      const a = b.dataset.lb;
      if (a === 'close') close();
      if (a === 'prev') show(i - 1);
      if (a === 'next') show(i + 1);
      if (a === 'map') { const p = photos[i]; close(); ctx.onShowOnMap(p, i); }
    });
    let x0 = null;
    const stage = el.querySelector('.lb-stage');
    stage.addEventListener('pointerdown', e => (x0 = e.clientX));
    stage.addEventListener('pointerup', e => {
      if (x0 == null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
    });
    show(i);
    el.querySelector('[data-lb="close"]').focus();
  };

  /* ---------- Saved shortlist ---------- */
  A.toggleSave = id => {
    S.saved.has(id) ? S.saved.delete(id) : S.saved.add(id);
    A.save('saved');
    document.querySelectorAll(`[data-save="${id}"]`).forEach(b => {
      b.classList.toggle('is-on', S.saved.has(id));
      b.setAttribute('aria-pressed', S.saved.has(id));
    });
    renderSavedCount();
    A.toast(S.saved.has(id) ? 'Saved to your shortlist' : 'Removed from your shortlist', 'heart');
  };
  function renderSavedCount() {
    const c = document.getElementById('savedCount');
    c.textContent = S.saved.size;
    c.hidden = !S.saved.size;
  }
  function openSaved() {
    const d = document.getElementById('drawer');
    const items = TH.all().filter(l => S.saved.has(l.id));
    d.querySelector('.drawer-body').innerHTML = items.length
      ? items.map(l => A.card(l, { row: true })).join('')
      : `<div class="empty"><i data-lucide="heart"></i><b>No saved places yet</b><span>Tap the heart on any listing. Shortlists can be shared with family in Nepal or abroad.</span></div>`;
    d.querySelector('#shareList').disabled = !items.length;
    d.classList.add('is-open');
    A.icons();
  }
  A.shareShortlist = async () => {
    const url = `${location.origin}${location.pathname}#/explore?ids=${[...S.saved].join(',')}`;
    try { await navigator.clipboard.writeText(url); A.toast('Shortlist link copied. Family can open it on any phone.', 'users'); }
    catch { A.toast('Copy failed. Link: ' + url, 'link'); }
  };

  /* ---------- Navigation ---------- */
  A.go = (hash, { morphFrom } = {}) => {
    if (morphFrom) morphFrom.style.viewTransitionName = 'hero';
    location.hash = hash;
  };

  const routes = [
    [/^#\/explore/, 'explore'],
    [/^#\/p\/([\w-]+)/, 'listing'],
    [/^#\/sell(?:\/(\d))?/, 'sell'],
    [/^#\/abroad/, 'abroad'],
    [/^#\/farms/, 'farms'],
    [/^#\/my/, 'my'],
    [/^#?\/?$/, 'home'],
  ];
  let current = null, currentName = null;
  const parseQuery = h => Object.fromEntries(new URLSearchParams(h.split('?')[1] || ''));

  function route() {
    const h = location.hash || '#/';
    let match = { name: 'home', params: [], query: {} };
    for (const [re, name] of routes) {
      const m = h.match(re);
      if (m) { match = { name, params: m.slice(1), query: parseQuery(h) }; break; }
    }
    if (match.name === currentName && current && current.update) {
      current.update(match.params, match.query);
      return;
    }
    const swap = () => {
      if (current && current.unmount) current.unmount();
      const el = document.getElementById('app');
      el.innerHTML = '';
      window.scrollTo(0, 0);
      document.getElementById('topbar').classList.remove('is-over-map');
      currentName = match.name;
      document.body.dataset.view = match.name;
      current = TH.views[match.name];
      current.mount(el, match.params, match.query);
      document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('is-on', a.dataset.nav === match.name));
      document.getElementById('mobileNav').classList.remove('is-open');
      A.icons();
    };
    if (document.startViewTransition && !M.reducedMotion() && current) {
      const vt = document.startViewTransition(swap);
      vt.finished.finally(() => document.querySelectorAll('[style*="view-transition-name"]').forEach(e => (e.style.viewTransitionName = '')));
    } else swap();
  }
  A.remount = () => { currentName = null; route(); };
  A.prefsChanged = () => {
    if (current && current.onPrefs) current.onPrefs();
    else A.remount();
  };

  /* ---------- Header ---------- */
  A.header = () => header();
  function header() {
    const h = document.getElementById('topbar');
    h.querySelector('[data-nav="explore"]').textContent = t('nav.explore');
    h.querySelector('[data-nav="sell"]').textContent = t('nav.sell');
    h.querySelector('[data-nav="abroad"]').textContent = t('nav.abroad');
    h.querySelector('[data-nav="farms"]').textContent = t('nav.farms');
    document.getElementById('langBtn').textContent = t('lang.switch');
    const mine = S.published.length > 0;
    h.querySelector('[data-nav="my"]').hidden = !mine;
    h.querySelector('[data-nav="my"]').textContent = t('nav.my');
    document.getElementById('mobileNav').innerHTML = ['explore', 'sell', ...(mine ? ['my'] : []), 'abroad', 'farms']
      .map(k => `<a href="#/${k === 'sell' ? 'sell/1' : k}" data-nav="${k}">${t('nav.' + k)}</a>`).join('');
    document.documentElement.lang = S.lang === 'ne' ? 'ne' : 'en';
  }
  function applyTheme() {
    const r = document.documentElement;
    if (S.theme === 'auto') delete r.dataset.theme;
    else r.dataset.theme = S.theme;
    const icon = { auto: 'sun-moon', light: 'sun', dark: 'moon' }[S.theme];
    document.getElementById('themeBtn').innerHTML = `<i data-lucide="${icon}"></i>`;
    A.icons();
  }

  async function init() {
    await TH.photos.init();
    const cur = document.getElementById('currency');
    cur.innerHTML = Object.keys(TH.FX).map(k => `<option value="${k}">${k}</option>`).join('');
    cur.value = S.currency;
    cur.addEventListener('change', () => { S.currency = cur.value; A.save('currency'); A.prefsChanged(); });
    document.getElementById('langBtn').addEventListener('click', () => { S.lang = S.lang === 'en' ? 'ne' : 'en'; A.save('lang'); header(); A.remount(); });
    document.getElementById('themeBtn').addEventListener('click', () => {
      S.theme = { auto: 'light', light: 'dark', dark: 'auto' }[S.theme];
      A.save('theme'); applyTheme(); A.toast(`Theme: ${S.theme}`, 'palette');
    });
    document.getElementById('savedBtn').addEventListener('click', openSaved);
    document.getElementById('menuBtn').addEventListener('click', () => document.getElementById('mobileNav').classList.toggle('is-open'));
    const drawer = document.getElementById('drawer');
    drawer.querySelector('#closeDrawer').addEventListener('click', () => drawer.classList.remove('is-open'));
    drawer.querySelector('#shareList').addEventListener('click', A.shareShortlist);
    drawer.querySelector('#viewSaved').addEventListener('click', () => { drawer.classList.remove('is-open'); A.go(`#/explore?ids=${[...S.saved].join(',')}`); });

    /* Global delegation for cards and save buttons */
    document.addEventListener('click', e => {
      const sv = e.target.closest('[data-save]');
      if (sv) { e.preventDefault(); e.stopPropagation(); A.toggleSave(sv.dataset.save); return; }
      const card = e.target.closest('.lcard[data-id]');
      if (card && !e.target.closest('[data-noopen]')) {
        drawer.classList.remove('is-open');
        A.go(`#/p/${card.dataset.id}`, { morphFrom: card.querySelector('.lcard-media') });
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.matches('.lcard[data-id]')) e.target.click();
      if (e.key === 'Escape') drawer.classList.remove('is-open');
    });
    const tier = M.tier();
    document.getElementById('ribbon').innerHTML = `<i data-lucide="flask-conical"></i>Prototype · sample data · ${tier} graphics tier${M.reducedMotion() ? ' · reduced motion' : ''}`;

    header();
    applyTheme();
    renderSavedCount();
    window.addEventListener('hashchange', route);
    route();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
