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

export function useOnboarding() {
  // Inicializar SIEMPRE con el valor por defecto (consistente entre SSR y cliente)
  // para evitar hydration mismatch. El valor real de localStorage se carga en useEffect.
  const [state, setState] = useState<OnboardingState>(DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

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
    isHydrated,
    goToStep,
    nextStep,
    prevStep,
    setBusinessId,
    clearOnboarding,
  };
}
