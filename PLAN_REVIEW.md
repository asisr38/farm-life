# Kathmandu Valley Farm — Plan & Platform Review

**Prepared:** 2026-05-29
**Reviewer lenses:** CEO · Product Owner · Architect · Developer · Systems / real-world operator
**Scope:** This repo contains **two intertwined "plans," not one**, and they are at different altitudes:

1. **The Farm Plan** (`kathmandu_valley_farm_plan.md`) — an operating plan for *one person* to lease and run a ~5-ropani organic market garden on the Kathmandu Valley rim.
2. **The Platform Plan** (`README.md` + the Next.js app) — a *two-sided marketplace* business that connects "U.S. software developers" with idle Nepali farmland and earns commission on leases.

These are very different businesses with very different risk profiles. Most of the plan's optimism comes from quietly blending them. This review separates them, pressure-tests both against **real, sourced data**, and then audits the **code** that claims to implement the platform.

> **Bottom line up front:** The *farm plan* is a credible lifestyle project but its unit economics are inflated ~2–3× versus documented Kathmandu Valley farm data. The *platform plan*'s headline persona — the U.S. developer who leases land and farms for profit — is **largely not legally executable** under current Nepali foreign-investment, land-ceiling, and visa law. The *code* is an early, partly-wired prototype that does **not yet implement the one feature the whole business depends on: facilitating a lease.** None of this is fatal, but the plan as written would not survive a competent investor's diligence or a Nepali lawyer's first read. The fixes are concrete and listed at the end.

---

## 1. CEO Lens — Strategy & Viability

### What's genuinely good
- **A real, observed problem.** Idle peri-urban land + organic-demand growth + diaspora/remote-work mobility is a real macro pattern, not invented. The "lease-first, capital-light" instinct is the *correct* strategic posture for an unproven operator.
- **Lease-first de-risking is the right call.** Given that foreigners legally *cannot own* land in Nepal, building the whole thesis on leasing (not buying) is not just smart — it's the only legal door. Good instinct.
- **First-mover is real in the narrow niche.** There is **no Nepal-specific farmland-leasing marketplace** today; Nepal's ~23 agritech startups (Smart Krishi, IFA Krishi, aQysta, etc.) are advisory/irrigation/info plays, not leasing marketplaces. Analogous models work abroad (U.S.: Tillable raised $8.25M Series A; CashRent raised a seed round on exactly this "level the farmland-rental playing field" thesis). So the *category* is validated elsewhere.

### What's strategically broken or unproven
- **The flagship customer probably can't legally be the customer.** The platform's *primary* persona is "U.S.-based software developers." But to *operate* a farm in Nepal a foreigner must invest through a registered company under **FITTA 2019** with a **minimum FDI of NPR 20 million (~US$150k)**, and **primary agriculture FDI is only permitted for large-scale, export-oriented operations exporting ≥75% of output** (the small "sell to two Kathmandu restaurants / a local CSA" model is *exactly* what remains effectively off-limits to foreign capital). A tourist visa is capped at **150 days/year and forbids business activity**; there is **no live digital-nomad visa yet** (a 5-year version is only *proposed*). Net: the dream of "burnt-out U.S. dev leases 5 ropani and farms for a living" is **not a legal product** today. This single fact reshapes the entire TAM.
- **The real addressable market is the *secondary* persona, not the primary.** Local Nepali urban professionals and returning NRNs *can* legally do this. That market is real but smaller, poorer per-head, and price-sensitive — which collides head-on with the platform's revenue assumptions (below).
- **The financial projections don't reconcile with documented reality** (see §2). When the headline farm grosses 2–3× what field studies report and the marketplace assumes U.S.-scale lease values in a market that legally excludes U.S. operators, the 3-year "$300k–500k revenue" line is aspirational fiction, not a forecast.
- **No defensibility / moat articulated.** "First mover" is not a moat. In a thin two-sided market, the moat is *trust and supply liquidity* (vetted landowners + standardized enforceable leases + dispute resolution). The plan names these as features but doesn't treat them as the actual business.

### CEO recommendation
**Pick the business.** Right now this is a lifestyle project, a content site, and a marketplace startup wearing one trench coat. The most fundable, legally-clean version is:
> **A trust-and-compliance layer for farmland leasing in the Kathmandu Valley — serving *local* aspiring farmers and returning NRNs first — monetized via lease facilitation + standardized legal templates + an operating dashboard.** Treat foreign/remote participants as a *later, regulated* segment (joint-venture or agritourism structures), not the launch wedge.

