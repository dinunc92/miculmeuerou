// components/Toast.tsx
"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastProps = {
  text: string;
  kind?: "info" | "success" | "error";
  duration?: number;
  onClose?: () => void;
};

// culori pastelate brand (turcoaz/lila)
const bgByKind: Record<NonNullable<ToastProps["kind"]>, string> = {
  info:    "bg-gradient-to-r from-[#6f42c1] to-[#2ec4b6] text-white", // mov→turcoaz
  success: "bg-gradient-to-r from-emerald-500 to-teal-400 text-white",
  error:   "bg-gradient-to-r from-rose-500 to-pink-400 text-white",
};

export default function Toast({ text, kind = "info", duration = 1800, onClose }: ToastProps) {
  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={`fixed bottom-6 right-6 z-50 shadow-2xl rounded-2xl px-5 py-3 border border-white/20 ${bgByKind[kind]}`}
        role="alert"
        aria-live="polite"
      >
        <div className="text-sm font-semibold tracking-wide">{text}</div>
      </motion.div>
    </AnimatePresence>
  );
}
