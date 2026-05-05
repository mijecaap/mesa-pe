"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Store, Tag, UtensilsCrossed, Clock, MessageCircle, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface LaunchChecklistProps {
  business: {
    id: string;
    slug: string;
    name: string;
    whatsappNumber?: string | null;
    isPublished: boolean;
    categories?: { id: string }[];
    items?: { id: string }[];
    openingHours?: { id: string }[];
  } | null | undefined;
}

interface CheckItem {
  id: number;
  label: string;
  icon: React.ElementType;
  completed: boolean;
  href: string;
}

export function LaunchChecklist({ business }: LaunchChecklistProps) {
  const items: CheckItem[] = useMemo(() => {
    if (!business) return [];
    return [
      {
        id: 1,
        label: "Crear negocio",
        icon: Store,
        completed: true,
        href: "/dashboard/business",
      },
      {
        id: 2,
        label: "Agregar al menos 1 categoría",
        icon: Tag,
        completed: (business.categories?.length ?? 0) > 0,
        href: "/dashboard/categories",
      },
      {
        id: 3,
        label: "Agregar al menos 1 producto",
        icon: UtensilsCrossed,
        completed: (business.items?.length ?? 0) > 0,
        href: "/dashboard/products",
      },
      {
        id: 4,
        label: "Configurar horarios",
        icon: Clock,
        completed: (business.openingHours?.length ?? 0) > 0,
        href: "/dashboard/hours",
      },
      {
        id: 5,
        label: "Configurar WhatsApp",
        icon: MessageCircle,
        completed: !!business.whatsappNumber,
        href: "/dashboard/business",
      },
      {
        id: 6,
        label: "Publicar menú",
        icon: Rocket,
        completed: business.isPublished,
        href: "/dashboard/business",
      },
    ];
  }, [business]);

  const completedCount = items.filter((i) => i.completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;
  const allCompleted = completedCount === items.length && items.length > 0;
  const firstIncomplete = items.find((i) => !i.completed);

  if (allCompleted) {
    return (
      <div className="rounded-2xl border border-moss/20 bg-moss/5 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-moss/15">
            <CheckCircle2 className="h-5 w-5 text-moss" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-coffee">¡Tu carta está lista!</p>
            <p className="mt-0.5 text-sm leading-relaxed text-warm-gray">
              Tu menú está publicado y recibiendo pedidos. Sigue agregando productos para atraer más clientes.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/${business?.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg bg-terracotta px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-terracotta-deep"
              >
                Ver mi carta <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/dashboard/qr"
                className="inline-flex items-center gap-1.5 rounded-lg border border-sand bg-white px-3.5 py-2 text-sm font-medium text-coffee transition-colors hover:bg-sand/40"
              >
                Compartir QR
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-coffee">Checklist de lanzamiento</h2>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-gray">
              {completedCount} de {items.length} completados
            </span>
            <span className="font-semibold text-coffee">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="space-y-1.5">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
              item.completed
                ? "bg-cream/60 text-warm-gray"
                : "bg-cream text-coffee hover:bg-sand/50"
            }`}
          >
            {item.completed ? (
              <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-moss" />
            ) : (
              <Circle className="h-[18px] w-[18px] shrink-0 text-sand" />
            )}
            <item.icon
              className={`h-4 w-4 shrink-0 ${
                item.completed ? "text-warm-gray/60" : "text-warm-gray"
              }`}
            />
            <span
              className={`flex-1 text-sm ${
                item.completed ? "line-through opacity-60" : "font-medium"
              }`}
            >
              {item.label}
            </span>
            {!item.completed && (
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-warm-gray opacity-0 transition-opacity group-hover:opacity-60" />
            )}
          </Link>
        ))}
      </div>

      {firstIncomplete && (
        <div className="mt-4">
          <Link href={firstIncomplete.href}>
            <Button className="w-full bg-terracotta text-white shadow-sm transition-colors hover:bg-terracotta-deep">
              Completar: {firstIncomplete.label}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
