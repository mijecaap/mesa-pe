"use client";

interface OpenStatusBadgeProps {
  isOpen: boolean;
}

export function OpenStatusBadge({ isOpen }: OpenStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isOpen
          ? "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)]"
          : "bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]"
      }`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          isOpen ? "bg-[var(--theme-accent)]" : "bg-[var(--theme-primary)]"
        }`}
      />
      {isOpen ? "Abierto ahora" : "Cerrado"}
    </span>
  );
}
