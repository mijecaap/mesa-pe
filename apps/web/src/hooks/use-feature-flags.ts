"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api";

export function useFeatureFlags(businessId?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["feature-flags", businessId],
    queryFn: () => fetchWithAuth(`/businesses/${businessId}/feature-flags`),
    enabled: !!businessId,
  });
}
