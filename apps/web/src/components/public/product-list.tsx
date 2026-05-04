"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { CategoryNav } from "./category-nav";
import { ProductCard } from "./product-card";
import type { PublicBusiness } from "@/hooks/use-public-business";

interface ProductListProps {
  business: PublicBusiness;
  onProductClick?: (item: PublicBusiness["categories"][0]["items"][0]) => void;
  isOpenNow?: boolean;
}

export function ProductList({ business, onProductClick, isOpenNow = true }: ProductListProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    let cats = business.categories;

    if (activeCategory) {
      cats = cats.filter((c) => c.id === activeCategory);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      cats = cats
        .map((cat) => ({
          ...cat,
          items: cat.items.filter(
            (item) =>
              item.name.toLowerCase().includes(term) ||
              (item.description?.toLowerCase().includes(term) ?? false)
          ),
        }))
        .filter((cat) => cat.items.length > 0);
    }

    return cats;
  }, [business.categories, activeCategory, search]);

  return (
    <div className="relative">
      {/* Search bar */}
      <div className="sticky top-0 z-20 border-b border-[#EDE6DE] bg-[#FDF8F3]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7D6F65]" />
            <input
              type="text"
              placeholder="Buscar en el menú..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#EDE6DE] bg-white py-2.5 pl-10 pr-10 text-sm text-[#2A211E] placeholder:text-[#7D6F65]/60 focus:border-[#C25E3A]/50 focus:outline-none focus:ring-2 focus:ring-[#C25E3A]/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[#7D6F65] transition-colors hover:bg-[#EDE6DE] hover:text-[#2A211E]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <CategoryNav
        categories={business.categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Categories */}
      <div className="space-y-0">
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <Search className="h-10 w-10 text-[#EDE6DE] mb-3" />
            <p className="text-base font-medium text-[#2A211E]">No encontramos productos</p>
            <p className="mt-1 text-sm text-[#7D6F65]">Prueba con otra búsqueda</p>
          </div>
        ) : (
          filteredCategories.map((category, catIdx) => {
            const isEven = catIdx % 2 === 0;
            return (
              <section
                key={category.id}
                id={`cat-${category.id}`}
                className={`py-12 sm:py-16 ${
                  isEven ? "bg-[#FDF8F3]" : "bg-white"
                }`}
              >
                <div className="mx-auto max-w-2xl px-4">
                  {/* Category header */}
                  <div className="mb-8 sm:mb-10">
                    <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold leading-tight tracking-tight text-[#2A211E] sm:text-3xl text-balance">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-[#7D6F65] text-pretty">
                        {category.description}
                      </p>
                    )}
                    <div className="mt-5 h-px w-16 bg-[#C25E3A]" />
                  </div>

                  {/* Product grid */}
                  <div className="grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-3">
                    {category.items.map((item, itemIdx) => (
                      <div
                        key={item.id}
                        className="animate-fade-in-up opacity-0-start"
                        style={{
                          animationDelay: `${itemIdx * 60}ms`,
                          animationFillMode: "forwards",
                        }}
                      >
                        <ProductCard
                          item={item}
                          currency={business.currency}
                          onClick={() => onProductClick?.(item)}
                          isOpenNow={isOpenNow}
                          index={itemIdx}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
