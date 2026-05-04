"use client";

import { useOrganization } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useBusinesses } from "@/hooks/use-business";
import { useDashboardStore } from "@/stores/dashboard";
import { QrGenerator } from "@/components/qr/qr-generator";

export default function QrPage() {
  const { organization } = useOrganization();
  const { data: businesses, isLoading } = useBusinesses(organization?.id);
  const { activeBusinessId } = useDashboardStore();

  const activeBusiness = businesses?.find(
    (b: { id: string }) => b.id === activeBusinessId,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!activeBusiness) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Código QR</h1>
        <p className="text-muted-foreground">
          Selecciona un negocio para generar su código QR.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Código QR</h1>
        <p className="text-muted-foreground">
          Descarga el QR de {activeBusiness.name} para imprimirlo o compartirlo.
        </p>
      </div>

      <QrGenerator
        slug={activeBusiness.slug}
        logoUrl={activeBusiness.logoUrl}
        businessName={activeBusiness.name}
      />
    </div>
  );
}
