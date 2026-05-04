"use client";

interface OpenStatusBadgeProps {
  isOpen: boolean;
}

export function OpenStatusBadge({ isOpen }: OpenStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isOpen
          ? "bg-[#4A6B5D]/10 text-[#4A6B5D]"
          : "bg-[#C25E3A]/10 text-[#C25E3A]"
      }`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          isOpen ? "bg-[#4A6B5D]" : "bg-[#C25E3A]"
        }`}
      />
      {isOpen ? "Abierto ahora" : "Cerrado"}
    </span>
  );
}
