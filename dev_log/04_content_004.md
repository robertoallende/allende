# Unit 04_content_004: AWS Builder Content Integration for Software Engineering Notes

## Status: Complete ✅

## Implementation Summary

Successfully implemented AWS Builder content integration for the Software Engineering Notes section with all planned features:

### ✅ 1. AWS Builder JSON Parsing
- **Created**: `fetch-awsbuilder-content.js` script with full JSON processing
- **Implementation**: Handles nested `feedContents` structure vs football's `items` array
- **Result**: Successfully parses 5 AWS Builder articles from awsbuilder.json

### ✅ 2. Data Format Conversion
- **Unix Timestamps**: Converted to DD/MM/YYYY format using `formatCompactDate()`
- **URL Generation**: Created `generateAwsBuilderUrl()` to build community.aws URLs
- **Content Processing**: Use `article.description` for accurate summaries (not full markdownDescription)
- **Result**: Clean, consistent data formatting with proper article descriptions

### ✅ 3. Minimalistic Format Implementation
- **Header Format**: `[Title](URL) | DD/MM/YYYY` consistent with football section
- **Content Flow**: Smart summaries with inline `[→](URL)` arrow links
- **Clean Spacing**: No separators, just whitespace between entries
- **Result**: Professional, scannable presentation matching site design

### ✅ 4. Custom Branding Integration
- **Title**: "Software Engineering Notes" (custom requested)
- **Description**: "Reflections on building and leading in the cloud era, from AI-first experiments to hard-earned lessons in delivering scalable, resilient systems."
- **Footer**: "Read all the articles at [AWS Builder Center](https://builder.aws.com/community/@robertoallende)"
- **Result**: Perfect alignment with professional technical positioning and AWS Builder profile

### ✅ 5. Build Process Integration
- **Package.json**: Updated with `fetch-awsbuilder` and `fetch-all-content` scripts
- **Build Pipeline**: Integrated into main build process with football content
- **Content Generation**: Updated generate-content.js to include software section
- **Result**: Seamless automated content processing

### ✅ 6. Directory Structure Setup
- **Created**: `src/content/software_blog/` with required subdirectories
- **Files**: initialMessage.md, responses/001.md, followUps/001.md
- **Integration**: Full compatibility with existing content system
- **Result**: Complete software section ready for use

## Technical Implementation Details

### Script Architecture
```javascript
// Key functions implemented:
- formatCompactDate(timestamp) // Unix → DD/MM/YYYY
- generateAwsBuilderUrl(contentId) // contentId → full URL
- createSmartSummary(description, 300) // Smart content truncation
- stripHtml(content) // Clean HTML entities
- generateMarkdown(feedData) // Full content generation

// Content source fix:
// Use: item.contentTypeSpecificResponse.article.description
// Not: item.markdownDescription (full article content)
```

### Content Processing Flow
```
awsbuilder.json → fetch-awsbuilder-content.js → software_blog/initialMessage.md → generate-content.js → generated-content.json
```

### Generated Content Structure
```markdown
# Software Engineering Notes

Reflections on building and leading in the cloud era, from AI-first experiments to hard-earned lessons in delivering scalable, resilient systems.

[Code with AI: Micromanagement is all you need](https://community.aws/content/2y6nQgj1FVuaJIn9rFLThIslwaJ) | 25/06/2025
The first time I integrated AI into my IDE, I was cocky. I typed "make a Gmail clone that uses a JSON file for content" and watched in amazement as it actually worked... [→](https://community.aws/content/2y6nQgj1FVuaJIn9rFLThIslwaJ)
```

## Objective
Integrate AWS Builder content from the awsbuilder.json file into the "Software Engineering Notes" section using a similar approach to unit 004_content_002, but adapted for the different JSON structure and content format. The section will showcase reflections on building and leading in the cloud era, from AI-first experiments to hard-earned lessons in delivering scalable, resilient systems.

## Current Content Analysis

