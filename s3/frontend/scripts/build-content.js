#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { remark } = require('remark');
const remarkFrontmatter = require('remark-frontmatter');
const remarkHtml = require('remark-html');
const Joi = require('joi');

// Paths
const CONTENT_DIR = path.join(__dirname, '../content');
const OUTPUT_DIR = path.join(__dirname, '../data/conversations');
const INDEX_FILE = path.join(CONTENT_DIR, 'index.json');

// Validation schemas
const indexSchema = Joi.object({
  conversations: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      title: Joi.string().required(),
      subtitle: Joi.string().required(),
      description: Joi.string().required(),
      order: Joi.number().integer().min(1).required(),
      category: Joi.string().required(),
      icon: Joi.string().required(),
      enabled: Joi.boolean().required(),
      file: Joi.string().required()
    })
  ).required()
});

const frontmatterSchema = Joi.object({
  conversation_id: Joi.string().required(),
  typing_delay: Joi.number().integer().min(500).max(5000).default(2000),
  follow_ups: Joi.array().items(Joi.string()).default([]),
  links: Joi.array().items(
    Joi.object({
      text: Joi.string().required(),
      url: Joi.string().uri().required(),
      type: Joi.string().valid('external', 'github', 'demo', 'article').default('external')
    })
  ).default([])
});

// Utility functions
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function logError(message, details = null) {
  console.error(`❌ ERROR: ${message}`);
  if (details) {
    console.error(`   Details: ${details}`);
  }
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

// Validation functions
function validateIndexFile(indexData) {
  const { error, value } = indexSchema.validate(indexData);
  if (error) {
    throw new Error(`Invalid index.json: ${error.details[0].message}`);
  }
  
  // Check for duplicate IDs
  const ids = value.conversations.map(c => c.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    throw new Error(`Duplicate conversation IDs found: ${duplicateIds.join(', ')}`);
  }
  
  // Check for duplicate orders
  const orders = value.conversations.map(c => c.order);
  const duplicateOrders = orders.filter((order, index) => orders.indexOf(order) !== index);
  if (duplicateOrders.length > 0) {
    throw new Error(`Duplicate conversation orders found: ${duplicateOrders.join(', ')}`);
  }
  
  return value;
}

function validateMarkdownFile(filePath, frontmatterData, content) {
  // Validate frontmatter
  const { error, value } = frontmatterSchema.validate(frontmatterData);
  if (error) {
    throw new Error(`Invalid frontmatter in ${filePath}: ${error.details[0].message}`);
  }
  
  // Check content length
  if (content.trim().length < 100) {
    throw new Error(`Content too short in ${filePath}: minimum 100 characters required`);
  }
  
  // Check for required markdown elements
  if (!content.includes('#')) {
    console.warn(`⚠️  Warning: No headers found in ${filePath}`);
  }
  
  return value;
}

// Content processing functions
async function processMarkdown(content) {
  // For now, just return the content as-is since we have our own markdown renderer
  // In the future, we could add more sophisticated processing here
  return content;
}

function createConversationData(indexEntry, frontmatter, content, htmlContent) {
  // Use our custom intro content instead of the full markdown
  const introContent = getIntroContent(indexEntry.id, content)
  
  return {
    conversations: [
      {
        id: indexEntry.id,
        title: indexEntry.title,
        description: indexEntry.description,
        category: indexEntry.category,
        messages: [
          {
            id: `${indexEntry.id}-welcome`,
            role: "user",
            content: `Tell me about ${indexEntry.title.toLowerCase()}`
          },
          {
            id: frontmatter.conversation_id,
            role: "assistant",
            content: introContent, // Use intro instead of full content
            metadata: {
              typing_delay: frontmatter.typing_delay,
              follow_ups: frontmatter.follow_ups,
              links: frontmatter.links
            }
          }
        ],
        suggested_follow_ups: frontmatter.follow_ups,
        related_topics: [],
        full_content: content, // Store full content for reference
        sections: extractContentSections(content) // Store sections for follow-up responses
      }
    ],
    quick_responses: {
      [indexEntry.id]: getQuickResponse(indexEntry.id, indexEntry.title)
    },
    fallback_responses: [
      `I'd be happy to tell you more about ${indexEntry.title.toLowerCase()}!`,
      `What specific aspect of ${indexEntry.title.toLowerCase()} interests you?`
    ]
  };
}

// Extract meaningful sections from markdown content
function extractContentSections(content) {
  const sections = {};
  
  // Split content by headers
  const lines = content.split('\n');
  let currentSection = 'intro';
  let currentContent = [];
  
  for (const line of lines) {
    if (line.startsWith('# ')) {
      // Main title - start intro section
      if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = 'intro';
      currentContent = [line];
    } else if (line.startsWith('## ')) {
      // Section header
      if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      // Create section key from header
      currentSection = line.replace('## ', '').toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      currentContent = [line];
    } else {
      currentContent.push(line);
    }
  }
  
  // Add final section
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n').trim();
  }
  
  return sections;
}

