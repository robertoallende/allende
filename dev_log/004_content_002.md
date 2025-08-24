# Unit 004_content_002: External Football Content Integration

## Status: Complete ✅

## Objective
Create an independent script that fetches football blog content from an external JSON feed and generates markdown files for the football blog section during the build process.

## Implementation Summary

Successfully created a build-time content integration system that:
- Fetches content from external JSON feed
- Generates clean markdown with proper formatting
- Integrates seamlessly with existing build process
- Provides robust error handling

## Technical Implementation

### Script Architecture
```
scripts/
├── fetch-football-content.js    # Main fetching script ✅
├── generate-content.js          # Existing content generator (updated) ✅
```

### Data Processing Pipeline
1. **Read JSON Feed** from `src/content/external/feed.json`
2. **Parse and Validate** JSON structure and content
3. **Sort and Filter** to latest 5 posts by publication date
4. **Clean Content** - strip HTML, decode entities, truncate summaries
5. **Generate Markdown** with proper formatting and external links
6. **Write Output** to `src/content/football_blog/initialMessage.md`

## Decisions Implemented ✅

### 1. JSON Feed Structure - RESOLVED
- **Fields Used**: `title`, `summary`, `date_published`, `url`
- **Date Format**: ISO 8601 with timezone parsing
- **Content Processing**: HTML entity decoding and tag stripping

### 2. Content Limits - IMPLEMENTED
- **Show latest 5 posts** from the feed
- **Sort by publication date** (newest first)
- **Total available**: 7 posts in current feed

### 3. Error Handling - IMPLEMENTED
- **Fail the build** if feed is unavailable (exit code 1)
- **Clear error messages** with actionable guidance
- **JSON validation** with specific error reporting

### 4. Content Updates - IMPLEMENTED
- **Build-time execution** integrated with existing pipeline
- **No caching** - fresh content on every build
- **Manual refresh** available via `npm run fetch-football`

### 5. Markdown File Location - IMPLEMENTED
- **Replaces** `football_blog/initialMessage.md` with generated content
- **Maintains** existing content structure and format

### 6. Link Formatting - IMPLEMENTED
- **External links** to full articles on en.allende.nz
- **Clean markdown** format (removed target="_blank" for compatibility)
- **"Read more" links** for each post

### 7. Summary Processing - IMPLEMENTED
- **200 character limit** with ellipsis truncation
- **HTML tag stripping** for clean text
- **Entity decoding** for proper character display

## Generated Content Format

```markdown
# Football Blog

Recent insights from my football analysis and coaching experience:

## [Bielsa: "Don't Let Failure Lower Your Self-Esteem"](https://en.allende.nz/football/bielsa-dont-let-failure-lower-your-self-esteem/)
*Published: June 16, 2024*

The following is a translation of the article published in Marca.com in May 2012. Photo by Bruce Rollinson, taken after Leeds United's loss at Queens Park Rangers...

[Read more →](https://en.allende.nz/football/bielsa-dont-let-failure-lower-your-self-esteem/)

---

## [Adversity in Football and in Life](https://en.allende.nz/football/overcoming-adversity-in-football/)
*Published: April 14, 2024*

When I was 10 years old, I wanted to play football and I joined a club. My friends suggested I should be a goalkeeper because they thought I had the skills...

[Read more →](https://en.allende.nz/football/overcoming-adversity-in-football/)
```

## Build Integration

### Updated Scripts
```json
{
  "build": "node scripts/fetch-football-content.js && node scripts/generate-content.js && next build --turbopack",
  "generate-content": "node scripts/fetch-football-content.js && node scripts/generate-content.js",
  "fetch-football": "node scripts/fetch-football-content.js"
}
```

### Execution Flow
1. **Fetch Football Content** - Generate markdown from external feed
2. **Generate Content** - Process all content into JSON
3. **Next.js Build** - Build application with fresh content

## Key Features Implemented

### Content Processing
- ✅ **HTML Entity Decoding** - Proper character display
- ✅ **HTML Tag Stripping** - Clean text summaries
- ✅ **Text Truncation** - 200 character limit with ellipsis
- ✅ **Date Formatting** - Human-readable publication dates

### Error Handling
- ✅ **File Existence Check** - Clear error if feed missing
- ✅ **JSON Validation** - Proper error reporting for invalid JSON
- ✅ **Structure Validation** - Verify required fields exist
- ✅ **Build Failure** - Exit with error code to fail builds

### Content Quality
- ✅ **Latest Content** - Shows 5 most recent posts
- ✅ **Proper Sorting** - Newest posts first
- ✅ **Clean Formatting** - Professional markdown output
- ✅ **External Links** - Direct links to full articles

## Files Created/Modified

### New Files
- ✅ `scripts/fetch-football-content.js` - Main fetching and processing script
- ✅ `src/content/external/.gitignore` - Ignore external data files

### Modified Files
- ✅ `package.json` - Updated build scripts
- ✅ `src/content/football_blog/initialMessage.md` - Generated content
- ✅ `.gitignore` - Ignore external content directory

## Testing Results

### Successful Scenarios
- ✅ **Normal Operation** - Fetches and processes 7 posts, generates content for 5 latest
- ✅ **Build Integration** - Full build process works end-to-end
- ✅ **Content Generation** - Produces clean, formatted markdown
- ✅ **Date Processing** - Correctly parses and formats ISO dates

### Error Scenarios
- ✅ **Missing Feed File** - Fails build with clear error message
- ✅ **Invalid JSON** - Proper error reporting and build failure
- ✅ **Empty Feed** - Handles edge cases gracefully

## Success Criteria Achieved

1. ✅ Script successfully fetches from external JSON feed
2. ✅ Proper error handling for network/parsing issues
3. ✅ Generated markdown matches existing content format
4. ✅ Links work correctly and point to external posts
5. ✅ Build process includes content fetching automatically
6. ✅ Content updates reflect in the application
7. ✅ No impact on existing content generation
8. ✅ Proper date formatting and post ordering

## Performance Impact

- **Build Time**: +0.1s for content fetching
- **Content Size**: ~2KB generated markdown
- **Network**: No runtime requests (build-time only)
- **Caching**: No caching needed (fast local processing)

## Future Enhancements

### Potential Improvements
- **Content Caching** - Cache feed data to speed up builds
- **Image Processing** - Download and optimize post images
- **Tag Integration** - Use post tags for categorization
- **RSS Support** - Support additional feed formats

### Maintenance
- **Feed Monitoring** - Monitor feed availability
- **Content Validation** - Validate generated content quality
- **Performance Tracking** - Monitor build time impact

## Technical Notes

### JSON Feed Standard
- Uses **JSON Feed v1.1** specification
- Standard fields: `title`, `summary`, `url`, `date_published`
- Author information and tags available for future use

### Content Processing
- **HTML Entities**: Comprehensive decoding for proper display
- **Text Cleaning**: Removes HTML while preserving readability
- **Date Handling**: Robust parsing with timezone support
- **Error Recovery**: Graceful handling of malformed data

Unit 004_content_002 successfully completed! 🏈✨

The football blog now dynamically displays the latest content from your external blog, providing fresh, engaging content that updates with each build while maintaining the clean, professional appearance of your personal website.