### AWS Builder JSON Structure
```json
{
  "feedContents": [
    {
      "author": {
        "alias": "robertoallende",
        "preferredName": "Roberto Allende"
      },
      "contentId": "/content/2y6nQgj1FVuaJIn9rFLThIslwaJ",
      "contentType": "ARTICLE",
      "contentTypeSpecificResponse": {
        "article": {
          "description": "Yes, it says micromanagement - and this time it makes sense.",
          "heroImageUrl": "https://assets.community.aws/...",
          "tags": ["amazon-q-developer", "amazon-q-cli", "genai"],
          "versionId": "2yxY2mrpBMYTErPCBPOwx43laUg"
        }
      },
      "createdAt": 1750777486884,
      "lastPublishedAt": 1750774663797,
      "markdownDescription": "The first time I integrated AI into my IDE...",
      "status": "LIVE",
      "title": "Code with AI: Micromanagement is all you need"
    }
  ]
}
```

### Key Differences from Football Feed
1. **Structure**: Nested under `feedContents` array vs direct `items` array
2. **Date Format**: Unix timestamps vs ISO date strings
3. **Content Field**: `markdownDescription` vs `summary` and `content_html`
4. **URL Generation**: Need to construct URLs from `contentId`
5. **Additional Metadata**: Tags, hero images, author info available

## Proposed Implementation

### 1. New Content Generation Script
**File**: `scripts/fetch-awsbuilder-content.js`

**Key Features**:
- Parse the different JSON structure
- Convert Unix timestamps to readable dates
- Generate AWS Builder URLs from contentId
- Apply same minimalistic formatting as football content
- Handle markdown content appropriately

### 2. Target Format (Consistent with Football Blog)
```
[Title](URL) | DD/MM/YYYY
Description text from markdownDescription field... [→](URL)
```

### 3. URL Construction Logic
AWS Builder URLs follow the pattern:
`https://community.aws/content/{contentId}`

Where contentId is extracted from the JSON (e.g., `/content/2y6nQgj1FVuaJIn9rFLThIslwaJ`)

## Technical Implementation Plan

### Script Structure
```javascript
const fs = require('fs');
const path = require('path');

/**
 * Convert Unix timestamp to DD/MM/YYYY format
 */
function formatCompactDate(timestamp) {
  try {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.warn(`Warning: Could not parse timestamp "${timestamp}"`);
    return 'Unknown date';
  }
}

/**
 * Strip HTML tags and decode entities
 */
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, '...')
    .trim();
}

/**
 * Create smart summary from markdown content
 */
function createSmartSummary(markdownContent, maxLength = 300) {
  if (!markdownContent) return 'No description available.';
  
  const cleaned = stripHtml(markdownContent);
  if (cleaned.length <= maxLength) return cleaned;
  
  // Find last complete sentence or word within limit
  const targetLength = maxLength - 15; // Reserve space for arrow link
  const truncated = cleaned.substring(0, targetLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  const cutPoint = lastSpace > targetLength - 30 ? lastSpace : targetLength;
  return cleaned.substring(0, cutPoint) + '...';
}

/**
 * Generate AWS Builder URL from contentId
 */
function generateAwsBuilderUrl(contentId) {
  // contentId format: "/content/2y6nQgj1FVuaJIn9rFLThIslwaJ"
  return `https://community.aws${contentId}`;
}

/**
 * Generate markdown content from AWS Builder feed
 */
function generateMarkdown(feedData) {
  if (!feedData || !feedData.feedContents || !Array.isArray(feedData.feedContents)) {
    throw new Error('Invalid feed data structure');
  }

  // Filter only LIVE articles and sort by publication date (newest first)
  const liveArticles = feedData.feedContents
    .filter(item => item.status === 'LIVE' && item.contentType === 'ARTICLE')
    .sort((a, b) => b.lastPublishedAt - a.lastPublishedAt);

  // Take latest 5 articles
  const latestArticles = liveArticles.slice(0, 5);

  let markdown = `# Software Engineering Notes

Reflections on building and leading in the cloud era, from AI-first experiments to hard-earned lessons in delivering scalable, resilient systems.

`;

  latestArticles.forEach((item, index) => {
    const title = stripHtml(item.title) || 'Untitled Post';
    const url = generateAwsBuilderUrl(item.contentId);
    const summary = createSmartSummary(item.markdownDescription, 300);
    const compactDate = formatCompactDate(item.lastPublishedAt);

    // Minimalistic format: [Title](URL) | DD/MM/YYYY
    // Summary text with minimal arrow link
    markdown += `[${title}](${url}) | ${compactDate}
${summary} [→](${url})`;

    // Add clean spacing between entries
    if (index < latestArticles.length - 1) {
      markdown += '\n\n';
    }
  });

  // Add footer
  markdown += `

*Interested in cloud architecture or AI development? Let's connect and discuss!*`;

  return markdown;
}