---

## 2. Reality Check — Plan Claims vs. Sourced Data

| Plan claim | What the data actually says | Verdict |
|---|---|---|
| Lease ≈ **NPR 1.1–1.3 lakh / ropani / yr** | Documented Kathmandu Valley leasehold rate ≈ **NPR 15,000 / ropani / yr** (rising ~10%/yr) in a 2024 study. Peri-urban premium land is higher, but the plan's figure is ~**7–8× the documented average.** | ⚠️ Likely overstated (or cherry-picked from prime Ring-Road land) — verify per actual short-listed plots. |
| **0.25 ha (5 ropani) grosses 14–16 lakh/yr** from year 2, **30–35% net margin** | Field studies: organic veg **gross ≈ NPR 101,536 / ropani / yr** (conventional ≈ 135,747). 5 ropani ⇒ **~NPR 5–7 lakh gross**, not 14–16. The plan implies ~280–320k/ropani — top-decile, multi-cropping, polytunnel, secured-premium-market territory, **not a base case.** | ❌ Revenue inflated ~2.5–3×. Margins: most small farms run **<10% operating margin** and are classified "high financial risk." |
| Organic price premium **20–50%** | Consumer willingness-to-pay studies: **~6–20% typical, ~30% average, up to 50%** at the top. **Only ~40% of organic output actually gets traded** as organic (weak market positioning). | ✅ Premium real but optimistic end; **demand absorption, not premium, is the constraint.** |
| Individuals capped at **25 ropani** in the Valley | ~~2025 amendment reduced the Valley ceiling to ~10 ropani~~ **Corrected 2026-10-21: still 25 ropani** (Lands Act s.7, unchanged since 2001; the Jan 2025 ordinance and bill only concerned developer exemptions and lapsed). | ✅ Correct. The 25-ropani slider is fine. |
| "Foreigners cannot own land (lease-only)" | **Correct.** Foreign *companies* may lease up to **50 years** for approved commercial activity. | ✅ Accurate — and the one legal fact the plan gets exactly right. |
| Water risk = a seasonal Mar–May footnote | Valley groundwater extraction is **~6× recharge**, water table dropping **~2.5 m/yr**; only **~19% of agriculture has year-round irrigation**; dry-season supply ≈ 90 ML/day vs ≥360 ML/day demand. | ❌ Under-weighted. Water is an **existential, structural** risk, not a seasonal line item. |
| Platform Yr-3 revenue **$300k–500k**, avg lease value **$3k–8k**, **10–15% commission**, CAC **$500–1k** | These are **U.S.-marketplace economics** applied to a market whose *only legal participants* (local farmers) lease at ~NPR 15k/ropani (~$110/ropani). A $3–8k lease ≈ 27–73 ropani — near or above the 25-ropani Valley ceiling. | ❌ Top-line and unit economics built on the wrong market. |
| "Respectable return within **3 years**" / lifestyle relief | Beginning farmers typically work **80–100 hrs/week at ~$2/hr for 3–7 years**; most don't clear year 3. Agriculture's *business* survival is actually decent (~66% at 5 yrs), but *profitability* is brutal early. | ⚠️ The "escape burnout into a profitable, restful farm in 3 years" promise is the opposite of the lived reality. |

*Sources for every row are listed in §9.*

---

## 3. Product Owner Lens — Personas, Scope, MVP

### Persona problem
The plan lists three personas (U.S. devs, local professionals, landowners) and optimizes the *marketing site* for the first one — who is the **least legally able to transact.** This is a classic "build for the persona you admire, not the one who can pay" trap.

- **Re-rank:** Landowners (supply) + local/NRN aspiring farmers (demand) are the launch market. Foreign lifestyle-farmers are a *future, regulated* segment.
- **Jobs-to-be-done that actually matter:**
  - Landowner: *"Turn my idle plot into reliable income without getting cheated or losing my land rights."* → vetting, escrow, enforceable lease, dispute path.
  - Local farmer: *"Find land + a fair lease + a buyer for my produce so I don't go broke in year 1."* → land discovery, standardized lease, **market/offtake linkage** (this is the real retention hook).

