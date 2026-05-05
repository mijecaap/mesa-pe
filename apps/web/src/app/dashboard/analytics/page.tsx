"use client";

import { useOrganization } from "@clerk/nextjs";
import {
  Eye,
  MessageSquare,
  ShoppingCart,
  TrendingUp,
  Users,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard";
import { useBusinesses } from "@/hooks/use-business";
import {
  useAnalyticsSummary,
  useDailyVisits,
  useHourlyVisits,
  useTopProducts,
} from "@/hooks/use-analytics";
import { useOrderLeads } from "@/hooks/use-order-leads";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AnalyticsPage() {
  const { organization } = useOrganization();
  const { data: businesses, isLoading: businessesLoading } = useBusinesses(
    organization?.id
  );
  const { activeBusinessId } = useDashboardStore();
  const activeBusiness = businesses?.find(
    (b: { id: string }) => b.id === activeBusinessId
  );

  if (businessesLoading) {
    return <AnalyticsSkeleton />;
  }

  if (!activeBusiness) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand/60">
          <BarChart3 className="h-8 w-8 text-warm-gray" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-coffee">Selecciona un negocio</p>
          <p className="max-w-xs text-sm leading-relaxed text-warm-gray">
            Necesitas tener un negocio activo para ver sus métricas.
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-coffee">Analytics</h1>
        <p className="mt-1 text-sm text-warm-gray">
          Métricas de {activeBusiness.name}
        </p>
      </div>

      <StatsGrid businessId={activeBusiness.id} />
      <ChartsRow businessId={activeBusiness.id} />
      <BottomRow businessId={activeBusiness.id} />
    </div>
  );
}

