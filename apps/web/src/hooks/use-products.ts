"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api";
import type {
  CreateMenuItemInput,
  UpdateMenuItemInput,
  ReorderMenuItemsInput,
} from "@mesa/shared-types";

export function useProducts(businessId?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["products", businessId],
    queryFn: () => fetchWithAuth(`/businesses/${businessId}/items`),
    enabled: !!businessId,
  });
}

export function useProduct(id?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchWithAuth(`/businesses/${id}/items/${id}`),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      data,
    }: {
      businessId: string;
      data: CreateMenuItemInput;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/items`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["products", vars.businessId] });
    },
  });
}

export function useUpdateProduct() {
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
      data: UpdateMenuItemInput;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/items/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["product", vars.id] });
      queryClient.invalidateQueries({ queryKey: ["products", vars.businessId] });
    },
  });
}

export function useDeleteProduct() {
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
      fetchWithAuth(`/businesses/${businessId}/items/${id}`, { method: "DELETE" }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["products", vars.businessId] });
    },
  });
}

export function useDuplicateProduct() {
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
      fetchWithAuth(`/businesses/${businessId}/items/${id}/duplicate`, { method: "POST" }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["products", vars.businessId] });
    },
  });
}

export function useReorderProducts() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      data,
    }: {
      businessId: string;
      data: ReorderMenuItemsInput;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/items/reorder`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["products", vars.businessId] });
    },
  });
}
