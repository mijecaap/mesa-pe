"use client";

import { useOrganization } from "@clerk/nextjs";
import { Loader2, QrCode, ArrowRight } from "lucide-react";
import { useBusinesses } from "@/hooks/use-business";
import { useDashboardStore } from "@/stores/dashboard";
import { QrGenerator } from "@/components/qr/qr-generator";
import Link from "next/link";

export default function QrPage() {
  const { organization } = useOrganization();
  const { data: businesses, isLoading } = useBusinesses(organization?.id);
  const { activeBusinessId } = useDashboardStore();

  const activeBusiness = businesses?.find(
    (b: { id: string }) => b.id === activeBusinessId,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (!activeBusiness) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand/60">
          <QrCode className="h-8 w-8 text-warm-gray" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-coffee">Selecciona un negocio</p>
          <p className="max-w-xs text-sm leading-relaxed text-warm-gray">
            Necesitas tener un negocio activo para generar su código QR.
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
        <h1 className="font-heading text-2xl font-bold text-coffee">Código QR</h1>
        <p className="mt-1 text-sm text-warm-gray">
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
