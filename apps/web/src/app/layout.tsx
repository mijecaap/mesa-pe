import type { Metadata } from "next";
import { Alegreya, Alegreya_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";
import "./globals.css";

const alegreyaSans = Alegreya_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
});

const alegreya = Alegreya({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Mesa.pe — Tu carta digital en 5 minutos",
  description:
    "Crea tu carta digital, genera un código QR y recibe pedidos por WhatsApp. Sin comisiones, sin apps. Ideal para restaurantes, cafeterías y negocios de comida en Perú.",
  openGraph: {
    title: "Mesa.pe — Tu carta digital en 5 minutos",
    description:
      "Crea tu carta digital, genera códigos QR y recibe pedidos por WhatsApp en minutos.",
    type: "website",
    locale: "es_PE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${alegreyaSans.variable} ${alegreya.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          appearance={{
            theme: shadcn,
            variables: { colorPrimary: "hsl(17 55% 49%)" },
          }}
        >
          <QueryProvider>
            <PostHogProvider>{children}</PostHogProvider>
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
