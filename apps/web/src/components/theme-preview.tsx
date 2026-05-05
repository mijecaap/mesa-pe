"use client";

import { Search, Clock, MapPin } from "lucide-react";
import { generateThemeVariables } from "@/lib/theme";
import type { BusinessTheme } from "@mesa/shared-types";

interface ThemePreviewProps {
  theme: BusinessTheme;
  businessName?: string;
}

export function ThemePreview({ theme, businessName = "Mi Negocio" }: ThemePreviewProps) {
  const vars = generateThemeVariables(theme);

  return (
    <div
      className="overflow-hidden rounded-2xl border border-sand shadow-sm"
      style={vars as unknown as React.CSSProperties}
    >
      <div className="bg-[var(--theme-bg)]">
        {/* Hero */}
        <div className="px-4 pt-8 pb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-[var(--theme-bg)] bg-[var(--theme-primary)] text-xl font-bold text-white shadow-lg">
              {businessName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--theme-accent)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                Abierto ahora
              </span>
              <h1
                className="mt-2 text-xl font-semibold leading-tight text-[var(--theme-text)]"
                style={{
                  fontFamily:
                    theme.fontFamily === "serif"
                      ? "Georgia, serif"
                      : theme.fontFamily === "mono"
                      ? "monospace"
                      : "system-ui, sans-serif",
                }}
              >
                {businessName}
              </h1>
              <p className="mt-1 text-sm text-[var(--theme-text-secondary)]">
                Descripción de ejemplo para la vista previa
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--theme-text-secondary)]">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[var(--theme-primary)]" />
                  Av. Ejemplo 123
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[var(--theme-primary)]" />
                  Pedidos por WhatsApp
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Banner */}
        <div className="mx-4 mb-4 overflow-hidden rounded-xl bg-[var(--theme-inverse-bg)]">
          <div className="flex">
            <div className="flex-1 p-4">
              <div className="inline-flex items-center gap-1 rounded-full bg-[var(--theme-primary)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                Promoción
              </div>
              <p className="mt-2 text-sm font-semibold text-[var(--theme-inverse-text)]">
                2x1 en empanadas
              </p>
              <p className="mt-1 text-xs text-[var(--theme-inverse-text-secondary)]">
                Válido todos los martes
              </p>
            </div>
            <div className="w-24 shrink-0 bg-[var(--theme-border)]" />
          </div>
        </div>

        {/* Search bar */}
        <div className="border-b border-[var(--theme-border)] bg-[var(--theme-bg)]/95 px-4 py-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-2">
            <Search className="h-3.5 w-3.5 text-[var(--theme-text-muted)]" />
            <span className="text-xs text-[var(--theme-text-muted)]">
              Buscar en el menú...
            </span>
          </div>
        </div>

        {/* Category nav */}
        <div className="border-b border-[var(--theme-border)] bg-[var(--theme-bg)]/95 px-4 py-2">
          <div className="flex gap-1">
            <span className="px-3 py-1.5 text-xs font-medium text-[var(--theme-text)]">
              Todo
            </span>
            <span className="px-3 py-1.5 text-xs font-medium text-[var(--theme-text-muted)]">
              Entradas
            </span>
            <span className="px-3 py-1.5 text-xs font-medium text-[var(--theme-text-muted)]">
              Platos
            </span>
          </div>
          <div className="mt-1 h-0.5 w-8 rounded-full bg-[var(--theme-primary)]" />
        </div>

        {/* Category section */}
        <div className="bg-[var(--theme-bg)] px-4 py-6">
          <h2 className="text-lg font-semibold text-[var(--theme-text)]">
            Platos principales
          </h2>
          <p className="mt-1 text-xs text-[var(--theme-text-secondary)]">
            Nuestras especialidades
          </p>
          <div className="mt-3 h-px w-10 bg-[var(--theme-primary)]" />

          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Product 1 */}
            <div className="flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[var(--theme-border)]">
                <div className="absolute left-2 top-2">
                  <span className="inline-flex items-center rounded-full bg-[var(--theme-primary)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm">
                    Popular
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-semibold text-[var(--theme-text)]">
                    Ceviche clásico
                  </span>
                  <span className="shrink-0 text-xs font-bold text-[var(--theme-primary)]">
                    S/ 28.00
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-[11px] text-[var(--theme-text-secondary)]">
                  Pescado fresco en limón con cebolla y ají
                </p>
              </div>
            </div>

            {/* Product 2 */}
            <div className="flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[var(--theme-border)]" />
              <div className="mt-2">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-semibold text-[var(--theme-text)]">
                    Lomo saltado
                  </span>
                  <span className="shrink-0 text-xs font-bold text-[var(--theme-primary)]">
                    S/ 32.00
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-[11px] text-[var(--theme-text-secondary)]">
                  Carne salteada con verduras y papas fritas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="border-t border-[var(--theme-border)] bg-[var(--theme-inverse-bg)] px-4 py-6">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--theme-primary)]">
            Información
          </span>
          <h2 className="mt-2 text-base font-semibold text-[var(--theme-inverse-text)]">
            Todo lo que necesitas saber
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <Clock className="h-4 w-4 text-[var(--theme-primary)]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--theme-inverse-text)]">
                  Horarios
                </p>
                <p className="text-[11px] text-[var(--theme-inverse-text-secondary)]">
                  Hoy: <span className="font-medium text-[var(--theme-inverse-text)]">08:00 – 22:00</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <MapPin className="h-4 w-4 text-[var(--theme-primary)]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--theme-inverse-text)]">
                  Dirección
                </p>
                <p className="text-[11px] text-[var(--theme-inverse-text-secondary)]">
                  Av. Ejemplo 123, Lima
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-[var(--theme-inverse-bg)] py-3 text-center">
          <p className="text-[10px] text-[var(--theme-inverse-text-muted)]">
            Carta digital creada con{" "}
            <span className="font-medium text-[var(--theme-primary)]">
              Mesa.pe
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
