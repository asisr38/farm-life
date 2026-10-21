/* Thaun prototype: From abroad and Farms pages. */
(function () {
  const G = TH.geo, A = TH.app, S = TH.state;

  const STATUSES = [
    ['citizen', 'Nepali citizen living abroad', 'Passport or citizenship from Nepal'],
    ['nrn', 'NRN card holder', 'Foreign citizen of Nepali origin'],
    ['foreign', 'Foreign national', 'Curious about Nepal'],
  ];

  const CAN = {
    citizen: [
      ['yes', 'Buy land and homes anywhere in Nepal', 'The family ceiling is 25 ropani in the Kathmandu Valley, 70 in the hills and 10 bigha in the Terai (Lands Act s.7).'],
      ['yes', 'Sign from abroad', 'Give a relative power of attorney, signed in person at your nearest Nepali embassy or consulate.'],
      ['yes', 'Rent or lease', 'Rent a home, or lease farmland with a recorded Thaun lease.'],
    ],
    nrn: [
      ['yes', 'Buy one residential property', 'With Ministry of Foreign Affairs approval (NRN Rules 2066, r.11): up to 2 ropani in the Valley, 4 ropani in other municipalities, 8 kattha in Terai municipalities, 1 bigha in Terai rural municipalities, 10 ropani elsewhere.'],
      ['yes', 'Keep what you already owned', 'Land you held as a Nepali citizen does not count against the cap.'],
      ['yes', 'Rent homes', 'Open to you, with a written agreement.'],
      ['maybe', 'Lease farmland', 'Possible routes exist, but get legal advice first. A Thaun guide can connect you.'],
    ],
    foreign: [
      ['no', 'Own land', 'Transfers of land to foreign nationals are void without Government of Nepal approval (National Civil Code 2074, s.432).'],
      ['yes', 'Rent a home or flat', 'Common and straightforward. Look for listings with 0 broker fee and a verified owner.'],
      ['maybe', 'Long-term lease or business use', 'Runs through foreign investment rules. Talk to a lawyer before committing money.'],
    ],
  };

  const STEPS = {
    buy: [
      ['Shortlist with family', 'Save places and share the shortlist with relatives in Nepal. Everyone sees the same prices in their own currency.'],
      ['Live video walk', 'A Thaun field agent walks the boundary and the road with you on a video call.'],
      ['Verification report', 'Lalpurja matched to the kitta number, road width measured, boundary walked with GPS.'],
      ['Approval and power of attorney', 'NRN buyers get Ministry of Foreign Affairs approval first. Then sign a power of attorney at your embassy.'],
      ['Registration', 'Your representative registers the transfer at the Land Administration Office (formerly Malpot).'],
    ],
    rent: [
      ['Shortlist', 'Filter by "Video walk" and "0 broker fee".'],
      ['Live video walk', 'See the flat, the water supply and the street before you fly.'],
      ['Written agreement', 'Rent, deposit months and notice period written down. Never pay before you have seen the place.'],
    ],
  };

  const icon = k => ({ yes: 'circle-check', no: 'circle-x', maybe: 'circle-help' }[k]);

  TH.views.abroad = {
    mount(el) {
      const st = S.status || 'nrn';
      const render = () => {
        const s = S.status || 'nrn';
        el.querySelectorAll('[data-st]').forEach(b => b.classList.toggle('is-on', b.dataset.st === s));
        el.querySelector('#can').innerHTML = CAN[s].map(([k, b, t]) => `<div class="can-row ${k}"><i data-lucide="${icon(k)}"></i><div><b>${b}</b><span>${t}</span></div></div>`).join('');
        const steps = s === 'foreign' ? STEPS.rent : STEPS.buy;
        el.querySelector('#stepsTitle').textContent = s === 'foreign' ? 'How renting from abroad works' : 'How buying from abroad works';
        el.querySelector('#steps').innerHTML = steps.map(([b, t]) => `<div class="step"><div><b>${b}</b><span>${t}</span></div></div>`).join('');
        const all = TH.all().filter(l => l.remote);
        const list = s === 'foreign' ? all.filter(l => l.intent === 'rent') : all.filter(l => l.intent === 'sale').concat(all.filter(l => l.intent !== 'sale'));
        el.querySelector('#remote').innerHTML = list.slice(0, 6).map(l => A.card(l)).join('');
        A.icons();
      };
      el.innerHTML = `
        <section class="abroad-hero">
          <div class="section">
            <div class="eyebrow" style="color:var(--accent)">From abroad</div>
            <h1 class="display">Your thaun in Nepal, from anywhere</h1>
            <p class="lead" style="font-size:18px;max-width:58ch">Prices in your currency, live video walks with a field agent, and shortlists your family at home can open on any phone. Start with who you are, because the rules differ.</p>
            <div class="status-cards">${STATUSES.map(([k, b, t]) => `<button class="status ${st === k ? 'is-on' : ''}" data-st="${k}"><b>${b}</b><span>${t}</span></button>`).join('')}</div>
            <div style="display:flex;gap:10px;align-items:center;margin-top:20px;flex-wrap:wrap">
              <span style="font-size:14px;opacity:.85">Show prices in</span>
              <select class="tool" id="cur2">${Object.keys(TH.FX).map(k => `<option ${k === S.currency ? 'selected' : ''}>${k}</option>`).join('')}</select>
              <span style="font-size:12.5px;opacity:.7">Indicative rates, prototype only</span>
            </div>
          </div>
        </section>
        <section class="section">
          <div class="answer">
            <div><div class="eyebrow">What you can do</div><h2 class="display" style="font-size:32px;margin:6px 0 18px">The rules, plainly</h2><div class="can" id="can"></div>
              <p class="muted" style="font-size:12.5px;margin-top:12px">Checked against the Lands Act 2021, NRN Rules 2066 and National Civil Code 2074 on 21 Oct 2026. General information, not legal advice.</p></div>
            <div><div class="eyebrow">Step by step</div><h2 class="display" style="font-size:32px;margin:6px 0 18px" id="stepsTitle"></h2><div class="steps" id="steps"></div></div>
          </div>
        </section>
        <section class="section" style="padding-top:0">
          <div class="section-head"><div><div class="eyebrow">Ready for a remote viewing</div><h2 class="display">Listings with live video walks</h2></div>
          <a class="btn" href="#/explore?remote=1">See them on the map <i data-lucide="map"></i></a></div>
          <div class="grid-3" id="remote"></div>
        </section>`;
      el.querySelectorAll('[data-st]').forEach(b => b.addEventListener('click', () => { S.status = b.dataset.st; A.save('status'); render(); }));
      el.querySelector('#cur2').addEventListener('change', e => {
        S.currency = e.target.value; A.save('currency');
        document.getElementById('currency').value = S.currency;
        render();
      });
      render();
    },
    onPrefs() { A.remount(); },
  };

  TH.views.farms = {
    mount(el) {
      const farms = TH.all().filter(l => l.type === 'farmland');
      el.innerHTML = `
        <section class="abroad-hero">
          <div class="section">
            <div class="eyebrow" style="color:var(--accent)">Thaun Farms · our roots</div>
            <h1 class="display">Idle land, back to work</h1>
            <p class="lead" style="font-size:18px;max-width:60ch">Thaun began as Kathmandu Valley Farm: matching families who have fallow valley land with people who want to farm it, on fair terms that are written down. Farmland is still the part of Thaun we care about most.</p>
          </div>
        </section>
        <section class="section">
          <div class="grid-3">
            <div class="trust-card"><span class="tier-icon"><i data-lucide="droplets"></i></span><h3 class="display">Water first</h3><p class="muted" style="margin:0">Dry-season water is what limits farming in the Valley. Groundwater is falling about 2.5 m a year. Thaun checks water on site before a farm listing is marked ready.</p></div>
            <div class="trust-card"><span class="tier-icon"><i data-lucide="scale"></i></span><h3 class="display">Honest numbers</h3><p class="muted" style="margin:0">Organic farms in the Valley gross around रु 1 lakh per ropani a year. Our planner starts there, not at the best case.</p></div>
            <div class="trust-card"><span class="tier-icon"><i data-lucide="handshake"></i></span><h3 class="display">Fair, recorded leases</h3><p class="muted" style="margin:0">${Object.values(TH.FARM.leaseModels).map(m => m.name).join(', ')}. Vetted on both sides, witnessed, and every payment logged.</p></div>
          </div>
        </section>
        <section class="section" style="padding-top:0">
          <div class="section-head"><div><div class="eyebrow">Farmland for lease</div><h2 class="display">Plots ready for a grower</h2></div>
          <a class="btn btn-brand" href="#/explore?type=farmland&intent=lease">On the map <i data-lucide="map"></i></a></div>
          <div class="grid-3">${farms.map(l => A.card(l)).join('')}</div>
        </section>
        <section class="section" style="padding-top:0">
          <div class="panel" style="display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center">
            <div><h2 class="display">Have idle land?</h2><p class="muted" style="margin:6px 0 0">Draw it on the map, tell us about the water, and choose the lease you're comfortable with. We find and vet the farmer.</p></div>
            <a class="btn btn-primary btn-lg" href="#/sell/1">List your farmland <i data-lucide="sprout"></i></a>
          </div>
        </section>`;
    },
    onPrefs() { A.remount(); },
  };
})();
