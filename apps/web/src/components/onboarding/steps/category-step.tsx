"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { OnboardingShell } from "../onboarding-shell";
import { useCreateCategory } from "@/hooks/use-categories";

interface CategoryStepProps {
  businessId: string;
  onNext: () => void;
  onBack: () => void;
}

export function CategoryStep({ businessId, onNext, onBack }: CategoryStepProps) {
  const createCategory = useCreateCategory();
  const [form, setForm] = useState({
    name: "",
    description: "",
    isVisible: true,
  });

  const handleSubmit = async () => {
    if (!form.name) {
      toast.error("Ingresa un nombre para la categoría");
      return;
    }

    try {
      await createCategory.mutateAsync({
        businessId,
        data: form,
      });
      toast.success("Categoría creada");
      onNext();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear categoría");
    }
  };

  return (
    <OnboardingShell
      step={3}
      title="Primera categoría"
      description="Crea al menos una categoría para organizar tus productos."
      onNext={handleSubmit}
      onBack={onBack}
      nextDisabled={createCategory.isPending}
      isNextLoading={createCategory.isPending}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="cat-name">Nombre de la categoría *</Label>
          <Input
            id="cat-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ej: Entradas, Bebidas, Platos principales"
          />
        </div>
        <div>
          <Label htmlFor="cat-desc">Descripción (opcional)</Label>
          <Input
            id="cat-desc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Breve descripción"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={form.isVisible}
            onCheckedChange={(checked) => setForm({ ...form, isVisible: checked })}
          />
          <Label>Visible en el menú público</Label>
        </div>
      </div>
    </OnboardingShell>
  );
}
