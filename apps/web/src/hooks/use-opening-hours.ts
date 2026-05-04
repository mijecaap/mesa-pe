"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api";
import type { UpdateOpeningHoursInput } from "@mesa/shared-types";

export function useOpeningHours(businessId?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["opening-hours", businessId],
    queryFn: () => fetchWithAuth(`/businesses/${businessId}/opening-hours`),
    enabled: !!businessId,
  });
}

export function useUpdateOpeningHours() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      data,
    }: {
      businessId: string;
      data: UpdateOpeningHoursInput;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/opening-hours`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["opening-hours", vars.businessId] });
    },
  });
}
