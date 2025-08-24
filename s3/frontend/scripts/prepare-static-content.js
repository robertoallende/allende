const fs = require('fs');
const path = require('path');

/**
 * Prepare static content for deployment by copying content rules and responses
 * to the public directory where they can be served as static files
 */
function prepareStaticContent() {
  console.log('🔧 Preparing static content for deployment...');
  
  try {
    // Define paths
    const publicContentDir = path.join(__dirname, '../public/content');
    const sourceRulesDir = path.join(__dirname, '../src/content/rules');
    const sourceResponsesDir = path.join(sourceRulesDir, 'responses');
    const sourceRulesFile = path.join(sourceRulesDir, 'content-rules.json');
    
    // Ensure public content directory exists
    if (!fs.existsSync(publicContentDir)) {
      fs.mkdirSync(publicContentDir, { recursive: true });
      console.log('📁 Created public/content directory');
    }
    
    // Copy content rules JSON file
    if (fs.existsSync(sourceRulesFile)) {
      const targetRulesFile = path.join(publicContentDir, 'content-rules.json');
      fs.copyFileSync(sourceRulesFile, targetRulesFile);
      console.log('✅ Copied content-rules.json');
    } else {
      console.warn('⚠️  content-rules.json not found, creating empty rules');
      const emptyRules = { rules: [] };
      fs.writeFileSync(
        path.join(publicContentDir, 'content-rules.json'),
        JSON.stringify(emptyRules, null, 2)
      );
    }
    
    // Copy response files
    const responsesTargetDir = path.join(publicContentDir, 'responses');
    if (!fs.existsSync(responsesTargetDir)) {
      fs.mkdirSync(responsesTargetDir, { recursive: true });
      console.log('📁 Created public/content/responses directory');
    }
    
    if (fs.existsSync(sourceResponsesDir)) {
      const files = fs.readdirSync(sourceResponsesDir);
      let copiedCount = 0;
      
      files.forEach(file => {
        if (file.endsWith('.md')) {
          const sourcePath = path.join(sourceResponsesDir, file);
          const targetPath = path.join(responsesTargetDir, file);
          fs.copyFileSync(sourcePath, targetPath);
          copiedCount++;
        }
      });
      
      console.log(`✅ Copied ${copiedCount} response files`);
    } else {
      console.warn('⚠️  responses directory not found');
    }
    
    // Copy generated content if it exists
    const generatedContentFile = path.join(__dirname, '../src/content/generated-content.json');
    if (fs.existsSync(generatedContentFile)) {
      const targetGeneratedFile = path.join(publicContentDir, 'generated-content.json');
      fs.copyFileSync(generatedContentFile, targetGeneratedFile);
      console.log('✅ Copied generated-content.json');
    }
    
    // Create a manifest file for debugging
    const manifest = {
      timestamp: new Date().toISOString(),
      files: {
        rules: fs.existsSync(path.join(publicContentDir, 'content-rules.json')),
        generatedContent: fs.existsSync(path.join(publicContentDir, 'generated-content.json')),
        responses: fs.existsSync(responsesTargetDir) ? fs.readdirSync(responsesTargetDir).length : 0
      }
    };
    
    fs.writeFileSync(
      path.join(publicContentDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log('✅ Static content preparation complete!');
    console.log('📊 Manifest:', manifest);
    
  } catch (error) {
    console.error('❌ Error preparing static content:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  prepareStaticContent();
}

module.exports = { prepareStaticContent };
