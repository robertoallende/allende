# Project Plan and Dev Log

Transform allende.nz from a Next.js chat-style interface to a modern Astro portfolio website using Micromanaged Driven Development methodology, preserving unique conversational content while presenting a professional portfolio facade.

## Structure

This project follows MMDD methodology with units representing major development phases. Each unit contains discrete tasks that build incrementally toward the final goal. Units focus on content transformation, portfolio presentation, and deployment infrastructure.

## About the Project

### What This Is
A complete reimplementation of allende.nz personal website using Astro and Astrofolio theme. The project transforms the existing Next.js chat-style interface into a professional portfolio while preserving the unique conversational content in hidden routes. Built for dual audiences: professional portfolio visitors and personal network accessing conversational content.

### Architecture
```
allende.nz-astro/
├── src/
│   ├── pages/
│   │   ├── about/index.astro        # /about
│   │   ├── software/index.astro     # /software  
│   │   ├── football/index.astro     # /football
│   │   ├── contact/index.astro      # /contact
│   │   └── x/[...slug].astro        # /x/* (hidden content)
│   ├── content/
│   │   ├── portfolio/               # Main navigation content
│   │   │   ├── about/
│   │   │   ├── software/
│   │   │   ├── football/
│   │   │   └── contact/
│   │   └── x/                       # Hidden conversational content
│   │       ├── piro.md              # Poetry document 1
│   │       ├── poetry.md            # Poetry document 2
│   │       ├── about.md             # Original chat about
│   │       ├── software/            # Tech chat transcripts
│   │       └── football/            # Football conversations
│   ├── components/
│   │   ├── portfolio/               # Portfolio-specific components
│   │   ├── chat/                    # Chat-style components for /x/ routes
│   │   └── shared/                  # Reusable components
│   └── styles/
│       ├── portfolio.css            # Main site styling
│       ├── chat.css                 # Chat interface styling
│       └── animations.css           # Chat-style animations
├── public/                          # Static assets
└── dev_log/                         # MMDD development documentation
```

Build process generates static HTML/CSS/JS for deployment to GitHub Pages or Vercel with custom domain (allende.nz).

### Technical Stack
- **Framework:** Astro with Astrofolio theme
- **Content:** Markdown/MDX with content collections
- **Styling:** Tailwind CSS + custom theme (gray/orange dark mode)
- **Features:** Portfolio showcase, blog, contact form, hidden chat content
- **SEO:** Built-in Astrofolio SEO + custom structured data
- **RSS:** Automated feed generation for blog content
- **Analytics:** Google Analytics 4 integration
- **Animations:** Chat-style content appearance effects
- **Deployment:** GitHub Actions → GitHub Pages/Vercel
- **Domain:** allende.nz (custom domain)
- **Node.js:** v22.19.0+

### Source Content Analysis
**Original Implementation (Next.js + AWS):**
- Chat-style interface with conversational navigation
- Content sections: About, Software/Blog, Projects, Football, Poetry, Contact
- AWS backend: Lambda, SES, API Gateway for email functionality
- External content integration: AWS Builder blog, football analysis
- Multiple themes: Claude-inspired, dark, light modes
- Mobile-first responsive design
- Real email system through conversational flow

**Content Transformation Strategy:**
- **Main Navigation**: Professional portfolio sections (About, Software, Football, Contact)
- **Hidden Routes**: Conversational content preserved under /x/ namespace
- **Dual Presentation**: Same content, different formats (portfolio vs chat)
- **Content Preservation**: All original chat transcripts and conversations maintained

## Project Status
### Overall Completion
46% - Units 1-6 complete (Foundation + Content phases complete)

### Units Completed
* **01**: Astro Setup & Astrofolio Integration ✅
* **02**: Content Architecture Setup ✅  
* **03**: Navigation & Routing ✅
* **04**: Home Page & Portfolio Foundation ✅
* **05**: Content Migration ✅
* **06**: External RSS Feed Integration ✅
* **07**: Navigation Structure Simplification ✅
* **08**: Content Formatting and Styling Improvements ✅
* **09**: RSS Unification and Content Additions ✅
* **10**: Chatbot-Style Typewriter Animation ✅
* **11**: SEO & Performance Optimization ✅

