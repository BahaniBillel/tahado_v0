/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tahadobucket.s3.eu-central-1.amazonaws.com",
        port: "",
        pathname: "/gifts-images/**",
      },
      {
        protocol: "https",
        hostname: "tahadobucket.s3.eu-central-1.amazonaws.com",
        port: "",
        pathname: "/gifts_photos/**",
      },
    ],
  },
};

module.exports = nextConfig;
