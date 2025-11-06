/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  i18n: {
    locales: ["en-IN", "hi"],
    defaultLocale: "en-IN"
  }
};

module.exports = nextConfig;
