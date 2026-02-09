# Specification

## Summary
**Goal:** Rename the Travel Tools shop tile and ensure blog posts get a persisted, one-time randomized baseline view count before normal per-open increments.

**Planned changes:**
- Update the Travel Tools grid tile label from “Print on Demand Travel Products” to exactly “TravelButts shop”, without changing any other UI labels.
- Change the “TravelButts shop” tile click target to navigate directly to the app’s existing Shop page/route (matching the current Shop navigation destination), not the coming-soon route.
- Add backend logic for blog view counts: on first recorded open when no view count exists, persist a random integer in the range 700–1000 (inclusive); on subsequent opens, increment the stored value by exactly 1 per open.

**User-visible outcome:** The Travel Tools tile is renamed to “TravelButts shop” and opens the real Shop page, and blog posts that previously had no view count will show a persisted number after being opened once, then increase by 1 on each subsequent open.