/**
 * Main function to process AWS Builder content
 */
async function main() {
  try {
    console.log('🔧 Processing AWS Builder content...');
    
    const inputPath = path.join(__dirname, '../src/content/external/awsbuilder.json');
    const outputPath = path.join(__dirname, '../src/content/software_blog/initialMessage.md');
    
    // Read the JSON file
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const feedData = JSON.parse(rawData);
    
    console.log(`📄 Found ${feedData.feedContents.length} articles in feed`);
    
    // Generate markdown
    const markdown = generateMarkdown(feedData);
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the markdown file
    fs.writeFileSync(outputPath, markdown, 'utf8');
    
    console.log(`✅ Software content generated successfully: ${outputPath}`);
    console.log(`📊 Generated content from ${Math.min(5, feedData.feedContents.filter(item => item.status === 'LIVE').length)} latest articles`);
    
  } catch (error) {
    console.error('❌ Error processing AWS Builder content:', error.message);
    process.exit(1);
  }
}

// Export functions for testing
module.exports = { 
  main, 
  generateMarkdown, 
  stripHtml, 
  createSmartSummary, 
  formatCompactDate,
  generateAwsBuilderUrl 
};

// Run if called directly
if (require.main === module) {
  main();
}
```

## Integration with Build Process

### Update package.json Scripts
```json
{
  "scripts": {
    "fetch-football": "node scripts/fetch-football-content.js",
    "fetch-awsbuilder": "node scripts/fetch-awsbuilder-content.js",
    "fetch-all-content": "npm run fetch-football && npm run fetch-awsbuilder",
    "build": "npm run fetch-all-content && node scripts/generate-content.js && next build --turbopack"
  }
}
```

### Update Main Build Script
**File**: `scripts/generate-content.js`

Add AWS Builder content processing:
```javascript
// Add to existing content generation
const awsBuilderContent = fs.readFileSync(
  path.join(__dirname, '../src/content/software_blog/initialMessage.md'), 
  'utf8'
);

// Include in generated content structure
const generatedContent = {
  // ... existing content
  software_blog: {
    initialMessage: awsBuilderContent
  }
};
```

## Content Structure Comparison

### Football Feed (JSON Feed Format)
```json
{
  "items": [
    {
      "title": "Article Title",
      "url": "https://en.allende.nz/football/article-slug/",
      "date_published": "2024-06-16T12:00:00Z",
      "summary": "Article summary...",
      "content_html": "Full HTML content..."
    }
  ]
}
```

### AWS Builder Feed (Custom Format)
```json
{
  "feedContents": [
    {
      "title": "Article Title",
      "contentId": "/content/2y6nQgj1FVuaJIn9rFLThIslwaJ",
      "lastPublishedAt": 1750774663797,
      "markdownDescription": "Full markdown content...",
      "contentTypeSpecificResponse": {
        "article": {
          "description": "Short description..."
        }
      }
    }
  ]
}
```

### Expected Output Format

### Software Engineering Notes Section
```markdown
# Software Engineering Notes

Reflections on building and leading in the cloud era, from AI-first experiments to hard-earned lessons in delivering scalable, resilient systems.

