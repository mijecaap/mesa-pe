"use client";

import Image from "next/image";
import { Flame, Leaf, Star, Tag, Zap } from "lucide-react";
import type { PublicBusiness } from "@/hooks/use-public-business";

interface ProductCardProps {
  item: PublicBusiness["categories"][0]["items"][0];
  currency: string;
  onClick?: () => void;
  isOpenNow?: boolean;
}

const tagIcons: Record<string, React.ReactNode> = {
  nuevo: <Star className="h-3 w-3" />,
  popular: <Flame className="h-3 w-3" />,
  promo: <Tag className="h-3 w-3" />,
  vegetariano: <Leaf className="h-3 w-3" />,
  picante: <Zap className="h-3 w-3" />,
};

const tagStyles: Record<string, string> = {
  nuevo: "bg-[#E9C46A] text-[#2B2D42]",
  popular: "bg-[#E85D04] text-white",
  promo: "bg-[#F4A261] text-[#2B2D42]",
  vegetariano: "bg-[#2A9D8F] text-white",
  picante: "bg-[#E76F51] text-white",
};

export function ProductCard({ item, currency, onClick, isOpenNow = true }: ProductCardProps) {
  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: currency || "PEN",
      minimumFractionDigits: 2,
    }).format(num);
  };

  const isDisabled = !item.isAvailable || !isOpenNow;

  return (
    <button
      type="button"
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`group flex w-full gap-3 rounded-2xl border border-[#EBE5E0] bg-white p-3 text-left transition-all duration-200 hover:shadow-md ${
        isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:-translate-y-0.5"
      }`}
    >
      {item.imageUrl ? (
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="112px"
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-[#2B2D42]">
                Agotado
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-[#F5F0EB] sm:h-28 sm:w-28">
          <span className="text-2xl font-bold text-[#EBE5E0]">
            {item.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <h3 className="font-semibold text-[#2B2D42]">{item.name}</h3>
          {item.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-[#8D817C]">
              {item.description}
            </p>
          )}
          {item.tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                    tagStyles[tag] || "bg-[#F5F0EB] text-[#8D817C]"
                  }`}
                >
                  {tagIcons[tag]}
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <p className="mt-2 text-sm font-bold text-[#E85D04]">
          {formatPrice(item.basePrice)}
        </p>
      </div>
    </button>
  );
}
