"use client";

import { useOrganization } from "@clerk/nextjs";
import {
  Store,
  Eye,
  MessageSquare,
  ShoppingCart,
  ArrowRight,
  AlertTriangle,
  Plus,
  UtensilsCrossed,
  QrCode,
  BarChart3,
  ExternalLink,
  Sparkles,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useBusinesses } from "@/hooks/use-business";
import { useDashboardStore } from "@/stores/dashboard";
import { useAnalyticsSummary } from "@/hooks/use-analytics";
import { useDaysRemaining } from "@/hooks/use-subscription";
import { LaunchChecklist } from "@/components/dashboard/launch-checklist";
import { DashboardStatsSkeleton } from "@/components/dashboard/skeletons/dashboard-stats-skeleton";
import { Button } from "@/components/ui/button";

export function DashboardClient() {
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { data: businesses, isLoading, isPending, error } = useBusinesses(organization?.id);
  const { activeBusinessId } = useDashboardStore();

  const activeBusiness = businesses?.find(
    (b: { id: string }) => b.id === activeBusinessId,
  );

  if (!orgLoaded || isLoading || isPending) {
    return <DashboardStatsSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-red-900">No se pudo cargar la información</p>
            <p className="text-sm leading-relaxed text-red-700">
              {error instanceof Error ? error.message : "Error de conexión con el servidor. Verifica que la API esté corriendo."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!businesses || businesses.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand/60">
          <Store className="h-8 w-8 text-warm-gray" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-coffee">No tienes negocios aún</p>
          <p className="max-w-xs text-sm leading-relaxed text-warm-gray">
            Crea tu primer negocio para empezar a recibir pedidos por WhatsApp.
          </p>
        </div>
        <Link href="/dashboard/business">
          <Button className="bg-terracotta text-white shadow-sm transition-colors hover:bg-terracotta-deep">
            <Plus className="mr-2 h-4 w-4" />
            Crear negocio
          </Button>
        </Link>
      </div>
    );
  }

  const checklistComplete =
    activeBusiness &&
    (activeBusiness.categories?.length ?? 0) > 0 &&
    (activeBusiness.items?.length ?? 0) > 0 &&
    (activeBusiness.openingHours?.length ?? 0) > 0 &&
    !!activeBusiness.whatsappNumber &&
    activeBusiness.isPublished;

  return (
    <div className="space-y-8">
      <ExpiryBanner businessId={activeBusiness?.id} />
      <LaunchChecklist business={activeBusiness} />

      <StatsGrid businessId={activeBusiness?.id} />

      {checklistComplete && activeBusiness && (
        <>
          <QuickActions business={activeBusiness} />
          <TipCard />
        </>
      )}
    </div>
  );
}

function ExpiryBanner({ businessId }: { businessId?: string }) {
  const { data } = useDaysRemaining(businessId);
  const days = data?.days;

  if (days === null || days === undefined || days > 7) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
          <Clock className="h-[18px] w-[18px] text-amber-700" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-900">
            Tu plan expira en {days} día{days !== 1 ? "s" : ""}
          </p>
          <p className="mt-0.5 text-sm leading-relaxed text-amber-800">
            Renueva tu suscripción para no perder funciones premium.{" "}
            <Link
              href="/dashboard/plan"
              className="font-medium text-terracotta hover:underline"
            >
              Gestionar plan →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function StatsGrid({ businessId }: { businessId?: string }) {
  const { data: summary, isLoading } = useAnalyticsSummary(businessId);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-sand/40" />
        ))}
      </div>
    );
  }

  const stats = [
    { label: "Productos", value: summary?.totalProducts ?? 0, icon: Store, color: "bg-terracotta/10 text-terracotta" },
    { label: "Visitas hoy", value: summary?.visitsToday ?? 0, icon: Eye, color: "bg-moss/10 text-moss" },
    { label: "Clics a WhatsApp", value: summary?.whatsappClicks ?? 0, icon: MessageSquare, color: "bg-blue-500/10 text-blue-600" },
    { label: "Pedidos iniciados", value: summary?.ordersStarted ?? 0, icon: ShoppingCart, color: "bg-amber-500/10 text-amber-600" },
  ];

  return (
    <div className="space-y-3">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-sand bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-warm-gray">{stat.label}</div>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-coffee">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Link
          href="/dashboard/analytics"
          className="inline-flex items-center gap-1 text-sm font-medium text-terracotta transition-colors hover:text-terracotta-deep"
        >
          Ver analytics completos <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function QuickActions({ business }: { business: { slug: string; name: string } }) {
  const actions = [
    {
      label: "Ver mi carta",
      description: "Previsualiza cómo la ven tus clientes",
      href: `/${business.slug}`,
      icon: ExternalLink,
      external: true,
    },
    {
      label: "Compartir QR",
      description: "Genera el código para tu local",
      href: "/dashboard/qr",
      icon: QrCode,
    },
    {
      label: "Agregar producto",
      description: "Atrae más clientes con tu menú",
      href: "/dashboard/products/new",
      icon: UtensilsCrossed,
    },
    {
      label: "Ver analytics",
      description: "Entiende qué vende más",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
  ];

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-warm-gray">
        Acciones rápidas
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            target={action.external ? "_blank" : undefined}
            className="group rounded-2xl border border-sand bg-white p-4 shadow-sm transition-all hover:border-terracotta/30 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream">
                <action.icon className="h-[18px] w-[18px] text-terracotta" />
              </div>
              <div>
                <p className="text-sm font-semibold text-coffee group-hover:text-terracotta transition-colors">
                  {action.label}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-warm-gray">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TipCard() {
  return (
    <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50">
          <Sparkles className="h-[18px] w-[18px] text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-coffee">Tip del día</p>
          <p className="mt-0.5 text-sm leading-relaxed text-warm-gray">
            Los negocios con fotos en sus productos reciben hasta un 40% más de pedidos.
            Ve a <Link href="/dashboard/products" className="font-medium text-terracotta hover:underline">Productos</Link> y sube imágenes atractivas.
          </p>
        </div>
      </div>
    </div>
  );
}
