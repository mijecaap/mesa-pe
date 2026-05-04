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
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-110 active:scale-95"
      aria-label="Escribir por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
