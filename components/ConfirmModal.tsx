// components/ConfirmModal.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmModal({
  open,
  title = "Ești sigur?",
  message,
  confirmText = "Da",
  cancelText = "Nu",
  onConfirm,
  onCancel
}: {
  open: boolean;
  title?: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 6 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative z-10 w-[90%] max-w-md rounded-2xl bg-white p-5 shadow-2xl"
            role="dialog" aria-modal="true"
          >
            <h3 className="text-xl font-extrabold mb-1">{title}</h3>
            <div className="text-gray-700 mb-4">{message}</div>
            <div className="flex justify-end gap-2">
              <button className="btn-cta btn-neutral" onClick={onCancel}>{cancelText}</button>
              <button className="btn-cta" onClick={onConfirm}>{confirmText}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
