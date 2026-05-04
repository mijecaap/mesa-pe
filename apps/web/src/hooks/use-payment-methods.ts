"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api";
import type {
  CreatePaymentMethodInput,
  UpdatePaymentMethodInput,
} from "@mesa/shared-types";

export function usePaymentMethods(businessId?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["payment-methods", businessId],
    queryFn: () => fetchWithAuth(`/businesses/${businessId}/payment-methods`),
    enabled: !!businessId,
  });
}

export function useCreatePaymentMethod() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      data,
    }: {
      businessId: string;
      data: CreatePaymentMethodInput;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/payment-methods`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods", vars.businessId] });
    },
  });
}

export function useUpdatePaymentMethod() {
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
      data: UpdatePaymentMethodInput;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/payment-methods/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods", vars.businessId] });
    },
  });
}

export function useDeletePaymentMethod() {
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
      fetchWithAuth(`/businesses/${businessId}/payment-methods/${id}`, { method: "DELETE" }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods", vars.businessId] });
    },
  });
}
