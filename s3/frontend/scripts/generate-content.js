const fs = require('fs');
const path = require('path');

// Import configuration (updated to match config.ts)
const contentConfig = {
  software: {
    title: "Software Engineering Notes",
    directory: "software_blog",
    icon: "BookOpenIcon",
    description: "Reflections on building and leading in the cloud era, from AI-first experiments to hard-earned lessons in delivering scalable, resilient systems."
  },
  football: {
    title: "Football Blog",
    directory: "football_blog",
    icon: "ZapIcon",
    description: "My thoughts and analysis on football, tactics, and the beautiful game."
  },
  projects: {
    title: "Projects", 
    directory: "projects",
    icon: "CodeIcon",
    description: "Here are some of the projects I've built and contributed to."
  },
  about: {
    title: "About",
    directory: "about", 
    icon: "UserIcon",
    description: "Hello! I'm Roberto, a passionate software engineer with a love for building innovative solutions."
  }
};

function loadFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8').trim();
  } catch (error) {
    throw new Error(`Failed to load required file: ${filePath}`);
  }
}

function loadNumberedFiles(dirPath) {
  try {
    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.md'))
      .sort()
      .map(file => loadFile(path.join(dirPath, file)));
    
    if (files.length === 0) {
      throw new Error(`No markdown files found in directory: ${dirPath}`);
    }
    
    return files;
  } catch (error) {
    throw new Error(`Failed to load directory: ${dirPath}`);
  }
}

function loadTopicContent(topicId) {
  const config = contentConfig[topicId];
  if (!config) {
    throw new Error(`Topic '${topicId}' not found in content configuration`);
  }

  const contentDir = path.join(process.cwd(), 'src/content', config.directory);
  
  // Load initial message
  const initialMessage = loadFile(path.join(contentDir, 'initialMessage.md'));
  
  // Load responses (numbered files)
  const responses = loadNumberedFiles(path.join(contentDir, 'responses'));
  
  // Load follow-ups (numbered files)
  const followUps = loadNumberedFiles(path.join(contentDir, 'followUps'));
  
  return { initialMessage, responses, followUps };
}

function generateContentData() {
  const content = {};
  
  for (const topicId of Object.keys(contentConfig)) {
    content[topicId] = loadTopicContent(topicId);
  }
  
  return content;
}

// Generate content and write to file
try {
  const contentData = generateContentData();
  const outputPath = path.join(process.cwd(), 'src/content/generated-content.json');
  
  fs.writeFileSync(outputPath, JSON.stringify(contentData, null, 2));
  console.log('✅ Content generated successfully:', outputPath);
} catch (error) {
  console.error('❌ Failed to generate content:', error.message);
  process.exit(1);
}
