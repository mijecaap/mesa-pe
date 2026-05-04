import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PublicPageWrapper } from "@/components/public/public-page-wrapper";
import { PublicPageSkeleton } from "@/components/public/skeletons/public-page-skeleton";
import type { PublicBusiness } from "@/hooks/use-public-business";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mesa.pe";

async function getBusiness(slug: string): Promise<PublicBusiness | null> {
  try {
    const res = await fetch(`${API_URL}/businesses/public/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusiness(slug);

  if (!business) {
    return {
      title: "Negocio no encontrado | Mesa.pe",
    };
  }

  const title = `${business.name} | Carta digital en Mesa.pe`;
  const description =
    business.description ||
    `Descubre la carta digital de ${business.name}. Mira nuestros productos, precios y haz tu pedido por WhatsApp.`;
  const image = business.bannerUrl || business.logoUrl;
  const url = `${BASE_URL}/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Mesa.pe",
      locale: "es_PE",
      type: "website",
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: business.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PublicBusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusiness(slug);

  if (!business) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: business.name,
    description: business.description || undefined,
    url: `${BASE_URL}/${slug}`,
    image: business.logoUrl || business.bannerUrl || undefined,
    telephone: business.whatsappNumber || undefined,
    address: business.address
      ? {
          "@type": "PostalAddress",
          streetAddress: business.address,
          addressCountry: "PE",
        }
      : undefined,
    openingHoursSpecification: business.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][h.dayOfWeek],
      opens: h.isClosed ? undefined : h.openTime,
      closes: h.isClosed ? undefined : h.closeTime,
    })),
    paymentAccepted:
      business.paymentMethods.map((pm) => pm.name).join(", ") || undefined,
    servesCuisine: "Peruana",
    priceRange: "$$",
  };

  // Create a resolved promise for the wrapper
  const businessPromise = Promise.resolve(business);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<PublicPageSkeleton />}>
        <PublicPageWrapper businessPromise={businessPromise} />
      </Suspense>
    </>
  );
}
