"use client";

import { useOrganization } from "@clerk/nextjs";
import {
  Eye,
  MessageSquare,
  ShoppingCart,
  TrendingUp,
  Users,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="rounded-lg border bg-card p-8 text-center text-card-foreground shadow-sm">
        <h2 className="text-xl font-semibold mb-2">No hay negocio activo</h2>
        <p className="text-muted-foreground">
          Selecciona un negocio para ver sus analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
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
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  const stats = [
    { label: "Visitas hoy", value: summary?.visitsToday ?? 0, icon: Eye },
    {
      label: "Visitas 7 días",
      value: summary?.visitsLast7Days ?? 0,
      icon: Users,
    },
    {
      label: "Visitas 30 días",
      value: summary?.visitsLast30Days ?? 0,
      icon: TrendingUp,
    },
    {
      label: "Clics WhatsApp",
      value: summary?.whatsappClicks ?? 0,
      icon: MessageSquare,
    },
    {
      label: "Pedidos iniciados",
      value: summary?.ordersStarted ?? 0,
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground">
                {s.label}
              </div>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-3xl font-bold">{s.value}</div>
          </CardContent>
        </Card>
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

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Visitas diarias</CardTitle>
          <CardDescription>Últimos 30 días</CardDescription>
        </CardHeader>
        <CardContent>
          {dailyLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(24 95% 53%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(24 95% 53%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(0 0% 90%)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visitas"
                  stroke="hsl(24 95% 53%)"
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Horas pico</CardTitle>
          <CardDescription>Distribución por hora del día</CardDescription>
        </CardHeader>
        <CardContent>
          {hourlyLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
                <XAxis dataKey="hora" tick={{ fontSize: 11 }} interval={2} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(0 0% 90%)",
                  }}
                />
                <Bar dataKey="visitas" fill="hsl(24 95% 53%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function BottomRow({ businessId }: { businessId: string }) {
  const { data: topViewed } = useTopProducts(businessId, "view");
  const { data: topCart } = useTopProducts(businessId, "cart");
  const { data: leadsData, isLoading: leadsLoading } = useOrderLeads(businessId);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Top productos vistos</CardTitle>
          <CardDescription>Últimos 30 días</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {topViewed?.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin datos aún</p>
          )}
          {topViewed?.slice(0, 10).map((p: { id: string; name: string; count: number }, i: number) => (
            <div key={p.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground w-4">
                  {i + 1}
                </span>
                <span className="text-sm">{p.name}</span>
              </div>
              <Badge variant="secondary">{p.count}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top en carrito</CardTitle>
          <CardDescription>Últimos 30 días</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {topCart?.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin datos aún</p>
          )}
          {topCart?.slice(0, 10).map((p: { id: string; name: string; count: number }, i: number) => (
            <div key={p.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground w-4">
                  {i + 1}
                </span>
                <span className="text-sm">{p.name}</span>
              </div>
              <Badge variant="secondary">{p.count}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Últimos pedidos</CardTitle>
          <CardDescription>OrderLeads recientes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {leadsLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : leadsData?.items?.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin pedidos aún</p>
          ) : (
            leadsData?.items?.slice(0, 8).map((lead: { id: string; customerName: string; total: number; fulfillmentType: string; createdAt: string }) => (
              <div key={lead.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{lead.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString("es-PE")} ·{" "}
                    {formatFulfillment(lead.fulfillmentType)}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  S/ {Number(lead.total).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
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
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}