// Get intro content for each topic
function getIntroContent(topicId, fullContent) {
  const intros = {
    about: `# Hi there! 👋\n\nI'm **Roberto Allende**, a software engineer passionate about building innovative solutions with modern technologies.\n\n## Quick Overview\n- 🚀 **Focus**: Full-stack development with cloud architecture\n- 💡 **Interests**: AI/ML, serverless computing, and developer tools\n- 🎯 **Current**: Building with AWS services and exploring AI-powered applications\n- 📍 **Location**: San Francisco Bay Area\n- 🌍 **Remote**: Open to global collaboration\n\n## Professional Journey\nI'm a **Senior Software Engineer** specializing in:\n- **Cloud Architecture**: AWS-native solutions and serverless patterns\n- **AI Integration**: Building intelligent applications with modern AI APIs\n- **Developer Experience**: Creating tools that developers actually want to use\n\nWhat would you like to know more about?`,
    
    projects: `# My Project Portfolio 🚀\n\nI've been working on some exciting projects recently! Here are the highlights:\n\n## 🌟 **Featured Projects**\n\n### 1. **Personal Chat Website** (Current)\n*The very website you're using right now!*\n- **Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, assistant-ui\n- **Features**: Dynamic theme switching, responsive chat interface, AWS integration\n- **Highlights**: Built for AWS Builder Challenge with modern React patterns\n\n### 2. **AI-Powered Document Processor**\n*Enterprise document analysis and intelligent extraction*\n- **Tech Stack**: Python, AWS Bedrock, LangChain, FastAPI\n- **Results**: 90% reduction in manual processing time, 99.2% accuracy\n- **Scale**: Handles thousands of documents efficiently\n\n### 3. **Serverless E-commerce Platform**\n*Scalable online marketplace with real-time features*\n- **Scale**: 10,000+ concurrent users, 99.99% uptime\n- **Architecture**: AWS Lambda, DynamoDB, API Gateway\n- **Benefits**: 80% cost reduction, automatic scaling\n\nWhich project interests you most?`,
    
    blog: `# Technical Blog & Writing ✍️\n\nI write about the intersection of **technology, development, and real-world problem solving**. My focus is on practical insights rather than theoretical concepts.\n\n## 📚 **Recent Posts**\n\n### 🔧 **"Building with AWS Bedrock: A Developer's Journey"**\n*Published: August 2025 • 12 min read*\n- Model selection strategies and cost optimization\n- Performance patterns and streaming responses\n- Real code examples and production templates\n- **Results**: 90% cost reduction, 3x faster responses\n\n### ⚡ **"Serverless Architecture Patterns That Actually Work"**\n*Published: July 2025 • 15 min read*\n- Production-ready patterns at scale\n- Cold start optimization and monitoring\n- Real experience with 50+ Lambda functions\n- **Results**: 99.9% uptime across all systems\n\n### 🎨 **"The Art of Developer Experience"**\n*Published: June 2025 • 10 min read*\n- Building tools developers actually want to use\n- API design principles and documentation strategies\n- **Impact**: 95% adoption rate for internal tools\n\nWhat type of technical content interests you?`,
    
    poetry: `# Truth Is Like Poetry 🎭\n\n*"The truth is like poetry — and most people fucking hate poetry."* - Michael Lewis, The Big Short\n\nWelcome to my collection of creative writing, where technology meets verse, and code becomes art. These pieces reflect my journey through the digital world.\n\n## **Featured Pieces**\n\n### **"Digital Dreams"**\n*A reflection on our connected world*\n> In circuits deep and data streams,\n> We chase our silicon dreams...\n\n### **"The Developer's Lament"**\n*On the eternal struggle with bugs*\n> Oh bug, you elusive sprite,\n> You haunt my code both day and night...\n\n### **"Cloud Haiku Collection"**\n*Minimalist thoughts on cloud computing*\n> Lambda functions sleep\n> Until events wake them up—\n> Serverless beauty\n\n### **"The Commit Message"**\n*A programmer's poetry*\n> "Fix bug in user auth"—\n> Three words that hide a story...\n\nWhich piece would you like to explore?`,
    
    contact: `# Get In Touch 📬\n\nI'd love to hear from you! Whether you're interested in collaboration, have questions about my work, or just want to connect with a fellow developer.\n\n## 📧 **Primary Contact**\n- **Email**: roberto@allende.ai\n- **LinkedIn**: linkedin.com/in/robertoallende\n- **GitHub**: github.com/robertoallende\n- **Response Time**: 24-48 hours for email, 12-24 hours for LinkedIn\n\n## 💼 **What I'm Open To**\n\n### **Consulting & Freelance Work**\n- Cloud Architecture (AWS solutions and serverless design)\n- AI Integration (LLM APIs, RAG systems, intelligent applications)\n- Full-Stack Development (React, Node.js, TypeScript projects)\n- **Current Availability**: Limited spots for Q4 2025\n\n### **Speaking Engagements**\n- Conference talks on cloud, AI, and development\n- Workshop facilitation and hands-on training\n- **Topics**: Serverless architecture, AI integration, developer experience\n\n### **Collaboration Opportunities**\n- Open source projects and meaningful contributions\n- Technical writing and guest posts\n- Mentoring and code reviews\n\nWhat type of collaboration interests you?`
  };
  
  return intros[topicId] || fullContent.substring(0, 800) + '...';
}

