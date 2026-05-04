"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Store, Tag, UtensilsCrossed, Clock, MessageCircle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="bg-green-50/50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800">¡Todo listo!</p>
              <p className="text-sm text-green-700">
                Tu carta digital está publicada y lista para recibir pedidos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Checklist de lanzamiento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedCount} de {items.length} completados
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-lg border p-3 ${
                item.completed ? "bg-muted/30" : "bg-background"
              }`}
            >
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span
                className={`flex-1 text-sm ${
                  item.completed ? "text-muted-foreground line-through" : ""
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {firstIncomplete && (
          <Link href={firstIncomplete.href}>
            <Button className="w-full bg-[#E85D04] text-white hover:bg-[#D15104]">
              Completar: {firstIncomplete.label}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