### MVP scope is inverted
The app today is **~80% marketing/storytelling site + ~20% half-wired dashboard.** For a *marketplace*, the MVP must prove **liquidity and a completed transaction**, yet the single most important object — a **Lease** — has **no creation flow, no UI, and no API** (confirmed: zero `prisma.lease.create` anywhere). You can model a farm but you cannot make the business's money-event happen.

**Minimum honest MVP (manual-concierge marketplace):**
1. Landowner lists a plot (works today, ish — see §5/§6 role bug).
2. Farmer browses/expresses interest (missing).
3. **Admin facilitates + records a lease** with terms, dates, model, and a generated agreement (missing — this is THE gap).
4. Money movement (even off-platform + recorded) (missing).
5. Post-lease operating dashboard: crops + yields (partly built).

Steps 2–4 are the business. Steps 1 & 5 are the parts that got built.

### Scope creep to cut
- **The Workout Tracker** (`/workout`, `components/workout/WorkoutTracker.tsx`) is entirely unrelated to farmland leasing. It's a personal side-experiment riding in the same repo and nav. Remove it from this product (move to a personal repo) — it dilutes the story for any stakeholder who opens the app.

### Trust & safety is the product, and it's absent
"Farmer Vetting," "Legal Framework," "Success Stories," "Insurance Products" are listed as features but exist only as marketing copy. In a land-and-money marketplace in a relationship-driven market, **trust mechanics ARE the product.** Nothing in the code implements vetting, KYC, escrow, agreement generation, or dispute logging.

---

## 4. Architect Lens — System Design

### What's reasonable
- **Stack is sane and modern:** Next.js 15 (App Router) + TypeScript + Prisma + PostgreSQL + NextAuth + Tailwind. Good defaults for a small team; nothing exotic to maintain.
- **Data model has the right *nouns*:** `User` (with `Role`), `Plot`, `Lease`, `Crop`, `Yield`. The skeleton matches the domain.
- **Role-based access is *attempted*** at the API layer (per-route `getServerSession` + role checks).

### Architectural gaps & risks
1. **`Lease` is a dead-end entity.** It exists in the schema with no service, no API route, no UI. The aggregate root of the whole business is unwired. Everything downstream (commission, payments, dashboards-by-role) is therefore impossible to complete.
2. **No money in the money model.** There is no `Payment`/`Transaction`/`Commission`/`Payout` entity and **no payment integration** (no Stripe, and crucially no **eSewa/Khalti/IME Pay** — the rails Nepal actually uses). A commission-based marketplace with no ledger cannot be reconciled, audited, or trusted.
3. **No migrations are committed** (`prisma/migrations/` does not exist). The repo relies on `prisma migrate dev --name init` locally. This guarantees **schema drift** between environments and makes production deploys non-reproducible. For a DB-backed product this is a release-blocker.
4. **Two competing routing trees.** `app/farmer-perspective`, `app/my-path`, `app/workout` exist **both** at the root **and** under `app/[lang]/...`. This duplicate i18n scaffolding will cause divergence, double-maintenance, and confusing canonical-URL/SEO behavior. Pick one i18n strategy (`[lang]` segment *or* root) and delete the other.
5. **No environment contract.** No `.env.example`, no runtime validation of env vars (`DATABASE_URL`, `NEXTAUTH_SECRET`). A missing/short `NEXTAUTH_SECRET` is a silent security failure. Add a `zod`-validated `env.ts` and a checked-in `.env.example`.
6. **JWT session strategy + PrismaAdapter is half-and-half.** Sessions are JWT (`strategy: "jwt"`), yet the `Session`/`Account`/`VerificationToken` tables exist and won't be populated as the adapter implies. Not a bug, but it signals the auth design wasn't deliberately chosen — and it complicates future OAuth/email-verification work.
7. **Geospatial is a toy.** `Plot.lat/lng` as nullable floats is fine for pins, but "land discovery within 15–20 km of a wholesale node" implies real geo queries (PostGIS, distance, polygons). Today there's no spatial indexing or search.
8. **No background/async layer** for the things a real marketplace needs: email (verification, lease notifications), document generation, reminders, payout scheduling. All of this is currently impossible to deliver.

### Architecture recommendation
Model the business as a **transaction lifecycle**, not a CRUD-of-farms:
`Listing → Inquiry → Application/Vetting → Lease (Agreement + Terms) → Payment/Escrow → Operating period (Crops/Yields) → Renewal/Exit/Dispute`.
Make `Lease` the aggregate root with a **state machine** and an **append-only money ledger**. Everything else hangs off that.

