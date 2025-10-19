import { NextRequest } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

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

const TIMEOUT = process.env.VERCEL ? 8000 : 10000;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const colorScheme = req.nextUrl.searchParams.get("colorScheme") || "light";
  const device = req.nextUrl.searchParams.get("device") || "desktop";

  if (!url) {
    return new Response(JSON.stringify({ error: "URL parameter is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    new URL(url);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid URL provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      let browser;
      try {
        sendEvent({ status: "🚀 Launching browser..." });

        if (isDev && puppeteerDev) {
          browser = await puppeteerDev.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
          });
        } else {
          browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: null,
            executablePath: await chromium.executablePath(),
            headless: true,
          });
        }

        sendEvent({ status: "🌐 Creating new page..." });
        const page = await browser.newPage();

        sendEvent({ status: "📱 Setting up viewport..." });
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

        sendEvent({ status: "🔗 Navigating to website..." });
        
        try {
          await Promise.race([
            page.goto(url, {
              waitUntil: "domcontentloaded",
              timeout: TIMEOUT,
            }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Navigation timeout")), TIMEOUT)
            ),
          ]);
        } catch (error) {
          // Continue even if navigation times out - page might still be usable
          sendEvent({ status: "⚠️ Page loading slowly, continuing..." });
        }
        
        sendEvent({ status: "⏳ Waiting for page to render..." });
        await new Promise(resolve => setTimeout(resolve, 1000));

        sendEvent({ status: "📸 Capturing screenshot..." });
        const screenshot = await page.screenshot({
          type: "webp",
          quality: 60,
          fullPage: false,
        }) as Buffer;

        sendEvent({ 
          status: "✅ Screenshot complete!",
          image: `data:image/webp;base64,${screenshot.toString('base64')}`,
          success: true
        });

      } catch (error) {
        sendEvent({ 
          error: error instanceof Error ? error.message : "Screenshot generation failed",
          success: false
        });
      } finally {
        if (browser) {
          await browser.close();
        }
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}