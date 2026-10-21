# Market Research — Thaun, a Map-First Property Portal for Nepal

| | |
|---|---|
| **Question** | What would a "Zillow / Redfin for Nepal" need to be (land for sale or lease, houses and flats for sale or rent), and what is state of the art? |
| **Date** | 2026-10-21 |
| **Companion docs** | `PORTAL_PLAN.md` (the plan this research feeds), `PRD.md` (current farmland-lease scope), `PLAN_REVIEW.md` |
| **Method** | Desk research from 2024–2026 sources, package registries and vendor pricing pages. Traffic numbers are Similarweb estimates (web only, rough). Items marked **[unverified]** need checking before anyone relies on them. |

---

## 1. Summary

1. **Nobody owns property search in Nepal.** Deals still move through brokers (*dalal*), room-finder shops, Facebook, TikTok and HamroBazar. The largest specialist portal, Gharghaderi, had about **43K web visits in 3 months** (Similarweb, Sep 2026), which is tiny. Searchers move between portals freely (80–100% audience overlap), so inventory is split across them.
2. **No Nepali portal offers map-first search, parcel boundaries, or a "verified" badge with a published meaning.** One (GharBazar) shows a map on its listing pages. Data quality is poor: one portal's rent feed lists an 8,073 sq ft office at Rs 6,900 and a flat at "Rs 1".
3. **The market is recovering fast.** Land transaction value roughly **doubled in FY 2082/83, from Rs 386bn to Rs 721bn**, and Kathmandu Metropolitan transaction value rose **217%**. Remittances hit a record **~Rs 2.36 trillion (+37%)**. NRB raised the home-loan cap to Rs 3 crore with LTV up to 80% for a first home.
4. **Trust is the core problem.** Common failures:
   - forged ownership certificates (*lalpurja*);
   - land resold after it was pledged as loan collateral;
   - plots without road access;
   - the Rs 500 "room form fee" scam;
   - broker fees nobody can check.

   On top of that, **21 Land Revenue Offices were burned** in the Sept 2025 protests (about 1M records reported destroyed), and subdivision is **frozen in 363 of 753 local levels** (July 2026).
5. **Parcel boundaries matter more in Nepal than in the US.** There are no street addresses, the hill terrain decides what can be built and what view a plot has, and land is measured in ropani-aana or bigha-kattha. The best global land portals (Land id, LandSearch) put the **parcel boundary on satellite imagery with a 3D terrain fly-over** at the centre of the listing. Nobody in Nepal does this.
6. **The tech for a premium 3D map experience is now cheap and open.** MapLibre GL JS 6 (globe and terrain), self-hosted Protomaps tiles, and open Copernicus 30 m elevation data cost almost nothing per map load. The same scale on Mapbox costs about $3k/month at 1M loads.

**The opportunity in one sentence:** be the first portal in Nepal where every listing is pinned to a real, outlined parcel on a 3D map, priced against public benchmarks, and backed by a verification badge with a published meaning that expires.

---

## 2. The Nepali competitive landscape

