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
  
  // Ensure proper asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  
  // Configure for static export compatibility
  distDir: '.next',
  
  // Disable features that require server
  poweredByHeader: false,
};

module.exports = nextConfig;
