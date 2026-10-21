# Plan — Thaun (ठाउँ): A Premium, Map-First Property Portal for Nepal

| | |
|---|---|
| **Product name** | **Thaun** (ठाउँ, "place"). Chosen 2026-10-21 |
| **Status** | Draft for review |
| **Date** | 2026-10-21 |
| **Inputs** | `PORTAL_MARKET_RESEARCH.md` (market + state of the art), `PRD.md` (farmland-lease concierge MVP), `PLAN_REVIEW.md` |
| **Scope asked for** | Land for sale, land for lease, houses/flats for sale or rent, on maps, with premium UI/UX (3D, animation) |

---

## 1. The strategic call

### 1.1 What changes vs. the current PRD

`PRD.md` scopes a **concierge farmland-leasing** product, with geo-search pushed to Phase 3. This plan widens it into a **general property portal** and moves the map to the centre. The PRD's core ideas still apply and become the portal's differentiator:

- the trust mechanics (vetting, recorded terms, audit log);
- honest numbers;
- water and market access treated as first-class;
- bilingual, mobile-first.

The farmland lease lifecycle becomes **one vertical (Lease → Farmland)** inside the portal. It is not thrown away.

> **Decided (2026-10-21):** the portal supersedes the PRD's phasing. `PRD.md` now carries a note to that effect. Map-first discovery is Phase 1, and the lease lifecycle is the deep workflow behind the farmland listing type.

### 1.2 Don't launch "everything, everywhere"

Most portals fail at **liquidity**. A map of all Nepal with 40 listings looks empty and nobody trusts it, and the incumbents (Gharghaderi, about 43K visits per quarter) show how thin this market is online. So launch on a narrow wedge where our differentiator matters most, and make it dense:

| Phase | Wedge | Why this order |
|---|---|---|
| **1** | **Land: sale + lease (incl. farmland) in the Kathmandu Valley** | Parcel outlines, terrain, slope and road access matter most for land, and no one does them. The farm-lease concierge (existing PRD) gives us early supply. Valley deal value rose 217% last year. |
| **2** | **Homes: flats/houses for rent and sale in KTM + Lalitpur + Bhaktapur** | Rentals bring frequency and traffic. Fixing the "Rs 500 room scam" is a clear story. Needs the verification ops built in Phase 1. |
| **3** | **Premium + diaspora + expansion:** drone 3D, NRN mode, AI search, Pokhara and Chitwan (Terai units) | Builds on trust and density. Drone capture becomes a paid product. |

**Density target before public launch:** **≥ 300 verified land listings in the Valley, each with a drawn parcel outline.** Sourced by hand through landowner outreach, farm-lease concierge supply and 3–5 partner agencies.

### 1.3 Positioning

> **"Every listing on a real parcel. Every badge means something."**
> The first Nepali portal where you see the exact plot outlined in 3D on the hillside, its slope, its road and its price against the market. Its "Verified" badge says what was checked and when.

---

## 2. Users

| Persona | Job to be done | What wins them |
|---|---|---|
| **Local buyer / family** | "Find a buildable plot or a home we can afford, without being cheated" | Parcel on the map, road access, price vs. market, verified badge, no broker runaround |
| **Renter** (student, young professional, newcomer) | "Find a decent room/flat fast without paying scammers" | Verified landlords, no upfront fee, real photos, map by commute |
| **NRN / diaspora buyer** | "Buy at home from abroad, safely, with my family" | 3D/remote tour, shared shortlist, NPR↔USD/AUD/GBP, eligibility + PoA guidance, live video viewing |
| **Landowner / seller / landlord** | "Sell or lease to a serious party for a fair price" | Free listing, a parcel-drawing tool, leads that are pre-screened, price benchmark |
| **Aspiring farmer** (existing PRD persona) | "Find land and a fair lease" | Farmland category with water, slope, soil, market-distance layers + concierge lease |
| **Agent / agency** (licensed or not) | "Get qualified leads and look professional" | Branded listings, verified-deal track record, licence badge (for deals above Rs 3 crore) |
| **Operator** (us) | "Verify, moderate, facilitate" | Verification console, duplicate detection, audit log |

