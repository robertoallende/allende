const fs = require('fs');
const path = require('path');

/**
 * Fetch Football Content Script
 * 
 * Reads the external football feed JSON and generates markdown content
 * for the football blog section.
 */

const FEED_PATH = path.join(__dirname, '../src/content/external/feed.json');
const OUTPUT_PATH = path.join(__dirname, '../src/content/football_blog/initialMessage.md');

/**
 * Strip HTML tags and decode HTML entities from text
 */
function stripHtml(html) {
  if (!html) return '';
  
  // First decode HTML entities
  const decoded = html
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&hellip;/g, '...')
    .replace(/&nbsp;/g, ' ');
  
  // Then strip HTML tags
  return decoded.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Truncate text to specified length with ellipsis
 */
function truncateText(text, maxLength = 200) {
  if (!text) return '';
  const cleaned = stripHtml(text);
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength).trim() + '...';
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.warn(`Warning: Could not parse date "${dateString}"`);
    return 'Unknown date';
  }
}

/**
 * Generate markdown content from feed data
 */
function generateMarkdown(feedData) {
  const { items = [] } = feedData;
  
  // Sort by date (newest first) and take latest 5
  const sortedItems = items
    .sort((a, b) => new Date(b.date_published) - new Date(a.date_published))
    .slice(0, 5);

  let markdown = `# Football Blog

Recent insights from my football analysis and coaching experience:

`;

  sortedItems.forEach((item, index) => {
    const title = stripHtml(item.title) || 'Untitled Post';
    const url = item.url || '#';
    const summary = truncateText(item.summary, 200);
    const date = formatDate(item.date_published);

    markdown += `## [${title}](${url})
*Published: ${date}*

${summary}

[Read more →](${url})`;

    // Add separator between posts (except for the last one)
    if (index < sortedItems.length - 1) {
      markdown += '\n\n---\n\n';
    }
  });

  // Add footer
  markdown += `

---

*Want to discuss football tactics or share your thoughts? Feel free to reach out!*`;

  return markdown;
}

/**
 * Main execution function
 */
function main() {
  try {
    console.log('🏈 Fetching football content...');
    
    // Check if feed file exists
    if (!fs.existsSync(FEED_PATH)) {
      console.error(`❌ Error: Feed file not found at ${FEED_PATH}`);
      console.error('Make sure to download the feed.json file to src/content/external/');
      process.exit(1);
    }

    // Read and parse the feed
    const feedContent = fs.readFileSync(FEED_PATH, 'utf8');
    let feedData;
    
    try {
      feedData = JSON.parse(feedContent);
    } catch (parseError) {
      console.error('❌ Error: Invalid JSON in feed file');
      console.error(parseError.message);
      process.exit(1);
    }

    // Validate feed structure
    if (!feedData.items || !Array.isArray(feedData.items)) {
      console.error('❌ Error: Invalid feed structure - missing or invalid "items" array');
      process.exit(1);
    }

    if (feedData.items.length === 0) {
      console.error('❌ Error: No items found in feed');
      process.exit(1);
    }

    console.log(`📄 Found ${feedData.items.length} posts in feed`);

    // Generate markdown content
    const markdown = generateMarkdown(feedData);

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the generated markdown
    fs.writeFileSync(OUTPUT_PATH, markdown, 'utf8');

    console.log(`✅ Football content generated successfully: ${OUTPUT_PATH}`);
    console.log(`📊 Generated content from ${Math.min(5, feedData.items.length)} latest posts`);

  } catch (error) {
    console.error('❌ Error generating football content:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, generateMarkdown, stripHtml, truncateText, formatDate };