function StatsGrid({ businessId }: { businessId: string }) {
  const { data: summary, isLoading } = useAnalyticsSummary(businessId);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-sand/40" />
        ))}
      </div>
    );
  }

  const stats = [
    { label: "Visitas hoy", value: summary?.visitsToday ?? 0, icon: Eye, color: "bg-blue-500/10 text-blue-600" },
    { label: "Visitas 7 días", value: summary?.visitsLast7Days ?? 0, icon: Users, color: "bg-moss/10 text-moss" },
    { label: "Visitas 30 días", value: summary?.visitsLast30Days ?? 0, icon: TrendingUp, color: "bg-terracotta/10 text-terracotta" },
    { label: "Clics WhatsApp", value: summary?.whatsappClicks ?? 0, icon: MessageSquare, color: "bg-amber-500/10 text-amber-600" },
    { label: "Pedidos iniciados", value: summary?.ordersStarted ?? 0, icon: ShoppingCart, color: "bg-purple-500/10 text-purple-600" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-sand bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-warm-gray">{s.label}</div>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.color}`}>
              <s.icon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-coffee">
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartsRow({ businessId }: { businessId: string }) {
  const { data: daily, isLoading: dailyLoading } = useDailyVisits(businessId);
  const { data: hourly, isLoading: hourlyLoading } = useHourlyVisits(businessId);

  const dailyData =
    daily?.map((d: { date: string; count: number }) => ({
      label: d.date.slice(5),
      visitas: d.count,
    })) ?? [];

  const hourlyMap = new Map<number, number>();
  hourly?.forEach((h: { hour: number; count: number }) => {
    hourlyMap.set(h.hour, (hourlyMap.get(h.hour) || 0) + h.count);
  });
  const hourlyData = Array.from({ length: 24 }, (_, h) => ({
    hora: `${String(h).padStart(2, "0")}:00`,
    visitas: hourlyMap.get(h) || 0,
  }));

  const chartTooltipStyle = {
    borderRadius: "12px",
    border: "1px solid #EDE6DE",
    background: "#FFFFFF",
    boxShadow: "0 4px 6px -1px rgba(42, 33, 30, 0.08)",
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-coffee">Visitas diarias</h3>
          <p className="text-sm text-warm-gray">Últimos 30 días</p>
        </div>
        {dailyLoading ? (
          <div className="h-64 animate-pulse rounded-xl bg-sand/40" />
        ) : dailyData.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-xl bg-cream/40">
            <p className="text-sm text-warm-gray">Sin datos aún</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C25E3A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#C25E3A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE6DE" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#7D6F65" }} axisLine={{ stroke: "#EDE6DE" }} />
              <YAxis tick={{ fontSize: 12, fill: "#7D6F65" }} axisLine={{ stroke: "#EDE6DE" }} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area
                type="monotone"
                dataKey="visitas"
                stroke="#C25E3A"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVisits)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-coffee">Horas pico</h3>
          <p className="text-sm text-warm-gray">Distribución por hora del día</p>
        </div>
        {hourlyLoading ? (
          <div className="h-64 animate-pulse rounded-xl bg-sand/40" />
        ) : hourlyData.every((d) => d.visitas === 0) ? (
          <div className="flex h-64 items-center justify-center rounded-xl bg-cream/40">
            <p className="text-sm text-warm-gray">Sin datos aún</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE6DE" />
              <XAxis dataKey="hora" tick={{ fontSize: 11, fill: "#7D6F65" }} interval={2} axisLine={{ stroke: "#EDE6DE" }} />
              <YAxis tick={{ fontSize: 12, fill: "#7D6F65" }} axisLine={{ stroke: "#EDE6DE" }} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="visitas" fill="#C25E3A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function BottomRow({ businessId }: { businessId: string }) {
  const { data: topViewed } = useTopProducts(businessId, "view");
  const { data: topCart } = useTopProducts(businessId, "cart");
  const { data: leadsData, isLoading: leadsLoading } = useOrderLeads(businessId);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <TopProductsCard
        title="Top productos vistos"
        description="Últimos 30 días"
        data={topViewed}
      />
      <TopProductsCard
        title="Top en carrito"
        description="Últimos 30 días"
        data={topCart}
      />
      <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-coffee">Últimos pedidos</h3>
          <p className="text-sm text-warm-gray">OrderLeads recientes</p>
        </div>
        <div className="space-y-3">
          {leadsLoading ? (
            <div className="h-40 animate-pulse rounded-xl bg-sand/40" />
          ) : !leadsData?.items || leadsData.items.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-xl bg-cream/40">
              <p className="text-sm text-warm-gray">Sin pedidos aún</p>
            </div>
          ) : (
            leadsData.items.slice(0, 8).map((lead: { id: string; customerName: string; total: number; fulfillmentType: string; createdAt: string }) => (
              <div key={lead.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-coffee">{lead.customerName}</p>
                  <p className="text-xs text-warm-gray">
                    {new Date(lead.createdAt).toLocaleDateString("es-PE")} · {formatFulfillment(lead.fulfillmentType)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-coffee">
                  S/ {Number(lead.total).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function TopProductsCard({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data?: { id: string; name: string; count: number }[];
}) {
  return (
    <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-coffee">{title}</h3>
        <p className="text-sm text-warm-gray">{description}</p>
      </div>
      <div className="space-y-3">
        {!data || data.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-xl bg-cream/40">
            <p className="text-sm text-warm-gray">Sin datos aún</p>
          </div>
        ) : (
          data.slice(0, 10).map((p, i) => (
            <div key={p.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cream text-[10px] font-semibold text-warm-gray">
                  {i + 1}
                </span>
                <span className="truncate text-sm text-coffee">{p.name}</span>
              </div>
              <Badge variant="outline" className="shrink-0 border-sand text-[10px] text-warm-gray">
                {p.count}
              </Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatFulfillment(type: string) {
  const map: Record<string, string> = {
    DINE_IN: "Mesa",
    PICKUP: "Recojo",
    DELIVERY: "Delivery",
  };
  return map[type] ?? type;
}

function AnalyticsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-sand/40" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-sand/40" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl bg-sand/40" />
        <div className="h-80 animate-pulse rounded-2xl bg-sand/40" />
      </div>
    </div>
  );
}
