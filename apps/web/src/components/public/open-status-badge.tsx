"use client";

interface OpenStatusBadgeProps {
  isOpen: boolean;
}

export function OpenStatusBadge({ isOpen }: OpenStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isOpen
          ? "bg-[#2A9D8F]/10 text-[#2A9D8F]"
          : "bg-[#E76F51]/10 text-[#E76F51]"
      }`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          isOpen ? "bg-[#2A9D8F]" : "bg-[#E76F51]"
        }`}
      />
      {isOpen ? "Abierto ahora" : "Cerrado"}
    </span>
  );
}
