"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Megaphone, ArrowRight, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import type { PublicBusiness } from "@/hooks/use-public-business";
import { cn } from "@/lib/utils";

interface PromotionBannerProps {
  promotions: PublicBusiness["promotions"];
}

export function PromotionBanner({ promotions }: PromotionBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const slideWidth = container.offsetWidth;
    container.scrollTo({
      left: slideWidth * index,
      behavior: "smooth",
    });
    setActiveIndex(index);
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const slideWidth = container.offsetWidth;
    const newIndex = Math.round(container.scrollLeft / slideWidth);
    setActiveIndex(newIndex);
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("es-PE", {
      day: "numeric",
      month: "short",
    });
  };

  if (!promotions || promotions.length === 0) return null;

  return (
    <section className="bg-[var(--theme-bg)] pt-6 pb-2">
      <div className="mx-auto max-w-2xl px-4">
        <div className="relative overflow-hidden rounded-2xl bg-[var(--theme-inverse-bg)]">
          {/* Carousel container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="w-full shrink-0 snap-start"
              >
                <div className="relative z-10 flex flex-col sm:flex-row">
                  {/* Text content */}
                  <div className="flex-1 p-5 sm:p-6">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--theme-primary)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      <Megaphone className="h-3 w-3" />
                      Promoción
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-[var(--theme-inverse-text)] sm:text-xl">
                      {promo.title}
                    </h3>
                    {promo.description && (
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--theme-inverse-text-secondary)]">
                        {promo.description}
                      </p>
                    )}

                    {(promo.startDate || promo.endDate) && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-[var(--theme-inverse-text-muted)]">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {promo.startDate && promo.endDate
                            ? `Válido del ${formatDate(promo.startDate)} al ${formatDate(promo.endDate)}`
                            : promo.endDate
                              ? `Válido hasta el ${formatDate(promo.endDate)}`
                              : `Desde el ${formatDate(promo.startDate)}`}
                        </span>
                      </div>
                    )}

                    {(promo.ctaUrl || promo.buttonText) && (
                      <>
                        {promo.ctaUrl ? (
                          <a
                            href={promo.ctaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--theme-primary)] transition-colors hover:text-[var(--theme-inverse-text)]"
                          >
                            {promo.buttonText || "Ver detalles"}{" "}
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--theme-primary)]">
                            {promo.buttonText}{" "}
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        )}
                      </>
                    )}
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
              </div>
            ))}
          </div>

          {/* Navigation arrows (only if multiple) */}
          {promotions.length > 1 && (
            <>
              <button
                onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
                className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                aria-label="Promoción anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  scrollTo(Math.min(promotions.length - 1, activeIndex + 1))
                }
                className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                aria-label="Siguiente promoción"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                {promotions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === activeIndex
                        ? "w-4 bg-[var(--theme-primary)]"
                        : "w-1.5 bg-white/40 hover:bg-white/60",
                    )}
                    aria-label={`Ir a promoción ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Decorative elements */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--theme-primary)]/10" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[var(--theme-primary)]/5" />
        </div>
      </div>
    </section>
  );
}
