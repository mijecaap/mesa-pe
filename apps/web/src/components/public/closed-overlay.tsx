"use client";

import { useState } from "react";
import { X, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ClosedOverlayProps {
  openingHours: { dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean }[];
  businessName?: string;
}

const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const dayNamesShort = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function ClosedOverlay({ openingHours, businessName }: ClosedOverlayProps) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("mesa-closed-dismissed") === "true";
  });

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
    // Banner sticky bottom cuando está dismissado
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#C25E3A]/20 bg-[#C25E3A]/90 px-4 py-2 backdrop-blur-sm">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <Moon className="h-4 w-4 shrink-0 text-white" />
          <p className="text-xs font-medium text-white">
            Cerrado ahora{nextOpen ? ` · Abrimos ${dayNamesShort[nextOpen.dayOfWeek]} a las ${nextOpen.openTime}` : ""}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative mx-4 max-w-md w-full rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C25E3A]/10">
            <Moon className="h-8 w-8 text-[#C25E3A]" />
          </div>

          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#2A211E]">
            {businessName ? `${businessName} está cerrado` : "Estamos cerrados"}
          </h2>
          <p className="mt-1 text-sm text-[#7D6F65]">
            Agradecemos tu interés. Vuelve durante nuestro horario de atención.
          </p>

          {nextOpen && (
            <div className="mt-4 rounded-lg bg-[#EDE6DE] px-4 py-3">
              <p className="text-sm font-medium text-[#2A211E]">
                Próxima apertura
              </p>
              <p className="text-sm text-[#7D6F65]">
                {dayNames[nextOpen.dayOfWeek]} a las {nextOpen.openTime}
              </p>
            </div>
          )}

          <Accordion className="mt-4 w-full">
            <AccordionItem value="hours">
              <AccordionTrigger className="text-sm">
                Ver horarios de atención
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 text-sm">
                  {openingHours
                    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                    .map((h) => (
                      <div
                        key={h.dayOfWeek}
                        className="flex justify-between py-1"
                      >
                        <span className="text-[#7D6F65]">{dayNames[h.dayOfWeek]}</span>
                        <span className="font-medium text-[#2A211E]">
                          {h.isClosed ? "Cerrado" : `${h.openTime} - ${h.closeTime}`}
                        </span>
                      </div>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={handleDismiss}
          >
            Ver menú igual
          </Button>
        </div>
      </div>
    </div>
  );
}
