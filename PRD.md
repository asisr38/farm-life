# Product Requirements Document — Kathmandu Valley Farm

| | |
|---|---|
| **Product** | Kathmandu Valley Farm — a trust-and-compliance layer for farmland leasing in the Kathmandu Valley |
| **Version** | 0.1 (Draft) |
| **Status** | For review |
| **Date** | 2026-05-29 |
| **Owner** | Product Owner (you) |
| **Companion docs** | `PLAN_REVIEW.md` (strategic + technical critique, with sourced data), `kathmandu_valley_farm_plan.md` (operating domain knowledge) |
| **Key decisions baked in** | (1) **Primary market: local Nepali + returning-NRN farmers**, not foreign operators. (2) **Farm operating knowledge is delivered as in-product features**, not a separate doc. (3) **MVP money event = concierge (admin-facilitated, admin-recorded) lease; payments logged off-platform.** |

> **Superseded phasing (2026-10-21).** The product is widening into a general, map-first property portal for Nepal (land for sale and lease, homes for sale and rent). See `PORTAL_PLAN.md`. Map-first discovery moves from Phase 3 to Phase 1. The farmland lease lifecycle in this PRD (§7, the epics, the trust mechanics) carries over unchanged as the **Lease → Farmland vertical** inside the portal. The portal's name is **Thaun** (ठाउँ, "place"); see `PORTAL_PLAN.md` §11.

---

## 1. Summary

Kathmandu Valley Farm connects **landowners with idle peri-urban farmland** to **aspiring farmers** (local residents and returning Non-Resident Nepalis), and de-risks the relationship with **vetting, a standardized enforceable lease, recorded payments, and an operating dashboard** for the farm once it's running.

In the MVP, the marketplace is **concierge-operated**: a platform operator (admin) does the matching, vetting, and lease facilitation by hand, and the software's job is to **structure, record, and make trustworthy** what is otherwise an informal, litigation-prone handshake. We earn a **facilitation fee** on each lease and, later, sell standardized legal templates, compliance concierge, and produce-offtake linkage.

This is deliberately **not** the original "U.S. software developer leases land and farms for profit" pitch — `PLAN_REVIEW.md` documents why that persona is largely **not legally executable** today (FITTA 75%-export rule for primary-agriculture FDI, ~NPR 20M minimum foreign investment, no live remote-work visa, foreigners barred from owning land under Civil Code s.432). Foreign/diaspora participation returns later as a **regulated agritourism / joint-venture segment**, not as the launch wedge.

---

## 2. Problem & Opportunity