### Planned Features
- Modern Astro-based portfolio architecture
- Astrofolio theme integration with custom branding
- Dual content structure (portfolio + hidden conversational content)
- Professional main navigation (About, Software, Football, Contact)
- Hidden conversational routes (/x/piro, /x/poetry, /x/about, etc.)
- Content migration from Next.js chat interface to Astro collections
- Custom theme matching original gray/orange dark mode colors
- Chat-style animations for content appearance
- Contact form functionality (simplified from original AWS backend)
- Blog integration with external content feeds
- Football analysis section (unique differentiator)
- Poetry/creative content in hidden routes
- SEO optimization for professional discovery
- RSS feed generation for blog content
- Google Analytics 4 integration
- Mobile-first responsive design
- GitHub Actions deployment pipeline

## Units Planned

### Phase 1: Foundation (Units 1-4)
* **01**: Astro Setup & Astrofolio Integration - Initialize project, install theme, configure development environment
* **02**: Content Architecture Setup - Create dual content structure (portfolio + /x/ routes), configure collections
* **03**: Navigation & Routing - Implement main navigation, set up hidden route handling, configure URL structure
* **04**: Home Page & Portfolio Foundation - Convert to portfolio layout, create compelling landing page

### Phase 2: Content & Polish (Units 5-8)
* **05**: Content Migration - Transform chat content to portfolio format, preserve conversational content in /x/ routes
* **06**: Software/Blog Section - Implement tech content, integrate external feeds, create blog functionality
* **07**: Theme Customization - Extract and implement gray/orange color scheme, match original dark theme
* **08**: Mobile & Responsive Optimization - Ensure mobile-first design, test across devices

### Phase 3: Advanced Features (Units 9-12)
* **09**: Football Section Implementation - Create football analysis showcase, migrate football content
* **10**: Contact Form & Hidden Content - Implement contact functionality, finalize /x/ route content
* **11**: Animation System - Implement chat-style content appearance animations, typewriter effects
* **12**: SEO & Performance Optimization - Enhanced SEO, RSS feeds, performance tuning

### Phase 4: Deployment (Unit 13)
* **13**: GitHub Actions & Production Deployment - Configure deployment pipeline, custom domain setup, production testing

## Expected Workflow
- Transform existing Next.js chat content to Astro portfolio format
- Preserve conversational personality in hidden /x/ routes
- Implement professional portfolio presentation for main navigation
- Run `npm run dev` for live preview with hot reload
- Run `npm run build` for production static files
- Push to GitHub triggers automated deployment via GitHub Actions
- Monitor live site at allende.nz

## Key Design Decisions

### Content Strategy
- **Dual Audience Approach**: Professional visitors see portfolio, personal network accesses conversational content
- **URL Structure**: Clean main routes (/about, /software, /football, /contact) + hidden /x/ namespace
- **Content Preservation**: All original chat transcripts and conversations maintained
- **Progressive Disclosure**: Professional facade with hidden personality layers

### Technical Approach
- **Astrofolio Base**: Proven portfolio theme with built-in features (SEO, RSS, animations)
- **Content Collections**: Separate collections for portfolio and hidden content
- **Component Architecture**: Reusable components for both portfolio and chat presentations
- **Theme Customization**: Match original gray/orange dark mode while maintaining Astrofolio structure

### Feature Priorities
1. **Essential**: Portfolio structure, content migration, main navigation
2. **Important**: Hidden routes, theme customization, contact form
3. **Enhancement**: Chat animations, advanced SEO, performance optimization

## Success Criteria
- Professional portfolio presentation suitable for career/business use
- All original conversational content preserved and accessible
- Unique personality maintained through hidden routes and animations
- Mobile-first responsive design across all devices
- SEO optimized for professional discovery
- Fast loading performance with Astro static generation
- Automated deployment pipeline for easy updates
- Custom domain (allende.nz) properly configured

## Reference Implementation
- **Original Site**: allende.nz (Next.js + AWS backend)
- **Source Analysis**: `/Users/robertoallende/code/astro/allende.nz/discover/`
- **MMDD Template**: `/Users/robertoallende/code/astro/astro/MMDD_ASTRO_TEMPLATE.md`
- **Component Library**: `/Users/robertoallende/code/astro/mmdd/remake/src/components/`
- **Deployment Pattern**: `/Users/robertoallende/code/astro/mmdd/remake/.github/workflows/deploy.yml`

This project demonstrates MMDD methodology applied to a complex content transformation challenge, balancing professional presentation with personal authenticity through systematic development and dual content architecture.
