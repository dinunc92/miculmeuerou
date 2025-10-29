"use client";

import { useEffect } from "react";
import clsx from "clsx";

type Kind = "info" | "success" | "error";

export default function Toast({
  text,
  kind = "info",
  onClose,
  autoHideMs = 1800,
}: {
  text: string;
  kind?: Kind;
  onClose?: () => void;
  autoHideMs?: number;
}) {
  useEffect(() => {
    if (!autoHideMs) return;
    const t = setTimeout(() => onClose?.(), autoHideMs);
    return () => clearTimeout(t);
  }, [autoHideMs, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        "fixed right-4 bottom-4 z-50 rounded-xl shadow-xl px-4 py-3 text-sm font-semibold flex items-center gap-3",
        "backdrop-blur",
        kind === "info" && "bg-[rgba(48,213,200,0.95)] text-white",
        kind === "success" && "bg-[rgba(41,197,164,0.95)] text-white",
        kind === "error" && "bg-[rgba(217,70,70,0.95)] text-white"
      )}
    >
      <span>
        {kind === "success" ? "✅ " : kind === "error" ? "⚠️ " : "💡 "}
        {text}
      </span>
      <button
        aria-label="Închide notificarea"
        onClick={onClose}
        className="ml-1 inline-flex items-center justify-center w-7 h-7 rounded-md bg-white/20 hover:bg-white/30"
      >
        ✕
      </button>
    </div>
  );
}
