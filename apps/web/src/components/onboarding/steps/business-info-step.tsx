"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { OnboardingShell } from "../onboarding-shell";
import { useCreateBusiness } from "@/hooks/use-business";
interface BusinessInfoStepProps {
  onNext: (businessId: string) => void;
}

export function BusinessInfoStep({ onNext }: BusinessInfoStepProps) {
  const createBusiness = useCreateBusiness();
  const [form, setForm] = useState({
    slug: "",
    name: "",
    whatsappNumber: "",
    description: "",
    currency: "PEN",
    isPublished: false,
    manualStatus: "AUTO" as "AUTO" | "OPEN" | "CLOSED",
  });

  const handleSubmit = async () => {
    if (!form.slug || !form.name || !form.whatsappNumber) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    try {
      const business = await createBusiness.mutateAsync(form);
      toast.success("Negocio creado correctamente");
      onNext(business.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear negocio");
    }
  };

  return (
    <OnboardingShell
      step={1}
      title="Datos de tu negocio"
      description="Empecemos con la información básica de tu negocio."
      onNext={handleSubmit}
      nextDisabled={createBusiness.isPending}
      isNextLoading={createBusiness.isPending}
      hideBack
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="onboarding-name">Nombre del negocio *</Label>
          <Input
            id="onboarding-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ej: La Casa del Sabor"
          />
        </div>
        <div>
          <Label htmlFor="onboarding-slug">URL de tu carta *</Label>
          <Input
            id="onboarding-slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
            placeholder="mi-negocio"
          />
          <p className="text-xs text-muted-foreground mt-1">
            mesa.pe/{form.slug || "tu-negocio"}
          </p>
        </div>
        <div>
          <Label htmlFor="onboarding-whatsapp">WhatsApp *</Label>
          <Input
            id="onboarding-whatsapp"
            value={form.whatsappNumber}
            onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
            placeholder="+51 999 999 999"
          />
        </div>
        <div>
          <Label htmlFor="onboarding-desc">Descripción</Label>
          <Input
            id="onboarding-desc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Breve descripción de tu negocio"
          />
        </div>
      </div>
    </OnboardingShell>
  );
}
