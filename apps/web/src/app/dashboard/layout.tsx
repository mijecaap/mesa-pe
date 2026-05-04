"use client";

import { useEffect } from "react";
import {
  OrganizationSwitcher,
  UserButton,
  useOrganization,
} from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Store,
  Clock,
  Tags,
  UtensilsCrossed,
  Settings,
  ChevronRight,
  QrCode,
  BarChart3,
} from "lucide-react";
import { useBusinesses } from "@/hooks/use-business";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import { useDashboardStore } from "@/stores/dashboard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/dashboard/business", label: "Mi Negocio", icon: Store },
  { href: "/dashboard/hours", label: "Horarios", icon: Clock },
  { href: "/dashboard/categories", label: "Categorías", icon: Tags },
  { href: "/dashboard/products", label: "Productos", icon: UtensilsCrossed },
  { href: "/dashboard/qr", label: "Código QR", icon: QrCode },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Configuración", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { organization } = useOrganization();
  const pathname = usePathname();
  const router = useRouter();
  const { data: businesses, isLoading: businessesLoading } = useBusinesses(organization?.id);
  const { activeBusinessId, setActiveBusinessId } = useDashboardStore();
  const { data: flags } = useFeatureFlags(activeBusinessId ?? undefined);

  useEffect(() => {
    if (businesses && businesses.length > 0 && !activeBusinessId) {
      setActiveBusinessId(businesses[0].id);
    }
  }, [businesses, activeBusinessId, setActiveBusinessId]);

  useEffect(() => {
    if (!businessesLoading && businesses && businesses.length === 0 && !pathname.startsWith("/dashboard/onboarding")) {
      router.push("/dashboard/onboarding");
    }
  }, [businessesLoading, businesses, pathname, router]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="font-bold text-lg">
              Mesa.pe
            </Link>
            <OrganizationSwitcher
              hidePersonal
              afterCreateOrganizationUrl="/dashboard"
              afterSelectOrganizationUrl="/dashboard"
              appearance={{
                elements: {
                  organizationSwitcherTrigger:
                    "px-2 py-1 rounded-md hover:bg-muted",
                },
              }}
            />
          </div>
          <UserButton
            appearance={{
              elements: {
                userButtonTrigger: "px-2 py-1 rounded-md hover:bg-muted",
              },
            }}
          />
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/30 md:block">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          {businesses && businesses.length > 0 && (
            <div className="mt-auto border-t p-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Negocio activo
                </p>
                <select
                  value={activeBusinessId ?? ""}
                  onChange={(e) => setActiveBusinessId(e.target.value)}
                  className="w-full rounded-md border bg-background px-2 py-1 text-sm"
                >
                  {businesses.map((b: { id: string; name: string }) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              {flags && (
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase tracking-wider"
                  >
                    {flags.showWatermark ? "Free" : flags.showAdvancedAnalytics ? "Pro" : "Starter"}
                  </Badge>
                  {flags.showWatermark && (
                    <Link
                      href="/#precios"
                      target="_blank"
                      className="text-[10px] font-medium text-[#f97316] hover:underline"
                    >
                      Upgrade →
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </aside>

        <main className="flex-1 container py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
