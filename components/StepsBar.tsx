"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

type StepsBarProps = {
  /** Pasul activ (1-based). Exemplu: 1..5 */
  active?: number;
  /** Marchează pașii finalizați; dacă lipsește, se consideră finalizați toți până la `active-1` */
  done?: boolean[];
  /** Etichete personalizate pentru pași (fallback la textul standard) */
  labels?: string[];
  /** Click pe un pas (dacă vrei să permiți saltul la un pas anume) */
  onStepClick?: (index1Based: number) => void;
};

const DEFAULT_LABELS = [
  "1️⃣ Alege povestea",
  "2️⃣ Încarcă fotografia",
  "3️⃣ Completează detaliile",
  "4️⃣ Plătește în siguranță",
  "5️⃣ Primești PDF în 48h (tipărit 5–7 zile)",
];

export default function StepsBar({
  active = 1,
  done,
  labels = DEFAULT_LABELS,
  onStepClick,
}: StepsBarProps) {
  const steps = labels.length ? labels : DEFAULT_LABELS;
  const [pulseIdx, setPulseIdx] = useState<number | null>(null);

  // determină starea fiecărui pas: done / active / upcoming
  const states = useMemo(() => {
    const arr = steps.map((_, i) => {
      const idx = i + 1;
      const isDone =
        Array.isArray(done) && typeof done[i] === "boolean"
          ? !!done[i]
          : idx < active; // implicit, tot ce e în stânga pasului activ e done
      const isActive = idx === active;
      return { isDone, isActive };
    });
    return arr;
  }, [steps, active, done]);

  // mic “ping” când se schimbă pasul activ
  useEffect(() => {
    setPulseIdx(active);
    const t = setTimeout(() => setPulseIdx(null), 450);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div
      className="w-full rounded-2xl p-3 md:p-4"
      style={{
        background:
          "linear-gradient(90deg, rgba(244,237,255,.9), rgba(227,255,248,.9))",
        boxShadow: "0 6px 18px rgba(0,0,0,.08)",
      }}
    >
      <ol className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
        {steps.map((label, i) => {
          const idx = i + 1;
          const { isDone, isActive } = states[i];
          const clickable = typeof onStepClick === "function";

          return (
            <li key={idx} className="flex items-center gap-3 md:block">
              {/* Indicator + conector (desktop) */}
              <div className="hidden md:flex items-center">
                {/* bulina */}
                <div
                  className={clsx(
                    "relative flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold transition",
                    isDone && "bg-[var(--brand-turquoise)] text-white border-transparent",
                    !isDone && isActive && "bg-[var(--brand-lilac)] text-white border-transparent",
                    !isDone && !isActive && "bg-white text-gray-500 border-gray-200"
                  )}
                  style={{ boxShadow: isActive ? "0 0 0 6px rgba(183,132,247,.20)" : undefined }}
                >
                  {isDone ? "✓" : idx}
                  {/* pulse când se schimbă activul */}
                  {pulseIdx === idx && (
                    <span className="absolute inset-0 rounded-full animate-[pulse_0.45s_ease-out] ring-4 ring-[rgba(183,132,247,.35)]" />
                  )}
                </div>

                {/* linia de legătură (nu la ultimul) */}
                {i < steps.length - 1 && (
                  <div
                    className={clsx(
                      "flex-1 h-1 mx-2 rounded-full transition-all",
                      // colorăm până la activ
                      idx < active
                        ? "bg-[var(--brand-turquoise)]"
                        : "bg-gray-200"
                    )}
                  />
                )}
              </div>

              {/* Buton/etichetă */}
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(idx)}
                className={clsx(
                  "w-full text-left md:mt-2 px-3 py-2 rounded-xl border transition",
                  isDone && "bg-white border-[rgba(0,0,0,.06)] text-gray-700",
                  isActive &&
                    "bg-white border-[rgba(0,0,0,.06)] text-[#4b2ca1] shadow-sm",
                  !isDone && !isActive && "bg-white/70 border-transparent text-gray-500",
                  clickable && "hover:shadow hover:bg-white"
                )}
              >
                <span className="text-sm leading-snug">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
