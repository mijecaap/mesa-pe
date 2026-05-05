"use client";

import Image from "next/image";
import { Flame, Leaf, Star, Tag, Zap, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicBusiness } from "@/hooks/use-public-business";

interface ProductCardProps {
  item: PublicBusiness["categories"][0]["items"][0];
  currency: string;
  onClick?: () => void;
  isOpenNow?: boolean;
  index?: number;
}

const tagConfig: Record<string, { icon: React.ReactNode; label: string; style: string }> = {
  nuevo: {
    icon: <Star className="h-3 w-3" />,
    label: "Nuevo",
    style: "bg-[var(--theme-text)] text-white",
  },
  popular: {
    icon: <Flame className="h-3 w-3" />,
    label: "Popular",
    style: "bg-[var(--theme-primary)] text-white",
  },
  promo: {
    icon: <Tag className="h-3 w-3" />,
    label: "Promo",
    style: "bg-[var(--theme-accent)] text-white",
  },
  vegetariano: {
    icon: <Leaf className="h-3 w-3" />,
    label: "Veggie",
    style: "bg-[var(--theme-accent)]/90 text-white",
  },
  picante: {
    icon: <Zap className="h-3 w-3" />,
    label: "Picante",
    style: "bg-[var(--theme-primary)]/90 text-white",
  },
};

export function ProductCard({ item, currency, onClick, isOpenNow = true, index = 0 }: ProductCardProps) {
  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: currency || "PEN",
      minimumFractionDigits: 2,
    }).format(num);
  };

  const isDisabled = !item.isAvailable || !isOpenNow;
  const primaryTag = item.tags[0];
  const tagInfo = primaryTag ? tagConfig[primaryTag] : null;

  return (
    <button
      type="button"
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={cn(
        "group relative flex w-full flex-col text-left transition-all duration-300",
        isDisabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:-translate-y-1"
      )}
      style={{
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[var(--theme-border)]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <ProductPlaceholder name={item.name} />
        )}

        {/* Tag badge */}
        {tagInfo && (
          <div className="absolute left-3 top-3">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider shadow-sm",
                tagInfo.style
              )}
            >
              {tagInfo.icon}
              {tagInfo.label}
            </span>
          </div>
        )}

        {/* Sold out overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--theme-text)]/40 backdrop-blur-[2px]">
            <span className="rounded-lg bg-[var(--theme-surface)]/95 px-4 py-2 text-sm font-medium italic tracking-wide text-[var(--theme-text)]">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-2.5 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold leading-snug text-[var(--theme-text)] text-pretty">
            {item.name}
          </h3>
          <span className="shrink-0 text-[15px] font-bold text-[var(--theme-primary)]">
            {formatPrice(item.basePrice)}
          </span>
        </div>

        {item.description && (
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[var(--theme-text-secondary)]">
            {item.description}
          </p>
        )}

        {/* Secondary tags */}
        {item.tags.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags.slice(1).map((tag) => {
              const config = tagConfig[tag];
              if (!config) return null;
              return (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-[var(--theme-border)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--theme-text-muted)]"
                >
                  {config.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </button>
  );
}

function ProductPlaceholder({ name }: { name: string }) {
  // Generate a warm, appetizing placeholder based on first letter
  const firstLetter = name.charAt(0).toUpperCase();
  const hues = ["var(--theme-primary)", "var(--theme-primary-hover)", "var(--theme-accent)", "var(--theme-text-muted)", "var(--theme-primary)"];
  const hue = hues[firstLetter.charCodeAt(0) % hues.length];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden">
      {/* Subtle pattern background */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${hue} 1px, transparent 0)`,
          backgroundSize: "16px 16px",
        }}
      />
      {/* Central icon + letter */}
      <div className="relative flex flex-col items-center gap-2">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `color-mix(in srgb, ${hue} 15%, transparent)` }}
        >
          <UtensilsCrossed className="h-6 w-6" style={{ color: `color-mix(in srgb, ${hue} 60%, transparent)` }} />
        </div>
        <span
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: `color-mix(in srgb, ${hue} 50%, transparent)` }}
        >
          {firstLetter}
        </span>
      </div>
    </div>
  );
}
