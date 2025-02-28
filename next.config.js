/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // 确保没有重写或重定向规则阻止 API 路由
};

module.exports = nextConfig;
