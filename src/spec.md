# Specification

## Summary
**Goal:** Add persistent, publicly readable per-blog view counts that start at a random value (700–1000) and increment by 1 each time a blog is opened.

**Planned changes:**
- Add backend persistent storage for per-blog view counts, initializing missing counts to a random integer in the inclusive range 700–1000 for both existing and future blog posts.
- Implement backend APIs to get a single blog’s view count, increment a blog’s view count by exactly +1 on blog open, and fetch all view counts keyed by blog ID for list rendering.
- Ensure view-count entries are removed when a blog post is deleted so deleted blogs no longer appear in the “all view counts” result.
- Add/adjust backend stable-state upgrade behavior to preserve existing data and initialize only missing view counts without re-randomizing existing ones.

**User-visible outcome:** View counts are visible to everyone; each blog shows a stable view number that starts between 700–1000 and increases by 1 whenever the blog is opened, persisting across refreshes and upgrades.
