# Unit 05: Content Migration - Subunit: Notes Section

## Objective
Add a new Notes section to host essay-style articles with dynamic content listing from local markdown files, displayed newest first, and add navigation entry as the last menu item.

## Implementation Plan

### 1. Content Structure
- Notes section already exists with index.md and at least one article
- Use existing content collection pattern (notes/ directory)
- Dynamic listing of all markdown files in notes/ directory
- Sort by date (newest first)

### 2. Dynamic Content Generation
- Read notes collection files at build time
- Extract title, description, and date from frontmatter
- Generate list similar to football/software sections
- Display below the header content from index.md

### 3. Navigation Update
- Add "Notes" as last item in main navigation
- Order: Software · Football · Projects · Notes
- Update Nav.astro component

## Technical Approach

### Content Collection Schema
```typescript
const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedAt: z.date(),
  }),
});
```

### Page Implementation
- `/src/pages/notes/index.astro` - Main notes page
- Read all entries from notes collection
- Sort by publishedAt (descending)
- Display header + dynamic list

### Navigation Update
- Update `/src/components/Nav.astro`
- Add Notes link after Projects

## Files to Create/Modify

**Content Collection:**
- `src/content/config.ts` - Add notes collection schema

**Pages:**
- `src/pages/notes/index.astro` - Notes section page with dynamic listing

**Navigation:**
- `src/components/Nav.astro` - Add Notes menu item

**Content:**
- `src/content/notes/index.md` - Section header (already exists)
- `src/content/notes/*.md` - Individual note articles (manually added)

## Success Criteria

- [x] Notes collection configured in content/config.ts
- [x] Notes page displays header from index.md
- [x] Dynamic list of all note articles below header
- [x] Articles sorted by publishedAt date (newest first)
- [x] Each article shows title, description, and date
- [x] Navigation includes "Notes" as last item
- [x] Build generates notes page successfully
- [x] Links to individual note articles work correctly

## Status
✅ **Complete** - Notes section successfully implemented

## Implementation Summary

### Files Created/Modified

**Content Collection:**
- `src/content/config.ts` - Added notes collection with schema (title, description, section, publishedAt optional)

**Pages:**
- `src/pages/notes/index.astro` - Notes section page with dynamic article listing
- `src/pages/notes/[slug].astro` - Dynamic route for individual note articles

**Navigation:**
- `src/components/Nav.astro` - Added Notes as last menu item (Software · Football · Projects · Notes)

**Content:**
- `src/content/notes/pragmatic.md` - Added publishedAt date for sorting

### Build Results
- ✅ 14 pages built successfully (was 11, added 3 new pages)
- ✅ Notes index page at /notes/
- ✅ Individual note article at /notes/pragmatic/
- ✅ Dynamic listing shows newest articles first
- ✅ Navigation updated with Notes as last item

### Technical Implementation
- Notes collection uses same pattern as football/software sections
- Dynamic listing filters out index.md and sorts by publishedAt (descending)
- Individual articles accessible via /notes/[slug] route
- Consistent styling with prose classes and blue link colors
- Date display format matches other sections (Month Day, Year)