---

## 3. Information architecture

```
/[lang]                      Home: hero fly-in + search (NL + filters) + curated areas
/[lang]/search               Map + results (the core screen)
   ?intent=buy|rent|lease&type=land|house|flat|room|commercial&bbox=…&poly=…
/[lang]/p/[slug]             Listing detail (land variant / home variant)
/[lang]/area/[palika]/[ward] Area pages: price per aana, trend, schools, listings (SEO)
/[lang]/prices               Price map + index (H3 heatmap, government vs market)
/[lang]/sell                 Seller flow: pin → parcel → details → media → verification
/[lang]/saved                Shortlists (shareable boards), saved searches + alerts
/[lang]/nrn                  Diaspora hub: eligibility, PoA, remote tours, FX
/[lang]/tools                Unit converter (R-A-P-D ↔ B-K-D ↔ m²/sq ft), EMI, fee/tax estimator
/[lang]/lease/farmland       Farmland vertical (existing concierge lifecycle)
/dashboard                   Seller/agent/farmer dashboards (existing, role-aware)
/ops                         Operator console: verification queue, moderation, leases, ledger
```

---

## 4. The experience: signature moments

Design rules: **motion has to explain something** (where a place is, how steep a slope is, what changed); **3D is opt-in on weaker phones**; **every listing must still work as a fast photo-and-text page without WebGL**.

### 4.1 Home: "From the Himalaya to your plot"

- **First visit per session:** the camera starts on a slowly rotating globe, sweeps over the Himalaya, and settles on the Kathmandu Valley in 3D terrain with soft dusk light (MapLibre globe + terrain + sky). About 4 seconds, **skippable**, shown once per session. Phones that can't run it get a pre-rendered video or poster. With `prefers-reduced-motion` it's a single crossfade.
- **Search box:** one field taking English, Nepali or romanised text: *"4 aana ghaderi Budhanilkantha road access under 1 crore"* or *"2BHK flat Jhamsikhel 40 hajar"*. Each part of the query becomes a filter chip you can edit. There is always a plain filters fallback.
- **Below the fold:** curated area cards (Budhanilkantha, Godawari, Bhaisepati…). Each shows a live price per aana, a sparkline, and a small 3D terrain thumbnail that tilts on hover.

### 4.2 Search: the map is the product

