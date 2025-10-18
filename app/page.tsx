"use client";

import type React from "react";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="min-h-screen absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] font-[family-name:var(--font-satoshi)]">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <motion.h1 
              className="text-2xl font-bold tracking-tight text-foreground font-[family-name:var(--font-bodar)]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Screenshot Generator.
            </motion.h1>
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <a
                href="https://x.com/drealdumore"
                className="transition-all hover:scale-110 transform duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/drealdumore"
                className="transition-all hover:scale-110 transform duration-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {imageSrc ? (
            // Screenshot preview view
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-6"
            >
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="text-2xl font-semibold text-foreground font-[family-name:var(--font-bodar)]">
                Screenshot Preview
              </h2>
              <motion.div 
                className="flex gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
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
              </motion.div>
            </motion.div>
            <motion.div
              className="overflow-hidden rounded-lg border border-border bg-muted cursor-pointer"
              onClick={() => setIsModalOpen(true)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={imageSrc || "/placeholder.svg"}
                alt="Website screenshot"
                className="w-full transition-transform duration-300"
                onError={() => setError("Failed to load screenshot")}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Button
                variant="outline"
                onClick={() => {
                  setImageSrc(null);
                  setUrl("");
                }}
                className="w-full hover:scale-105 transition-transform duration-200 font-[family-name:var(--font-satoshi)]"
              >
                Generate Another
              </Button>
            </motion.div>
          </motion.div>
          ) : (
            // Hero section with form
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center justify-center space-y-8 py-12"
            >
              {/* Badge */}
              <motion.div 
                className="flex"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <a
                  target="_blank"
                  className="inline-flex"
                  aria-label="Visit the GitHub repository for MetaScraper"
                  href="https://github.com/Drealdumore/MetaScraper"
                >
                  <span className="relative inline-block overflow-hidden rounded-full p-[1px] hover:scale-105 transition-transform duration-200">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a9a9a9_0%,#0c0c0c_50%,#a9a9a9_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#171717_0%,#737373_50%,#171717_100%)]"></span>
                    <div className="inline-flex h-full w-full cursor-pointer font-semibold justify-center rounded-full bg-white px-3 py-1 text-xs leading-5 text-neutral-600 backdrop-blur-xl dark:bg-black dark:text-neutral-200 font-[family-name:var(--font-satoshi)]">
                      Proudly Open Source ⚡️
                    </div>
                  </span>
                </a>
              </motion.div>

              {/* Hero Title */}
              <motion.div 
                className="space-y-4 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.h2 
                  className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl font-[family-name:var(--font-bodar)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Screenshot Generator.
                </motion.h2>
                <motion.p 
                  className="mx-auto max-w-2xl text-lg text-muted-foreground font-[family-name:var(--font-satoshi)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Easily capture and retrieve screenshots from any website,
                  including full page renders and responsive designs.
                </motion.p>
              </motion.div>
              {/* Input Section */}
              <motion.div 
                className="w-full max-w-lg mx-auto space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.div 
                  className="flex gap-3 justify-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Input
                    type="url"
                    value={url}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter website URL"
                    disabled={loading}
                    className="w-80 px-4 py-3 text-base transition-all duration-200 focus:scale-105 font-[family-name:var(--font-satoshi)]"
                  />
                  <Button
                    onClick={handleGenerateScreenshot}
                    disabled={loading}
                    size="lg"
                    className="transition-all duration-200 active:scale-95 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed rounded-md bg-neutral-950 disabled:bg-neutral-950/75 px-5 py-2 text-white font-[family-name:var(--font-satoshi)]"
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
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ErrorMessage message={error} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
