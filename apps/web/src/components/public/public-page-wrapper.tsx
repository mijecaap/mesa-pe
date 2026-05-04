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
      <div className="flex min-h-screen items-center justify-center bg-[#FFFCF8]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2B2D42]">Negocio no encontrado</h1>
          <p className="mt-2 text-[#8D817C]">La carta digital que buscas no existe.</p>
        </div>
      </div>
    );
  }

  return <PublicPageClient business={business} />;
}
