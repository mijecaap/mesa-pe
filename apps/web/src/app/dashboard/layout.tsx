"use client";

import { useEffect, useState } from "react";
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
  ChevronDown,
  QrCode,
  BarChart3,
  Menu,
  Megaphone,
} from "lucide-react";
import { useBusinesses } from "@/hooks/use-business";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import { useDashboardStore } from "@/stores/dashboard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard/business", label: "Mi Negocio", icon: Store },
  { href: "/dashboard/hours", label: "Horarios", icon: Clock },
  { href: "/dashboard/categories", label: "Categorías", icon: Tags },
  { href: "/dashboard/products", label: "Productos", icon: UtensilsCrossed },
  { href: "/dashboard/promotions", label: "Promociones", icon: Megaphone },
  { href: "/dashboard/qr", label: "Código QR", icon: QrCode },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Configuración", icon: Settings },
];

function NavItems({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40 focus-visible:ring-offset-1",
              isActive
                ? "bg-terracotta text-white shadow-sm"
                : "text-coffee/80 hover:bg-sand/60 hover:text-coffee",
            )}
          >
            <item.icon
              className="h-[18px] w-[18px] shrink-0"
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className="truncate">{item.label}</span>
            {isActive && (
              <ChevronRight className="ml-auto h-4 w-4 shrink-0 opacity-80" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function BusinessSelectorFooter({
  businesses,
  activeBusinessId,
  setActiveBusinessId,
  flags,
}: {
  businesses: { id: string; name: string }[];
  activeBusinessId: string | null;
  setActiveBusinessId: (id: string) => void;
  flags?: { showWatermark: boolean; showAdvancedAnalytics: boolean };
}) {
  return (
    <div className="border-t border-sand p-4">
      <div className="space-y-3">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-warm-gray">
            Negocio activo
          </p>
          <div className="relative">
            <select
              value={activeBusinessId ?? ""}
              onChange={(e) => setActiveBusinessId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-sand bg-cream/60 px-3 py-2.5 pr-8 text-sm text-coffee transition-colors focus-visible:border-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/30"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-gray" />
          </div>
        </div>
        {flags && (
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="border-sand text-[10px] uppercase tracking-wider text-warm-gray"
            >
              {flags.showWatermark
                ? "Free"
                : flags.showAdvancedAnalytics
                  ? "Pro"
                  : "Starter"}
            </Badge>
            {flags.showWatermark && (
              <Link
                href="/#precios"
                target="_blank"
                className="text-[11px] font-semibold text-terracotta transition-colors hover:text-terracotta-deep hover:underline"
              >
                Upgrade →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { organization } = useOrganization();
  const pathname = usePathname();
  const router = useRouter();
  const { data: businesses, isLoading: businessesLoading } = useBusinesses(
    organization?.id,
  );
  const { activeBusinessId, setActiveBusinessId } = useDashboardStore();
  const { data: flags } = useFeatureFlags(activeBusinessId ?? undefined);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (businesses && businesses.length > 0 && !activeBusinessId) {
      setActiveBusinessId(businesses[0].id);
    }
  }, [businesses, activeBusinessId, setActiveBusinessId]);

  useEffect(() => {
    if (
      !businessesLoading &&
      businesses &&
      businesses.length === 0 &&
      !pathname.startsWith("/dashboard/onboarding")
    ) {
      router.push("/dashboard/onboarding");
    }
  }, [businessesLoading, businesses, pathname, router]);

  const hasBusinesses = businesses && businesses.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:m-3 focus:rounded-lg focus:bg-terracotta focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        Saltar al contenido principal
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-sand bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile drawer */}
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-coffee transition-colors hover:bg-sand/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40 md:hidden"
                aria-label="Abrir menú de navegación"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[280px] border-r border-sand bg-white p-0 sm:max-w-[280px]"
              >
                <SheetTitle className="sr-only">
                  Menú de navegación
                </SheetTitle>
                <div className="flex h-full flex-col">
                  <div className="border-b border-sand p-4">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileNavOpen(false)}
                      className="font-heading text-lg font-bold text-coffee"
                    >
                      Mesa.pe
                    </Link>
                  </div>
                  <div className="flex-1 overflow-auto py-2">
                    <NavItems
                      pathname={pathname}
                      onNavigate={() => setMobileNavOpen(false)}
                    />
                  </div>
                  {hasBusinesses && (
                    <BusinessSelectorFooter
                      businesses={businesses}
                      activeBusinessId={activeBusinessId}
                      setActiveBusinessId={(id) => {
                        setActiveBusinessId(id);
                        setMobileNavOpen(false);
                      }}
                      flags={flags}
                    />
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link
              href="/dashboard"
              className="font-heading text-lg font-bold text-coffee transition-colors hover:text-coffee-deep"
            >
              Mesa.pe
            </Link>

            <div className="hidden md:block">
              <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/dashboard"
                afterSelectOrganizationUrl="/dashboard"
                appearance={{
                  elements: {
                    organizationSwitcherTrigger:
                      "px-2 py-1 rounded-lg hover:bg-sand/60 transition-colors text-sm",
                  },
                }}
              />
            </div>
          </div>

          <UserButton
            appearance={{
              elements: {
                userButtonTrigger:
                  "px-2 py-1 rounded-lg hover:bg-sand/60 transition-colors",
              },
            }}
          />
        </div>
      </header>

      <div className="flex flex-1 items-start">
        {/* Desktop Sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 flex-col border-r border-sand bg-white md:flex">
          <div className="flex-1 overflow-y-auto py-2">
            <NavItems pathname={pathname} />
          </div>

          {hasBusinesses && (
            <BusinessSelectorFooter
              businesses={businesses}
              activeBusinessId={activeBusinessId}
              setActiveBusinessId={setActiveBusinessId}
              flags={flags}
            />
          )}
        </aside>

        {/* Main content */}
        <main
          id="main-content"
          className="flex-1 p-4 md:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
