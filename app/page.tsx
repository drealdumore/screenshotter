"use client";

import type React from "react";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Loader2, Download, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/ui/copy-button";
import { ImageModal } from "@/components/ui/image-modal";
import ErrorMessage from "../components/errorMessage";

interface ScreenshotResponse {
  error?: string;
}

const ScreenshotGenerator = () => {
  const { resolvedTheme } = useTheme();
  const [url, setUrl] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError(null);
  };

  const handleGenerateScreenshot = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setError(null);
    setLoading(true);
    setImageSrc(null);

    try {
      const sanitizedUrl = encodeURIComponent(url);
      const apiUrl = `/api/screenshot?url=${sanitizedUrl}&colorScheme=${
        resolvedTheme === "dark" ? "dark" : "light"
      }`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const data: ScreenshotResponse = await response.json();
        throw new Error(data.error || "Failed to generate screenshot");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImageSrc(imageUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate screenshot"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleGenerateScreenshot();
    }
  };

  const handleDownload = () => {
    if (!imageSrc) return;
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = `screenshot-${Date.now()}.png`;
    link.click();
  };

  const handleCopy = async () => {
    if (!imageSrc) return;
    try {
      const blob = await fetch(imageSrc).then((r) => r.blob());
      await navigator.clipboard.write([
        new ClipboardItem({ "image/webp": blob }),
      ]);
    } catch (err) {
      setError("Failed to copy image to clipboard");
    }
  };

  return (
    <div className="min-h-screen absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <header>
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Screenshot Generator.
            </h1>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {imageSrc ? (
          // Screenshot preview view
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">
                Screenshot Preview
              </h2>
              <div className="flex gap-2">
                <CopyButton
                  content=""
                  onCopy={handleCopy}
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="gap-2 bg-transparent"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
            <div
              className="overflow-hidden rounded-lg border border-border bg-muted cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={imageSrc || "/placeholder.svg"}
                alt="Website screenshot"
                className="w-full hover:scale-105 transition-transform duration-300"
                onError={() => setError("Failed to load screenshot")}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setImageSrc(null);
                setUrl("");
              }}
              className="w-full"
            >
              Generate Another
            </Button>
          </div>
        ) : (
          // Hero section with form
          <div className="flex flex-col items-center justify-center space-y-8 py-12">
            {/* Badge */}

            <div className="flex">
              <a
                target="_blank"
                className="inline-flex"
                aria-label="Visit the GitHub repository for MetaScraper"
                href="https://github.com/Drealdumore/MetaScraper"
              >
                <span className="relative inline-block overflow-hidden rounded-full p-[1px]">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a9a9a9_0%,#0c0c0c_50%,#a9a9a9_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#171717_0%,#737373_50%,#171717_100%)]"></span>
                  <div className="inline-flex h-full w-full cursor-pointer font-semibold justify-center rounded-full bg-white px-3 py-1 text-xs leading-5 text-neutral-600 backdrop-blur-xl dark:bg-black dark:text-neutral-200">
                    Proudly Open Source ⚡️
                  </div>
                </span>
              </a>
            </div>

            {/* Hero Title */}
            <div className="space-y-4 text-center">
              <h2 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                Screenshot Generator.
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Easily capture and retrieve screenshots from any website,
                including full page renders and responsive designs.
              </p>
            </div>
            {/* Input Section */}
            <div className="w-full max-w-lg mx-auto space-y-4">
              <div className="flex gap-3 justify-center">
                <Input
                  type="url"
                  value={url}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter website URL"
                  disabled={loading}
                  className="w-80 px-4 py-3 text-base"
                />
                <Button
                  onClick={handleGenerateScreenshot}
                  disabled={loading}
                  size="lg"
                  className="transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-md bg-neutral-950 disabled:bg-neutral-950/75 px-5 py-2 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Scrape"
                  )}
                </Button>
              </div>

              {error && <ErrorMessage message={error} />}
            </div>
          </div>
        )}
      </main>

      {imageSrc && (
        <ImageModal
          src={imageSrc}
          alt="Website screenshot"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ScreenshotGenerator;
