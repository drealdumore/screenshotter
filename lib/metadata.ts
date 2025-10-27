export const sharedMetadata = {
  title: "Peekr — Instantly Capture and Preview Websites",
  description:
    "Peekr lets you capture and preview websites instantly — from full-page screenshots to responsive snapshots. Perfect for developers, designers, and marketers who want clean visuals of any webpage.",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://peekrr.vercel.app",
  ogImage: {
    width: 1200,
    height: 630,
    type: "image/png",
  },
  image: "/og.png",
};