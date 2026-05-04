"use client";

import { useOrganization } from "@clerk/nextjs";
import { Store, Eye, MessageSquare, ShoppingCart, ArrowRight, AlertTriangle, Plus } from "lucide-react";
import Link from "next/link";
import { useBusinesses } from "@/hooks/use-business";
import { useDashboardStore } from "@/stores/dashboard";
import { useAnalyticsSummary } from "@/hooks/use-analytics";
import { LaunchChecklist } from "@/components/dashboard/launch-checklist";
import { DashboardStatsSkeleton } from "@/components/dashboard/skeletons/dashboard-stats-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardClient() {
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { data: businesses, isLoading, isPending, error } = useBusinesses(organization?.id);
  const { activeBusinessId } = useDashboardStore();

  const activeBusiness = businesses?.find(
    (b: { id: string }) => b.id === activeBusinessId,
  );

  // Clerk aún está cargando la organización
  if (!orgLoaded) {
    return <DashboardStatsSkeleton />;
  }

  // Query está cargando (incluye el estado enabled:false de react-query v5)
  if (isLoading || isPending) {
    return <DashboardStatsSkeleton />;
  }

  // Error de conexión o del servidor
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <div className="space-y-1">
            <p className="font-semibold text-red-800">No se pudo cargar la información</p>
            <p className="text-sm text-red-700">
              {error instanceof Error ? error.message : "Error de conexión con el servidor. Verifica que la API esté corriendo."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sin negocios creados
  if (!businesses || businesses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <Store className="h-10 w-10 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-lg font-semibold">No tienes negocios aún</p>
            <p className="text-sm text-muted-foreground">
              Crea tu primer negocio para empezar a usar el dashboard.
            </p>
          </div>
          <Link href="/dashboard/business">
            <Button className="bg-[#E85D04] text-white hover:bg-[#D15104]">
              <Plus className="mr-2 h-4 w-4" />
              Crear negocio
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <LaunchChecklist business={activeBusiness} />

      <StatsGrid businessId={activeBusiness?.id} />
    </div>
  );
}

function StatsGrid({ businessId }: { businessId?: string }) {
  const { data: summary, isLoading } = useAnalyticsSummary(businessId);

  if (isLoading) {
    return <DashboardStatsSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Productos"
          value={0}
          icon={Store}
        />
        <StatCard
          label="Visitas hoy"
          value={summary?.visitsToday ?? 0}
          icon={Eye}
        />
        <StatCard
          label="Clics a WhatsApp"
          value={summary?.whatsappClicks ?? 0}
          icon={MessageSquare}
        />
        <StatCard
          label="Pedidos iniciados"
          value={summary?.ordersStarted ?? 0}
          icon={ShoppingCart}
        />
      </div>
      <div className="flex justify-end">
        <Link
          href="/dashboard/analytics"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Ver analytics completos <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}
