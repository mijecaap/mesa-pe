"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
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
    <div className="mx-auto max-w-xl px-4 pb-24 pt-4">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7D6F65]" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#EDE6DE] bg-white py-2.5 pl-10 pr-4 text-sm text-[#2A211E] placeholder:text-[#7D6F65] focus:border-[#C25E3A] focus:outline-none focus:ring-1 focus:ring-[#C25E3A]/30"
        />
      </div>

      <CategoryNav
        categories={business.categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <div className="mt-4 space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#7D6F65]">
            No se encontraron productos
          </div>
        ) : (
          filteredCategories.map((category, catIdx) => (
            <section
              key={category.id}
              id={`cat-${category.id}`}
              className="animate-fade-in-up opacity-0-start"
              style={{ animationDelay: `${catIdx * 100}ms` }}
            >
              <div className="mb-3 flex items-center gap-3">
                <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#2A211E]">
                  {category.name}
                </h2>
                <div className="h-px flex-1 bg-[#EDE6DE]" />
              </div>
              {category.description && (
                <p className="mb-3 text-xs text-[#7D6F65]">
                  {category.description}
                </p>
              )}
              <div className="space-y-3">
                {category.items.map((item, itemIdx) => (
                  <div
                    key={item.id}
                    className="animate-fade-in-up opacity-0-start"
                    style={{ animationDelay: `${catIdx * 100 + itemIdx * 50}ms` }}
                  >
                    <ProductCard
                      item={item}
                      currency={business.currency}
                      onClick={() => onProductClick?.(item)}
                      isOpenNow={isOpenNow}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