// Get quick response for each topic
function getQuickResponse(topicId, title) {
  const responses = {
    about: "I'm a software engineer focused on cloud architecture and AI integration.",
    projects: "I've built several projects including AI tools, serverless platforms, and developer utilities.",
    blog: "I write about practical software development, cloud architecture, and AI integration.",
    poetry: "I create technical poetry that blends programming concepts with creative expression.",
    contact: "You can reach me via email at roberto@allende.ai or connect on LinkedIn."
  };
  
  return responses[topicId] || `Here's information about ${title.toLowerCase()}.`;
}

// Main processing function
async function buildContent() {
  try {
    logInfo('Starting content build process...');
    
    // Ensure output directory exists
    ensureDirectoryExists(OUTPUT_DIR);
    
    // Read and validate index file
    if (!fs.existsSync(INDEX_FILE)) {
      throw new Error(`Index file not found: ${INDEX_FILE}`);
    }
    
    const indexContent = fs.readFileSync(INDEX_FILE, 'utf8');
    let indexData;
    
    try {
      indexData = JSON.parse(indexContent);
    } catch (parseError) {
      throw new Error(`Invalid JSON in index file: ${parseError.message}`);
    }
    
    const validatedIndex = validateIndexFile(indexData);
    logSuccess(`Validated index.json with ${validatedIndex.conversations.length} conversations`);
    
    // Process each conversation
    const processedConversations = [];
    const conversationsList = [];
    
    for (const conversation of validatedIndex.conversations) {
      if (!conversation.enabled) {
        logInfo(`Skipping disabled conversation: ${conversation.id}`);
        continue;
      }
      
      const markdownPath = path.join(CONTENT_DIR, conversation.file);
      
      // Check if markdown file exists
      if (!fs.existsSync(markdownPath)) {
        throw new Error(`Markdown file not found: ${markdownPath}`);
      }
      
      // Read and parse markdown file
      const markdownContent = fs.readFileSync(markdownPath, 'utf8');
      const { data: frontmatter, content } = matter(markdownContent);
      
      // Validate markdown file
      const validatedFrontmatter = validateMarkdownFile(markdownPath, frontmatter, content);
      
      // Process markdown to HTML
      const htmlContent = await processMarkdown(content);
      
      // Create conversation data
      const conversationData = createConversationData(
        conversation,
        validatedFrontmatter,
        content,
        htmlContent
      );
      
      // Write individual conversation file
      const outputPath = path.join(OUTPUT_DIR, `${conversation.id}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(conversationData, null, 2));
      
      processedConversations.push(conversation.id);
      conversationsList.push({
        id: conversation.id,
        title: conversation.title,
        subtitle: conversation.subtitle,
        description: conversation.description,
        order: conversation.order,
        category: conversation.category,
        icon: conversation.icon
      });
      
      logSuccess(`Processed conversation: ${conversation.id}`);
    }
    
    // Create master conversations index
    const masterIndex = {
      conversations: conversationsList.sort((a, b) => a.order - b.order),
      generated_at: new Date().toISOString(),
      total_conversations: conversationsList.length
    };
    
    const masterIndexPath = path.join(OUTPUT_DIR, '_index.json');
    fs.writeFileSync(masterIndexPath, JSON.stringify(masterIndex, null, 2));
    
    logSuccess(`Generated master index with ${conversationsList.length} conversations`);
    logSuccess(`Content build completed successfully!`);
    
    // Summary
    console.log('\n📊 Build Summary:');
    console.log(`   • Processed: ${processedConversations.length} conversations`);
    console.log(`   • Output directory: ${OUTPUT_DIR}`);
    console.log(`   • Files generated: ${processedConversations.length + 1}`);
    console.log(`   • Build time: ${new Date().toLocaleTimeString()}`);
    
  } catch (error) {
    logError('Content build failed', error.message);
    process.exit(1);
  }
}

// Watch mode for development
function watchContent() {
  const chokidar = require('chokidar');
  
  logInfo('Starting content watcher...');
  
  const watcher = chokidar.watch([
    path.join(CONTENT_DIR, '*.json'),
    path.join(CONTENT_DIR, '*.md')
  ], {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  });
  
  watcher
    .on('change', (filePath) => {
      logInfo(`File changed: ${path.relative(CONTENT_DIR, filePath)}`);
      buildContent();
    })
    .on('add', (filePath) => {
      logInfo(`File added: ${path.relative(CONTENT_DIR, filePath)}`);
      buildContent();
    })
    .on('unlink', (filePath) => {
      logInfo(`File removed: ${path.relative(CONTENT_DIR, filePath)}`);
      buildContent();
    });
  
  logSuccess('Content watcher started. Press Ctrl+C to stop.');
  
  // Initial build
  buildContent();
}

// CLI handling
const args = process.argv.slice(2);
const command = args[0];

if (command === 'watch') {
  watchContent();
} else {
  buildContent();
}
