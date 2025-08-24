# Unit 004_content_002: External Football Content Integration

## Objective
Create an independent script that fetches football blog content from an external JSON feed and generates markdown files for the football blog section during the build process.

## Requirements

### Data Source
- **URL**: `https://en.allende.nz/football/feed.json`
- **Integration**: Independent script, not part of the main app
- **Execution**: Run as part of the build process

### Data Extraction
From each JSON entry, extract:
- **Title**: Blog post title
- **Summary**: Brief description/excerpt
- **Date**: Publication date
- **URL**: Link to full article

### Output Generation
- Generate markdown files for football blog section
- Include title as clickable link to full article
- Include summary with "Read more" link to post URL
- Maintain consistency with existing content structure

## Technical Approach

### Script Architecture
```
scripts/
├── fetch-football-content.js    # Main fetching script
├── generate-content.js          # Existing content generator (updated)
└── utils/
    ├── markdown-generator.js    # Markdown formatting utilities
    └── content-validator.js     # Content validation helpers
```

### Build Integration
- Add script to `package.json` build process
- Run before existing content generation
- Update existing content generation to include fetched content

### Content Structure
Generated markdown should match existing format:
```markdown
# Football Blog

Recent posts from my football analysis:

## [Post Title](https://en.allende.nz/football/post-url)
*Published: Date*

Summary content here...

[Read more →](https://en.allende.nz/football/post-url)

---

## [Another Post Title](https://en.allende.nz/football/another-url)
*Published: Date*

Another summary...

[Read more →](https://en.allende.nz/football/another-url)
```

## Decisions Needed

### 1. JSON Feed Structure
**Question**: What is the exact structure of the JSON feed?
- Need to see sample data to understand field names
- Confirm available fields (title, summary, date, url, etc.)
- Understand date format for proper parsing

### 2. Content Limits
**Question**: How many posts should we include?
- All posts from the feed?
- Latest N posts (e.g., 10 most recent)?
- Posts from last X months?

### 3. Error Handling
**Question**: What should happen if the feed is unavailable?
- Fail the build?
- Use cached/fallback content?
- Generate empty section with message?

### 4. Content Updates
**Question**: How often should content be refreshed?
- Only during builds?
- Cache duration considerations?
- Manual refresh capability?

### 5. Markdown File Location
**Question**: Where should generated content be placed?
- Replace existing `football_blog/initialMessage.md`?
- Generate additional response files?
- Create separate generated content directory?

### 6. Link Formatting
**Question**: Should external links open in new tabs?
- Add `target="_blank"` attributes?
- Include external link indicators?
- Maintain current link styling?

## Implementation Plan

### Phase 1: Script Development
1. **Create fetch script** to retrieve JSON feed
2. **Parse and validate** JSON structure
3. **Generate markdown** with proper formatting
4. **Handle errors** gracefully

### Phase 2: Build Integration
1. **Update package.json** scripts
2. **Modify build process** to run fetch before content generation
3. **Update content generator** to include fetched content
4. **Test build pipeline** end-to-end

### Phase 3: Content Enhancement
1. **Style external links** appropriately
2. **Add date formatting** for consistency
3. **Implement content limits** if needed
4. **Add caching mechanism** if required

## Expected Files

### New Files
- `scripts/fetch-football-content.js` - Main fetching script
- `scripts/utils/markdown-generator.js` - Markdown utilities
- `scripts/utils/content-validator.js` - Validation helpers

### Modified Files
- `package.json` - Updated build scripts
- `scripts/generate-content.js` - Include fetched content
- `src/content/football_blog/initialMessage.md` - Generated content

## Success Criteria

1. ✅ Script successfully fetches from external JSON feed
2. ✅ Proper error handling for network/parsing issues
3. ✅ Generated markdown matches existing content format
4. ✅ Links work correctly and open to external posts
5. ✅ Build process includes content fetching automatically
6. ✅ Content updates reflect in the application
7. ✅ No impact on existing content generation
8. ✅ Proper date formatting and post ordering

## Technical Considerations

### Network Requests
- Use `node-fetch` or built-in `fetch` for HTTP requests
- Implement timeout and retry logic
- Handle CORS and SSL certificate issues

### Content Processing
- Sanitize HTML content if present in summaries
- Truncate summaries if too long
- Format dates consistently with existing content

### Build Performance
- Cache fetched content to avoid repeated requests
- Implement incremental updates if possible
- Minimize build time impact

## Status: Planned

Awaiting decisions on JSON structure and content handling approach before implementation.

## Next Steps

1. **Examine JSON feed structure** to understand available data
2. **Make decisions** on content limits and error handling
3. **Implement fetching script** with proper error handling
4. **Integrate with build process** and test thoroughly
5. **Validate generated content** matches design requirements
