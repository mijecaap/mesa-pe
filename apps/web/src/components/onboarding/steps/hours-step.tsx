"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { OnboardingShell } from "../onboarding-shell";
import { useUpdateOpeningHours } from "@/hooks/use-opening-hours";

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

interface HoursStepProps {
  businessId: string;
  onNext: () => void;
  onBack: () => void;
}

export function HoursStep({ businessId, onNext, onBack }: HoursStepProps) {
  const updateHours = useUpdateOpeningHours();
  const [hours, setHours] = useState<HourRow[]>(
    DAYS.map((_, i) => ({
      dayOfWeek: i,
      openTime: "08:00",
      closeTime: "22:00",
      isClosed: i === 0, // Cerrado domingos por defecto
    })),
  );

  const handleSubmit = async () => {
    try {
      await updateHours.mutateAsync({
        businessId,
        data: { hours },
      });
      toast.success("Horarios guardados");
      onNext();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar horarios");
    }
  };

  return (
    <OnboardingShell
      step={2}
      title="Horarios de atención"
      description="Configura los días y horarios en que atiendes."
      onNext={handleSubmit}
      onBack={onBack}
      nextDisabled={updateHours.isPending}
      isNextLoading={updateHours.isPending}
    >
      <div className="space-y-3">
        {hours.map((day, index) => (
          <div
            key={day.dayOfWeek}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <div className="w-24 text-sm font-medium">{DAYS[index]}</div>
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
                  className="w-24"
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
                  className="w-24"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </OnboardingShell>
  );
}
