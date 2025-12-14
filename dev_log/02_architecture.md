# Unit 02: Architecture

## Objective

Set up dual content architecture with separate collections for portfolio content (main navigation) and hidden conversational content (/x/ routes), establishing the foundation for allende.nz's unique dual-audience approach.

## Implementation

### Technical Approach

1. **Content Collections Setup**
   - Create separate collections for portfolio and hidden content
   - Configure content schemas for different content types
   - Maintain existing blog collection for tech articles
   - Set up proper TypeScript types for content

2. **Routing Architecture**
   - Implement dynamic routing for /x/ namespace
   - Create individual pages for main navigation sections
   - Configure URL structure for clean portfolio URLs
   - Set up content collection routing

3. **Page Structure Creation**
   - Create main navigation pages (about, software, football, contact)
   - Implement dynamic /x/ route handler
   - Configure proper page layouts and templates
   - Ensure SEO-friendly URL structure

4. **Content Schema Definition**
   - Define frontmatter schemas for portfolio content
   - Create schema for hidden conversational content
   - Configure content validation and TypeScript types
   - Plan for future content migration

### Key Decisions

- **Separate Collections**: Clean separation between portfolio and hidden content
- **Dynamic /x/ Routing**: Single handler for all hidden routes (/x/[...slug].astro)
- **Individual Main Pages**: Dedicated pages for about, software, football, contact
- **Structure First**: Set up architecture before content migration
- **Schema-Driven**: Proper content validation and TypeScript support

### Files to Create/Modify

**New content collections:**
- `src/content/portfolio/` - Main navigation content
- `src/content/hidden/` - /x/ route content
- `src/content/config.ts` - Updated content configuration

**New page routes:**
- `src/pages/about/index.astro` - /about
- `src/pages/software/index.astro` - /software
- `src/pages/football/index.astro` - /football
- `src/pages/contact/index.astro` - /contact
- `src/pages/x/[...slug].astro` - /x/* dynamic routing

**Configuration updates:**
- Update content schemas for new collections
- Configure routing and navigation structure

### Success Criteria

- [x] Content collections configured for portfolio and hidden content
- [x] Main navigation pages created (about, software, football, contact)
- [x] Dynamic /x/ routing implemented and functional
- [x] Content schemas defined with TypeScript support
- [x] URL structure working as planned (/about, /software, /football, /contact, /x/*)
- [x] Build process works with new architecture
- [x] Development server serves all routes correctly
- [x] Foundation ready for content migration

## Status: Complete

Successfully implemented dual content architecture with separate collections and routing:
- ✓ Created portfolio and hidden content collections with proper schemas
- ✓ Configured TypeScript validation for content frontmatter
- ✓ Implemented main navigation pages: /about, /software, /football, /contact
- ✓ Created dynamic /x/ routing for hidden content (/x/piro, /x/poetry)
- ✓ Set up placeholder content files for structure testing
- ✓ Build generates 12 pages including all new routes
- ✓ Content collections properly integrated with Astro's content system
- ✓ URL structure matches planned architecture

Architecture established:
- src/content/portfolio/ - Main navigation content (about, software, football, contact)
- src/content/hidden/ - Hidden conversational content (piro, poetry)
- src/content/blog/ - Existing blog collection maintained
- src/pages/x/[...slug].astro - Dynamic routing for all /x/* routes
- Individual pages for main navigation sections

Ready for Unit 3: Navigation to update site navigation and routing configuration.
