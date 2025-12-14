# Unit 7: Navigation Structure Simplification

## Objective
Simplify the overly complex navigation structure by removing unnecessary sections and reorganizing content into a cleaner hierarchy.

## Current Issues
- Unnecessary blog section (not needed)
- Portfolio wrapper is redundant 
- Contact section is unnecessary
- Hidden folder should be renamed to 'x'
- Football, software, and projects should be direct content sections

## Target Structure
```
src/content/
├── football/
├── software/
├── projects/
└── x/           # renamed from hidden
    ├── about/
    ├── poetry/
    └── piro/
```

## Implementation Plan

### Step 1: Remove Blog Section
- Delete blog pages and content
- Remove blog navigation references

### Step 2: Flatten Portfolio Structure  
- Move football, software, projects from portfolio/ to content/
- Update content collection schema
- Update page references

### Step 3: Rename Hidden to X
- Rename hidden/ folder to x/
- Update page routes and references

### Step 4: Remove Contact Section
- Delete contact page and content
- Remove navigation references

### Step 5: Update Navigation
- Simplify navigation to: Football, Software, Projects
- Keep /x/ routes for conversational content

## Expected Outcome
- Cleaner, flatter content structure
- Simplified navigation without unnecessary sections
- Consistent with original allende.nz approach
- Easier content management

## Status
✅ **Complete**

## Implementation Summary

### Completed Changes
1. **Removed Blog Section** - Deleted blog pages, content, and references
2. **Flattened Portfolio Structure** - Moved football, software, projects to root content/
3. **Renamed Hidden to X** - Updated folder name and all references
4. **Removed Contact Section** - Deleted contact page and content  
5. **Updated Content Collections** - New schema for simplified structure
6. **Fixed Page References** - Updated all pages to use new collection structure

### Final Structure
```
src/content/
├── football/index.md
├── software/index.md  
├── projects/index.md
└── x/
    ├── about.md
    ├── poetry.md
    └── piro.md
```

### Pages Generated
- `/football/` - Football Analysis with RSS feed
- `/software/` - Software Engineering Notes with AWS Builder content
- `/projects/` - Projects overview
- `/x/about/`, `/x/poetry/`, `/x/piro/` - Hidden conversational content

### Build Results
- 8 pages built successfully
- RSS feeds working (football JSON, AWS Builder API)
- Clean navigation structure without unnecessary complexity
- Consistent with original allende.nz approach
