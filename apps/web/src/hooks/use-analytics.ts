"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api";

export function useAnalyticsSummary(businessId?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["analytics", "summary", businessId],
    queryFn: () => fetchWithAuth(`/analytics/businesses/${businessId}/summary`),
    enabled: !!businessId,
  });
}

export function useTopProducts(businessId?: string, type: "view" | "cart" = "view") {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["analytics", "top-products", businessId, type],
    queryFn: () =>
      fetchWithAuth(`/analytics/businesses/${businessId}/top-products?type=${type}`),
    enabled: !!businessId,
  });
}

export function useHourlyVisits(businessId?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["analytics", "hourly", businessId],
    queryFn: () => fetchWithAuth(`/analytics/businesses/${businessId}/hourly`),
    enabled: !!businessId,
  });
}

export function useDailyVisits(businessId?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["analytics", "daily", businessId],
    queryFn: () => fetchWithAuth(`/analytics/businesses/${businessId}/daily`),
    enabled: !!businessId,
  });
}