[Code with AI: Micromanagement is all you need](https://community.aws/content/2y6nQgj1FVuaJIn9rFLThIslwaJ) | 16/06/2024
The first time I integrated AI into my IDE, I was cocky. I typed "make a Gmail clone that uses a JSON file for content" and watched in amazement as it actually worked. The demo was flawless - I felt like a wizard. A few days later, reality hit... [→](https://community.aws/content/2y6nQgj1FVuaJIn9rFLThIslwaJ)

[Five Takeaways from AWS Summit Sydney 2025](https://community.aws/content/2y6VTiNmyMKGnFslikzXkfecPd9) | 14/04/2024
June 4-5, 2025 saw AWS bring together thousands of developers, builders, and business leaders at Sydney's International Convention Centre for their annual Summit. Across 90+ sessions and 80+ partner showcases, the event highlighted both where AWS is directing their efforts... [→](https://community.aws/content/2y6VTiNmyMKGnFslikzXkfecPd9)

*Read all the articles at [AWS Builder Center](https://builder.aws.com/community/@robertoallende)*
```

## Benefits and Features

### 1. Consistent Formatting
- Same minimalistic style as football content
- `[Title](URL) | DD/MM/YYYY` format
- Clean arrow links `[→](URL)`
- Appropriate content length for scanning

### 2. Rich Content Integration
- Leverages detailed AWS Builder articles
- Professional software development content
- Cloud architecture and AI insights
- Real-world project experiences

### 3. Automated Processing
- Handles Unix timestamp conversion
- Smart markdown content summarization
- Proper URL generation for AWS Builder
- Maintains build process integration

### 4. Extensible Architecture
- Easy to add more content sources
- Consistent processing patterns
- Modular script structure
- Testable functions

## Implementation Phases

### Phase 1: Core Script Development
1. **Create fetch-awsbuilder-content.js** with JSON parsing
2. **Implement date conversion** from Unix timestamps
3. **Add URL generation** for AWS Builder links
4. **Test content processing** with existing JSON file

### Phase 2: Build Integration
1. **Update package.json** with new scripts
2. **Modify generate-content.js** to include software content
3. **Test full build process** with both content sources
4. **Validate output formatting** and consistency

### Phase 3: Content Optimization
1. **Fine-tune summary length** for optimal readability
2. **Ensure responsive behavior** across screen sizes
3. **Validate link functionality** and accessibility
4. **Test with different content volumes**

## Success Criteria

1. ✅ Successfully parse AWS Builder JSON structure
2. ✅ Generate consistent minimalistic format matching football content
3. ✅ Convert Unix timestamps to DD/MM/YYYY format
4. ✅ Create proper AWS Builder URLs from contentId
5. ✅ Smart summarization of markdown content
6. ✅ Integration with existing build process
7. ✅ Maintain performance and build times
8. ✅ Professional "Software Engineering Notes" section presentation
9. ✅ Consistent styling across all content sections
10. ✅ Proper error handling and validation

## Technical Considerations

### Content Processing
- **Markdown handling**: Process `markdownDescription` field appropriately
- **Length optimization**: Balance between information and scannability
- **HTML stripping**: Clean any residual HTML from markdown content
- **URL validation**: Ensure generated AWS Builder URLs are correct

### Performance Impact
- **Build time**: Minimal impact with local JSON processing
- **File size**: Appropriate content length for web delivery
- **Caching**: Leverage existing build caching mechanisms
- **Error handling**: Graceful degradation if content unavailable

### Maintenance
- **Content updates**: Manual JSON file updates or future automation
- **Format consistency**: Maintain alignment with football content style
- **Extensibility**: Easy addition of new content sources
- **Documentation**: Clear setup and maintenance instructions

## Status: Planned

Ready for implementation. This unit will create a professional software blog section that showcases AWS Builder content using the same elegant, minimalistic formatting established in the football section.

## Next Steps

1. **Create fetch-awsbuilder-content.js** script with AWS Builder JSON parsing
2. **Implement date and URL conversion** functions
3. **Add smart markdown summarization** for appropriate content length
4. **Integrate with build process** and test full workflow
5. **Validate output formatting** and cross-browser compatibility
6. **Document usage and maintenance** procedures
