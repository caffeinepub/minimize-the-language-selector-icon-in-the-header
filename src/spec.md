# Specification

## Summary
**Goal:** Add a prominent shortcut on the Travel Style Quiz results page that takes users to the existing Packing List page.

**Planned changes:**
- Update the “Your Travel Style Revealed!” (quiz completed/results) view to render a visible call-to-action shortcut with an English label (e.g., “Personalize your packing list here”).
- Wire the shortcut to navigate via existing hash routing to `#packing-list`, reusing the current PackingList route/page.
- Ensure the shortcut appears only on the results view (not during the quiz question flow).

**User-visible outcome:** After finishing the Travel Style Quiz and seeing “Your Travel Style Revealed!”, users can tap/click a prominent CTA to jump directly to the existing Packing List page.
