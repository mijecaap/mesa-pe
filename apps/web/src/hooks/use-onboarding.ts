import { useState, useEffect, useCallback } from "react";

export interface OnboardingState {
  currentStep: number;
  businessId: string | null;
  completedSteps: number[];
}

const STORAGE_KEY = "mesa-onboarding";

function getInitialState(): OnboardingState {
  if (typeof window === "undefined") {
    return { currentStep: 1, businessId: null, completedSteps: [] };
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return { currentStep: 1, businessId: null, completedSteps: [] };
}

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(getInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, Math.min(6, step)),
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      const next = Math.min(6, prev.currentStep + 1);
      return {
        ...prev,
        currentStep: next,
        completedSteps: Array.from(new Set([...prev.completedSteps, prev.currentStep])),
      };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1),
    }));
  }, []);

  const setBusinessId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, businessId: id }));
  }, []);

  const clearOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ currentStep: 1, businessId: null, completedSteps: [] });
  }, []);

  return {
    ...state,
    goToStep,
    nextStep,
    prevStep,
    setBusinessId,
    clearOnboarding,
  };
}
