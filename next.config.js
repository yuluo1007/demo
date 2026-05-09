const path = require('path');

const withAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true';
const repositoryName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split('/')[1]
  : '';
const pagesBasePath = isGitHubPagesBuild && repositoryName ? `/${repositoryName}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  output: isGitHubPagesBuild ? 'export' : 'standalone',
  basePath: pagesBasePath,
  assetPrefix: pagesBasePath || undefined,
  trailingSlash: isGitHubPagesBuild,

  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: isGitHubPagesBuild,
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  experimental: {
    scrollRestoration: true,
  },

  turbopack: {
    root: path.join(__dirname),
  },

  ...(!isGitHubPagesBuild
    ? {
        async headers() {
          const securityHeaders = [
            { key: 'X-DNS-Prefetch-Control', value: 'on' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
            },
          ];

          return [
            { source: '/:path*', headers: securityHeaders },
            {
              source: '/_next/static/:path*',
              headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
              ],
            },
            {
              source: '/(favicon.ico|robots.txt|sitemap.xml)',
              headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
            },
          ];
        },
      }
    : {}),
};

module.exports = withAnalyzer(nextConfig);
