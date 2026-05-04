"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api";

export function useOrderLeads(businessId?: string, status?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["order-leads", businessId, status],
    queryFn: () =>
      fetchWithAuth(
        `/businesses/${businessId}/order-leads${status ? `?status=${status}` : ""}`
      ),
    enabled: !!businessId,
  });
}
