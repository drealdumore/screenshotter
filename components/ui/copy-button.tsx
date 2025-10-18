"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  content: string;
  onCopy?: () => void;
  delay?: number;
}

export function CopyButton({
  className,
  content,
  onCopy,
  variant,
  size,
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
    <Button
      variant={variant}
      size={size}
      className={className}
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
    </Button>
  );
}