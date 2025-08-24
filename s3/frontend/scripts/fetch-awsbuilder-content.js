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

Reflections on building and leading teams in the cloud era, from AI-first experiments to hard-earned lessons in delivering scalable, resilient systems.

`;

  latestArticles.forEach((item, index) => {
    const title = stripHtml(item.title) || 'Untitled Post';
    const url = generateAwsBuilderUrl(item.contentId);
    
    // Use the article description instead of full markdownDescription
    const description = item.contentTypeSpecificResponse?.article?.description || 'No description available.';
    const summary = createSmartSummary(description, 300);
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

*Read all the articles at [AWS Builder Center](https://builder.aws.com/community/@robertoallende)*`;

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
