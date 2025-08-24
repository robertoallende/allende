# 04_content_001: Content System with Configuration and File Loading

## Objective
Replace hardcoded content in `multi-thread-runtime.tsx` with a flexible file-based content system. Create a configuration file that defines topics and loads content from separate markdown files during build time.

## Requirements Analysis

### Current State Issues
- **Hardcoded content**: All conversation content is inline in `multi-thread-runtime.tsx`
- **Mixed concerns**: Content and code are coupled together
- **Maintenance difficulty**: Updating content requires code changes
- **Scalability problems**: Adding new topics requires code modifications

### Target Architecture
- **Configuration-driven**: Topics defined in a central config file
- **File-based content**: Each content piece in separate markdown files
- **Build-time loading**: Content loaded during build process for optimal performance
- **Fail-fast validation**: Build fails if required files are missing

## Implementation Plan

### 1. Content Directory Structure
```
src/content/
├── config.ts                    # Topic configuration with metadata
├── blog_posts/
│   ├── initialMessage.md
│   ├── responses/
│   │   ├── 01.md
│   │   ├── 02.md
│   │   └── 03.md
│   └── followUps/
│       ├── 01.md
│       ├── 02.md
│       └── 03.md
├── projects/
│   ├── initialMessage.md
│   ├── responses/
│   │   ├── 01.md
│   │   └── 02.md
│   └── followUps/
│       ├── 01.md
│       └── 02.md
└── about/
    ├── initialMessage.md
    ├── responses/
    │   ├── 01.md
    │   └── 02.md
    └── followUps/
        ├── 01.md
        └── 02.md
```

### 2. Configuration File Design
**File**: `src/content/config.ts`
```typescript
export interface TopicConfig {
  title: string;
  directory: string;
  icon: string;
  description: string;
}

export const contentConfig: Record<string, TopicConfig> = {
  blog: {
    title: "Blog Posts",
    directory: "blog_posts",
    icon: "BookOpenIcon",
    description: "I write about software development, technology trends, and lessons learned from building applications."
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
```

### 3. Content Loading System
**File**: `src/content/loader.ts`
```typescript
import fs from 'fs';
import path from 'path';
import { contentConfig } from './config';

export interface LoadedContent {
  initialMessage: string;
  responses: string[];
  followUps: string[];
}

export function loadTopicContent(topicId: string): LoadedContent {
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

function loadFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8').trim();
  } catch (error) {
    throw new Error(`Failed to load required file: ${filePath}`);
  }
}

function loadNumberedFiles(dirPath: string): string[] {
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

export function loadAllContent(): Record<string, LoadedContent> {
  const content: Record<string, LoadedContent> = {};
  
  for (const topicId of Object.keys(contentConfig)) {
    content[topicId] = loadTopicContent(topicId);
  }
  
  return content;
}
```

### 4. Multi-Thread Runtime Updates
**File**: `components/chat/multi-thread-runtime.tsx`
- Remove hardcoded `topicConversations`
- Import content loading system
- Load content during component initialization
- Maintain existing conversation logic

## Technical Details

### Build-Time Loading Strategy
```typescript
// Load content at build time using Next.js static props or module loading
const contentData = loadAllContent(); // Executed during build

// Use in component
export function MultiThreadRuntime({ children }: { children: ReactNode }) {
  const [conversations] = useState(() => {
    // Transform loaded content into conversation format
    return Object.entries(contentData).reduce((acc, [topicId, content]) => {
      acc[topicId] = {
        initialMessage: content.initialMessage,
        responses: content.responses,
        followUps: content.followUps,
        responseIndex: 0
      };
      return acc;
    }, {} as Record<string, TopicConversation>);
  });
  
  // Rest of existing logic...
}
```

### Error Handling Strategy
- **Missing files**: Build fails with clear error message
- **Invalid structure**: Build fails with validation errors
- **Empty directories**: Build fails if no content files found
- **Configuration errors**: Build fails if topic config is invalid

### File Naming Convention
- **Initial messages**: `initialMessage.md`
- **Responses**: `responses/01.md`, `responses/02.md`, etc.
- **Follow-ups**: `followUps/01.md`, `followUps/02.md`, etc.
- **Directories**: Snake_case matching config (e.g., `blog_posts`)

## Migration Plan

### Phase 1: Create Content Structure
1. Create `src/content/` directory
2. Create `config.ts` with topic definitions
3. Create subdirectories for each topic
4. Create placeholder markdown files

### Phase 2: Extract Existing Content
1. Copy current hardcoded content to markdown files
2. Split responses and follow-ups into numbered files
3. Validate all content is properly extracted

### Phase 3: Implement Loading System
1. Create `loader.ts` with file loading functions
2. Add error handling and validation
3. Test loading system with existing content

### Phase 4: Update Runtime Component
1. Modify `multi-thread-runtime.tsx` to use loaded content
2. Remove hardcoded `topicConversations`
3. Integrate content loading with existing conversation logic

