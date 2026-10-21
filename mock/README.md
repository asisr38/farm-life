# MVP Prototype — Kathmandu Valley Farm

A **self-contained, clickable HTML mock** of the Phase-1 **concierge lease-facilitation** flow described in `../PRD.md`. Built for fast flow validation *before* writing production code.

## Run it
Open `index.html` in any browser (double-click, or `open mock/index.html` on macOS). No build step, no server. Styling uses the Tailwind Play CDN + Lucide icons, so an internet connection is needed for the polished look (the flow still works without it).

## How to demo (the core loop)
1. **Operator / Admin** (default view): open **Facilitation Queue** → click the **`L-002` (Sundarijal · Bibek Tamang)** card.
2. Walk the stepper: **Start vetting → approve both parties → draft lease → Generate agreement (view the bilingual lease) → mark generated → Record signed → activate.** Watch it land in **Active** and seed the **Ledger**.
3. Try the **blocker**: the *Khokana Field* plot has unverified water — go to **Plots** and "Verify water & publish" to see the honesty guardrail.
4. Switch **View as → Farmer**: **Browse Land → Express interest** (creates a new inquiry back in the operator queue), then **My Farm** (yield chart), **Planner** (toggle Base/Expected/**Stretch** to see the realistic-vs-inflated economics), **My Journey**.
5. Switch **View as → Landowner**: **My Land** + **Leases & Income**.

## Screen → PRD epic map
| Screen | PRD Epic |
|---|---|
| Facilitation Queue + Lease Workspace (stepper, agreement, activate) | **D** — Lease facilitation & agreement (the money event) |
| Plots list + Add-plot (required water field, verify-to-publish) | **B** — Plots & listings |
| People & Vetting | **C** — Inquiry, application & vetting |
| Ledger (append-only, off-platform payments logged) | **E** — Payments & ledger |
| Farmer dashboard (crops, yields chart) | **F** — Operating dashboard |
| Browse Land + Express interest | **B/C** — discovery + inquiry |
| Honest Planner (base/expected/stretch, 25-ropani Valley cap) | **G1** — realistic calculator |
| My Journey (6 phases tied to state) | **G2** |
| Resources | **G3** |
| Role switcher (operator/farmer/landowner) | **A/F3** — roles & role-aware views |

## Deliberately faked (it's a mock)
State is in-memory and resets on refresh; forms aren't fully wired; no real auth, payments, persistence, geo-search, or Nepali translation (the ने button explains the parity requirement). Numbers are seed data grounded in `../PLAN_REVIEW.md` research.
