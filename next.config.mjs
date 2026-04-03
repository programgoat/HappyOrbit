const repoName = 'HappyOrbit';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isGitHubPages ? 'export' : undefined,
  trailingSlash: isGitHubPages,
  basePath: isGitHubPages ? `/${repoName}` : '',
  assetPrefix: isGitHubPages ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
