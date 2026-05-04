"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api";
import type {
  CreateDeliveryZoneInput,
  UpdateDeliveryZoneInput,
} from "@mesa/shared-types";

export function useDeliveryZones(businessId?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["delivery-zones", businessId],
    queryFn: () => fetchWithAuth(`/businesses/${businessId}/delivery-zones`),
    enabled: !!businessId,
  });
}

export function useCreateDeliveryZone() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      data,
    }: {
      businessId: string;
      data: CreateDeliveryZoneInput;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/delivery-zones`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["delivery-zones", vars.businessId] });
    },
  });
}

export function useUpdateDeliveryZone() {
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
      data: UpdateDeliveryZoneInput;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/delivery-zones/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["delivery-zones", vars.businessId] });
    },
  });
}

export function useDeleteDeliveryZone() {
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
      fetchWithAuth(`/businesses/${businessId}/delivery-zones/${id}`, { method: "DELETE" }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["delivery-zones", vars.businessId] });
    },
  });
}
