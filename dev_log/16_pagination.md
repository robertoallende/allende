# Unit 16: Homepage Pagination

## Objective
Add pagination to the homepage feed so visitors can browse all articles across multiple pages. Currently the feed is capped at 12 items (7 local notes + 5 AWS Builder articles). This unit fetches all AWS Builder articles at build time and generates static paginated pages at 10 items per page.

## Implementation

### 1. Increase AWS Builder fetch limit
Update `src/utils/aws-builder-fetcher.js` to raise `maxItems` default from 5 to 50, pulling all available articles at build time.

### 2. Astro static pagination
Replace `src/pages/index.astro` with `src/pages/[...page].astro` using Astro's built-in `paginate()` helper. The merged feed (local notes + AWS Builder, sorted newest first) is split into pages of 10 items. Generated routes:
- `/` — page 1
- `/page/2/` — page 2
- `/page/3/` — page 3, etc.

### 3. Page navigation UI
Add a pagination bar at the bottom of the feed:
- Previous / Next links
- Numbered page links for all pages
- Current page highlighted
- Hidden on single-page feeds

## Files to Modify
- `src/utils/aws-builder-fetcher.js` — increase `maxItems` default to 50
- `src/pages/index.astro` — replace with `src/pages/[...page].astro`

## Success Criteria
- [x] All AWS Builder articles fetched at build time (13 articles, was 5)
- [x] Homepage shows 10 items per page
- [x] `/2/` resolves correctly
- [x] Page navigation renders at the bottom with correct links
- [x] Current page is visually distinct (dark background highlight)
- [x] Build succeeds — 23 pages generated
- [x] `/` still resolves to page 1

## Status: Complete ✅

20 total items (13 AWS Builder + 7 notes) split across 2 pages. Pagination nav shows disabled prev/next at boundaries, numbered page links, current page highlighted. `[...page].astro` replaces `index.astro` as the homepage route.
