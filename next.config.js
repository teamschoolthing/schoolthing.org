const withPWA = require('next-pwa')({
  dest: "public",
    register: true,
    dynamicStartUrl: false, //new
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    customWorkerDir: 'worker'
})

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
})