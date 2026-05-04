"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import type { PublicBusiness } from "@/hooks/use-public-business";

interface PhotoGalleryProps {
  business: PublicBusiness;
}

export function PhotoGallery({ business }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    business.bannerUrl,
    business.logoUrl,
    ...business.promotions.map((p) => p.imageUrl),
    ...business.categories.flatMap((c) => c.items.map((i) => i.imageUrl)),
  ].filter((url): url is string => !!url);

  const uniqueImages = Array.from(new Set(images));

  if (uniqueImages.length === 0) return null;

  return (
    <section className="border-t border-[#EDE6DE] bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-6">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#C25E3A]">
            Galería
          </span>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[#2A211E] sm:text-3xl">
            Un vistazo a {business.name}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
          {uniqueImages.slice(0, 8).map((url, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(url)}
              className="relative aspect-square overflow-hidden rounded-xl bg-[#EDE6DE] transition-transform duration-300 hover:scale-[1.02]"
            >
              <Image
                src={url}
                alt={`Foto ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
                sizes="(max-width: 640px) 33vw, 160px"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative max-h-[80vh] w-full max-w-2xl">
            <Image
              src={selectedImage}
              alt="Vista ampliada"
              width={800}
              height={600}
              className="h-auto w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
