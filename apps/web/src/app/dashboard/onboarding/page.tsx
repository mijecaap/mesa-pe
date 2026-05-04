"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useBusinesses } from "@/hooks/use-business";
import { useOnboarding } from "@/hooks/use-onboarding";
import { BusinessInfoStep } from "@/components/onboarding/steps/business-info-step";
import { HoursStep } from "@/components/onboarding/steps/hours-step";
import { CategoryStep } from "@/components/onboarding/steps/category-step";
import { ProductStep } from "@/components/onboarding/steps/product-step";
import { WhatsappStep } from "@/components/onboarding/steps/whatsapp-step";
import { FinalStep } from "@/components/onboarding/steps/final-step";

export default function OnboardingPage() {
  const router = useRouter();
  const { organization } = useOrganization();
  const { data: businesses, isLoading } = useBusinesses(organization?.id);
  const onboarding = useOnboarding();

  const businessData = useMemo(() => {
    if (!onboarding.businessId || !businesses) return null;
    return businesses.find((b: { id: string }) => b.id === onboarding.businessId) || null;
  }, [onboarding.businessId, businesses]);

  // Si ya tiene negocios y no está en medio del onboarding, redirigir al dashboard
  useEffect(() => {
    if (!isLoading && businesses && businesses.length > 0 && !onboarding.businessId) {
      if (onboarding.currentStep === 1 && onboarding.completedSteps.length === 0) {
        router.push("/dashboard");
      }
    }
  }, [isLoading, businesses, onboarding, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleBusinessCreated = (id: string) => {
    onboarding.setBusinessId(id);
    onboarding.nextStep();
  };

  const handleFinish = () => {
    onboarding.clearOnboarding();
    router.push("/dashboard");
  };

  const currentStep = onboarding.currentStep;

  return (
    <div className="py-8">
      {currentStep === 1 && (
        <BusinessInfoStep onNext={handleBusinessCreated} />
      )}
      {currentStep === 2 && businessData && (
        <HoursStep
          businessId={businessData.id}
          onNext={onboarding.nextStep}
          onBack={onboarding.prevStep}
        />
      )}
      {currentStep === 3 && businessData && (
        <CategoryStep
          businessId={businessData.id}
          onNext={onboarding.nextStep}
          onBack={onboarding.prevStep}
        />
      )}
      {currentStep === 4 && businessData && (
        <ProductStep
          businessId={businessData.id}
          onNext={onboarding.nextStep}
          onBack={onboarding.prevStep}
        />
      )}
      {currentStep === 5 && businessData && (
        <WhatsappStep
          businessId={businessData.id}
          currentWhatsapp={businessData.whatsappNumber}
          onNext={onboarding.nextStep}
          onBack={onboarding.prevStep}
        />
      )}
      {currentStep === 6 && businessData && (
        <FinalStep
          slug={businessData.slug}
          logoUrl={businessData.logoUrl}
          businessName={businessData.name}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
}
