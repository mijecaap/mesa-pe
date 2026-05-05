"use client";

import { use } from "react";
import { PublicPageClient } from "./public-page-client";
import { getThemeVariables } from "@/lib/theme";
import type { PublicBusiness } from "@/hooks/use-public-business";

export function PublicPageWrapper({
  businessPromise,
}: {
  businessPromise: Promise<PublicBusiness | null>;
}) {
  const business = use(businessPromise);

  const vars = getThemeVariables(business?.theme);

  if (!business) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={vars as unknown as React.CSSProperties}
      >
        <div className="text-center animate-fade-in-up">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--theme-text)]">
            Negocio no encontrado
          </h1>
          <p className="mt-2 text-[var(--theme-text-secondary)]">
            La carta digital que buscas no existe.
          </p>
        </div>
      </div>
    );
  }

  return <PublicPageClient business={business} />;
}
