"use client";

import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface OnboardingShellProps {
  step: number;
  totalSteps?: number;
  title: string;
  description?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isNextLoading?: boolean;
  hideBack?: boolean;
}

export function OnboardingShell({
  step,
  totalSteps = 6,
  title,
  description,
  children,
  onBack,
  onNext,
  nextLabel = "Continuar",
  nextDisabled = false,
  isNextLoading = false,
  hideBack = false,
}: OnboardingShellProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Paso {step} de {totalSteps}
          </span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="space-y-2 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        {children}
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        {!hideBack && onBack ? (
          <Button variant="ghost" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Atrás
          </Button>
        ) : (
          <div />
        )}

        {onNext && (
          <Button
            onClick={onNext}
            disabled={nextDisabled || isNextLoading}
            className="bg-[#E85D04] text-white hover:bg-[#D15104]"
          >
            {isNextLoading ? (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <ChevronRight className="mr-2 h-4 w-4" />
            )}
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
