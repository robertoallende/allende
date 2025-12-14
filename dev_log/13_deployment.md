# Unit 13: GitHub Pages Deployment Migration

## Objective
Migrate allende.nz deployment from AWS Amplify to GitHub Pages using GitHub Actions, following the MMDD deployment pattern with custom domain configuration.

## Migration Strategy

### Current State
- **Hosting**: AWS Amplify
- **Domain**: allende.nz custom domain
- **Build**: Astro static site generation
- **Content**: 11 pages with portfolio + /x/ routes

### Target State
- **Hosting**: GitHub Pages
- **Deployment**: GitHub Actions workflow
- **Domain**: allende.nz (migrated from Amplify)
- **Pattern**: MMDD-style deployment pipeline

## Implementation Steps

### 1. GitHub Repository Setup
- Ensure repository has GitHub Pages enabled
- Configure Pages source to GitHub Actions
- Set up custom domain in repository settings

### 2. GitHub Actions Workflow
- Create `.github/workflows/deploy.yml`
- Manual deployment trigger (workflow_dispatch)
- Astro build and validation process
- Custom domain CNAME configuration

### 3. Domain Migration
- Update DNS from AWS Amplify to GitHub Pages
- Configure CNAME record: allende.nz → username.github.io
- Verify SSL certificate provisioning

### 4. Build Validation
- Verify all 11 pages build successfully
- Check portfolio and /x/ routes accessibility
- Validate RSS feeds and sitemap generation
- Confirm analytics and SEO integration

## Deployment Workflow

```yaml
# Manual deployment trigger
on: workflow_dispatch

jobs:
  - Setup Node.js 22.x environment
  - Install dependencies and build Astro site
  - Validate build output (HTML, CSS, JS, RSS, sitemap)
  - Create CNAME file for allende.nz
  - Deploy to GitHub Pages
```

## GitHub Pages Configuration Required

### Repository Settings
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Configure custom domain: allende.nz
4. Enable "Enforce HTTPS"

### DNS Configuration
- Update CNAME record to point to GitHub Pages
- Verify domain ownership in GitHub

## Key Differences from MMDD
- **Domain**: allende.nz (vs mmdd.dev)
- **Content**: Portfolio + hidden routes (vs documentation site)
- **Analytics**: G-TXYD29HN0T (vs G-2QVVJSV702)
- **Validation**: Portfolio-specific checks

## Status
🔄 **In Progress** - Setting up GitHub Pages migration

## Next Steps
1. Create GitHub Actions workflow file
2. Configure repository Pages settings
3. Test deployment pipeline
4. Update DNS configuration
5. Verify live site functionality