- **Desktop:** results list 40% / map 60%, with a "search as I move" toggle. Hovering a card highlights its pin and vice versa. Tapping a pin opens a **mini-card that grows out of the pin** (shared-element transition), not a page navigation.
- **Mobile:** a full-bleed map with a **bottom sheet** (peek → half → full). A floating Map/List pill. Filters open as a full-screen sheet with a live count ("Show 128 plots").
- **Pins:**
  - show the price in lakh/crore: `रु 85 L`, `रु 1.2 Cr`, and `रु 45K/mo` for rentals;
  - are grouped into clusters that split apart in an animation as you zoom in;
  - turn grey once viewed and show a heart once saved;
  - are capped and **ranked** (Airbnb's lesson) with "zoom in to see 40 more".
- **Parcel outlines appear from about zoom 16.** At street level, land listings are drawn as their real outlines, not dots.
- **Draw an area:** sketch a lasso around the area you want. Also "near a landmark" (Bhatbhateni Maharajgunj, Patan Durbar Square) and **commute time** to a place (Phase 2+).
- **Layers drawer** (thumbnail toggles):
  - 3D terrain
  - satellite
  - **price per aana hexes** (H3)
  - slope
  - road network by width
  - **subdivision freeze zones**
  - flood/river buffer
  - schools/hospitals
  - farmland suitability (Phase 3)
- **Units:** every area appears in *both* `R-A-P-D` and m². In the Terai, `B-K-D` is shown first. One global toggle switches units.

### 4.3 Listing page, land: "fly to the plot"

The page opens with photos and price instantly (server-rendered). The map hero loads after the main content has rendered (after LCP), then:

1. The camera flies from the area to the parcel. **The outline draws itself** (animated line), then **tilts into 3D terrain and slowly orbits**. The user can drag, and a pause control is always visible.
2. **Fact strip** (tabular numerals):
   - Area: `0-8-2-0 (4,201 sq ft · 390 m²)`
   - Road: `Motorable, ~4 m, 30 m to blacktop`
   - Facing: `South-east`
   - Slope: `Gentle 6°`
   - Elevation: `1,412 m`
3. **"What you'll see"**: a **Himalaya view check** computed from the elevation model. It is a line-of-sight test from the plot to named peaks (Langtang Lirung, Gauri Shankar, Ganesh Himal…), shown as a panorama silhouette with the visible peaks labelled. **No portal anywhere does this**, it matters a lot for Nepali buyers, and it can be computed in advance.
4. **Sun & seasons**: a sun-path arc over the parcel for winter and summer solstice, with daylight hours.
5. **Price honesty panel**: the asking price per aana, **the government minimum valuation for that ward**, and **the market range for that area** (our H3 data), each with its source and date.
6. **Verification ledger**: each check shows who checked it and when:
   - ownership certificate seen and matched to the plot number
   - owner ID checked
   - site visited
   - road confirmed
   - re-confirmed available

   It **expires after 30 days** unless re-confirmed.
7. **Regulatory flags**: subdivision status of the municipality, land-use class (when known), and whether this deal is above Rs 3 crore (so a licensed broker is required).
8. **Contact**: WhatsApp or Viber deep link, or an in-app message. The **scam guard** appears on first contact ("never pay before a site visit; we never ask for form fees").
9. **For NRNs** (shown to visitors abroad by IP and currency): an eligibility note, PoA steps, and a "Book a live video walk" button.

### 4.4 Listing page, home/flat/room

- A five-image photo grid. Tapping it opens a full-screen gallery grouped by room.
- **Shared-element transition** from the search card image to the gallery.
- Media tabs: **Photos · 360° · Floor plan · Map · Video**. Then **3D** (Phase 3: drone or phone captures rendered with Spark).
- **Rentals:**
  - the full monthly cost: rent, deposit (months), water/electricity arrangement, parking, broker fee **("0" badge when owner-direct)**;
  - nearby services within walking distance;
  - commute time.
- **Sale:** an EMI calculator using current bank rates and NRB loan-to-value rules (80% first home, 70% otherwise, cap Rs 3 crore).

### 4.5 Seller flow: "draw your land"

1. **Pin:** search by palika/ward/tole/landmark (our place index + Baato). The map flies there in satellite view and the seller drags the pin onto their plot.
2. **Parcel:** the seller traces the boundary on satellite imagery (terra-draw). Live area is shown in R-A-P-D. If the traced area differs from the area on their certificate by more than 10%, a nudge appears. Optionally they upload the cadastral map sheet (*naksa*) to trace over.
3. **Details:** intent (sell/lease/rent) and price. Lease models come from the PRD (fixed, *bataiya* harvest-share, lease-to-own). Then road and water.
4. **Media:** phone photos (thumbnail placeholder, compressed upload), an optional 360° photo, and an optional booked **drone shoot** (paid).
5. **Verification:** upload the certificate and ID **privately** (operators only, never public). Choose the verification tier.

### 4.6 Diaspora (NRN) mode

- A currency toggle that shows the NPR price converted to USD/AUD/GBP/AED/JPY, with the conversion rate.
- **Shared shortlist boards** (like Compass Collections): invite family in Nepal, comment on each listing, and vote.
- **Live video viewings**, booked with a field agent who walks the plot boundary in GPS mode.
- A guided checklist: eligibility, PoA at the embassy, the land revenue office process, and tax/fee estimates.

### 4.7 Field mode (Phase 2): walk the boundary

On a phone at the plot, the map shows the parcel outline and your live GPS dot ("you are inside the boundary"). It works offline once the area has been cached.

---

## 5. Design system: "Himalayan editorial"

| Element | Direction |
|---|---|
| **Feel** | Calm, editorial, tactile. A magazine about land, not a classifieds board. The map imagery and terrain are the colour; the interface frame stays quiet. |
| **Palette** | Warm paper neutrals (light) and deep slate-night (dark). Primary: deep pine/rhododendron-forest green. Accent: **saffron/marigold** for price and calls to action. A *verified* colour separate from the brand colour, so the badge always reads as status. All colours defined as tokens with light and dark values. |
| **Type** | A display serif for headings and prices (e.g. Fraunces / Instrument Serif), a neutral sans for the interface (Inter / Geist), **Mukta or Noto Sans Devanagari** for Nepali, checked against the Latin fonts for matching visual size and weight. **Tabular numerals** for every price and area. |
| **Surfaces over the map** | Frosted panels (sheets, filter pills, mini-cards), with a solid fallback that guarantees WCAG AA text contrast over busy satellite imagery. |
| **Motion language** | Spring physics (Motion) for the bottom sheet, cards and pins. Easing `flyTo` for the camera. CSS View Transitions for list↔detail. GSAP only for scripted sequences on marketing pages. |
| **Iconography** | One line-icon set (Lucide is already in the repo). Custom, slightly dimensional glyphs for property types (terraced plot, ghar, flat, room, farmland). |
| **Components** | shadcn/ui + Radix on Tailwind 4. A custom bottom sheet built with Motion (Vaul hasn't had a release since Dec 2024). |

### Motion and performance guardrails

| Device tier | Detected by | Experience |
|---|---|---|
| **Low** | `deviceMemory` ≤ 4, ≤ 4 cores, `Save-Data`, slower than 4G, or no WebGL2 | 2D map, `jumpTo` (instant camera moves), static terrain poster, no intro video, pixel ratio capped at 1.5 |
| **Mid** | default | Terrain at low exaggeration, `maxPitch` 60, globe only on the intro |
| **High** | good GPU, fast network | Full fly-tos, sky/fog, orbit, 3D extrusions, splats |

- `prefers-reduced-motion` turns fly-tos into crossfades and stops orbits and parallax.
- Anything that loops gets a pause control (WCAG 2.2.2).
- **Budgets:**
  - ≤ 170 KB gzipped JS before interaction on landing and listing pages;
  - the map chunk (about 440 KB gzipped including its worker) loads after LCP or on intent;
  - splat and 3D code (≥ 1 MB) lives only on the 3D tab;
  - LCP < 2.5 s and INP < 200 ms at p75 on a Redmi/Galaxy A-class phone over 4G in Kathmandu.

---

## 6. Technical architecture

### 6.1 Recommended stack (versions as of 2026-10-21)

| Layer | Choice | Why | Est. cost (100k → 1M map sessions/mo) |
|---|---|---|---|
| Framework | **Next.js 16.4 + React 19.3** (App Router), Vercel, functions in **bom1** (Mumbai) | `<ViewTransition>`, R3F 9 needs React 19; 15.5 only gets backports | ~$50–300 |
| Map | **MapLibre GL JS 6.15** via **react-map-gl 8.1** (`/maplibre`) | Globe, terrain, `flyTo`, BSD licence, no per-load fee. Leaflet can't do 3D | $0 |
| Basemap | **Protomaps PMTiles** (Nepal extract) on **Cloudflare R2** + Worker | Cloudflare has a **Kathmandu PoP**; own styling | ~$5 → $60 |
| Terrain | **Mapterhorn / Copernicus GLO-30** terrarium PMTiles on R2; multidirectional hillshade; `maplibre-contour` | Best open Himalayan elevation data | incl. above |
| Satellite | Opt-in layer: Esri World Imagery (Location Platform) or MapTiler Satellite; **drone orthophotos** for premium listings | Only metered when switched on | ~$50 → $500 **[verify]** |
| Geocoding | **Own place index** (province → district → palika → ward → tole/landmark, Devanagari + romanised) + **Baato** + Plus Codes | No street addresses | Baato quote |
| DB | Postgres + **PostGIS** (Mumbai region), **Prisma 7.x** (pin it; npm `latest` points to 8.0 RC) for CRUD + **Kysely/TypedSQL** for spatial queries | Prisma has no geometry type | $25–100 |
| Listings → map | GeoJSON + built-in clustering while < 20k listings → `ST_AsMVT` tile route with CDN cache → Martin when needed | No extra server early | ~$0 |
| Price heatmap | **H3** (h3-js 4.5) cells res 7–9, materialised view → `fill-extrusion` | Cheap, readable, SEO pages | $0 |
| Search | Postgres FTS + `pg_trgm` → **Typesense 30** (geo polygon, typo tolerance) | Bilingual fuzzy search | $0 → ~$100 |
| Parcel drawing | **terra-draw 1.38** + turf 7 geodesic area | Maintained, works with MapLibre | $0 |
| Elevation analysis | Offline job: slope/aspect/elevation per parcel; **Himalaya viewshed** to named peaks; sun path (suncalc) | Signature feature, computed in advance | compute only |
| 3D media | Phase 2: **Photo Sphere Viewer 5** (360°). Phase 3: **Spark 2.4** Gaussian splats on three r186 / R3F 9 | Realistic on mid-range Android | per capture |
| Motion/UI | **Motion 14** (`motion/react`), Tailwind 4.3, shadcn + Radix, GSAP 3.15 (marketing only), Lenis (never on map routes) | Modern, free | $0 |
| Media | Presigned upload to **R2**; Cloudflare Image Transformations (or sharp pre-generation); **ThumbHash**; Mux → Cloudflare Stream for video | No egress fees, KTM PoP | ~$5 → $150 |
| Auth | **Better Auth** (phone OTP via Sparrow/Aakash SMS + Google). next-auth 4 is in maintenance | Phone-first users | ~NPR 1/SMS |
| Payments | **Khalti KPG-2 + eSewa ePay v2**; Fonepay QR via bank | Featured listings, verification fees | % fee |
| i18n | **next-intl 4** (`/en`, `/ne`), Mukta, `Intl.NumberFormat('ne-NP')`, lakh/crore formatting, `nepali-datetime` for BS dates | Full EN/NE parity | $0 |
| AI (Phase 3) | Natural-language query → structured filters (Claude, tool use); listing Q&A over structured facts; duplicate photo detection (perceptual + embedding) | Standard on leading portals; only alongside filters | usage |

**Rough total:** ~$150–500/mo at 100k map sessions and ~$1–2.5k/mo at 1M. The same scale on Mapbox would add $3k+/mo for the map alone.

### 6.2 Serving layout

```
Browser (Nepal, mid-range Android)
 ├─ HTML/RSC ──────────► Vercel (bom1)  ── Postgres+PostGIS (Mumbai)
 │                                          └─ Typesense (later)
 ├─ basemap/terrain ───► Cloudflare Worker ── R2 (PMTiles: nepal.pmtiles, terrain.pmtiles)
 ├─ listing tiles ─────► Vercel route /tiles/{z}/{x}/{y}.mvt (ST_AsMVT, s-maxage)
 ├─ images/video ──────► Cloudflare Images on R2 / Mux
 └─ geocode ───────────► own place index (Postgres) → Baato fallback
```

### 6.3 Data model (target, extends the current schema)

| Entity | Fields / notes |
|---|---|
| **Place** | Gazetteer: `level` (province/district/palika/ward/tole/landmark), `nameEn`, `nameNe`, `aliases[]`, `geom`, `parentId` |
| **Property** | `kind` (land/house/flat/room/commercial/farmland), `placeId`, `point geography`, `parcel geometry(MultiPolygon,4326)` (nullable, written via SQL), `parcelSource` (seller-traced / blueprint-traced / surveyor-verified), `areaM2`, `kittaNo`, `sheetNo` (private), `roadWidthM`, `roadType`, `distanceToBlacktopM`, `water`, `elevationM`, `slopeDeg`, `aspect`, `viewPeaks[]`, `h3_7/8/9` |
| **Listing** | `propertyId`, `intent` (sale/lease/rent), `price`, `priceBasis` (total/per-aana/per-month/per-ropani-per-year), `leaseModels[]` (fixed/bataiya/lease-to-own, from the PRD), `status` (draft/review/published/paused/sold/expired), `source` (owner/agent/developer), `agentId?`, `publishedAt`, `confirmedAt` |
| **Media** | `listingId`, `type` (photo/pano360/video/floorplan/drone-ortho/splat), `url`, `thumbhash`, `room`, `isStaged` (forces a label), `phash` (duplicate detection) |
| **VerificationCheck** | `listingId`, `kind` (certificate-seen, plot-number-matched, owner-ID, site-visit, road-confirmed, availability-reconfirmed), `by`, `at`, `expiresAt`, `evidenceRef` (private), `result` |
| **ValuationRef** | `placeId` (ward), `fiscalYear`, `govRatePerAana`, `source` |
| **PriceCell** | materialised: `h3`, `kind`, `medianPerAana`, `p25`, `p75`, `n`, `asOf` |
| **Inquiry / Lead** | `listingId`, `fromUserId`, `channel` (app/WhatsApp/Viber/call), `status` |
| **Board / BoardItem / Comment** | Shared shortlists for families |
| **SavedSearch** | `filters`, `polygon?`, `alertChannel`, `cadence` |
| **Org / Agent** | `licenceNo?`, `licenceVerifiedAt?`, verified deal count |
| **Lease, LedgerEntry, AuditEvent** | **Kept from the PRD**; used by the lease/farmland vertical |
| **Plot** (existing) | Migrated into Property (`kind=farmland`) + Listing |

**Privacy rules:**
- Ownership certificates, ID documents and plot/sheet numbers are **never public**.
- Data is collected with consent and used only for verification (Privacy Act 2075).
- Precise parcel outlines are public only after the owner confirms. Before that, the map shows an approximate ~100 m circle.

---

## 7. Trust and verification operations (the moat)

| Tier | Badge | Checks | Who pays |
|---|---|---|---|
| **Listed** | none | Phone OTP; automatic checks: duplicate photos, phone numbers inside photos, price outliers | Free |
| **Owner-verified** | ✓ Owner | Owner ID + ownership certificate seen + plot number matched to the drawn outline (operator review) | Small fee, or free while launching |
| **Site-verified** | ✓✓ Site | Field agent visit: geotagged photos, road width measured, boundary walked with GPS | Paid |
| **Premium media** | 3D | Drone orthophoto + (Phase 3) splat flyover | Paid package |

- **Every badge shows its checks and dates, and expires.** A listing that isn't re-confirmed within 30 days drops to "Unconfirmed", and after 60 days it is hidden from search.
- **Parcel honesty:** the outline is labelled with its source ("Traced by seller", "Traced from cadastral map sheet", "Surveyor-verified"). The text says *"Approximate boundary — confirm with a licensed surveyor (amin)"* until a surveyor has verified it.
- **Fraud signals:**
  - the same parcel outline or photos under different listers;
  - the asking price far below the market range ("too good to be true");
  - accounts created recently that post many listings;
  - plot numbers in the districts whose offices were burned in 2025. The offices are known, so we show a "records under reconstruction" note.
- **No made-up locations:** the current `NepalMapInner.tsx` places plots that have no coordinates in a "golden-angle" pattern of fake points around Kathmandu. That must be removed. A listing with no real location doesn't appear on the map.

---

## 8. Business model

| Stream | Phase | Note |
|---|---|---|
| Free listings for owners | 1 | Supply first (the NoBroker lesson) |
| Paid verification tiers + drone media packages | 1–3 | Also our main way to stand out |
| Featured / boosted placement (Khalti/eSewa) | 2 | Only for verified listings, so paid placement never puts junk on top |
| Agent / agency subscriptions | 2 | Branded profile, lead inbox, licence badge, verified deal record |
| **Lease facilitation fee** (farmland vertical) | 1 | Existing PRD money event |
| Rental services: digital deposit, rental agreement template, move-in checklist | 2–3 | Revenue from services, not commission (NoBroker) |
| NRN concierge (remote viewing, PoA coordination with legal partners) | 3 | High value per customer |
| Price data / reports (banks, valuers, developers) | 3+ | Once the price index has enough data behind it |

**Compliance before money flows:**
- register under the **E-Commerce Directive 2082**;
- set up a Nepal entity with PAN/VAT (also needed for Khalti/eSewa/Fonepay onboarding);
- get a legal opinion on whether facilitating deals above Rs 3 crore requires the **broker licence**.

---

## 9. Roadmap

### Phase 0 — Foundation + risk spikes (≈ 3 weeks)

**Upgrade and cleanup:**
- Next 16 / React 19 / Tailwind 4 / Motion 14
- Prisma 7 + PostGIS
- next-intl replaces the current mixed `/[lang]` setup
- Better Auth
- remove the fake map coordinates
- CI with lint, types and a build

**Spikes that answer the riskiest questions first:**

1. **Mid-range Android test:** MapLibre 6 terrain + globe intro + `flyTo` + 2k clustered pins on a Redmi/Galaxy A phone over 4G. Measure FPS, memory and time to interactive, then set the device-tier thresholds from the results.
2. **Parcel drawing usability test:** 5 real landowners trace their plot on satellite imagery with terra-draw. Can they do it, and how close is the traced area to their certificate?
3. **Geocoding comparison:** Baato vs Galli vs our own place index on 200 real seller-entered locations, in Devanagari and romanised spellings.
4. **Imagery check:** Esri vs MapTiler satellite over 20 sample plots (Valley, hills, Terai). Compare resolution and capture date, and get the licence terms in writing.
5. **Network path:** do NTC, Ncell and WorldLink reach Cloudflare's KTM PoP? Measure PMTiles fetch latency.
6. **Himalaya viewshed proof of concept:** compute which peaks are visible from 10 known plots and check against reality (photos from those plots).

**Exit criteria:** every spike has a written result in `LOG.md`; device tiers are defined from measurements; there is a go/no-go on satellite provider and geocoder.

### Phase 1 — Land in the Valley (MVP, ≈ 10–12 weeks)

**Scope:**
- **Discovery:**
  - home page with intro fly-in and bilingual keyword search (natural language comes later);
  - map search with price pins, clusters, parcel outlines, draw-area, and layers (terrain, satellite, slope, roads, subdivision freeze, price hexes once n ≥ 5 per cell);
  - land listing page: fly-to, outline drawing itself, 3D orbit, fact strip, Himalaya view, sun path, price honesty panel, verification ledger, regulatory flags, WhatsApp/Viber contact with scam guard.
- **Seller side:**
  - seller flow (pin → trace → details → media → private documents);
  - **agent and agency accounts** (basic profile, listings under their name, the source label on every card, licence number field for deals above Rs 3 crore);
  - operator console (verification queue, moderation, duplicate flags, audit log);
  - the farmland lease vertical runs on the PRD's existing lifecycle.
- **Tools and polish:** unit converter, EN/NE parity, area pages for ~30 Valley palika/wards.

**Acceptance criteria (draft):**
- On a Galaxy A-class phone over 4G in Kathmandu, the listing page reaches LCP < 2.5 s at p75, and the map becomes interactive < 4 s after LCP.
- The low tier never loads terrain or the intro video.
- Every published land listing has a real point. ≥ 80% have a parcel outline with a labelled source. 0 listings use made-up coordinates.
- Every area figure shows R-A-P-D and m²; the converter matches the reference table exactly (1 ropani = 508.72 m²).
- Verification badges show their checks and dates and expire on schedule. An automated test covers the move to "Unconfirmed" at day 30.
- Certificate and ID documents are reachable only by the operator role (server-side RBAC test).
- `prefers-reduced-motion` turns off every fly-to, orbit and intro (Playwright test).
- At launch: ≥ 300 verified Valley land listings with outlines.

**Metrics:**
- **North star:** verified active listings that get ≥ 1 qualified lead within 14 days.
- **Also tracked:** lead rate per listing view; % of listings with an outline; time to verify; repeat visits per week; seller NPS.

### Phase 2 — Homes and rentals (≈ 10 weeks)

- Flats, houses and rooms for rent and sale in Kathmandu, Lalitpur and Bhaktapur.
- 360° tours, floor plans, full monthly rental cost, commute-time search.
- Saved searches + alerts (email, push, WhatsApp template).
- Shared shortlist boards.
- Featured listings and verification fees via Khalti/eSewa.
- Agent subscriptions (lead inbox, branded profile) + verified licence badge + verified deal record.
- Field mode (walk the boundary, offline).
- Duplicate photo detection.

### Phase 3 — Premium, diaspora, expansion

- Drone orthophoto + **Gaussian-splat flyovers** (Spark) as a paid package.
- NRN hub: currency conversion, live video viewings, PoA partners.
- **Natural-language search (EN/NE) and Q&A on listings**, answered from the listing's structured data.
- Labelled AI virtual staging.
- Pokhara and Chitwan (Terai units first).
- Public price index pages.
- Farmland suitability layers (irrigation, soil where available).

---

## 10. Risks

| Risk | Mitigation |
|---|---|
| **Liquidity:** an empty map | Narrow wedge (Valley land), hand-sourced supply, agency partners, farm-lease concierge supply; don't launch below 300 verified listings |
| **Parcel accuracy / liability** | Every outline labelled with its source and marked approximate; surveyor tier; never claim a legal boundary; keep a dispute path |
| **No official land data API; records burned in 2025** | Manual verification ops; record evidence privately; flag the affected districts |
| **3D cost on weak phones** | Device tiers from Phase 0 measurements; static fallbacks; 3D only on tap |
| **Satellite licensing and cost** | Satellite layer is opt-in; get licence terms in writing; drone orthophotos for premium |
| **Regulation** (broker licence, E-Commerce registration, Privacy Act) | Get a legal opinion in Phase 0; register before taking payments |
| **Incumbents copy the map** | Our moat is verification ops + parcel data + price data, not the map itself |
| **Content risk from price/risk layers** (the Zillow climate-score lesson) | Cite the source and date for every layer; let owners dispute; show the government valuation as a reference, not a judgement |

## 11. Decisions and open questions

**Decided (2026-10-21)**
1. **Scope:** the portal supersedes the PRD's phasing; farmland leasing is one vertical.
2. **Brand: Thaun** (ठाउँ, "place"). It covers land, homes and rooms equally and is easy to say for locals and the diaspora. "Kathmandu Valley Farm" stays only as the farmland vertical's working label. **To do before public use:** register thaun.com.np (needs a Nepali company) and thaun.app; ask about buying the parked thaun.com; run a trademark search at the Department of Industry.
3. **Agents welcome from day one.** Every card shows its source (Owner / Agent / Licensed agency / Developer). There's a filter for owner-direct listings and listings with zero broker fee. Agent ranking comes from verified activity, not payment alone.
4. **Land ceiling, answered:** still **25 ropani in the Valley** (70 hills / 10 bigha Terai), per person including family, Lands Act s.7, unchanged since 2001. NRN buyers: **2 ropani in the Valley, one purchase**, with MoFA approval. Details in `PORTAL_MARKET_RESEARCH.md` §5.

5. **Priority audiences:** **sellers publishing listings** and **international buyers, both serious and curious** (NRNs and foreigners). The seller flow and the From-abroad hub get the most product attention. Eligibility is explained plainly: foreigners can't own land, and NRN card holders can buy one property of up to 2 ropani in the Valley.
6. **Repo strategy:** **grow out of `farm-life`**. Its roots stay visible in the product: farmland as a first-class category, the honest farm planner, water-first verification, and fair recorded leases (fixed, bataiya, lease-to-own).

**Still open**
7. **Ops capacity:** who does site visits in Phase 1, and how many verifications a week can we afford?

## 12. Suggested next steps

> **Prototype built (2026-10-21):** `prototype/thaun/`. See its README for how to run it and what it taught us. Its two priority audiences are sellers publishing land and buyers abroad; the farm-life roots carry through as farmland, the honest planner and lease models.

1. You decide on §11 Q1–Q3.
2. ~~**Clickable visual prototype**~~ (done) of the three signature screens (home fly-in, map search with bottom sheet, land listing with 3D orbit), running real MapLibre + terrain over the Valley, to align on look and feel before Phase 0.
3. Phase 0 spikes 1–6, recorded in the product log, then turn Phase 1 into stories with acceptance criteria.
