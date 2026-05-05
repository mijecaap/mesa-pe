import { useState, useEffect, useCallback } from "react";

export interface OnboardingState {
  currentStep: number;
  businessId: string | null;
  completedSteps: number[];
}

const STORAGE_KEY = "mesa-onboarding";
const DEFAULT_STATE: OnboardingState = {
  currentStep: 1,
  businessId: null,
  completedSteps: [],
};

function loadState(): OnboardingState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(loadState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
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
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    setState({ currentStep: 1, businessId: null, completedSteps: [] });
  }, []);

  return {
    ...state,
    isHydrated: typeof window !== "undefined",
    goToStep,
    nextStep,
    prevStep,
    setBusinessId,
    clearOnboarding,
  };
}
