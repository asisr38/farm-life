/* Thaun prototype: the seller's own listings. Verification progress, listing quality,
   re-confirming availability, editing, closing and deleting. */
(function () {
  const G = TH.geo, A = TH.app, S = TH.state;

  const CLOSED = { sale: ['sold', 'Mark as sold'], rent: ['rented', 'Mark as rented'], lease: ['leased', 'Mark as leased'] };
  const STATUS = { sold: 'Sold', rented: 'Rented', leased: 'Leased' };

  const mine = () => TH.everything().filter(l => l.mine && !l.draft).sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
  const update = (id, patch) => {
    S.published = S.published.map(x => (x.id === id ? { ...x, ...patch, _prepped: false } : x));
    A.savePublished();
  };
  const fmtDate = iso => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const inDays = n => new Date(Date.now() + n * 864e5).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  /* Listings published before the form was stored get one rebuilt from what we know. */
  function formFor(l) {
    if (l.form) return { ...l.form };
    const sale = l.intent === 'sale';
    return {
      intent: l.intent, type: l.type, place: null, pin: l.center, coords: l.parcelCoords, closed: true, lalpurja: ['', '', '', ''],
      price: sale ? String(Math.round(l.price / 1e3) / 100) : String(l.price), priceUnit: sale ? 'lakh' : 'npr',
      road: l.road || { type: 'motorable', widthFt: 13, toBlacktopM: 0 }, water: l.water || 'unsure', leaseModels: l.leaseModels || ['fixed'],
      title: l.title, blurb: l.blurb, tier: l.tier || 'owner', phone: '', consent: false, docs: {}, drone: !!l.remote, photoCount: 0,
    };
  }

  async function edit(l, step) {
    S.draft = { ...formFor(l), editing: l.id };
    A.save('draft');
    /* Fresh object URLs, so discarding the edit can't break the published listing's images. */
    const copy = TH.photos.owner(l.id).map(p => ({ ...p, src: URL.createObjectURL(p.blob), thumb: URL.createObjectURL(p.thumbBlob || p.blob) }));
    await TH.photos.save('draft', copy);
    location.hash = `#/sell/${step}`;
  }

  /* Example figures only: the prototype has no traffic, so these grow with the listing's age. */
  function stats(l) {
    const seed = [...l.id].reduce((a, c) => a + c.charCodeAt(0), 0);
    const views = 12 + (seed % 40) + l.posted * 23;
    return [['eye', 'Views', views], ['heart', 'Saves', Math.round(views / 11)], ['message-circle', 'Enquiries', Math.round(views / 38)]];
  }

  function quality(l) {
    const form = l.form || {};
    const photos = TH.photos.owner(l.id);
    const onPlot = photos.some(p => ['on', 'near'].includes(TH.photos.placement(p, l.parcel, l.center).state));
    const items = [];
    const add = (ok, label, tip, step) => items.push({ ok, label, tip, step });
    add(photos.length >= 5, photos.length >= 5 ? `${photos.length} photos` : photos.length ? `${photos.length} of 5 photos` : 'No photos yet',
      'Listings with five or more photos get far more enquiries. Show each corner, the road and the view.', 4);
    if (l.parcel) add(onPlot, onPlot ? 'A photo taken on the plot' : 'No photo taken on the plot',
      'Take one photo standing on the land with location turned on. Buyers see it was taken there.', 4);
    const lp = G.rapdToM2((form.lalpurja || []).map(v => +v || 0));
    if (l.parcel) {
      if (!lp) add(false, 'Lalpurja area not entered', 'Enter the area written on your lalpurja so buyers can compare it with your traced boundary.', 2);
      else {
        const diff = Math.abs(l.m2 - lp) / lp * 100;
        add(diff <= 5, diff <= 5 ? 'Traced area matches the lalpurja' : `Traced area is ${G.num(diff, 0)}% off the lalpurja`, 'Adjust the corners, or upload your naksa so a surveyor can check the line.', 2);
      }
    }
    if (l.intent === 'sale' && l.m2 && l.area && (l.type === 'land' || l.type === 'farmland')) {
      const ask = l.price / 1e5 / G.aana(l.m2);
      const ok = ask >= l.area.band[0] && ask <= l.area.band[1];
      add(ok, ok ? `Price within the ${l.area.name} range` : `Price ${ask > l.area.band[1] ? 'above' : 'below'} the ${l.area.name} range`,
        `Land here usually goes for रु ${l.area.band[0]}–${l.area.band[1]} L per aana. You're asking रु ${G.num(ask, 1)} L.`, 3);
    }
    add((l.blurb || '').length >= 120, (l.blurb || '').length >= 120 ? 'A full description' : 'Description is short',
      'Say what the land is good for, what the neighbours are like, and how water and power reach it.', 3);
    add(!!(l.road && l.road.type && (l.road.widthFt || l.road.type === 'footpath')), 'Road access described', 'Add the road type and width. It is the first question buyers ask.', 3);
    const tier = form.tier || l.tier || 'listed';
    add(tier !== 'listed', tier !== 'listed' ? 'Verification requested' : 'Not verified', 'Verified listings rank higher. Owner verification is free at launch.', 5);
    return items;
  }

  function timeline(l) {
    const form = l.form || {};
    const tier = form.tier || l.tier || 'listed';
    const checks = l.checks || {};
    const steps = [{ done: true, label: 'Listed', sub: fmtDate(l.publishedAt || new Date().toISOString()) }];
    if (tier === 'listed') steps.push({ done: false, skip: true, label: 'Documents', sub: 'Not requested on the Listed tier' });
    else {
      const docs = form.docs && form.docs.lalpurja && form.docs.id;
      steps.push({ done: !!docs, label: 'Documents received', sub: docs ? 'Lalpurja and ID, kept private' : 'Upload your lalpurja and ID' , step: docs ? null : 5 });
      steps.push({ done: !!checks.owner, label: 'Owner and lalpurja checked', sub: checks.owner ? fmtDate(checks.owner) : 'Usually within two working days' });
      if (tier === 'site') steps.push({ done: !!checks.site, label: 'Site visit', sub: checks.site ? fmtDate(checks.site) : 'A field agent will call to book a time' });
    }
    return steps;
  }

  function item(l) {
    const fr = A.freshness(l);
    const closed = !A.isLive(l);
    const q = quality(l);
    const score = Math.round((q.filter(x => x.ok).length / q.length) * 100);
    const steps = timeline(l);
    const pending = steps.some(s => !s.done && !s.skip);
    const [closeKey, closeLabel] = CLOSED[l.intent] || CLOSED.sale;
    const pill = closed
      ? `<span class="badge">${STATUS[l.status] || 'Closed'}</span>`
      : fr.stale ? `<span class="badge badge-warn"><i data-lucide="clock-alert"></i>Needs re-confirming</span>`
        : `<span class="badge badge-owner"><i data-lucide="radio"></i>Live</span>`;
    return `
      <article class="my-item ${closed ? 'is-closed' : ''}" data-my="${l.id}">
        <a class="my-media" href="#/p/${l.id}" aria-label="Open ${A.esc(l.title)}">${A.cardMedia(l)}</a>
        <div class="my-main">
          <div class="my-head">
            <div style="min-width:0">
              <div class="eyebrow">${A.intentName(l.intent)} · ${A.typeName(l.type)}</div>
              <h2 class="display"><a href="#/p/${l.id}">${A.esc(l.title)}</a></h2>
              <div class="muted num" style="font-size:13.5px">${A.price(l)} · ${l.m2 ? G.fmtRapd(l.m2) + ' · ' : ''}${l.area ? l.area.name : ''} · listed ${l.posted === 0 ? 'today' : `${l.posted} days ago`}</div>
            </div>
            ${pill}
          </div>

          ${closed ? `<div class="callout info"><i data-lucide="info"></i><span>${STATUS[l.status]} on ${fmtDate(l.statusAt)}. It no longer shows in search, and the page tells visitors it's closed.</span></div>` : `
          <div class="my-fresh ${fr.stale ? 'is-stale' : fr.renewIn <= 7 ? 'is-soon' : ''}">
            <i data-lucide="${fr.stale ? 'clock-alert' : 'refresh-cw'}"></i>
            <span>${fr.stale ? `Not re-confirmed for ${fr.age} days. Buyers see it as unconfirmed.` : `Confirm it's still available by <b>${inDays(fr.renewIn)}</b> to keep the badge.`}</span>
            <button class="btn btn-sm btn-primary" data-act="reconfirm"><i data-lucide="check"></i>Still available</button>
          </div>`}

          <div class="my-stats">${stats(l).map(([i, k, v]) => `<div><i data-lucide="${i}"></i><b class="num">${G.int(v)}</b><span>${k}</span></div>`).join('')}<small>Example numbers in this prototype</small></div>

          <div class="my-grid">
            <section>
              <h3>Verification</h3>
              <ol class="my-steps">${steps.map(s => `<li class="${s.done ? 'is-done' : s.skip ? 'is-skip' : ''}"><i data-lucide="${s.done ? 'circle-check' : s.skip ? 'circle-minus' : 'circle-dashed'}"></i><div><b>${s.label}</b><span>${s.sub}${s.step ? ` · <button class="link" data-step="${s.step}">Upload</button>` : ''}</span></div></li>`).join('')}</ol>
              ${pending && !closed ? `<button class="btn btn-sm btn-ghost" data-act="simulate"><i data-lucide="flask-conical"></i>Prototype: simulate Thaun's checks</button>` : ''}
            </section>
            <section>
              <h3>Listing quality <span class="my-score num ${score >= 80 ? 'is-good' : score >= 50 ? 'is-mid' : ''}">${score}%</span></h3>
              <ul class="my-quality">${q.map(x => `<li class="${x.ok ? 'is-ok' : ''}"><i data-lucide="${x.ok ? 'circle-check' : 'circle-alert'}"></i><div><b>${x.label}</b>${x.ok ? '' : `<span>${x.tip} <button class="link" data-step="${x.step}">Fix</button></span>`}</div></li>`).join('')}</ul>
            </section>
          </div>

          <div class="my-actions">
            <a class="btn btn-sm" href="#/p/${l.id}"><i data-lucide="eye"></i>View</a>
            <button class="btn btn-sm" data-step="3"><i data-lucide="pencil"></i>Edit details</button>
            <button class="btn btn-sm" data-step="4"><i data-lucide="image-plus"></i>Photos</button>
            ${closed ? `<button class="btn btn-sm" data-act="relist"><i data-lucide="rotate-ccw"></i>Relist</button>` : `<button class="btn btn-sm" data-act="close" data-close="${closeKey}"><i data-lucide="handshake"></i>${closeLabel}</button>`}
            <button class="btn btn-sm btn-ghost my-delete" data-act="delete"><i data-lucide="trash-2"></i>Delete</button>
          </div>
        </div>
      </article>`;
  }

  function render(el) {
    const list = mine();
    const live = list.filter(A.isLive);
    const stale = live.filter(l => A.freshness(l).stale).length;
    el.innerHTML = `
      <section class="section my">
        <div class="section-head">
          <div><div class="eyebrow">Seller</div><h1 class="display" style="font-size:clamp(34px,4vw,50px);margin:6px 0 0">Your listings</h1>
          <p class="lead">${list.length ? `${live.length} live ${live.length === 1 ? 'listing' : 'listings'}${list.length > live.length ? `, ${list.length - live.length} closed` : ''}${stale ? ` · <b>${stale} need${stale === 1 ? 's' : ''} re-confirming</b>` : ''}.` : "You haven't listed anything yet."}</p></div>
          <a class="btn btn-primary" href="#/sell/1"><i data-lucide="plus"></i>${list.length ? 'List another' : 'List your land'}</a>
        </div>
        ${list.length ? `<div class="my-list">${list.map(item).join('')}</div>` : `
          <div class="empty" style="padding:60px 12px"><i data-lucide="pen-tool"></i><b>Draw your land on the map in five minutes</b><span>Pin it, trace the boundary, add photos and a price. Thaun checks the documents, and buyers see a badge that says what was checked.</span><a class="btn btn-primary" href="#/sell/1">Start</a></div>`}
        <p class="muted" style="font-size:12.5px;margin-top:20px">Prototype: your listings, photos and documents live only in this browser.</p>
      </section>`;
    A.icons();
  }

  let host, onClick;
  TH.views.my = {
    mount(el) {
      host = el;
      render(el);
      el.addEventListener('click', (onClick = async e => {
        const card = e.target.closest('[data-my]');
        if (!card) return;
        const l = TH.byId(card.dataset.my);
        const step = e.target.closest('[data-step]');
        if (step) { e.preventDefault(); return edit(l, step.dataset.step); }
        const act = e.target.closest('[data-act]');
        if (!act) return;
        const now = new Date().toISOString();
        switch (act.dataset.act) {
          case 'reconfirm':
            update(l.id, { reconfirmedAt: now });
            A.toast('Confirmed. Your badge stays fresh for another 30 days.', 'refresh-cw');
            break;
          case 'simulate': {
            const tier = (l.form && l.form.tier) || l.tier || 'listed';
            update(l.id, { checks: { ...(l.checks || {}), owner: now, certificate: now, ...(tier === 'site' ? { site: now, road: now } : {}) }, form: { ...(l.form || {}), docs: { lalpurja: true, id: true } } });
            A.toast('Prototype: Thaun has checked the owner and lalpurja.', 'badge-check');
            break;
          }
          case 'close':
            update(l.id, { status: act.dataset.close, statusAt: now });
            A.toast(`Marked as ${act.dataset.close}. It's out of search now.`, 'handshake');
            break;
          case 'relist':
            update(l.id, { status: 'active', statusAt: now, reconfirmedAt: now });
            A.toast('Back in search, confirmed available today.', 'rotate-ccw');
            break;
          case 'delete': {
            const v = await A.modal(`<h2 class="display">Delete this listing?</h2><p class="muted" style="margin:0">"${A.esc(l.title)}" and its photos are removed from this browser. This can't be undone.</p><div class="modal-actions"><button class="btn" data-v="no">Keep it</button><button class="btn btn-primary" data-v="yes">Delete</button></div>`);
            if (v !== 'yes') return;
            S.published = S.published.filter(x => x.id !== l.id);
            A.savePublished();
            await TH.photos.clear(l.id);
            S.saved.delete(l.id); A.save('saved');
            A.header();
            A.toast('Listing deleted', 'trash-2');
            break;
          }
        }
        render(el);
      }));
      document.title = 'Your listings · Thaun';
    },
    onPrefs() { A.remount(); },
    unmount() {
      host && host.removeEventListener('click', onClick);
      document.title = 'Thaun · Land, homes and farmland in Nepal';
    },
  };
})();
