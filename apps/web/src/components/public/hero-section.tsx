"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { OpenStatusBadge } from "./open-status-badge";
import type { PublicBusiness } from "@/hooks/use-public-business";

interface HeroSectionProps {
  business: PublicBusiness;
  isOpenNow?: boolean;
}

export function HeroSection({ business, isOpenNow = true }: HeroSectionProps) {
  const whatsappLink = `https://wa.me/${business.whatsappNumber.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(business.name)}!`;

  return (
    <div className="relative">
      {business.bannerUrl && (
        <div className="relative h-40 w-full overflow-hidden sm:h-56">
          <Image
            src={business.bannerUrl}
            alt={`Banner de ${business.name}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className="relative -mt-10 px-4 sm:-mt-14">
        <div className="mx-auto max-w-xl">
          <div className="flex items-end gap-4">
            {business.logoUrl ? (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-[#FFFCF8] bg-white shadow-lg sm:h-24 sm:w-24">
                <Image
                  src={business.logoUrl}
                  alt={business.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-[#FFFCF8] bg-[#E85D04] text-xl font-bold text-white shadow-lg sm:h-24 sm:w-24">
                {business.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="mb-1 flex-1">
              <h1 className="text-xl font-bold leading-tight text-[#2B2D42] sm:text-2xl">
                {business.name}
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <OpenStatusBadge isOpen={business.isOpenNow} />
              </div>
            </div>
          </div>

          {business.description && (
            <p className="mt-3 text-sm leading-relaxed text-[#8D817C]">
              {business.description}
            </p>
          )}

          {isOpenNow && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-semibold text-white shadow-sm transition-transform active:scale-[0.98] hover:shadow-md"
            >
              <MessageCircle className="h-5 w-5" />
              Escribir por WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
