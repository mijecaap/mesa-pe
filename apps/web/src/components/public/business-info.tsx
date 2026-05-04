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
      <div className="space-y-4 rounded-2xl border border-[#EBE5E0] bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#8D817C]">
          Información
        </h2>

        {business.address && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E85D04]" />
            <div className="flex-1">
              <p className="text-sm text-[#2B2D42]">{business.address}</p>
              {business.googleMapsUrl && (
                <a
                  href={business.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs font-medium text-[#E85D04] hover:underline"
                >
                  Ver en Google Maps →
                </a>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowHours(!showHours)}
          className="flex w-full items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 shrink-0 text-[#E85D04]" />
            <span className="text-sm text-[#2B2D42]">Horarios de atención</span>
          </div>
          {showHours ? (
            <ChevronUp className="h-4 w-4 text-[#8D817C]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#8D817C]" />
          )}
        </button>

        {showHours && (
          <div className="space-y-1.5 pl-7">
            {sortedHours.map((h) => (
              <div
                key={h.id}
                className="flex justify-between text-sm"
              >
                <span className="text-[#8D817C]">{dayNames[h.dayOfWeek]}</span>
                <span className="font-medium text-[#2B2D42]">
                  {h.isClosed ? (
                    <span className="text-[#E76F51]">Cerrado</span>
                  ) : (
                    `${h.openTime} – ${h.closeTime}`
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        {business.paymentMethods.length > 0 && (
          <div className="flex items-start gap-3">
            <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-[#E85D04]" />
            <div className="flex-1">
              <p className="text-sm text-[#2B2D42]">Métodos de pago</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {business.paymentMethods.map((pm) => (
                  <span
                    key={pm.id}
                    className="inline-flex items-center rounded-lg bg-[#F5F0EB] px-2.5 py-1 text-xs font-medium text-[#2B2D42]"
                  >
                    {pm.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
