/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images : {
    remotePatterns: [
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
      // hostname: "picsum.photos",
    },
    {
      protocol: "https",
      hostname: "picsum.photos",
    },
    {
      protocol: "https",
      hostname: "www.dummyimage.com"
    }
  ]}
};

export default nextConfig;
