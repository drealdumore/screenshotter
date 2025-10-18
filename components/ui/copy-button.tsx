"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, CopyIcon } from "lucide-react";

interface CopyButtonProps extends Omit<React.ComponentProps<"button">, 'onClick'> {
  content: string;
  onCopy?: () => void;
  delay?: number;
}

export function CopyButton({
  className,
  content,
  onCopy,
  delay = 2000,
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      
      try {
        if (content) {
          await navigator.clipboard.writeText(content);
        } else if (onCopy) {
          await onCopy();
        }
        
        setIsCopied(true);
        
        setTimeout(() => {
          setIsCopied(false);
        }, delay);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    },
    [content, onCopy, delay]
  );

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 border shadow-xs hover:bg-accent hover:text-accent-foreground  h-8 rounded-md px-3 border-neutral-400  gap-2 bg-transparent"
      onClick={handleCopy}
      {...props}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={isCopied ? "check" : "copy"}
          initial={{ scale: 0, opacity: 0, filter: "blur(4px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          exit={{ scale: 0, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-2"
        >
          {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
          {isCopied ? "Copied!" : "Copy"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}