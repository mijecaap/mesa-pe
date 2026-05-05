"use client";

import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import type { PublicBusiness } from "@/hooks/use-public-business";

interface HeroSectionProps {
  business: PublicBusiness;
  isOpenNow?: boolean;
}

export function HeroSection({ business, isOpenNow = true }: HeroSectionProps) {
  const hasBanner = !!business.bannerUrl;

  if (hasBanner) {
    return (
      <section className="relative">
        {/* Banner image */}
        <div className="relative h-[45vh] min-h-[300px] w-full overflow-hidden sm:h-[50vh]">
          <Image
            src={business.bannerUrl!}
            alt={business.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-text)]/80 via-[var(--theme-text)]/20 to-transparent" />
        </div>

        {/* Overlapping content */}
        <div className="relative -mt-20 px-4 sm:-mt-24">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-end gap-4">
              <Logo business={business} />
              <StatusBadge isOpenNow={isOpenNow} />
            </div>
            <BusinessMeta business={business} isOpenNow={isOpenNow} />
          </div>
        </div>
      </section>
    );
  }

  // Compact hero when no banner — no giant black block
  return (
    <section className="relative bg-[var(--theme-bg)] pt-10 pb-6 sm:pt-14 sm:pb-8">
      {/* Subtle decorative shapes */}
      <div className="absolute right-0 top-0 h-64 w-64 opacity-[0.03]" style={{
        background: "radial-gradient(circle at 70% 30%, var(--theme-primary) 0%, transparent 70%)"
      }} />
      <div className="absolute left-0 bottom-0 h-48 w-48 opacity-[0.02]" style={{
        background: "radial-gradient(circle at 30% 70%, var(--theme-primary) 0%, transparent 70%)"
      }} />

      <div className="relative mx-auto max-w-2xl px-4">
        <div className="flex items-start gap-5">
          <Logo business={business} large />
          <div className="flex-1 pt-2">
            <StatusBadge isOpenNow={isOpenNow} />
            <BusinessMeta business={business} isOpenNow={isOpenNow} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Logo({ business, large = false }: { business: PublicBusiness; large?: boolean }) {
  const sizeClass = large
    ? "h-20 w-20 sm:h-24 sm:w-24"
    : "h-24 w-24 sm:h-28 sm:w-28";

  if (business.logoUrl) {
    return (
      <div
        className={`relative ${sizeClass} shrink-0 overflow-hidden rounded-2xl border-4 border-[var(--theme-bg)] bg-white shadow-lg`}
      >
        <Image
          src={business.logoUrl}
          alt={business.name}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-2xl border-4 border-[var(--theme-bg)] bg-[var(--theme-primary)] text-2xl font-bold text-white shadow-lg`}
    >
      {business.name.charAt(0).toUpperCase()}
    </div>
  );
}

function StatusBadge({ isOpenNow }: { isOpenNow: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wider ${
        isOpenNow
          ? "bg-[var(--theme-accent)] text-white"
          : "bg-[var(--theme-primary)] text-white"
      }`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
            isOpenNow ? "bg-white" : "bg-white/50"
          }`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            isOpenNow ? "bg-white" : "bg-white/80"
          }`}
        />
      </span>
      {isOpenNow ? "Abierto ahora" : "Cerrado"}
    </span>
  );
}

function BusinessMeta({ business, isOpenNow }: { business: PublicBusiness; isOpenNow: boolean }) {
  return (
    <>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight tracking-tight text-[var(--theme-text)] sm:text-4xl text-balance">
        {business.name}
      </h1>

      {business.description && (
        <p className="mt-2 max-w-lg text-base leading-relaxed text-[var(--theme-text-secondary)] text-pretty">
          {business.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--theme-text-secondary)]">
        {business.address && (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[var(--theme-primary)]" />
            <span className="line-clamp-1">{business.address}</span>
          </div>
        )}
        {business.whatsappNumber && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[var(--theme-primary)]" />
            <span>Pedidos por WhatsApp</span>
          </div>
        )}
      </div>
    </>
  );
}
