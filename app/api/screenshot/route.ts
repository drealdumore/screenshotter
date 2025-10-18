import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// For local development, install puppeteer: npm install puppeteer
const isDev = process.env.NODE_ENV === "development";
let puppeteerDev: any;
if (isDev) {
  try {
    puppeteerDev = require("puppeteer");
  } catch {
    // puppeteer not installed, will use puppeteer-core
  }
}

export const runtime = "nodejs";

const getViewport = (device: string) => {
  if (device === 'mobile') {
    return {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    };
  }
  return {
    width: 1280,
    height: 764,
    deviceScaleFactor: 2,
  };
};

const TIMEOUT = process.env.VERCEL ? 8000 : 10000; // Shorter timeout for Vercel
const CACHE_DURATION = 60 * 60 * 24;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const colorScheme = req.nextUrl.searchParams.get("colorScheme") || "light";
  const device = req.nextUrl.searchParams.get("device") || "desktop";

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return NextResponse.json(
      { error: "Invalid URL provided" },
      { status: 400 }
    );
  }

  let browser;
  try {
    if (isDev && puppeteerDev) {
      // Local development with regular puppeteer
      browser = await puppeteerDev.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } else {
      // Production with @sparticuz/chromium
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: null,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    }

    const page = await browser.newPage();

    const viewport = getViewport(device);
    
    await Promise.all([
      page.setViewport(viewport),
      page.emulateMediaFeatures([
        { name: "prefers-color-scheme", value: colorScheme },
      ]),
    ]);
    
    if (device === 'mobile') {
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
    }

    try {
      await Promise.race([
        page.goto(url, {
          waitUntil: "networkidle0",
          timeout: TIMEOUT,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Navigation timeout")), TIMEOUT)
        ),
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load page: ${error.message}`);
      }
      throw new Error("Failed to load page");
    }

    const screenshot = await page.screenshot({
      type: "webp",
      quality: 80,
      fullPage: false,
      // Removed optimizeForSpeed as it's not a valid option
    }) as Buffer;

    return new NextResponse(new Uint8Array(screenshot), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": `public, max-age=${CACHE_DURATION}`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Screenshot generation failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}