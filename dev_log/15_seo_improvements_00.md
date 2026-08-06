# Unit 15: SEO Improvements - Subunit: Article/Person JSON-LD Schema

## Objective
Add Article structured data (JSON-LD) to individual note pages so Google can display rich results and AI search tools (Perplexity, ChatGPT search, Google AI Overviews) can properly attribute and summarize content.

## Implementation

### Technical Approach
Added an Article JSON-LD block to `src/pages/notes/[slug].astro` that renders per-page structured data using each note's frontmatter (title, description, publishedAt).

### Schema Structure
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "<note title>",
  "description": "<note description>",
  "url": "https://allende.nz/notes/<slug>/",
  "datePublished": "<ISO date>",
  "dateModified": "<ISO date>",
  "author": {
    "@type": "Person",
    "name": "Roberto Allende",
    "url": "https://allende.nz",
    "jobTitle": "AI-first Engineering Leader",
    "sameAs": [
      "https://github.com/robertoallende",
      "https://www.linkedin.com/in/robertoallende/",
      "https://x.com/robertoallende",
      "https://builder.aws.com/community/@robertoallende"
    ]
  },
  "publisher": {
    "@type": "Person",
    "name": "Roberto Allende",
    "url": "https://allende.nz"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://allende.nz/notes/<slug>/"
  },
  "inLanguage": "en"
}
```

### Key Decisions
- **JSON-LD in body**: Base.astro has no named head slot; JSON-LD is valid anywhere in HTML and Google parses it regardless of placement
- **Person inline in Article**: Embedded full Person entity with sameAs links inside the author field rather than referencing the global Person schema — this ensures each article is self-contained for crawlers
- **dateModified = datePublished**: Notes don't track modification dates separately; using publishedAt for both
- **Undefined field cleanup**: Fields without values (e.g., datePublished when publishedAt is missing) are stripped before serialization

## Files Modified
- `src/pages/notes/[slug].astro` — Added Article JSON-LD schema generation and rendering

## Verification
- Build succeeds: 21 pages generated
- Article schema confirmed present in built HTML (e.g., `dist/notes/pragmatic/index.html`)
- Each note page now contains 3 JSON-LD blocks: Person (global), WebSite (global), Article (per-page)
- Schema validates with correct headline, description, dates, and author attribution

## Status: Complete ✅

Article JSON-LD schema successfully added to all 6 note pages. Deployed pages will be eligible for Google rich results and provide structured attribution data for AI search tools.
