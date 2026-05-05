"use client";

import { MessageCircle } from "lucide-react";

interface FloatingWhatsAppProps {
  phone: string;
  businessName: string;
}

export function FloatingWhatsApp({ phone, businessName }: FloatingWhatsAppProps) {
  const link = `https://wa.me/${phone.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(businessName)}!`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--theme-primary)] text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.12),0_4px_6px_-4px_rgba(0,0,0,0.06)] transition-transform hover:scale-110 active:scale-95"
      aria-label="Escribir por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
