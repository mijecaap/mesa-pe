"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { OnboardingShell } from "../onboarding-shell";
import { useUpdateBusiness } from "@/hooks/use-business";

interface WhatsappStepProps {
  businessId: string;
  currentWhatsapp?: string;
  onNext: () => void;
  onBack: () => void;
}

export function WhatsappStep({ businessId, currentWhatsapp, onNext, onBack }: WhatsappStepProps) {
  const updateBusiness = useUpdateBusiness();
  const [whatsapp, setWhatsapp] = useState(currentWhatsapp || "");
  const [publish, setPublish] = useState(true);

  const handleSubmit = async () => {
    if (!whatsapp) {
      toast.error("Ingresa un número de WhatsApp");
      return;
    }

    try {
      await updateBusiness.mutateAsync({
        id: businessId,
        data: {
          whatsappNumber: whatsapp,
          isPublished: publish,
        },
      });
      toast.success("Configuración guardada");
      onNext();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    }
  };

  return (
    <OnboardingShell
      step={5}
      title="WhatsApp y publicación"
      description="Confirma tu número de WhatsApp y publica tu carta."
      onNext={handleSubmit}
      onBack={onBack}
      nextDisabled={updateBusiness.isPending}
      isNextLoading={updateBusiness.isPending}
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="wa-number">Número de WhatsApp *</Label>
          <Input
            id="wa-number"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+51 999 999 999"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Tus clientes te escribirán a este número para hacer pedidos.
          </p>
        </div>

        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Publicar carta digital</p>
              <p className="text-sm text-muted-foreground">
                Tu página estará visible públicamente
              </p>
            </div>
            <Switch checked={publish} onCheckedChange={setPublish} />
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}
