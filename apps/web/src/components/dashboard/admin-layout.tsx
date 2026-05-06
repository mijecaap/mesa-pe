"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Shield,
  ChevronRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const adminNavItems = [
  { href: "/dashboard/admin", label: "Panel", icon: Shield },
];

function NavItems({
  items,
  pathname,
  onNavigate,
}: {
  items: { href: string; label: string; icon: React.ElementType }[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => {
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

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* Skip link */}
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
                  Menú de administración
                </SheetTitle>
                <div className="flex h-full flex-col">
                  <div className="border-b border-sand p-4">
                    <Link
                      href="/dashboard/admin"
                      onClick={() => setMobileNavOpen(false)}
                      className="font-heading text-lg font-bold text-coffee"
                    >
                      Mesa.pe Admin
                    </Link>
                  </div>
                  <div className="flex-1 overflow-auto py-2">
                    <NavItems
                      items={adminNavItems}
                      pathname={pathname}
                      onNavigate={() => setMobileNavOpen(false)}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link
              href="/dashboard/admin"
              className="font-heading text-lg font-bold text-coffee transition-colors hover:text-coffee-deep"
            >
              Mesa.pe <span className="text-terracotta">Admin</span>
            </Link>
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
            <NavItems items={adminNavItems} pathname={pathname} />
          </div>

          <div className="border-t border-sand p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warm-gray">
              Modo administrador
            </p>
            <p className="mt-1 text-xs text-warm-gray/80">
              Gestión de negocios y suscripciones.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
