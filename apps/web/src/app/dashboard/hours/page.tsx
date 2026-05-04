"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOpeningHours, useUpdateOpeningHours } from "@/hooks/use-opening-hours";
import { useDashboardStore } from "@/stores/dashboard";

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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!activeBusinessId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Selecciona un negocio para configurar los horarios.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Horarios de atención</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Horario semanal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hours.map((day, index) => (
              <div
                key={day.dayOfWeek}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <div className="w-24 font-medium">{DAYS[index]}</div>
                <div className="flex items-center gap-2 flex-1">
                  <Switch
                    checked={!day.isClosed}
                    onCheckedChange={(checked) => {
                      const newHours = [...hours];
                      newHours[index].isClosed = !checked;
                      setHours(newHours);
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {day.isClosed ? "Cerrado" : "Abierto"}
                  </span>
                </div>
                {!day.isClosed && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={day.openTime}
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[index].openTime = e.target.value;
                        setHours(newHours);
                      }}
                      className="w-28"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="time"
                      value={day.closeTime}
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[index].closeTime = e.target.value;
                        setHours(newHours);
                      }}
                      className="w-28"
                    />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={updateHours.isPending}>
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
