import { Metadata } from "next";
import { notFound } from "next/navigation";
import { QrPdfTemplate } from "./qr-pdf-template";

export const metadata: Metadata = {
  title: "QR PDF",
  robots: "noindex, nofollow",
};

interface QrPdfPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function QrPdfPage({ params, searchParams }: QrPdfPageProps) {
  const { slug } = await params;
  const { token } = await searchParams;

  if (token !== process.env.PDF_RENDER_TOKEN) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">No autorizado</p>
      </div>
    );
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  let business: {
    name: string;
    logoUrl?: string | null;
    theme?: { primaryColor?: string } | null;
  } | null = null;

  try {
    const res = await fetch(`${apiUrl}/businesses/public/${slug}`, {
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      notFound();
    }

    business = await res.json();
  } catch {
    notFound();
  }

  if (!business) {
    notFound();
  }

  return (
    <QrPdfTemplate
      slug={slug}
      businessName={business.name}
      logoUrl={business.logoUrl}
      themeColor={business.theme?.primaryColor ?? "#C25E3A"}
    />
  );
}
