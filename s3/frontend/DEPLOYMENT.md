# Deployment Guide

This document explains how to deploy the personal portfolio chat interface to AWS Amplify.

## Prerequisites

- AWS Account with Amplify access
- GitHub repository connected to AWS Amplify
- Domain name (optional, for custom domain setup)

## Build Configuration

The application is configured for static export deployment using the `amplify.yml` configuration file in the repository root.

### Key Configuration Details

- **Build Tool**: pnpm with Node.js 20
- **Framework**: Next.js 15 with static export
- **Output Directory**: `out/` (Next.js static export)
- **Content Generation**: Automated during build process

## Local Testing

### Test Static Export Locally

```bash
# Build and export static files
npm run build

# Serve static files locally
npm run serve

# Visit http://localhost:3000 to test
```

### Verify Content System

The static export includes:
- `/content/content-rules.json` - Content matching rules
- `/content/responses/*.md` - Markdown response files
- `/content/generated-content.json` - External blog/article content
- `/content/manifest.json` - Build manifest for debugging

## AWS Amplify Setup

### 1. Connect Repository

1. Go to AWS Amplify Console
2. Choose "Host web app"
3. Connect your GitHub repository
4. Select the branch (usually `main`)

### 2. Build Settings

The `amplify.yml` file in the repository root contains the build configuration:

```yaml
version: 1
applications:
  - appRoot: s3/frontend
    frontend:
      phases:
        preBuild:
          commands:
            - nvm use 20 || nvm install 20
            - corepack enable
            - corepack prepare pnpm@9.12.0 --activate
            - pnpm install --frozen-lockfile
        build:
          commands:
            - pnpm run build
      artifacts:
        baseDirectory: out
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - ~/.pnpm-store/**/*
          - .next/cache/**/*
      env:
        variables:
          NODE_ENV: production
          NEXT_TELEMETRY_DISABLED: 1
```

### 3. Environment Variables

Set these in the Amplify Console under "Environment variables":

- `NODE_ENV`: `production`
- `NEXT_TELEMETRY_DISABLED`: `1`

### 4. Domain Configuration (Optional)

1. In Amplify Console, go to "Domain management"
2. Add your custom domain (e.g., `robertoallende.ai`)
3. Configure DNS settings as instructed
4. SSL certificate will be automatically provisioned

## Build Process

The build process includes these steps:

1. **Content Generation**: Fetch external content (football blog, AWS Builder articles)
2. **Static Preparation**: Copy content files to public directory
3. **Next.js Build**: Generate optimized production build
4. **Static Export**: Create static files in `out/` directory

### Content Sources

- **Football Blog**: RSS feed from football blog
- **AWS Builder Articles**: RSS feed from AWS Builder profile
- **Static Content**: Markdown files for content matching system

## Monitoring and Troubleshooting

### Build Logs

Check Amplify build logs for:
- Content generation success/failure
- Static content preparation
- Next.js build output
- Export completion

### Common Issues

#### Build Failures

1. **Node Version**: Ensure Node 20 is specified in amplify.yml
2. **pnpm Issues**: Verify Corepack configuration
3. **Content Generation**: Check external RSS feed availability

#### Runtime Issues

1. **Content Not Loading**: Verify static files in `/content/` directory
2. **404 Errors**: Check trailing slash configuration in next.config.js
3. **Mobile Issues**: Test responsive design on various devices

### Performance Monitoring

- **Amplify Analytics**: Built-in performance metrics
- **Core Web Vitals**: Monitor loading performance
- **Error Tracking**: Client-side error monitoring

## Rollback Procedure

### Quick Rollback

1. Go to Amplify Console
2. Select previous successful deployment
3. Click "Promote to main"

### Git-based Rollback

```bash
# Revert to previous commit
git revert <commit-hash>
git push origin main

# Amplify will automatically deploy the reverted version
```

## Security Considerations

### Static Site Security

- **No Server Vulnerabilities**: Static files eliminate server attack vectors
- **HTTPS Enforcement**: Amplify provides automatic HTTPS
- **Content Validation**: Build-time content validation and sanitization

### Content Security

- All content is pre-generated and validated during build
- No user-generated content or dynamic server processing
- External content sources are fetched securely during build

## Performance Optimization

### Build Performance

- **Dependency Caching**: pnpm store and node_modules cached
- **Incremental Builds**: Next.js build cache preserved
- **Content Caching**: Generated content cached between builds

### Runtime Performance

- **Static Files**: No server processing required
- **CDN Distribution**: Global edge caching through Amplify
- **Optimized Assets**: Next.js automatic optimization

## Support and Maintenance

### Regular Maintenance

1. **Content Updates**: External content automatically updated on each build
2. **Dependency Updates**: Regular npm audit and updates
3. **Performance Monitoring**: Regular performance reviews

### Emergency Procedures

1. **Build Failures**: Check build logs and external dependencies
2. **Content Issues**: Verify RSS feed availability
3. **Performance Issues**: Monitor Core Web Vitals and user reports

## Success Criteria

✅ **Successful Deployment**: Application deploys without errors  
✅ **Content Matching**: Intelligent content system works with static files  
✅ **Responsive Design**: Mobile and desktop experiences work perfectly  
✅ **Performance**: Fast loading times with CDN distribution  
✅ **Domain Configuration**: Custom domain works with HTTPS  
✅ **Build Automation**: Automated deployments on git push  

## Next Steps

After successful deployment:

1. **Domain Setup**: Configure custom domain if desired
2. **Analytics**: Set up monitoring and analytics
3. **Performance**: Monitor and optimize based on real usage
4. **Content**: Regular content updates and improvements

The deployment provides a robust, scalable hosting solution that maintains all sophisticated features while ensuring optimal performance and reliability for end users.
