"use client";

import { use } from "react";
import { PublicPageClient } from "./public-page-client";
import type { PublicBusiness } from "@/hooks/use-public-business";

export function PublicPageWrapper({
  businessPromise,
}: {
  businessPromise: Promise<PublicBusiness | null>;
}) {
  const business = use(businessPromise);

  if (!business) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDF8F3]">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#2A211E]">Negocio no encontrado</h1>
          <p className="mt-2 text-[#7D6F65]">La carta digital que buscas no existe.</p>
        </div>
      </div>
    );
  }

  return <PublicPageClient business={business} />;
}
