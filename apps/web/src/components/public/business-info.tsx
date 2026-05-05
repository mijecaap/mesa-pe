"use client";

import { Clock, MapPin, CreditCard, Phone } from "lucide-react";
import type { PublicBusiness } from "@/hooks/use-public-business";

const dayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

interface BusinessInfoProps {
  business: PublicBusiness;
}

export function BusinessInfo({ business }: BusinessInfoProps) {
  const sortedHours = [...business.openingHours].sort(
    (a, b) => a.dayOfWeek - b.dayOfWeek
  );

  const today = new Date().getDay();
  const todayHours = sortedHours.find((h) => h.dayOfWeek === today);

  return (
    <section className="border-t border-[var(--theme-border)] bg-[var(--theme-inverse-bg)] py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--theme-primary)]">
            Información
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--theme-inverse-text)] sm:text-3xl text-balance">
            Todo lo que necesitas saber
          </h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          {/* Address */}
          {business.address && (
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <MapPin className="h-5 w-5 text-[var(--theme-primary)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--theme-inverse-text)]">Dirección</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--theme-inverse-text-secondary)]">
                  {business.address}
                </p>
                {business.googleMapsUrl && (
                  <a
                    href={business.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-medium text-[var(--theme-primary)] hover:underline"
                  >
                    Ver en Google Maps
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Hours */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Clock className="h-5 w-5 text-[var(--theme-primary)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[var(--theme-inverse-text)]">Horarios</h3>
              {todayHours && (
                <p className="mt-1.5 text-sm text-[var(--theme-inverse-text-secondary)]">
                  Hoy:{" "}
                  {todayHours.isClosed ? (
                    <span className="text-[var(--theme-primary)]">Cerrado</span>
                  ) : (
                    <span className="text-[var(--theme-inverse-text)] font-medium">
                      {todayHours.openTime} – {todayHours.closeTime}
                    </span>
                  )}
                </p>
              )}
              <div className="mt-4 space-y-2">
                {sortedHours.map((h) => (
                  <div
                    key={h.dayOfWeek}
                    className={`flex justify-between text-sm ${
                      h.dayOfWeek === today ? "text-[var(--theme-inverse-text)]" : "text-[var(--theme-inverse-text-muted)]"
                    }`}
                  >
                    <span className={h.dayOfWeek === today ? "font-medium" : ""}>
                      {dayNames[h.dayOfWeek]}
                    </span>
                    <span className={h.dayOfWeek === today ? "font-medium text-[var(--theme-inverse-text)]" : ""}>
                      {h.isClosed ? "Cerrado" : `${h.openTime} – ${h.closeTime}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment methods */}
          {business.paymentMethods.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <CreditCard className="h-5 w-5 text-[var(--theme-primary)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--theme-inverse-text)]">Pagos</h3>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {business.paymentMethods.map((pm) => (
                    <span
                      key={pm.id}
                      className="inline-flex items-center rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-[var(--theme-inverse-text)]"
                    >
                      {pm.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp */}
          {business.whatsappNumber && (
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Phone className="h-5 w-5 text-[var(--theme-primary)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--theme-inverse-text)]">Contacto</h3>
                <p className="mt-1.5 text-sm text-[var(--theme-inverse-text-secondary)]">
                  Pedidos por WhatsApp
                </p>
                <a
                  href={`https://wa.me/${business.whatsappNumber.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--theme-primary)] hover:underline"
                >
                  Escribir ahora
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
