# Unit 01: Foundation

## Objective

Initialize Astro project with Astrofolio theme and configure development environment as the foundation for transforming allende.nz from Next.js chat interface to professional portfolio website.

## Implementation

### Technical Approach

1. **Initialize Astro Project with Astrofolio**
   - Clone or install Astrofolio theme from GitHub
   - Configure package.json with project-specific details
   - Install dependencies with npm (Node.js 22.x)
   - Verify Astrofolio theme structure and features

2. **Configure Development Environment**
   - Set up Node.js 22.x environment
   - Configure npm scripts for development and build
   - Test development server with hot reload
   - Verify build process generates static files

3. **Project Structure Setup**
   - Understand Astrofolio's default structure
   - Plan content collections for dual architecture
   - Configure basic Astro settings
   - Set up Git repository for development tracking

4. **Theme Verification**
   - Test Astrofolio's built-in features (MDX, SEO, RSS)
   - Verify light/dark mode functionality
   - Check responsive design and animations
   - Ensure all dependencies work correctly

### Key Decisions

- **Theme Choice:** Astrofolio for portfolio-focused features and built-in optimizations
- **Node Version:** 22.x for compatibility with latest Astro features
- **Package Manager:** npm for consistency with MMDD template
- **Development Approach:** Start with clean Astrofolio, customize incrementally

### Files to Create/Modify

**New project structure:**
- `package.json` - Project configuration and dependencies
- `astro.config.mjs` - Astro and theme configuration
- `src/` - Source code directory with Astrofolio structure
- `public/` - Static assets
- `.gitignore` - Git ignore patterns for Astro project

**Configuration files:**
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.mjs` - Tailwind CSS configuration (if needed)

### Success Criteria

- [ ] Astro project initialized with Astrofolio theme
- [ ] Development server runs without errors (`npm run dev`)
- [ ] Build process generates static files (`npm run build`)
- [ ] Astrofolio default content renders correctly
- [ ] All theme features functional (MDX, dark mode, animations)
- [ ] Project structure ready for content collections
- [ ] Git repository configured for development
- [ ] Dependencies installed with 0 vulnerabilities

## Status: Planned

Ready to initialize Astro project with Astrofolio theme and establish development foundation for allende.nz portfolio transformation.
