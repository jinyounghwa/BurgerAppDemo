/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // 동적 라우트를 정적으로 생성하기 위한 설정
  trailingSlash: true,
};

module.exports = nextConfig;
