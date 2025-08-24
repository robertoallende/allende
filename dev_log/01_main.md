# Project Plan and Dev Log

This project creates and documents the development of a personal website for the AWS Builder Challenge #2 using Micromanaged Driven Development (MMDD) principles.

## Structure

Each unit represents a major phase in the development, and optional subunits capture specific design or implementation tasks. Files follow the naming convention:

```
<sequence>_<unitname>[_subunit].md
```

For example: `02_content.md` or `05_api-chat_prompt.md`.

## About the Project

### What This Is

A chat-style personal "About Me" website with the following sections: About, Blog, Projects, Poetry, and Contact. Each section is presented as a static chat transcript, with optional live Q\&A powered by Amazon Bedrock (Titan Text-Lite). The project is built to comply with the AWS Builder Challenge rules: HTTPS, working contact form, open-source code, and substantial use of Q Developer.

### Architecture

* **Frontend:** Next.js + Tailwind + `assistant-ui` for the chat interface
* **Static Content:** JSON/Markdown transcripts in S3, served via CloudFront with ACM certificate
* **APIs:** API Gateway + Lambda

  * `/api/chat`: Titan Text-Lite with context snippets
  * `/api/contact`: SES send + optional S3 store
  * `/api/human`: Human verification (bot checks, CAPTCHA)
* **Safety:** Pre-checks in Lambda (regex, max length, rate limits), strict system prompt, conditional Guardrails
* **Deployment:** Amplify Hosting or GitHub Actions → S3 + CloudFront invalidation

### Technical Stack

* **Languages:** TypeScript, React/Next.js
* **Styling:** TailwindCSS
* **Components:** assistant-ui
* **Cloud:** AWS S3, CloudFront, API Gateway, Lambda, SES, Bedrock Titan Lite
* **AI Tools:** Amazon Q Developer CLI, Bedrock Guardrails (conditional)
* **Version Control:** GitHub (MIT License)

## Project Status

### Overall Completion

Frontend development phase complete (Units 2.1-2.11). Content system fully implemented with external integration (Units 4.1-4.2). Ready to proceed with repository setup and backend implementation.

### Completed Features

**Frontend Implementation (Complete)**
- ✅ Next.js 15 + TypeScript + Tailwind CSS setup
- ✅ Assistant-UI integration with custom components
- ✅ Multi-thread conversation system with topic-based navigation
- ✅ Real content integration from markdown files
- ✅ Three-theme system (default, dark, claude) with CSS variables
- ✅ Enhanced message rendering with smooth streaming markdown
- ✅ Responsive sidebar with topic navigation and theme selection
- ✅ Claude theme as default with custom input styling (#30302E bg, #5B5A56 border)
- ✅ Configuration system for UI customization and theme defaults
- ✅ File-based content system with build-time generation
- ✅ External content integration from JSON feeds with error handling
- ✅ Optimized content area layout with improved width and centering
- ✅ Enhanced link readability with modern styling and hover effects
- ✅ Clean, borderless interface with eliminated theme flash
- ✅ Consistent styling and user experience across all components

**Metrics**: 15 units completed (11 frontend + 2 theming + 2 content), ~70 files created/modified, full TypeScript coverage

## Units Implemented

### Completed Units

* **00**: MMDD Principles (imported from base repo)
* **01**: Project Plan and Dev Log - Initial project structure and planning ✅
* **002_frontend_001**: Frontend Setup - Next.js, TypeScript, Tailwind CSS, essential dependencies ✅
* **002_frontend_002**: Chat UI Implementation - assistant-ui integration with basic thread components ✅
* **002_frontend_003**: Multi-Thread Runtime - Topic-based conversation system with cached responses ✅
* **002_frontend_004**: Content Integration - Real markdown content from files, topic threads ✅
* **002_frontend_005**: Theme System - Multi-theme support (default, dark, claude) with CSS variables ✅
* **002_frontend_006**: Enhanced Messages - Custom message components with markdown rendering ✅
* **002_frontend_007**: Topic Sidebar - Navigation sidebar with topic selection and theme picker ✅
* **002_frontend_008**: Markdown Rendering - Smooth streaming markdown with proper styling ✅
* **002_frontend_009**: New Conversation Styling - Consistent button styling with active states ✅
* **002_frontend_010**: Claude Theme Input & Config - Input styling and theme configuration system ✅
* **02_frontend_012**: Content Area Width, Centering, and Link Styling - Improved content layout and readability ✅
* **002_theming_011**: Remove Lines & Theme Flash - Eliminated horizontal borders and white flash on page load ✅
* **03_theming_001**: Claude Colors - Authentic Claude theme with exact color matching ✅
* **04_content_001**: File-based Content System - Replaced hardcoded content with markdown files and build-time generation ✅
* **004_content_002**: External Football Content Integration - Dynamic football blog content from external JSON feed ✅

### Units In Progress

* **03\_repository**: Bootstrap repo, license, README, CI skeleton — status: Planned

## Planned Units

* **02\_frontend**: Frontend development with React, Tailwind, and chat UI
  * **002\_frontend\_001**: Setup React, Tailwind and basic tools in s3/frontend directory
  * **002\_frontend\_002**: Add chat UI using assistant-ui package (reference tmp/ docs and repo)
  * **002\_frontend\_003**: Create cached conversations for Home (blog posts), Projects, About, Contact with placeholder content
  * **002\_frontend\_004**: Replace placeholders with real content rendered from .md files at build stage
* **03\_repository**: Bootstrap repo, license, README, CI skeleton
* **04\_api-chat**: Lambda for Titan Text-Lite prompt building and response
* **05\_api-contact**: Lambda for SES email sending and validation
* **06\_human-gate**: Bot/human check implementation
* **07\_infra**: IaC for S3, CloudFront, ACM, APIGW, Lambdas, SES
* **08\_ci-cd**: Amplify Hosting or GitHub Actions pipeline
* **09\_article**: AWS Builder Center submission article with screenshots, Q Developer usage
* **10\_polish**: CSS animations, theme toggle, performance pass