---

## 5. Developer Lens — Code Quality & Concrete Bugs

The code is competent-junior level: clean Tailwind, reasonable component split, Zod on most write paths. But there are real correctness and security issues:

### Functional bugs
1. **Role assignment is impossible → the marketplace can't form.** `POST /api/signup` always creates a user with the schema default `role = farmer` (no role field accepted, no Zod schema at all). But `POST /api/plots` requires `admin` or `landowner`. **Therefore no user can ever list a plot through the product** — you'd have to hand-edit the database. The two-sided marketplace literally cannot bootstrap itself. *(Confirmed: the only `role:` reference in app/lib is the read in `authOptions.ts`.)*
2. **The dashboard is farmer-only despite "role-aware" claims.** `app/dashboard/page.tsx` hard-codes `where: { leases: { some: { farmerId: session.user.id } } }`. A **landowner logs in and sees an empty dashboard** with "No plots found. Contact admin." The README's "role-aware dashboard (farmers, landowners, admins see tailored data)" is not implemented.
3. **`/dashboard` does its own auth check AND is in `middleware.ts`** — redundant but harmless; the inconsistency (some protected pages rely on middleware, `/crops/new` etc. may not) suggests auth coverage wasn't audited route-by-route.

### Security issues
4. **Signup has no input validation or password policy.** Unlike the plots/crops/yields routes (which use Zod), `signup/route.ts` does raw `request.json()` with only `if (!email || !password)`. No email-format check, no min-length, no strength rule, no normalization. Weak/garbage credentials accepted.
5. **No rate limiting / brute-force protection** on `/api/signup` or the credentials login. In a credential-based auth system this is table stakes (add per-IP throttling, e.g., Upstash ratelimit or middleware).
6. **No account enumeration consideration.** Signup returns a distinct 409 "Email already in use" — convenient, but leaks which emails are registered. Acceptable for v0, note it.
7. **`as any` casts paper over the type system** (`authOptions.ts` returns `as any`; `plots/route.ts` `data: {...} as any`; dashboard comment literally says "types still do not add .location"). These are the type holes that hide the bugs above. `next-auth.d.ts` augmentation exists but isn't fully trusted by the code.