### Phase 5: Validation and Testing
1. Test build process with new content system
2. Verify all topics load correctly
3. Test error handling with missing files
4. Ensure conversation functionality remains intact

## Files to Create/Modify

### New Files
- `src/content/config.ts` - Topic configuration
- `src/content/loader.ts` - Content loading system
- `src/content/blog_posts/initialMessage.md` - Blog initial message
- `src/content/blog_posts/responses/01.md` - Blog response 1
- `src/content/blog_posts/responses/02.md` - Blog response 2
- `src/content/blog_posts/followUps/01.md` - Blog follow-up 1
- `src/content/projects/initialMessage.md` - Projects initial message
- `src/content/projects/responses/01.md` - Projects response 1
- `src/content/about/initialMessage.md` - About initial message
- `src/content/about/responses/01.md` - About response 1

### Modified Files
- `components/chat/multi-thread-runtime.tsx` - Use content loading system
- `components/chat/topic-sidebar.tsx` - Use config for topic metadata

## Expected Outcomes

### Content Management Benefits
- **Easy content updates**: Edit markdown files without touching code
- **Version control friendly**: Content changes tracked separately from code
- **Scalable structure**: Add new topics by creating directories and config entries
- **Clear organization**: Content logically separated by topic and type

### Developer Experience Benefits
- **Separation of concerns**: Content and code properly decoupled
- **Type safety**: Full TypeScript support for content structure
- **Build-time validation**: Catch content issues early in development
- **Maintainable codebase**: Cleaner, more focused component code

### Performance Benefits
- **Build-time loading**: No runtime file system access needed
- **Static content**: Content bundled with application for fast access
- **Optimized builds**: Content loaded once during build process

## Success Criteria

1. ✅ Content configuration system created with topic metadata
2. ✅ File-based content structure implemented with numbered files
3. ✅ Build-time content loading system functional
4. ✅ All existing content migrated to markdown files
5. ✅ Multi-thread runtime uses loaded content instead of hardcoded data
6. ✅ Build fails gracefully when content files are missing
7. ✅ Topic sidebar uses configuration for metadata
8. ✅ All conversation functionality preserved
9. ✅ TypeScript compilation successful
10. ✅ Content easily editable without code changes

## AI Interactions

This unit will require:
1. File system operations for content loading
2. TypeScript interface design for content structure
3. Error handling and validation logic
4. Component refactoring to use loaded content
5. Build process integration for static content loading

## Next Steps

After completion, this will provide:
- **Flexible content system** ready for easy updates
- **Scalable architecture** for adding new topics
- **Clean separation** between content and application logic
- **Foundation for CMS integration** if needed in the future

## Status: Complete ✅

### Implementation Summary
Successfully replaced hardcoded content in `multi-thread-runtime.tsx` with a flexible file-based content system:

1. **Content Directory Structure**: Created organized directory structure with separate markdown files
2. **Configuration System**: Implemented TypeScript configuration with topic metadata
3. **Build-Time Loading**: Created script to generate JSON content at build time
4. **Component Updates**: Updated runtime and sidebar to use loaded content
5. **Build Integration**: Added content generation to build process

### Files Created
- `src/content/config.ts` - Topic configuration with metadata
- `src/content/loader.ts` - Content loading system (now uses generated JSON)
- `scripts/generate-content.js` - Build-time content generation script
- `src/content/generated-content.json` - Generated content data
- Content directories and markdown files:
  - `src/content/blog_posts/` - Blog content (initialMessage.md, responses/01-02.md, followUps/01-04.md)
  - `src/content/projects/` - Projects content (initialMessage.md, responses/01-02.md, followUps/01-04.md)
  - `src/content/about/` - About content (initialMessage.md, responses/01-03.md, followUps/01-04.md)

### Files Modified
- `components/chat/multi-thread-runtime.tsx` - Uses content loading system instead of hardcoded data
- `components/chat/topic-sidebar.tsx` - Uses configuration for topic metadata
- `package.json` - Added content generation to build script

### Technical Implementation
- **Build-time generation**: Content loaded from markdown files during build process
- **JSON output**: Generated content stored as JSON for client-side consumption
- **Type safety**: Full TypeScript support for content structure
- **Error handling**: Build fails if content files are missing
- **Maintainable**: Easy to add new topics by creating directories and config entries

### Testing Results
- ✅ TypeScript compilation successful
- ✅ Build process completes successfully (196kB bundle)
- ✅ Content properly loaded from markdown files
- ✅ All existing functionality preserved
- ✅ Configuration-driven topic generation working
- ✅ Sidebar uses dynamic topic metadata

### Benefits Achieved
- **Content/code separation**: Content can be edited without touching code
- **Scalable structure**: New topics added via configuration and directories
- **Build-time validation**: Missing content files cause build failure
- **Performance**: Static content bundled with application
- **Developer experience**: Clear organization and type safety

Unit 04_content_001 successfully completed! 🎉
