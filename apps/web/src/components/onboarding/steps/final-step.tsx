"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OnboardingShell } from "../onboarding-shell";
import { QrGenerator } from "@/components/qr/qr-generator";
import Link from "next/link";

interface FinalStepProps {
  slug: string;
  logoUrl?: string | null;
  businessName: string;
  onFinish: () => void;
}

export function FinalStep({ slug, logoUrl, businessName, onFinish }: FinalStepProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/${slug}` : `https://mesa.pe/${slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <OnboardingShell
      step={6}
      title="¡Listo para lanzar!"
      description="Tu carta digital está lista. Comparte el QR o el link con tus clientes."
      onNext={onFinish}
      nextLabel="Ir a mi dashboard"
      hideBack
    >
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <QrGenerator
          slug={slug}
          logoUrl={logoUrl}
          businessName={businessName}
        />

        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2">Link de tu carta</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 truncate rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                {publicUrl}
              </div>
              <Button variant="outline" size="icon" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Link href={`/${slug}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </OnboardingShell>
  );
}
