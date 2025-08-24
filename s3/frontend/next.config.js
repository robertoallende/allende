/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Amplify hosting
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  
  // Configure trailing slash for consistent routing
  trailingSlash: true,
  
  // Ensure proper asset handling for static export
  assetPrefix: '',
  
  // Configure for static export compatibility
  distDir: '.next',
  
  // Disable features that require server
  poweredByHeader: false,
  
  // Ensure static export works properly
  experimental: {
    // Disable server components that might cause issues
    appDir: true,
  },
  
  // Configure for Amplify deployment
  env: {
    CUSTOM_KEY: 'static-export',
  },
};

module.exports = nextConfig;
