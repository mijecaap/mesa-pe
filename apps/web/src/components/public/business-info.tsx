"use client";

import { Clock, MapPin, CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
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
  const [showHours, setShowHours] = useState(false);

  const sortedHours = [...business.openingHours].sort(
    (a, b) => a.dayOfWeek - b.dayOfWeek
  );

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <div className="space-y-4 rounded-2xl border border-[#EDE6DE] bg-white p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7D6F65]">
          Información
        </h2>

        {business.address && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C25E3A]" />
            <div className="flex-1">
              <p className="text-sm text-[#2A211E]">{business.address}</p>
              {business.googleMapsUrl && (
                <a
                  href={business.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs font-medium text-[#C25E3A] hover:underline"
                >
                  Ver en Google Maps →
                </a>
              )}
            </div>
          </div>
        )}

        <div className="border-t border-[#EDE6DE] pt-4">
          <button
            onClick={() => setShowHours(!showHours)}
            className="flex w-full items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 shrink-0 text-[#C25E3A]" />
              <span className="text-sm text-[#2A211E]">Horarios de atención</span>
            </div>
            {showHours ? (
              <ChevronUp className="h-4 w-4 text-[#7D6F65] transition-transform" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#7D6F65] transition-transform" />
            )}
          </button>

          <div
            className={`grid transition-all duration-300 ease-out ${
              showHours ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="space-y-1.5 pl-7">
                {sortedHours.map((h) => (
                  <div key={h.id} className="flex justify-between text-sm">
                    <span className="text-[#7D6F65]">{dayNames[h.dayOfWeek]}</span>
                    <span className="font-medium text-[#2A211E]">
                      {h.isClosed ? (
                        <span className="text-[#C25E3A]">Cerrado</span>
                      ) : (
                        `${h.openTime} – ${h.closeTime}`
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {business.paymentMethods.length > 0 && (
          <div className="border-t border-[#EDE6DE] pt-4">
            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-[#C25E3A]" />
              <div className="flex-1">
                <p className="text-sm text-[#2A211E]">Métodos de pago</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {business.paymentMethods.map((pm) => (
                    <span
                      key={pm.id}
                      className="inline-flex items-center rounded-lg bg-[#EDE6DE] px-2.5 py-1 text-xs font-medium text-[#2A211E]"
                    >
                      {pm.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