- **Idle land, willing owners.** Youth out-migration leaves peri-urban Valley plots fallow; owners want income but fear losing land rights or being cheated.
- **Aspiring farmers can't find fair, safe land deals.** Land in Nepal is family + identity + litigation-prone. There is no trusted, standardized way to find a plot, agree fair terms, and record an enforceable lease.
- **Demand for chemical-free produce is real** (consumers pay ~30% average premium, up to 50%), **but ~60% of organic output never reaches an organic-priced buyer** — market linkage, not growing, is where farmers lose money.
- **No incumbent.** There is no Nepal-specific farmland-leasing marketplace today (Nepal's agritech is advisory/irrigation/info). The model is proven abroad (Tillable, CashRent in the U.S.).

**Opportunity:** Be the trusted layer *over* the existing social/legal system — making a registered, witnessed, water-verified, market-linked lease **easier and safer** than the status quo handshake.

---

## 3. Goals, Non-Goals & Guardrails

### 3.1 Goals (what success looks like for v1)
- G1. Prove the **money event**: facilitate and record real, signed leases between vetted parties.
- G2. Build **supply liquidity**: a pool of vetted, water-verified plots that farmers actually want.
- G3. Reduce perceived risk enough that **landowners say yes** and **farmers complete year 1**.
- G4. Deliver the farm operating knowledge (financials, lease terms, water/market checklists, phased journey) **inside the product** so a first-time farmer is not flying blind.

### 3.2 Non-Goals (explicitly out of scope for v1)
- N1. **No foreign-operator profit-farming flow.** No FDI/work-visa onboarding. (Future, regulated segment.)
- N2. **No fully self-serve, automated matching or payments.** MVP is concierge; payments are off-platform but logged.
- N3. **No produce/equipment e-commerce marketplace.** Offtake *linkage* is a later phase; in-platform sales is not v1.
- N4. **No native mobile apps.** Mobile-first responsive web / PWA only.
- N5. **No insurance products** (listed in old README as aspirational; defer).

### 3.3 Product principles / guardrails
- **Trust mechanics ARE the product.** Vetting, standardized lease, recorded money, dispute path — these are features, not marketing copy.
- **Honest economics only.** All financial tooling uses field-validated numbers (base case, not best case). No inflated projections in user-facing tools.
- **Online layer over offline reality.** We make the ward-office registration, the witnessed lease, and the provincial mediation path *easier* — we never pretend to replace them.
- **Mobile-first, bilingual.** Most local users are on phones; full **English + Nepali (ne)** parity.
- **Water and market access are first-class.** A plot without dry-season water or a path to a buyer is not a sellable opportunity.

---

## 4. Users & Personas

| Persona | Who | Core job-to-be-done | Primary needs |
|---|---|---|---|
| **Aspiring Farmer** (local / NRN) | Urban Nepali professional, returning NRN, or experienced farmer seeking land | "Find land + a fair lease + a buyer so I don't go broke in year 1" | Land discovery, transparent terms, lease they can trust, market linkage, operating guidance |
| **Landowner** | Owner of idle peri-urban Valley plot | "Earn from my idle land without getting cheated or losing my rights" | Vetted tenants, fair recorded terms, protection of ownership/right-of-first-refusal, reliable payment |
| **Operator / Concierge (Admin)** | Platform staff — **first-class user in MVP** | "Match, vet, and facilitate leases efficiently and safely" | Listing & user management, vetting workflow, lease drafting/recording, payment ledger, dispute log |
| **Buyer / Offtaker** *(Phase 3)* | Restaurant, hotel, CSA, organic grocer | "Reliable supply of chemical-free produce" | Standing orders, farmer discovery, quality assurance |

---

## 5. Market & Constraints (carried from `PLAN_REVIEW.md`, sourced)

- **Lease rates:** documented ~NPR 15k/ropani/yr (rising ~10%/yr); prime peri-urban higher. Use per-plot real figures, not the old 1.1–1.3 lakh assumption.
- **Farm economics:** organic gross ~NPR 101.5k/ropani/yr (conventional ~135.7k). A 5-ropani plot ⇒ **~NPR 5–7 lakh gross base case** (not 14–16 lakh). Most small farms run <10% operating margin → market linkage is decisive.
- **Land ceiling (corrected 2026-10-21):** Lands Act 2021 s.7 is unchanged since 2001. **25 ropani in the Kathmandu Valley, 70 ropani elsewhere in the hills, 10 bigha in the Terai, per person *including their family*** (+5 ropani / +1 bigha for a homestead). The earlier "~10 ropani (2025)" claim was wrong; the 2025 ordinance and bill lapsed, and the Oct 2026 ordinance doesn't touch s.7. Sources are in `PORTAL_MARKET_RESEARCH.md` §5.
- **Water:** aquifer extraction ~6× recharge, table dropping ~2.5 m/yr, only ~19% of agriculture year-round irrigated. **Dry-season water is the binding constraint.**
- **Legal:** foreigners cannot own land; foreign primary-agriculture FDI needs ≥75% export + ~NPR 20M min → foreign profit-farming is out of scope for v1.

These constraints are **requirements**, not background: they drive the water-verification feature, the realistic calculator, the local-first persona, and the offtake-linkage roadmap.

---

## 6. Scope & Phasing

The build is phased so each phase maps to an epic group for the sprint/Jira step.

| Phase | Theme | Outcome |
|---|---|---|
| **Phase 0** | **Foundation / repo hardening** | The existing prototype becomes a trustworthy base: migrations, env contract, fixed RBAC, role-aware dashboard, CI/tests, dead-code removed. |
| **Phase 1** | **Concierge MVP (this PRD's core)** | Operator can take a plot from listing → vetted match → recorded signed lease → active operating dashboard, with payments logged. The money event works. |
| **Phase 2** | **Self-serve + trust depth** | Farmer/landowner self-serve flows, Nepali payment rails (Khalti/eSewa/IME Pay), notifications, document storage, dispute logging. |
| **Phase 3** | **Liquidity & expansion** | Offtake/buyer linkage, geo-search, PWA, and the regulated foreign agritourism/JV segment. |

---

## 7. The Lease Lifecycle (the aggregate root)

The whole product is modeled as a **transaction lifecycle**, not CRUD-of-farms. `Lease` is the aggregate root with an explicit state machine; every state transition and money event is written to an **append-only audit log**.

```
Listing(Draft) → Listing(Published) → Inquiry → Application
   → Vetting(Pending → Approved/Rejected)
   → Match/Negotiation → LeaseDraft
   → AgreementSigned (offline, uploaded/recorded)
   → Active  ──► Renewal ──► Active
             ──► Exit ──► Closed
             ──► Dispute ──► (Resolved → Active | Closed)
```

- **MVP states implemented end-to-end:** `Published → Inquiry → Vetting → LeaseDraft → AgreementSigned → Active → Closed`, all **operator-driven**.
- Each transition is permissioned, timestamped, and audit-logged.

---

## 8. Functional Requirements — Epics & Stories

> Notation: stories are `As a <persona>, I want <capability>, so that <value>.` MVP cut line is marked **[MVP]**. Acceptance criteria (AC) are given for the highest-risk stories; the rest will be detailed in the sprint/Jira step.

### EPIC A — Identity, Roles & Access (Phase 0/1)
- **A1 [MVP]** As a new user, I want to sign up as a **farmer or landowner**, so that I get the right experience. *(Fixes current bug: signup only ever creates `farmer`.)*
  - AC: signup form accepts role ∈ {farmer, landowner}; landowner accounts start `vetting_status = pending`; admin role is never self-assignable; passwords validated (min length + strength) server-side via Zod; rate-limited.
- **A2 [MVP]** As an operator, I want to assign/adjust roles and vetting status, so that I control who can list or lease.
- **A3 [MVP]** As any user, I want role-correct access enforced **server-side on every route**, so that I can't reach data I shouldn't. *(Replaces ad-hoc `as any` checks; centralize RBAC.)*
- **A4** As a user, I want email verification, so that accounts are real. *(Phase 2.)*

### EPIC B — Plots & Listings (supply) (Phase 1)
- **B1 [MVP]** As a landowner (or operator on their behalf), I want to create a **plot** with size, location (lat/lng + ward), photos, and **dry-season water status**, so that it can be evaluated.
  - AC: water access captured as a structured, **required** field (e.g., `none | seasonal | year_round`, plus source + verification note); plot cannot be *published* without a water assessment.
- **B2 [MVP]** As an operator, I want to move a plot **Draft → Published** after a vetting check, so that only verified opportunities are visible.
- **B3 [MVP]** As a farmer, I want to **browse/search published plots** (size, location, water, lease models offered, asking rate), so that I can find a fit.
- **B4** As a farmer, I want **map + distance-to-wholesale-node search**, so that I can judge market access. *(Geo-search; Phase 2/3.)*

### EPIC C — Inquiry, Application & Vetting (Phase 1)
- **C1 [MVP]** As a farmer, I want to **express interest / apply** on a plot, so that the operator can match me.
- **C2 [MVP]** As an operator, I want a **vetting workflow** (identity, commitment, references, and for landowners proof of ownership) with status + notes, so that both sides are trustworthy.
  - AC: vetting record stores documents/notes, reviewer, decision, timestamp; a lease cannot be created unless **both** parties are `approved`.
- **C3 [MVP]** As an operator, I want a **facilitation queue** (inquiries → vetting → ready-to-draft), so that I can run the concierge process efficiently.

### EPIC D — Lease Facilitation & Agreement (the money event) (Phase 1)
- **D1 [MVP]** As an operator, I want to **draft a lease** for a matched plot+farmer with model (cash / share / lease-to-own), term (start/end), rent, and the standardized clause set (tenure, right-of-first-refusal, improvements ownership, **water guarantee**, dispute resolution), so that terms are clear and enforceable.
- **D2 [MVP]** As an operator, I want to **generate a printable lease agreement** (EN/NE) from the lease record, so that parties can sign offline and register at the ward office.
  - AC: agreement is generated from structured terms (no free-text-only); includes the water-guarantee clause and dispute-resolution path (Bagmati Province mediation).
- **D3 [MVP]** As an operator, I want to record the **signed agreement** (upload scan + mark `AgreementSigned → Active`), so that the lease is official in-system.
- **D4 [MVP]** As an operator, I want the system to compute and record the **platform facilitation fee** on each lease, so that revenue is tracked.

### EPIC E — Payments & Ledger (Phase 1 record-only → Phase 2 integrated)
- **E1 [MVP]** As an operator, I want to **log payments** (rent installments, facilitation fee) as ledger entries against a lease, even when money moved off-platform, so that the marketplace is reconcilable and auditable.
  - AC: append-only ledger; each entry has type, amount (NPR), date, payer/payee, method, and reference; lease shows balance/schedule.
- **E2** As a farmer/landowner, I want to **pay/receive via Khalti/eSewa/IME Pay** in-platform, so that money movement is automatic and trusted. *(Phase 2.)*

### EPIC F — Operating Dashboard: Crops & Yields (Phase 1)
- **F1 [MVP]** As a farmer, I want to record **crops** (name, variety, planting date) on my leased plot, so that I can track the season.
- **F2 [MVP]** As a farmer, I want to record **yields** (date, kg, NPR revenue), so that I can see productivity and income.
- **F3 [MVP]** As a farmer, I want a **role-correct dashboard** (plots leased, crops, yield trend, income), and as a **landowner** a dashboard of owned plots, active leases, and rent received. *(Fixes current farmer-only dashboard.)*

### EPIC G — Farm Operating Playbook (baked-in knowledge) (Phase 1)
- **G1 [MVP]** As a farmer, I want a **realistic financial calculator** (base/expected/stretch scenarios with field-validated defaults; land-size capped at the Valley ceiling of 25 ropani per family), so that I plan honestly. *(Fixes inflated revenue.)*
- **G2 [MVP]** As a farmer, I want a **guided "My Journey"** (the 6-phase roadmap) tied to my real lease/plot state, so that I know my next concrete step.
- **G3 [MVP]** As a user, I want a **resource directory** (markets, certification e.g. PGS, suppliers, KVFN, provincial mediation), so that I can act offline.
- **G4** As a farmer, I want **water and market-access checklists** as part of plot evaluation, so that I avoid the two biggest failure modes. *(Ties into B1/B4.)*

### EPIC H — Trust, Safety & Dispute (Phase 2, designed in Phase 1)
- **H1** Document storage (KYC, ownership proof, signed agreements) with access control.
- **H2** Dispute logging + mediation tracking against a lease.
- **H3** Public "success stories" / track record (only real, post-verification).

### EPIC I — Platform Foundation (Phase 0)
- **I1 [MVP]** Commit Prisma migrations; reproducible DB across environments.
- **I2 [MVP]** `.env.example` + Zod-validated `env.ts` (fail fast on missing `DATABASE_URL`/`NEXTAUTH_SECRET`).
- **I3 [MVP]** Remove the unrelated **Workout Tracker**; collapse the **duplicate routing trees** into one i18n strategy.
- **I4 [MVP]** Standardized API error envelope; eliminate `as any`; tighten `next-auth` typing.
- **I5 [MVP]** CI pipeline (lint, type-check, build, test) + first tests covering **auth, RBAC, and lease transitions**.

---

## 9. Data Model (target)

Extends the current schema (`User, Plot, Lease, Crop, Yield`) toward the lifecycle model.

- **User** — add `vettingStatus` (pending/approved/rejected); keep `role`; signup may set farmer/landowner only.
- **Plot** — add `wardId/address`, `waterAccess` (none/seasonal/year_round + source + verifiedAt/by), `marketDistanceKm`, `photos[]`, `status` (draft/published/leased/retired).
- **Listing terms** — lease models offered + asking rate (can live on Plot for MVP; promote to a `Listing` entity if a plot needs multiple offers).
- **Inquiry / Application** — farmer ↔ plot interest with status.
- **VettingRecord** — subject (user), documents, reviewer, decision, notes, timestamps.
- **Lease** *(aggregate root)* — add `status` (state machine), `model`, `startDate/endDate`, structured `terms` (clauses incl. water guarantee), `agreementFileUrl`, `facilitationFeeNpr`.
- **LedgerEntry** *(new)* — leaseId, type (rent/fee/payout), amountNpr, date, method, reference, payer/payee. Append-only.
- **AuditEvent** *(new)* — entity, fromState, toState, actor, timestamp, metadata (covers lease transitions + money events).
- **Crop / Yield** — unchanged structurally.
- *(Phase 3)* **Buyer / Offtake** — standing orders linking farmers to buyers.

---

## 10. Non-Functional Requirements

- **Security:** Zod validation on every write; password policy; per-IP rate limiting on auth; server-side RBAC on every route; secrets validated at boot; audit log for sensitive actions; consider account-enumeration hardening.
- **Internationalization:** full EN/NE parity; one routing strategy; generated lease agreement available in both languages.
- **Mobile-first:** responsive, performance-budgeted for mid-range Android on 3G/4G; PWA-installable (Phase 2/3).
- **Reliability/observability:** committed migrations; CI gating merges; structured logging; audit trail for leases + money.
- **Privacy:** KYC/ownership documents access-controlled; data-retention policy; clear consent.
- **Payments (when integrated):** PCI-aware via hosted Nepali gateways; reconciliation against the ledger.

---

## 11. Success Metrics

- **North Star:** **# of leases facilitated that remain Active at 6 months** (proves real value, not vanity signups).
- **Funnel:** plots published → inquiries → vetted matches → leases signed → active@6mo.
- **Supply liquidity:** count of **vetted, water-verified** published plots.
- **Operator efficiency:** median **time-to-facilitate** a lease + operator hours per lease (concierge unit cost; tells us when to automate).
- **Trust/retention:** lease **renewal rate**; **dispute rate**; comparison of churn for farmers **with vs. without** a market/offtake link.
- **Honest revenue:** facilitation-fee GMV; avg facilitation fee per lease (in NPR, local-market-realistic).

---

## 12. Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Legal exposure on lease facilitation / who can transact | High | **Nepali corporate/land-lawyer opinion before launch** (Operational story O1); standardized, lawyer-reviewed lease template; register leases at ward office. |
| Water unreliability kills farms (and trust) | High | Water access as a **required, verified** plot field; water-guarantee clause in every lease; reject non-irrigated plots. |
| Demand absorption — produce doesn't sell at organic price | High | Offtake-linkage roadmap (Phase 3); market-access scoring in vetting; resource directory to buyers now. |
| Thin two-sided market / no liquidity | Med-High | Concierge model bootstraps supply manually; seed a curated set of vetted plots before opening demand. |
| Concierge doesn't scale | Med | Track operator hours/lease; automate the highest-cost step first (Phase 2). |
| Over-promising returns erodes trust | Med | Honest-economics guardrail; calculator shows base case + risk framing. |
| Foreign-segment legal complexity | Med | Out of v1 scope; revisit as regulated JV/agritourism only with counsel. |

---

## 13. Operational (non-software) workstreams → manual Jira stories

Per the delivery model, these are **real-world actions** that get Jira stories which a human moves manually (they gate or run parallel to the code):

- **O1.** Obtain written legal opinion (FITTA, lease registration, concierge-model legality, foreign-segment path).
- **O2.** Draft + lawyer-review the **standardized lease template** (the artifact the product generates).
- **O3.** Source & vet an initial **supply pool** of plots (incl. on-site water verification).
- **O4.** Establish **offtake relationships** (restaurants / CSA / organic grocers) for market linkage.
- **O5.** Partnerships: PGS/organic certification (Nepal Permaculture Group), KVFN, microfinance.
- **O6.** Payment-gateway merchant onboarding (Khalti/eSewa/IME Pay) ahead of Phase 2.
- **O7.** Validate real lease rates + farm economics on the actual short-listed plots (feeds calculator defaults).

---

## 14. Open Questions (to resolve before/within sprint planning)

1. Legal entity & who is the contracting party on the lease — platform as facilitator vs. party? (Depends on O1.)
2. Facilitation-fee model — flat NPR, % of annual rent, or subscription for landowners? (Affects E-epic + revenue metric.)
3. Vetting depth required for v1 (what documents are mandatory vs. nice-to-have)?
4. Generated agreement — do we need legally-binding e-signature in v1, or print-and-wet-sign + upload (assumed for MVP)?
5. Geo data source for ward boundaries / wholesale-node distances (Phase 2 geo-search).

---

## 15. Next Steps (this pipeline)

1. **Review/approve this PRD.**
2. **MVP HTML mock** — clickable static mock of the Phase-1 concierge flow (operator queue, plot listing, vetting, lease draft → agreement → active, ledger, role-aware dashboards, realistic calculator) for fast validation before coding.
3. **Sprint-wise plan + Jira** — convert Epics A–I (software) and O1–O7 (operational) into stories, sized and sequenced; Phase 0 first, then Phase 1.
4. **Agentic implementation** — code changes executed with human-in-the-loop review per story; real-world (O-series) stories moved manually.
