"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api";
import type { CreateSubscriptionInput } from "@mesa/shared-types";

export function useSubscription(businessId?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["subscription", businessId],
    queryFn: () => fetchWithAuth(`/businesses/${businessId}/subscription`),
    enabled: !!businessId,
  });
}

export function useSubscriptionHistory(businessId?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["subscription-history", businessId],
    queryFn: () =>
      fetchWithAuth(`/businesses/${businessId}/subscription/history`),
    enabled: !!businessId,
  });
}

export function useDaysRemaining(businessId?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["subscription-days", businessId],
    queryFn: () =>
      fetchWithAuth(`/businesses/${businessId}/subscription/days-remaining`),
    enabled: !!businessId,
  });
}

export function useCreateSubscription() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      data,
    }: {
      businessId: string;
      data: CreateSubscriptionInput;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/subscription`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["subscription", vars.businessId] });
      queryClient.invalidateQueries({ queryKey: ["subscription-history", vars.businessId] });
      queryClient.invalidateQueries({ queryKey: ["subscription-days", vars.businessId] });
      queryClient.invalidateQueries({ queryKey: ["feature-flags", vars.businessId] });
      queryClient.invalidateQueries({ queryKey: ["business", vars.businessId] });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}
