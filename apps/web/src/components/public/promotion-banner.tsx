"use client";

import Image from "next/image";
import { Megaphone, ArrowRight } from "lucide-react";
import type { PublicBusiness } from "@/hooks/use-public-business";

interface PromotionBannerProps {
  promotions: PublicBusiness["promotions"];
}

export function PromotionBanner({ promotions }: PromotionBannerProps) {
  if (!promotions || promotions.length === 0) return null;

  const promo = promotions[0];

  return (
    <section className="bg-[#FDF8F3] pt-6 pb-2">
      <div className="mx-auto max-w-2xl px-4">
        <div className="relative overflow-hidden rounded-2xl bg-[#2A211E]">
          <div className="relative z-10 flex flex-col sm:flex-row">
            {/* Text content */}
            <div className="flex-1 p-5 sm:p-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#C25E3A] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                <Megaphone className="h-3 w-3" />
                Promoción
              </div>
              <h3 className="mt-3 text-lg font-semibold text-white sm:text-xl">
                {promo.title}
              </h3>
              {promo.description && (
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                  {promo.description}
                </p>
              )}
              <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#C25E3A] transition-colors hover:text-white">
                Ver detalles <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Image */}
            {promo.imageUrl && (
              <div className="relative h-48 w-full sm:h-auto sm:w-48 sm:shrink-0">
                <Image
                  src={promo.imageUrl}
                  alt={promo.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              </div>
            )}
          </div>

          {/* Decorative element */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#C25E3A]/10" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#C25E3A]/5" />
        </div>
      </div>
    </section>
  );
}
