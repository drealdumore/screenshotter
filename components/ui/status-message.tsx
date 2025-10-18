"use client"

import { useState } from "react"
import { motion, useAnimation } from "framer-motion"

const AnimatedText = ({ message }: { message: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-sm text-neutral-600 font-[family-name:var(--font-satoshi)]"
    >
      {message.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

interface StatusMessageProps {
  message: string
}

const StatusMessage = ({ message }: StatusMessageProps) => {
  if (!message) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-center mt-3"
    >
      <AnimatedText message={message} />
    </motion.div>
  )
}

export default StatusMessage