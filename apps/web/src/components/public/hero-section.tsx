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
        <div className="relative h-44 w-full overflow-hidden sm:h-60">
          <Image
            src={business.bannerUrl}
            alt={`Banner de ${business.name}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A211E]/60 via-[#2A211E]/10 to-transparent" />
        </div>
      )}

      <div className={business.bannerUrl ? "relative -mt-12 px-4 sm:-mt-16" : "relative px-4 pt-6"}>
        <div className="mx-auto max-w-xl">
          <div className="flex items-end gap-4">
            {business.logoUrl ? (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-[3px] border-[#FDF8F3] bg-white shadow-[0_10px_15px_-3px_rgba(42,33,30,0.1),0_4px_6px_-4px_rgba(42,33,30,0.05)] sm:h-24 sm:w-24">
                <Image
                  src={business.logoUrl}
                  alt={business.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#FDF8F3] bg-[#C25E3A] text-xl font-bold text-white shadow-[0_10px_15px_-3px_rgba(42,33,30,0.1),0_4px_6px_-4px_rgba(42,33,30,0.05)] sm:h-24 sm:w-24">
                {business.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="mb-1 flex-1">
              <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold leading-tight text-[#2A211E] sm:text-2xl">
                {business.name}
              </h1>
              <div className="mt-1.5 flex items-center gap-2">
                <OpenStatusBadge isOpen={business.isOpenNow} />
              </div>
            </div>
          </div>

          {business.description && (
            <p className="mt-3 text-sm leading-relaxed text-[#7D6F65]">
              {business.description}
            </p>
          )}

          {isOpenNow && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#EDE6DE] bg-white py-3 text-sm font-semibold text-[#2A211E] shadow-sm transition-all hover:bg-[#FDF8F3] hover:shadow-[0_10px_15px_-3px_rgba(42,33,30,0.06),0_4px_6px_-4px_rgba(42,33,30,0.03)] active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
              Escribir por WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