| Portal | Offers | Traffic (3-mo visits, Sep 2026) | Map | Verification | Money | Weakness |
|---|---|---|---|---|---|---|
| **HamroBazar** (general classifieds) | Property category alongside everything else | ~427K (#55 in Nepal; 10% US) | No | "Verified seller", bans reported fraudsters | Free | Not a property product; a known channel for room scams; no structured land data |
| **Gharghaderi** | Sale and rent: house, land, plotting land, flat, office | ~43K (+43% month on month), the **largest specialist** | No | "Verified properties" with no stated method | Paid ads, "post demand" | Bad data, mostly high-end Kathmandu, no app |
| **Nepal Homes** (PropTech Nepal) | Buy and rent, including agricultural land | ~27K | No | None described | Featured/premium, syndicated to OnlineKhabar and Hamro Patro | Agency-fed (one agency has 2.4K listings), generic UI |
| **Lalpurja Nepal** | Listings | ~9K | ? | ? | ? | Not inspected |
| **RealEstateinNepal** | Sale and rent, including hotels | ~8K | No | Shows its government licence number | Top/Premium/Featured tiers | Dated UI |
| **Basobaas** (2014, seed 2018) | Residential and commercial | ~7K | ? | ? | ? | Claims to lead the market, but its traffic has faded |
| **GharBazar** | Houses, land; EMI calculator and unit converter | ~6K (−36%) | **Map on listing pages** | None | Tiered | iOS app last updated 2024 |
| **Aafnai Ghar** (2026, new) | Land (agricultural, residential, commercial), houses | Tiny | No | None | ? | ~250 listings in total; good EN/NE, compare and WhatsApp features |

Smaller sites (99aana, PropertyKarobar, RentalNepal, gharjagganepal, nepalpropertybazaar, meroproperty and others) are similar: classifieds with no map.

**Signals worth tracking:**
- **Himalayan Realtors** became the **first government-licensed real estate brokerage** in March 2026.
- **Zila LandKit** is a Chrome extension that compares listings with the government minimum valuation ("Price X-Ray"). It has only a handful of users, but it shows buyers want to know whether a price is fair.
- I found **no proptech funding rounds or map-first launches in Nepal in 2025–26**.

## 3. How people actually find property today

- **Land and houses:** local brokers who work one area, plus friends and relatives. Brokers control deals informally because the rules are unclear (OnlineKhabar 2023, Himalayan Times).
- **Rooms and flats:** Kathmandu Post investigated this in February 2026.
  - Street brokers approach newcomers within minutes.
  - Room-finder shops charge **Rs 500 to register, then Rs 2,000 for a room, Rs 3,000 for two rooms or Rs 4,000 for a flat**, and landlords pay them as well.
  - Seekers find these shops through **TikTok and Facebook**.
  - No regulator covers rental brokerage.
- **Video:** YouTube channels that tour properties ("Real Estate Of Nepal", about 1.6M views). I could not measure how big Facebook groups or TikTok are **[unverified]**.
- **Diaspora (NRN):** a Biratnagar firm reports regular online buyers in Germany, the UAE, Australia and the UK. **7–30% of portal traffic comes from the US.** NRNs generally need a power of attorney signed in person at an embassy, so they usually buy through a proxy.
- **Fraud patterns to design against:**
  - forged *lalpurja* sold with help from Land Revenue Office insiders (Bhaktapur, Rs 117M);
  - plots that don't exist (Birgunj, Rs 80 lakh);
  - land resold after being pledged as loan collateral (Nawalparasi);
  - grabs of government land (Lalita Niwas, Rs 18bn+);
  - advance-fee rental scams.
- **Prices nobody can check:** the government valuation is "almost always much lower" than market price, often 2–5× lower in prime Kathmandu. The deed value (*thaili*) follows the government rate, so real sale prices aren't public.

## 4. Market data

### Transactions (NRB / Department of Land Management and Archive)

| FY | Transaction value | Notes |
|---|---|---|
| 2081/82 (2024/25) | Rs 386bn | Q4 was a record 456K transactions |
| 2082/83 (2025/26) | **Rs 721bn** | Transaction count +4.7%; revenue +48%; capital gains tax +63%; bank real estate lending +6.9% |

- **Kathmandu Metropolitan, FY 2082/83:** transaction value +217%, land area +208%.
- **Lalitpur:** Q4 transaction count +137%.
- **Most-traded plot size nationally:** 2.5–10 aana.
- **New public data feed:** NRB started a quarterly **real estate status report** in April 2026, which can feed our price trends.

### Indicative land prices (Merokalam guide, data May 2026)

| Area | Rs per aana |
|---|---|
| Inside Ring Road (Baneshwor, Putalisadak) | 40–75 lakh |
| Koteshwor / Tinkune | 25–45 lakh |
| Budhanilkantha / Dhumbarahi | 18–30 lakh |
| Sitapaila / Kalanki / Kirtipur | 12–22 lakh |
| Chandragiri / Nagarjun / Dakshinkali | 8–15 lakh |
| Lalitpur: Kupondole / Jawalakhel | 35–55 lakh |
| Lalitpur: Bhaisepati / Imadol | 20–35 lakh |
| Godawari | 10–18 lakh |
| Bhaktapur: Suryabinayak | 20–35 lakh |
| Pokhara Lakeside | 40–70 lakh |
| Chitwan (Bharatpur core) | 15–30 lakh **per kattha** |

**Example of the valuation gap:** an Imadol plot had a government valuation of Rs 21.8 lakh per aana and sold for Rs 47 lakh per aana.

### Rents (Numbeo, Kathmandu, Oct 2026)

| Unit | Average monthly rent | Range |
|---|---|---|
| 1-bedroom, centre | Rs 32.8K | Rs 20–62K |
| 1-bedroom, outside centre | Rs 15.6K | |
| 3-bedroom, centre | Rs 66K | Rs 45–140K |
| 3-bedroom, outside centre | Rs 30K | |

- **Rooms in Koteshwor:** Rs 13–15K (Kathmandu Post 2026).
- **Data gap:** there is no reliable rent data specific to Lalitpur or Bhaktapur.

### Demand and digital reach

| Measure | Figure | Source |
|---|---|---|
| Population | 29.6M | DataReportal 2026 |
| Internet users | **16.6M (56%)** | DataReportal 2026 |
| Facebook ad reach | 14.8M | DataReportal 2026 |
| Mobile broadband subscriptions | 27.6M | Telecom regulator |
| Phones | Mostly mid-range Android | StatCounter |
| Payments | Fonepay passed **1M QR transactions in a day** (2025); Khalti has merged with IME Pay; eSewa claims 10M+ users **[unverified]** | Various |

## 5. Regulation, land data and units

### Units
- **Hills and the Kathmandu Valley:** 1 ropani = 16 aana = 64 paisa = 256 daam = **508.72 m²** (5,476 sq ft).
- **Terai:** 1 bigha = 20 kattha = 400 dhur = **6,772.63 m²**.
- Ownership certificates write area as `R-A-P-D`. Mistakes in converting between units cause disputes, so the portal must show both systems and m².

### Ownership (checked against the law, 2026-10-21)

**Land ceiling: Lands Act 2021 s.7** (high confidence)
- The ceiling is **per person, counting their family**: spouse and children under 16 are added together.
- The figures have been unchanged since the 5th Amendment (2001):

| Area | Ceiling | Extra for a homestead |
|---|---|---|
| Kathmandu Valley | **25 ropani** | +5 ropani |
| Other hill/mountain areas | **70 ropani** | +5 ropani |
| Terai | **10 bigha** | +1 bigha |

- The 2020 8th Amendment (s.12A) only added a paid route to keep land above the ceiling.
- **Recent changes did not touch the ceiling:**
  - The Jan 2025 ordinance (exemptions for developers) was withdrawn, re-tabled as a bill, and lapsed when the House was dissolved in Sept 2025.
  - A Nov 2025 "Ninth Amendment" ordinance was approved by cabinet, but there is no evidence it was ever issued.
  - **Ordinance No. 11 of 2083 (13 Oct 2026)** is in force pending parliament. It covers land for government-owned institutions, landless Dalits and squatters. It renames land revenue (*Malpot*) offices to Land Administration offices and lets local governments register land. It does **not** change s.7.
- **The "~10 ropani (2025)" claim earlier in `PLAN_REVIEW.md` was wrong** and has been corrected.
- **Exemptions (s.12):** government, notified education, health and industrial bodies, Guthi, notified cooperatives, and diplomatic missions. Construction and real-estate companies have notified caps of 50 ropani (Valley), 100 ropani (hills) and 20 bigha (Terai) under the 2021 rules (secondary source).
- Whether *leased* land counts toward the ceiling was not checked.

**Foreigners** (high confidence)
- National Civil Code 2074 s.432: no transfer of immovable property to a foreigner without government approval. A transfer without approval is void and the property goes to the state.
- s.433: inherited land must be sold to a Nepali citizen within 3 years. This doesn't apply to holders of NRN citizenship.

**NRN cardholders: NRN Rules 2066, Rule 11** (high confidence)
- They may buy residential land in **one** location, approved by the Ministry of Foreign Affairs (MoFA):

| Location | Cap |
|---|---|
| Kathmandu Valley | **2 ropani** |
| Terai municipalities | 8 kattha |
| Other municipalities | 4 ropani |
| Terai rural municipalities | 1 bigha |
| Elsewhere | 10 ropani |

- Land they held earlier as Nepali citizens is exempt.
- An NRN bill was announced in Jul 2026 but has not passed.

### Subdivision (*kitta kat*)
- **The freeze:** under the Land Use Act 2019, subdivision is frozen wherever the local government hasn't classified land into its 10 categories. That was **363 of 753 local levels as of July 2026**.
- **Minimum plot sizes** (Land Use Rules 2079; medium-high confidence, secondary sources):

| Land | Minimum plot |
|---|---|
| Residential / commercial | **130 m²** (~4 aana) |
| Inside approved plotting programmes only (2023 amendment) | 80 m² |
| Agricultural, Valley | 500 m² |
| Agricultural, Terai | 675 m² |
| Agricultural, elsewhere | 1,000 m² |

- **KVDA plotting rules** (medium confidence): roads **≥ 6 m**, ≥ 5% open space, and a planning permit is required. KVDA froze about 1,200 non-compliant parcels in May 2025.
- **Land bank:** launched in Nov 2025 by the 3rd Land Use Rules amendment, to put idle farmland to use. Directly relevant to the farmland-lease vertical.

**Product implications:**
- An NRN mode must enforce **one purchase, 2 ropani in the Valley** and route buyers to the MoFA approval process.
- Listing pages can flag plots **under 130 m²** and plots on **roads under 6 m** as subdivision/plotting risks.
- The farm calculator's 25-ropani cap is correct.

**Sources for this section:**
- Lands Act (Law Commission English text): http://admin.theiguides.org/Media/Documents/LandAct1964.pdf
- Ordinance No. 11 of 2083: https://lawcommission.gov.np/content/13633/bhumi/
- Lokaantar, Sep 2026: https://lokaantar.com/story/328873/2026/9/15/khoj/jagga
- Fate of the 2025 bill: https://kathmandupost.com/national/2025/07/10/government-withdraws-controversial-land-bill-from-house-agenda-after-opposition-from-ruling-party
- Civil Code: https://faolex.fao.org/docs/pdf/nep209663.pdf
- NRN caps (MoFA): https://mofa.gov.np/pages/nrn-24/
- 2023 plot size amendment: https://www.onlinekhabar.com/2023/08/1352244
- KVDA freeze: https://nagariknews.nagariknetwork.com/economy/1476001-1747539168.html
- Developer caps (2021): https://clickmandu.com/2021/05/155917.html

### Broker licensing (new, 2025–26)
- **Who needs a licence:** firms doing property deals **above Rs 3 crore** in 6 metropolitan and 11 sub-metropolitan cities (Land Revenue Act s.26A/B; Regulations 2082).
- **Licence fee:** Rs 5–10 lakh.
- **Penalties:** up to Rs 25 lakh and/or 6 months in jail.
- **Not covered:** individual brokers, online portals and rental brokerage are not clearly in scope **[get a legal opinion]**.

### Cadastre and records
- **No open parcel data or API exists.**
- Cadastral maps are bought from the Survey Department or the National Geoportal.
- The government land systems are partly digital and not linked to each other: NeLIS (survey), LRIMS (ownership records) and MeroKitta (online map requests).
- **I found no public way to verify an ownership certificate online** (Nagarik App holds ID, not land) **[unverified]**.
- The **government minimum valuation** is published office by office each Shrawan 1, not as an open dataset.

### Compliance
- **E-Commerce Act 2081 / Directive 2082:** **registration with the Department of Commerce is mandatory** for online businesses (Aug 2026 notice), and misleading ads are banned.
- **Individual Privacy Act 2075:** collecting personal data needs consent, and data may be used only for the purpose it was collected.

### Addresses and maps
- There are no street addresses in practice; people use landmarks.
- Kathmandu Metropolitan's house numbering is about half complete.
- Ward 26 is piloting **NFC/QR plates with Plus Codes** (Oct 2025).
- **Google Street View launched in Nepal in Aug 2025** (Kathmandu plus about 60 cities).
- **Nepali map providers:**
  - **Baato.io**: OSM-based search, geocoding and routing, billed in NPR. It claims 200K free map loads a month.
  - **Galli Maps**: house-number search and 360° street imagery, but its developer API is weak.
- **OSM building coverage** in the Valley is good (Open Cities, 2015 earthquake mapping) and thins out beyond it.

## 6. What state of the art looks like globally (2025–2026)

### Map search
- **Desktop:** list and map side by side, with **price-label pins** ("NPR 85 L"), clusters that break apart as you zoom in, and hover linking each card to its pin.
- **Mobile:** a **bottom sheet over a full-screen map** with peek, half and full positions (Google Maps 2024–25, Airbnb, Zillow).
- **Choosing which pins to show is a ranking problem.** Airbnb's KDD 2024 paper reports a 21% drop in impressions needed before booking when the map shows fewer, better pins.
- **Drawing a search area** (Rightmove reported a 37% lift after rebuilding it) and **travel-time search** (Zoopla).
- **Layers** behind one button.
- **Price heatmaps** that also work as search-engine landing pages (Idealista, Housing.com Price Trend Engine).

### Land listings
These patterns come from Land id, LandSearch, AcreValue and AcreTrader.
- **The parcel outline on satellite imagery is the hero element.**
- An **auto-spinning 3D terrain tour** that can be shared without logging in.
- Contour, hillshade and slope layers.
- Road, water and power-line layers.
- An **offline "walk the boundary" mode with GPS**.
- A due-diligence report on the plot.

### 3D and media
- **Zillow SkyTour** (Jul 2025) brings **drone-captured Gaussian splats** to a major portal for the first time. Apartments.com has a Matterport 3D exterior.
- **Realtor.com FlyAround** builds a 3D orbit from Google's 3D map tiles with no shoot needed. Google has little or no photorealistic 3D coverage of Nepal, so here **drone capture is the only route to "wow" 3D**.
- Zillow builds AI floor plans from 360° photos.
- Beike/Realsee runs **agent-guided shared VR tours**, which suit a diaspora buyer viewing remotely.

### AI
- **Natural-language search is now standard and always sits alongside filters:**
  - Redfin (Nov 2025): about 2× listings viewed and +47% tour requests;
  - Zillow AI mode (Mar 2026);
  - Rightmove (Feb 2026);
  - Realtor.com RealAssist (Jun 2026);
  - REA.
- **Portals also run apps inside ChatGPT:** Zillow, Redfin and Rightmove.
- **Q&A on each listing:** Ask Rightmove.
- **AI virtual staging** must be labelled. California AB 723 (Oct 2025) requires disclosure and a link to the original photo.
- **Detecting duplicate and recycled photos** matters at scale. Vendors claim up to 20% of portal listings are duplicates.

### Trust
- **Badges that expire unless the listing is re-confirmed:** Bayut TruCheck, PropertyGuru Verified (2.6× views, by its own claim).
- **Agent scores built from verified transactions:** Bayut TruBroker.
- **Listing source on every card** (owner, agent or developer), plus owner-direct options (NoBroker, whose revenue comes from services, not commission).
- **Scam warnings at the moment of first contact.**
- **Lesson from Zillow's climate-risk scores**, removed Dec 2025 after agents complained: risk layers need a cited source and a dispute path.

### Premium motion
- **Shared-element transitions:** the View Transitions API for same-page changes became Baseline in Oct 2025.
- **Camera choreography:** globe → country → valley → parcel `flyTo`, a tilt into terrain, and the parcel outline drawing itself.
- **A dimensional, tactile style** (Airbnb's 2025 relaunch), with an editorial serif for headings and prices.
- **Awwwards-level WebGL** is used on *developer campaign microsites*. The big portals keep search fast and plain and save rich 3D for the hero of each listing.
- **Guardrails:**
  - INP ≤ 200 ms;
  - 3D loads only when the user taps, with a poster image shown first;
  - respect `prefers-reduced-motion`;
  - a pause control on anything that loops (WCAG 2.2.2).

## 7. Gaps a new portal can own

| # | Gap | Why it matters in Nepal |
|---|---|---|
| 1 | **Parcel-pinned, map-first search** | No addresses; nobody does it |
| 2 | **3D terrain plus slope, aspect, road and water for every land listing** | Hill terrain decides whether land can be built on, what view it has, and its price |
| 3 | **A verification badge with a published meaning that expires** (ownership certificate seen, owner identity checked, site visited, re-confirmed) | Forgery, double-selling and stale listings |
| 4 | **Price transparency:** asking price vs government valuation vs local market range, and price per aana heatmaps | Prices nobody can check, set by brokers |
| 5 | **Regulatory flags per parcel:** subdivision freeze, land-use class, plotting permit, licensed broker | 363 local levels frozen; licensing rule for deals above Rs 3 crore |
| 6 | **Farmland and land for lease as a first-class category** | No portal does it; the land bank launched in Nov 2025; this is our existing PRD |
| 7 | **Rentals with no scams:** verified landlords, no upfront fees, digital deposit | Rs 500 scams and broker fees; people search often, which drives repeat visits |
| 8 | **A mode for diaspora (NRN) buyers:** remote live tours, eligibility checks, power-of-attorney partners, a shortlist shared with family | Record remittances; 7–30% of portal traffic from abroad |
| 9 | **Bilingual, unit-aware, clean data** | The incumbents fail at the basics |

---

## Sources

**Nepal market**
- Similarweb (Sep 2026): hamrobazaar.com, gharghaderi.com, nepalhomes.com, basobaas.com, gharbazar.com, realestateinnepal.com, lalpurjanepal.com.np, propertykarobar.com, rentalnepal.com
- https://kathmandupost.com/valley/2026/02/15/the-murky-business-of-room-finding-in-kathmandu
- https://kathmandupost.com/valley/2023/01/30/the-risks-of-renting-rooms-online-in-kathmandu
- https://english.onlinekhabar.com/real-estate-transactions-nearly-double-kathmandu-metropolitan-city-records-highest-growth.html
- https://nepsetrading.com/news/real-estate-market-bounces-back-transaction-value-nearly-doubles-in-a-year
- https://www.nrb.org.np/contents/uploads/2026/04/A-Report-on-the-Status-of-Real-Estate-Market-in-Nepal.pdf
- https://merokalam.com/blog/land-price-kathmandu-pokhara/
- https://www.numbeo.com/cost-of-living/in/Kathmandu
- https://www.sharesansar.com/newsdetail/monetary-policy-update-higher-loan-limits-offer-major-credit-relief-for-housing-shares-and-digital-lending-2026-07-07
- https://english.ratopati.com/story/76530/235-trillion-remittances-entered-in-one-year-371-percent-more-than-last-year
- https://datareportal.com/reports/digital-2026-nepal
- https://www.sharesansar.com/newsdetail/himalayan-realtors-becomes-first-government-licensed-real-estate-brokerage-in-nepal-2026-03-01
- https://nitipartners.com/new-land-sale-license-rule-in-nepal-who-must-comply-from-2026/
- https://kathmandupost.com/national/2026/07/22/land-subdivision-halted-again-in-363-local-governments-over-classification-delays
- https://kathmandupost.com/columns/2026/08/15/the-state-kept-only-one-copy
- https://ekantipur.com/news/2025/11/16/en/how-does-a-land-bank-work-understand-in-five-questions-and-answers-59-10.html
- https://www.fig.net/resources/proceedings/fig_proceedings/fig2021/papers/ts07.2/TS07.2_thapa_10910.pdf
- https://www.hamropatro.com/en/news/detail/4639130139724541-running-an-online-business-in-nepal-registration-is-mandatory-unregistered
- https://blog.google/products/maps/nepal-street-view/
- https://english.onlinekhabar.com/kmc-launches-new-digital-address-system.html
- https://baato.io
- https://b360nepal.com/galli-maps-the-demand-for-location-data-will-only-get-bigger/
- https://en.wikipedia.org/wiki/Nepalese_customary_units_of_measurement
- https://nitipartners.com/nrn-property-rights-nepal-2026/

**Global state of the art**
- https://zillow.mediaroom.com/2025-07-15-Summer-just-got-hotter-Zillow-debuts-five-powerful-new-features
- https://radiancefields.com/zillow-adds-gaussian-splatting-support-with-skytour-unveiling
- https://www.inman.com/2026/03/25/zillow-goes-ai-mode-with-new-home-search-assistant/
- https://techcrunch.com/2025/12/01/zillow-drops-climate-risk-scores-after-agents-complained-of-lost-sales
- https://www.businesswire.com/news/home/20251113066597/en/Redfin-Debuts-Conversational-Search-to-Reinvent-How-People-Find-Homes
- https://www.inman.com/2025/10/30/realtor-coms-flyaround-offers-a-birds-eye-view-of-the-market/
- https://www.estateagenttoday.co.uk/breaking-news/2026/02/rightmove-launches-latest-phase-of-ai-powered-property-search/
- https://traveltime.com/blog/isochrone-map-tool-case-study-zoopla
- https://myagentofferings.propertygurugroup.com/tools/verified-listings/
- https://www.bayut.com/mybayut/trucheck-bayut-uae
- https://housing.com/news/housing-com-launches-ai-powered-price-trend-engine-for-home-search
- https://arxiv.org/pdf/2407.00091 (Airbnb, Learning to Rank for Maps)
- https://id.land/product/3d-tour
- https://www.mapbox.com/blog/3d-maps-on-landsearch-com
- https://acretrader.com/learn/acretrader-101/investment-due-diligence-process
- https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available
- https://beverlyhillscourier.com/2025/11/23/californias-new-disclosure-rule-for-digitally-altered-real-estate-marketing/

**Tech and pricing:** see the sources in `PORTAL_PLAN.md` §6.
