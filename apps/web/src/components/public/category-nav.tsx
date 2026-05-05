"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  categories: { id: string; name: string }[];
  activeCategory: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryNav({ categories, activeCategory, onSelect }: CategoryNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const activeId = activeCategory ?? "all";
    const activeBtn = itemRefs.current.get(activeId);
    if (activeBtn && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - navRect.left + navRef.current.scrollLeft,
        width: btnRect.width,
      });
    }
  }, [activeCategory]);

  const handleClick = (id: string | null) => {
    onSelect(id);
    // Scroll to section
    if (id) {
      const el = document.getElementById(`cat-${id}`);
      if (el) {
        const navHeight = 64;
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-[var(--theme-border)] bg-[var(--theme-bg)]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-2xl px-4">
        <div
          ref={navRef}
          className="relative flex gap-1 overflow-x-auto py-3 scrollbar-hide"
        >
          {/* Sliding indicator */}
          <div
            className="absolute bottom-2 h-0.5 rounded-full bg-[var(--theme-primary)] transition-all duration-300 ease-out"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
          />

          <button
            ref={(el) => {
              if (el) itemRefs.current.set("all", el);
            }}
            onClick={() => handleClick(null)}
            className={cn(
              "relative shrink-0 px-4 py-2 text-sm font-medium transition-colors duration-200",
              activeCategory === null
                ? "text-[var(--theme-text)]"
                : "text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
            )}
          >
            Todo
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              ref={(el) => {
                if (el) itemRefs.current.set(cat.id, el);
              }}
              onClick={() => handleClick(cat.id)}
              className={cn(
                "relative shrink-0 px-4 py-2 text-sm font-medium transition-colors duration-200",
                activeCategory === cat.id
                  ? "text-[var(--theme-text)]"
                  : "text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
