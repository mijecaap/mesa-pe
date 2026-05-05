"use client";

import { useState } from "react";
import { X, Moon, Clock } from "lucide-react";

interface ClosedOverlayProps {
  openingHours: { dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean }[];
  businessName?: string;
}

const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const dayNamesFull = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function ClosedOverlay({ openingHours, businessName }: ClosedOverlayProps) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("mesa-closed-dismissed") === "true";
  });
  const [showDetails, setShowDetails] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("mesa-closed-dismissed", "true");
  };

  const today = new Date().getDay();
  const sortedHours = [...openingHours].sort((a, b) => {
    const distA = (a.dayOfWeek - today + 7) % 7;
    const distB = (b.dayOfWeek - today + 7) % 7;
    return distA - distB;
  });

  const nextOpen = sortedHours.find((h) => !h.isClosed);

  if (dismissed) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--theme-primary)]/20 bg-[var(--theme-inverse-bg)]/90 px-4 py-2.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 shrink-0 text-[var(--theme-primary)]" />
            <p className="text-xs font-medium text-[var(--theme-inverse-text)]/90">
              Cerrado ahora
              {nextOpen && (
                <span className="text-[var(--theme-inverse-text-muted)]">
                  {" "}
                  · Abrimos {dayNames[nextOpen.dayOfWeek]} a las {nextOpen.openTime}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-medium text-[var(--theme-primary)] hover:underline"
          >
            Ver horarios
          </button>
        </div>

        {showDetails && (
          <div className="mx-auto max-w-2xl mt-3 border-t border-white/10 pt-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-3">
              {openingHours
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                .map((h) => (
                  <div key={h.dayOfWeek} className="flex justify-between">
                    <span className={h.dayOfWeek === today ? "text-[var(--theme-inverse-text)]" : "text-[var(--theme-inverse-text-muted)]"}>
                      {dayNamesFull[h.dayOfWeek]}
                    </span>
                    <span className={h.dayOfWeek === today ? "text-[var(--theme-inverse-text)] font-medium" : "text-[var(--theme-inverse-text-muted)]"}>
                      {h.isClosed ? "Cerrado" : `${h.openTime} – ${h.closeTime}`}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md animate-fade-in">
      <div className="relative mx-4 max-w-sm w-full rounded-2xl bg-[var(--theme-bg)] p-6 shadow-2xl animate-scale-in">
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[var(--theme-text-muted)] transition-colors hover:bg-[var(--theme-border)]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--theme-primary)]/10">
            <Moon className="h-8 w-8 text-[var(--theme-primary)]" />
          </div>

          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--theme-text)]">
            {businessName ? `${businessName} está cerrado` : "Estamos cerrados"}
          </h2>
          <p className="mt-1.5 text-sm text-[var(--theme-text-secondary)]">
            Agradecemos tu interés. Puedes explorar el menú y volver durante nuestro horario de atención.
          </p>

          {nextOpen && (
            <div className="mt-5 flex items-center gap-2 rounded-lg bg-[var(--theme-border)] px-4 py-3">
              <Clock className="h-4 w-4 text-[var(--theme-primary)]" />
              <div className="text-left">
                <p className="text-xs font-medium text-[var(--theme-text)]">Próxima apertura</p>
                <p className="text-xs text-[var(--theme-text-secondary)]">
                  {dayNamesFull[nextOpen.dayOfWeek]} a las {nextOpen.openTime}
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            className="mt-5 w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] py-3 text-sm font-semibold text-[var(--theme-text)] transition-all hover:bg-[var(--theme-bg)] active:scale-[0.98]"
          >
            Ver menú igual
          </button>
        </div>
      </div>
    </div>
  );
}
