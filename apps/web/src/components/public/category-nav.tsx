"use client";

import { cn } from "@/lib/utils";

interface CategoryNavProps {
  categories: { id: string; name: string }[];
  activeCategory: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryNav({ categories, activeCategory, onSelect }: CategoryNavProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-[#EDE6DE] bg-[#FDF8F3]/95 py-3 backdrop-blur-sm">
      <div className="mx-auto max-w-xl px-4">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => onSelect(null)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeCategory === null
                ? "bg-[#2A211E] text-white"
                : "bg-[#EDE6DE] text-[#7D6F65] hover:bg-[#E5DDD4]"
            )}
          >
            Todo
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeCategory === cat.id
                  ? "bg-[#2A211E] text-white"
                  : "bg-[#EDE6DE] text-[#7D6F65] hover:bg-[#E5DDD4]"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
