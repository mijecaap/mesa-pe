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
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8D817C]" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#EBE5E0] bg-white py-2.5 pl-10 pr-4 text-sm text-[#2B2D42] placeholder:text-[#8D817C] focus:border-[#E85D04] focus:outline-none focus:ring-1 focus:ring-[#E85D04]"
        />
      </div>

      <CategoryNav
        categories={business.categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <div className="mt-4 space-y-6">
        {filteredCategories.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#8D817C]">
            No se encontraron productos
          </div>
        ) : (
          filteredCategories.map((category) => (
            <section key={category.id} id={`cat-${category.id}`}>
              <h2 className="mb-3 text-lg font-bold text-[#2B2D42]">
                {category.name}
              </h2>
              {category.description && (
                <p className="mb-3 text-xs text-[#8D817C]">
                  {category.description}
                </p>
              )}
              <div className="space-y-3">
                {category.items.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    currency={business.currency}
                    onClick={() => onProductClick?.(item)}
                    isOpenNow={isOpenNow}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
