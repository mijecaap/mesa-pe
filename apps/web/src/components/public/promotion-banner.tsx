"use client";

import Image from "next/image";
import { Megaphone } from "lucide-react";
import type { PublicBusiness } from "@/hooks/use-public-business";

interface PromotionBannerProps {
  promotions: PublicBusiness["promotions"];
}

export function PromotionBanner({ promotions }: PromotionBannerProps) {
  if (!promotions || promotions.length === 0) return null;

  const promo = promotions[0];

  return (
    <div className="mx-auto max-w-xl px-4 pt-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#E85D04] to-[#F4A261] p-4 shadow-sm">
        <div className="relative z-10 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Megaphone className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">{promo.title}</h3>
            {promo.description && (
              <p className="mt-0.5 text-sm text-white/90">{promo.description}</p>
            )}
          </div>
        </div>
        {promo.imageUrl && (
          <div className="relative mt-3 h-32 w-full overflow-hidden rounded-xl">
            <Image
              src={promo.imageUrl}
              alt={promo.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 640px"
            />
          </div>
        )}
      </div>
    </div>
  );
}
