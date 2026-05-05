"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Save, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useOpeningHours, useUpdateOpeningHours } from "@/hooks/use-opening-hours";
import { useDashboardStore } from "@/stores/dashboard";
import Link from "next/link";

const DAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

interface HourRow {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export default function HoursPage() {
  const { activeBusinessId } = useDashboardStore();
  const { data: savedHours, isLoading } = useOpeningHours(activeBusinessId ?? undefined);
  const updateHours = useUpdateOpeningHours();

  const todayIndex = new Date().getDay();

  const [hours, setHours] = useState<HourRow[]>(
    DAYS.map((_, i) => ({
      dayOfWeek: i,
      openTime: "08:00",
      closeTime: "22:00",
      isClosed: false,
    })),
  );

  useEffect(() => {
    if (savedHours && savedHours.length === 7) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHours(
        savedHours.map((h: HourRow) => ({
          dayOfWeek: h.dayOfWeek,
          openTime: h.openTime,
          closeTime: h.closeTime,
          isClosed: h.isClosed,
        })),
      );
    }
  }, [savedHours]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusinessId) return;

    try {
      await updateHours.mutateAsync({
        businessId: activeBusinessId,
        data: { hours },
      });
      toast.success("Horarios actualizados");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (!activeBusinessId) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand/60">
          <Clock className="h-8 w-8 text-warm-gray" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-coffee">Selecciona un negocio</p>
          <p className="max-w-xs text-sm leading-relaxed text-warm-gray">
            Necesitas tener un negocio activo para configurar los horarios de atención.
          </p>
        </div>
        <Link
          href="/dashboard/business"
          className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-terracotta-deep"
        >
          Ir a Mi Negocio <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-coffee">Horarios de atención</h1>
        <p className="mt-1 text-sm text-warm-gray">
          Define cuándo tu negocio está abierto para recibir pedidos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
          <div className="space-y-2">
            {hours.map((day, index) => {
              const isToday = index === todayIndex;
              return (
                <div
                  key={day.dayOfWeek}
                  className={`flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center sm:gap-4 ${
                    isToday
                      ? "border border-terracotta/20 bg-terracotta/5"
                      : "border border-transparent bg-cream/40"
                  }`}
                >
                  <div className="flex items-center gap-2 sm:w-28">
                    <span
                      className={`text-sm font-semibold ${
                        isToday ? "text-terracotta" : "text-coffee"
                      }`}
                    >
                      {DAYS[index]}
                    </span>
                    {isToday && (
                      <span className="rounded-full bg-terracotta/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-terracotta">
                        Hoy
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      checked={!day.isClosed}
                      onCheckedChange={(checked) => {
                        const newHours = [...hours];
                        newHours[index].isClosed = !checked;
                        setHours(newHours);
                      }}
                      aria-label={`${DAYS[index]} ${day.isClosed ? "cerrado" : "abierto"}`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        day.isClosed ? "text-warm-gray" : "text-coffee"
                      }`}
                    >
                      {day.isClosed ? "Cerrado" : "Abierto"}
                    </span>
                  </div>

                  {!day.isClosed && (
                    <div className="flex items-center gap-2 sm:ml-auto">
                      <Input
                        type="time"
                        value={day.openTime}
                        onChange={(e) => {
                          const newHours = [...hours];
                          newHours[index].openTime = e.target.value;
                          setHours(newHours);
                        }}
                        className="w-28 rounded-xl border-sand bg-white text-center text-sm focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                      />
                      <span className="text-sm text-warm-gray">a</span>
                      <Input
                        type="time"
                        value={day.closeTime}
                        onChange={(e) => {
                          const newHours = [...hours];
                          newHours[index].closeTime = e.target.value;
                          setHours(newHours);
                        }}
                        className="w-28 rounded-xl border-sand bg-white text-center text-sm focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateHours.isPending}
            className="bg-terracotta text-white shadow-sm transition-colors hover:bg-terracotta-deep"
          >
            {updateHours.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Save className="mr-2 h-4 w-4" />
            Guardar horarios
          </Button>
        </div>
      </form>
    </div>
  );
}
