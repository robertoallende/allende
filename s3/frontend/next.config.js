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
  
  // Disable features that require server
  poweredByHeader: false,
};

module.exports = nextConfig;
