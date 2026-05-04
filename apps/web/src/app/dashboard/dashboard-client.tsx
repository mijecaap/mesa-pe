"use client";

import { useOrganization } from "@clerk/nextjs";
import { Store, Eye, MessageSquare, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useBusinesses } from "@/hooks/use-business";
import { useDashboardStore } from "@/stores/dashboard";
import { useAnalyticsSummary } from "@/hooks/use-analytics";
import { LaunchChecklist } from "@/components/dashboard/launch-checklist";
import { DashboardStatsSkeleton } from "@/components/dashboard/skeletons/dashboard-stats-skeleton";

export function DashboardClient() {
  const { organization } = useOrganization();
  const { data: businesses, isLoading } = useBusinesses(organization?.id);
  const { activeBusinessId } = useDashboardStore();

  const activeBusiness = businesses?.find(
    (b: { id: string }) => b.id === activeBusinessId,
  );

  if (isLoading) {
    return <DashboardStatsSkeleton />;
  }

  if (!businesses || businesses.length === 0) {
    return null;
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
