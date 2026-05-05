"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api";
import type {
  CreatePromotionInput,
  UpdatePromotionInput,
} from "@mesa/shared-types";

export function usePromotions(businessId?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["promotions", businessId],
    queryFn: () => fetchWithAuth(`/businesses/${businessId}/promotions`),
    enabled: !!businessId,
  });
}

export function useCreatePromotion() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      data,
    }: {
      businessId: string;
      data: CreatePromotionInput;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/promotions`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["promotions", vars.businessId] });
      queryClient.invalidateQueries({ queryKey: ["feature-flags", vars.businessId] });
    },
  });
}

export function useUpdatePromotion() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      id,
      data,
    }: {
      businessId: string;
      id: string;
      data: UpdatePromotionInput;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/promotions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["promotions", vars.businessId] });
    },
  });
}

export function useDeletePromotion() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      id,
    }: {
      businessId: string;
      id: string;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/promotions/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["promotions", vars.businessId] });
      queryClient.invalidateQueries({ queryKey: ["feature-flags", vars.businessId] });
    },
  });
}
