export const sharedMetadata = {
  title: "Screenshot Generator - Capture Website Screenshots Instantly",
  description:
    "Generate high-quality screenshots of any website instantly. Free online tool with WebP format and one-click download. Perfect for developers, designers, and marketers.",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://drealdumore-screenshotter.vercel.app",
  ogImage: {
    width: 1200,
    height: 630,
    type: "image/png",
  },
  image: "/og.png",
};