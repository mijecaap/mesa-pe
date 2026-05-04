"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useBusinesses } from "@/hooks/use-business";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useUpdateBusiness } from "@/hooks/use-business";
import { BusinessInfoStep } from "@/components/onboarding/steps/business-info-step";
import { HoursStep } from "@/components/onboarding/steps/hours-step";
import { CategoryStep } from "@/components/onboarding/steps/category-step";
import { ProductStep } from "@/components/onboarding/steps/product-step";
import { WhatsappStep } from "@/components/onboarding/steps/whatsapp-step";
import { FinalStep } from "@/components/onboarding/steps/final-step";

export default function OnboardingPage() {
  const router = useRouter();
  const { organization } = useOrganization();
  const { data: businesses, isLoading, isFetching } = useBusinesses(organization?.id);
  const onboarding = useOnboarding();
  const updateBusiness = useUpdateBusiness();

  const businessData = useMemo(() => {
    if (!onboarding.businessId || !businesses) return null;
    return businesses.find((b: { id: string }) => b.id === onboarding.businessId) || null;
  }, [onboarding.businessId, businesses]);

  // Si estamos en un paso avanzado pero no hay businessData (localStorage residual,
  // negocio borrado, etc.), resetear al paso 1 para evitar pantalla en blanco.
  // Importante: usar isFetching en lugar de isLoading para evitar race condition
  // cuando la mutación invalida el query y se está refetcheando.
  useEffect(() => {
    if (!onboarding.isHydrated || isLoading || isFetching) return;
    if (onboarding.currentStep > 1 && !businessData) {
      onboarding.goToStep(1);
      onboarding.setBusinessId("");
    }
  }, [onboarding.isHydrated, isLoading, isFetching, onboarding.currentStep, businessData, onboarding.goToStep, onboarding.setBusinessId]);

  // Si ya tiene negocios y no está en medio del onboarding, redirigir al dashboard
  useEffect(() => {
    if (!onboarding.isHydrated || isLoading) return;
    if (businesses && businesses.length > 0 && !onboarding.businessId) {
      if (onboarding.currentStep === 1 && onboarding.completedSteps.length === 0) {
        router.push("/dashboard");
      }
    }
  }, [isLoading, businesses, onboarding.isHydrated, onboarding.businessId, onboarding.currentStep, onboarding.completedSteps, router]);

  // Skeleton idéntico en SSR e hidratación inicial para evitar mismatch
  if (!onboarding.isHydrated || isLoading) {
    return (
      <div className="py-8">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-4 w-10 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-2 w-full bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-48 w-full bg-muted rounded animate-pulse" />
          <div className="flex justify-between pt-6 border-t">
            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const handleBusinessCreated = (id: string) => {
    onboarding.setBusinessId(id);
    onboarding.nextStep();
  };

  const handleFinish = async () => {
    if (onboarding.businessId) {
      try {
        await updateBusiness.mutateAsync({
          id: onboarding.businessId,
          data: { isPublished: true },
        });
      } catch {
        // Si falla la publicación, seguimos adelante igual
      }
    }
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

      {/* Fallback: cualquier paso no manejado o sin businessData muestra paso 1 */}
      {(currentStep < 1 || currentStep > 6 || (currentStep > 1 && !businessData)) && (
        <BusinessInfoStep onNext={handleBusinessCreated} />
      )}
    </div>
  );
}
