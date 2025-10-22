// components/Lightbox.tsx
"use client";

import { useEffect } from "react";

export default function Lightbox({
  open,
  onClose,
  images,
  title,
}: {
  open: boolean;
  onClose: () => void;
  images: string[];
  title?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-2xl max-w-5xl w-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <div className="text-lg font-semibold mb-3">{title}</div>
        ) : null}

        <div className="grid sm:grid-cols-2 gap-3">
          {images.slice(0, 4).map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Previzualizare pagină ${i + 1}`}
              className="w-full rounded-lg border object-cover"
            />
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button className="btn-neutral" onClick={onClose}>
            Închide
          </button>
        </div>
      </div>
    </div>
  );
}
