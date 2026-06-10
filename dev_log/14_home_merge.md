# Unit 14: Home Page Merge & Navigation Simplification

## Objective
Merge Notes and Software content into the Home page as a unified chronological feed, simplify navigation to Home · Projects only, and remove the football page.

## Context
The site currently has separate Notes, Software, and Football sections in navigation. This unit consolidates the content experience: the home page becomes the single content hub showing the typewriter intro followed by a merged feed of local notes articles and external AWS Builder RSS items, sorted newest first.

## Implementation

### Navigation Changes
- Remove Notes, Software, Football from Nav.astro
- Keep only: Home · Projects

### Home Page Restructure
- Keep typewriter intro (first two lines of current home content)
- Add merged chronological feed below intro:
  - Source 1: Local notes articles from `src/content/notes/` (excluding index.md)
  - Source 2: External AWS Builder RSS (existing fetcher)
  - Sort all items by date, newest first
  - Display: title, date, link

### Pages Kept (not in nav)
- `/notes/` and `/notes/[slug]` — accessible but unlisted
- `/software/` — accessible but unlisted
- `/projects/` — in nav

### Pages/Content Removed
- `/football/` page (no content exists anyway)
- Football RSS feed references

## Files to Modify
- `src/components/Nav.astro` — simplify navigation
- `src/pages/index.astro` — merged feed below typewriter intro
- `src/utils/rss-fetcher.js` — remove football feed references
- `src/pages/football/` — delete

## Success Criteria
- [ ] Navigation shows only Home · Projects
- [ ] Home page shows typewriter intro (first two lines)
- [ ] Home page shows merged chronological feed (notes + AWS Builder RSS)
- [ ] Feed items sorted newest first
- [ ] /notes/ and /software/ pages still accessible via direct URL
- [ ] Football page and references removed
- [ ] Build succeeds

## Status: Complete ✅

### Implementation Summary
- Navigation simplified to Home · Projects
- Home page shows typewriter intro + merged chronological feed (5 notes + 5 AWS Builder articles)
- Football references removed from config.ts, config.js, and SEO.astro
- /notes/ and /software/ pages remain accessible via direct URL
- Build verified: 20 pages generated successfully

### Files Modified
- `src/components/Nav.astro` — removed Notes, Software from nav
- `src/pages/index.astro` — merged feed implementation
- `src/content/config.ts` — removed football collection
- `src/config.js` — updated site description
- `src/components/SEO.astro` — removed football from description, knowsAbout, keywords
