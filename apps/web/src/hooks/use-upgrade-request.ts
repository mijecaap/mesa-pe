"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api";
import type { CreateUpgradeRequestInput } from "@mesa/shared-types";

export function useUpgradeRequests(businessId?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["upgrade-requests", businessId],
    queryFn: () =>
      fetchWithAuth(`/businesses/${businessId}/upgrade-requests`),
    enabled: !!businessId,
  });
}

export function useCreateUpgradeRequest() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      data,
    }: {
      businessId: string;
      data: CreateUpgradeRequestInput;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/upgrade-requests`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["upgrade-requests", vars.businessId] });
    },
  });
}
