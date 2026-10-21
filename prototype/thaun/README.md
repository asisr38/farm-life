# Thaun — clickable prototype

A no-build prototype of the portal described in `../../PORTAL_PLAN.md`. It runs real 3D maps over real Nepali terrain. Its main audiences are **sellers publishing land** and **buyers looking from abroad**, and it keeps the farm-life roots: farmland, honest numbers and fair leases.

## Run it

```sh
cd prototype/thaun
python3 -m http.server 8765
# open http://127.0.0.1:8765
```

You need an internet connection for the map, imagery, terrain and fonts. Opening `index.html` directly also works in most browsers. A local server is more reliable because the elevation tiles are read into a canvas.

Add `?tier=low` to the URL to see the low-power experience. It drops 3D terrain and replaces camera flights with jumps. With the OS "reduce motion" setting on, every fly-in and orbit becomes an instant cut.

## What to try

| Flow | Path |
|---|---|
| **Intro**: globe → Himalaya → Kathmandu Valley in 3D, skippable, shown once per session | `#/` |
| **Search** in English, romanised Nepali or Devanagari. Try `4 aana in Budhanilkantha under 2 crore road` | `#/` search box |
| **Map search**: price pins, hover sync between pin and card, plot outlines from zoom 13.5, 3D terrain, price-per-aana layer, verified and owner-direct filters, mobile bottom sheet | `#/explore` |
| **Land listing**: flies to the plot, draws the boundary, tilts and orbits | `#/p/nagarkot-ridge` |
| **Himalaya view**: real line of sight to 7 named peaks, from standing height or a 2nd-floor roof | scroll down on any land listing |
| **Price check**: asking price per aana against the area's range and the government valuation | land listings for sale |
| **Farm roots**: honest 3-year farm planner (base, expected and stretch cases) and lease models; water-verification flags | `#/p/sundarijal-rim`, `#/p/khokana-field`, `#/farms` |
| **Seller flow**: search a ward or landmark → drop a pin → trace corners on satellite, with live R-A-P-D area, edge lengths in feet and a lalpurja comparison → price check → photos → private documents → 3D preview → publish | `#/sell/1` |
| **From abroad**: eligibility for Nepali citizens, NRN card holders and foreign nationals (checked against current law on 2026-10-21), step-by-step remote buying, currency switch | `#/abroad` |
| Shortlist (heart) → "Share with family" link; first-contact scam guard; EN / ने switch; light and dark themes | header |

## What's real and what's sample data

**Real:**
- **Satellite imagery:** Esri World Imagery.
- **Map:** OpenFreeMap / OpenStreetMap.
- **Terrain:** Copernicus GLO-30 via Mapterhorn.
- **Slope, aspect and elevation** for each plot, computed in the browser from that elevation data.
- **Line of sight to the peaks**, also computed in the browser. It includes earth curvature and refraction, but no buildings or trees.
- **Land units and conversions:** 1 ropani = 508.72 m².
- **Legal rules** in the eligibility text.
- **Market price bands per aana:** Merokalam guide, May 2026.

**Sample data:**
- All listings, people and plot shapes. The listing badge says "Boundary: sample shape".
- Government valuations per area.
- Subdivision-freeze status.
- Exchange rates.
- Price trend lines.

**Prototype only:** anything a seller enters is kept in this browser's localStorage, and uploaded photos and documents never leave the page.

## Stack (prototype only)

- MapLibre GL JS 5.24 for globe, terrain and camera.
- Turf 7.2 for geometry.
- Lucide icons.
- Plain JS and CSS, with no build step.

The production plan (`PORTAL_PLAN.md` §6) moves this to Next.js 16 / React 19 with MapLibre 6, self-hosted PMTiles on Cloudflare R2, and PostGIS. It also moves the view calculation to the server, run once per listing.

## Files

| File | What it holds |
|---|---|
| `index.html` | Shell, header, script order |
| `styles.css` | Design tokens (light and dark), components |
| `data.js` | Areas, places, peaks, sample listings, farm figures |
| `geo.js` | Land units, money formatting, parcel shapes, elevation sampling, line of sight, aerial thumbnails |
| `map.js` | MapLibre setup, device tiers, camera flights, outline drawing, orbit, price pins |
| `app.js` | State, EN/NE strings, router, cards, badges, scam guard, shortlist |
| `views-*.js` | Home, explore, listing, sell, and the abroad and farms pages |

## Things this prototype taught us (feed into Phase 0)

- **Camera flights over terrain need ground elevation first.** MapLibre only refreshes the ground height at the centre after a camera change. Flying while it still reads 0 lands the camera several zoom levels short. `M.groundReady` in `map.js` handles this; keep the same guard in production.
- **Elevation tiles need an explicit `maxzoom`.** Mapterhorn serves z12 here. Without the cap the map requests tiles that 404.
- **The grey 3D building extrusions from the base map look wrong over photographs.** They are hidden in satellite mode.
- **The line-of-sight calculation fetches about 15–20 elevation tiles (a few MB) per listing.** That's fine for a demo, but production should compute it once per listing on the server, as the plan says.
