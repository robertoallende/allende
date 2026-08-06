# Unit 15: SEO Improvements

## Objective
Improve search engine visibility and AI search tool attribution for allende.nz. Currently only the homepage is indexed; individual /notes posts are missing from Google entirely. This unit addresses crawl discovery, structured data, and meta description freshness.

## Context
After deploying Units 1–14, the site is live but underperforming in search. Google Search Console shows only the homepage indexed. The sitemap exists but hasn't been submitted. Posts lack Article schema, reducing rich result eligibility and AI citation quality.

## Implementation Plan

### Subunit: Article/Person JSON-LD Schema
Add structured Article schema to individual note pages for rich results and AI search attribution.

### Additional Actions (Manual / Search Console)
- Submit sitemap-index.xml in Google Search Console
- Request indexing for each /notes/* URL individually
- Verify meta descriptions are current (old "football analyst" snippet cached)
- Monitor indexing progress over following weeks

## Scope

| Task | Type | Status |
|------|------|--------|
| Article JSON-LD on /notes/[slug] pages | Code | ✅ Complete |
| Submit sitemap to Search Console | Manual | Pending |
| Request indexing for note URLs | Manual | Pending |
| Verify meta description refresh | Manual | Pending |

## Technical Notes
- Sitemap already generated correctly at build time (sitemap-index.xml → sitemap-0.xml)
- robots.txt already references sitemap and disallows /x/
- Site-wide meta description already updated to "AI-first engineering leader..." in config.js and SEO.astro
- Person + WebSite JSON-LD already present site-wide from Unit 11

## Status: In Progress
Code changes complete (Article schema subunit). Manual Search Console actions pending.
