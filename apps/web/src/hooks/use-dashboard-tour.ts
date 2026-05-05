"use client";

import { useState, useCallback, useSyncExternalStore } from "react";

const TOUR_STORAGE_KEY = "mesa-dashboard-tour";

interface TourState {
  hasSeenTour: boolean;
  lastStepIndex: number;
}

function getInitialState(): TourState {
  if (typeof window === "undefined") {
    return { hasSeenTour: false, lastStepIndex: 0 };
  }
  try {
    const raw = localStorage.getItem(TOUR_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as TourState;
    }
  } catch {
    // ignore parse errors
  }
  return { hasSeenTour: false, lastStepIndex: 0 };
}

function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return false;
}

function getClientSnapshot() {
  return true;
}

export function useDashboardTour() {
  const [state, setState] = useState<TourState>(getInitialState);
  const isReady = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const markAsSeen = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, hasSeenTour: true };
      localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const saveProgress = useCallback((stepIndex: number) => {
    setState((prev) => {
      const next = { ...prev, lastStepIndex: stepIndex };
      localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const restartTour = useCallback(() => {
    const next = { hasSeenTour: false, lastStepIndex: 0 };
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(next));
    setState(next);
  }, []);

  return {
    hasSeenTour: state.hasSeenTour,
    lastStepIndex: state.lastStepIndex,
    isReady,
    markAsSeen,
    saveProgress,
    restartTour,
  };
}