### Engineering hygiene
8. **Zero tests.** No unit, integration, or e2e tests anywhere. For auth + money + access-control code, that's the highest-risk place to have none.
9. **No CI.** No `.github/workflows`. Lint/type-check/build/test aren't enforced on push. (Scripts exist in `package.json`; nothing runs them.)
10. **Commit hygiene.** Recent history is `oooo`, `ok`, `ok now`, `now`, `zzz`, `abc`. Fine for a solo prototype; unacceptable once anyone else (or future-you, or an investor's technical advisor) needs to read history. Adopt conventional commits.
11. **Inconsistent API error shapes.** Some routes return `{ message }`, others `{ error: { code, details } }`. Standardize one envelope.

---

## 6. Systems & Real-World Implementation

Thinking past the screen, into dirt, water, money, and law:

- **Water is the binding constraint, not land.** With the aquifer dropping ~2.5 m/yr and only ~19% of valley agriculture irrigated year-round, *any* plot's value is dominated by its dry-season (Mar–May) water security. The lease must guarantee **measurable** water (litres/day or pump-hours, with a rebate trigger) — the farm plan says this; the *platform* should make verified water access a **first-class, searchable plot attribute and a vetting gate.** A plot without dry-season water is unsellable, full stop.
- **Cold chain & market access decide profit, not yield.** Field data shows **~60% of organic output never reaches an organic-priced buyer.** Growing the crop is the easy 50%; the value is captured at the cold-room → transport → premium-buyer relationship. The plan correctly lists "secure markets early (MOUs with 2 restaurants/CSA)" but the *platform* under-invests here. **Offtake linkage is the retention engine** — a farmer who has a buyer renews; one who has rotting cauliflower churns and tells everyone.
- **Labor reality undercuts the lifestyle pitch.** Peak-season labor at NPR 1,000–1,200/day is real, but availability is the issue (youth out-migration is *why* land is idle in the first place — the same trend that creates supply destroys the labor pool). The plan's WWOOF/volunteer mitigation is thin and visa-fraught for volunteers too.
- **The legal/registration burden is a *product*, not a footnote.** A foreigner doing this legally needs: company registration + FDI approval (NPR 20M min) + work visa (labour permit + work agreement + line-agency recommendation) + lease registration at the Ward Office + PGS/organic certification. That stack is *itself* the highest-value thing the platform could sell — as a guided compliance/concierge service — and it's the thing most likely to make a local farmer trust the platform too.
- **Trust in a relationship economy.** Land in Nepal is family, identity, and litigation-prone. A web form does not displace the village elder, the ward office, and the cousin who "knows a guy." The platform wins only if it makes the *offline* trust artifacts (registered lease, witnessed terms, dispute mediation via the Bagmati Province board) **easier and safer** than the status quo — i.e., it must be a layer *over* the existing social/legal system, not a replacement for it.

---

## 7. What's Good (Keep / Build On)

- Correct core instinct: **lease-first, capital-light, foreigners-lease-don't-own.**
- A real, sourced macro problem (idle land + organic demand + mobility).
- Genuine first-mover gap in the *leasing-marketplace* niche, with working analogs abroad to learn from (Tillable, CashRent).
- Sensible, low-maintenance tech stack and a domain-correct data-model skeleton.
- The farm plan's **lease-clause checklist** (tenure, right-of-first-refusal, improvements ownership, water guarantee, dispute resolution) is genuinely good operating guidance and should become the **standardized lease template** that the platform sells.
- Bilingual (`en`/`ne`) ambition is right for the *real* (local) market — finish it properly.

---

## 8. What Needs Improvement (Prioritized)

### P0 — Truth & legality (do before pitching anyone)
1. **Rewrite the financials** against documented data: ~NPR 5–7 lakh gross on 5 ropani as the *base* case; show the 14–16 lakh figure only as an explicit top-decile scenario with the assumptions (polytunnels, multi-cropping, secured premium offtake) stated. Re-do the platform revenue model on *local* lease values, not U.S. ones.
2. **Get a Nepali corporate/land lawyer's written opinion** on the foreign-participant path (FITTA 75%-export rule, FDI minimum, work visa, the land ceiling, 25 ropani in the Valley per the 2026-10-21 check). Until then, **stop marketing to U.S. developers as primary** — it may be unsellable and reputationally risky.
3. **Re-pick the launch persona** to the legally-able one (local/NRN), and rebuild the homepage narrative around it.

### P1 — Make the business buildable
4. **Implement the `Lease` lifecycle**: API + UI + state machine + generated agreement. This is the product.
5. **Fix role assignment** (let signup choose farmer/landowner with admin approval for landowners) so the marketplace can bootstrap without DB surgery.
6. **Make the dashboard genuinely role-aware** (landowner view = owned plots + tenant leases + income; farmer view = leased plots + crops/yields; admin = facilitation queue).
7. **Add a money model + Nepali payment rails** (eSewa/Khalti/IME Pay), even if v0 just *records* off-platform payments. No ledger, no marketplace.
8. **Commit Prisma migrations; add `.env.example` + validated `env.ts`.**

### P2 — Trust, quality, scale
9. Validation + password policy + rate limiting on auth; standardize API error envelope; kill `as any`.
10. Add tests (start with auth + access control) and a CI pipeline (lint, type-check, build, test).
11. Collapse the duplicate routing trees into one i18n strategy.
12. **Remove the Workout Tracker** from this product.
13. Make **dry-season water access** and **offtake/market linkage** first-class, searchable, vetted plot attributes.

---

## 9. Sources

**Foreign ownership / leasing / FDI**
- [Work Permit & Working Visa for foreigners in Nepal (OneSphere Law)](https://onespherelaw.com/work-permit-foreigners-working-visa-in-nepal/)
- [Start a Business in Nepal as a Foreigner — incl. 50-yr lease (CompanyNP)](https://companynp.com/start-a-business-in-nepal-as-a-foreigner/)
- [Nepal opens foreign investment in primary sectors of agriculture — 75%-export condition (Imperial Law)](https://www.lawimperial.com/nepal-opens-foreign-investment-in-primary-sectors-of-agriculture/)
- [Opening agriculture sector for FDI (UNCTAD Investment Policy Monitor)](https://investmentpolicy.unctad.org/investment-policy-monitor/measures/3648/opening-agriculture-sector-for-fdi)
- [Foreign Investment: Negative List & Minimum Threshold — NPR 20M (Gandhi & Associates)](https://www.lawgandhi.com/foreign-investment-in-nepal-negative-list-minimum-threshold/)
- [Foreign Investment in Nepal: Legal Guide 2025 (Bhandari Law)](https://lawbhandari.com/publication/foreign-direct-investment-in-nepal)

**Land ceiling**
- [Eighth amendment to Land Act imposes new land ceiling (The Himalayan Times)](https://thehimalayantimes.com/kathmandu/eighth-amendment-to-land-act-imposes-new-land-ceiling)
- ~~[Nepal eases land ceiling laws — KV reduced to 10 ropani (Fiscal Nepal)](https://www.fiscalnepal.com/2025/01/16/19208/nepal-eases-land-ceiling-laws-offering-relief-to-real-estate-developers/)~~ (not supported by primary sources; see `PORTAL_MARKET_RESEARCH.md` §5)

**Lease rates & farm economics**
- [Agricultural Land Rental Arrangements in Nepal — ~NPR 15k/ropani/yr (Giri & Goswami, 2024, SAGE)](https://journals.sagepub.com/doi/10.1177/10185291241296212)
- [Economic analysis of organic vs conventional vegetable farming, Kathmandu Valley — gross/ropani (NepJOL)](https://www.nepjol.info/index.php/AEJ/article/view/19816)
- [Vegetable Farming and Farmers' Livelihood: Kathmandu Valley (MDPI Sustainability)](https://www.mdpi.com/2071-1050/11/3/889)
- [Production Cost Analysis of Major Vegetables (Bagmati Province DOAD)](https://doad.bagamati.gov.np/sites/default/files/publication/vegetable%20production%20cost%20leaflet%20(1)_0.pdf)

**Organic demand / willingness to pay**
- [Consumers' Willingness to Pay for Organic Products: Kathmandu Valley (ResearchGate)](https://www.researchgate.net/publication/255565449_Consumers'_Willingness_to_Pay_for_Organic_Products_A_Case_From_Kathmandu_Valley)

**Water**
- [Domestic Water Demand–Supply Deficit in Kathmandu Valley (MDPI Water)](https://www.mdpi.com/2073-4441/8/5/196)
- [Recharging groundwater — extraction vs recharge (Kathmandu Post)](https://kathmandupost.com/columns/2023/12/16/recharging-groundwater)
- [Springs and groundwater shrinking across Nepal, ADB warns (Kathmandu Post)](https://kathmandupost.com/money/2025/12/08/springs-and-groundwater-shrinking-across-nepal-adb-warns)

**Competitors / category**
- [AgriTech startups in Nepal (Tracxn)](https://tracxn.com/d/explore/agritech-startups-in-nepal/__vVR-XvgpyN7GOCc3u4u6Xi6nuo4mM8Sq2i2Ty193KdU/companies)
- [Tillable raises $8.25M for farmland-rental marketplace (GlobeNewswire)](https://www.globenewswire.com/en/news-release/2019/02/21/1739174/0/en/Online-Marketplace-Tillable-Raises-8-25M-Series-A-to-Bring-Efficiency-to-32-Billion-Farmland-Rental-Market.html)
- [CashRent seed round — farmland-rental marketplace (AgFunderNews)](https://agfundernews.com/farmers-landowners-fund-cashrent-seed-round-to-level-the-farmland-rental-playing-field)

**Visa / remote work**
- [Nepal Digital Nomad Visa Guide — 150-day tourist cap, proposed DNV (Stamped Nomad)](https://www.stampednomad.com/guides/nepal)
- [Nepal eyes digital nomad visa policy (Kathmandu Post)](https://kathmandupost.com/money/2025/05/28/nepal-eyes-tourism-economic-boost-with-new-digital-nomad-visa-policy)
- [Working Visa (Nepal Dept. of Immigration)](https://www.immigration.gov.np/en/page/working-visa)

**Beginning-farmer reality**
- [7 Reasons Why Small Farms Fail (Small Farm Nation)](https://smallfarmnation.com/7-reason-why-small-farms-fail/)
- [Most small family farms at high financial risk (USDA Economic Research Service)](https://www.ers.usda.gov/data-products/charts-of-note/chart-detail?chartId=108317)

---

*Method note: codebase reviewed file-by-file (schema, all API routes, auth, middleware, dashboard, calculator). Real-world claims validated via web research and cross-checked against Nepali legal-firm publications, peer-reviewed/agency studies, and market data. Where the plan and the data disagree, the data is cited inline.*
