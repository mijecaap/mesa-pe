"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api";
import type {
  CreateMenuCategoryInput,
  UpdateMenuCategoryInput,
  ReorderMenuCategoriesInput,
} from "@mesa/shared-types";

export function useCategories(businessId?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["categories", businessId],
    queryFn: () => fetchWithAuth(`/businesses/${businessId}/categories`),
    enabled: !!businessId,
  });
}

export function useCreateCategory() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      data,
    }: {
      businessId: string;
      data: CreateMenuCategoryInput;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/categories`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["categories", vars.businessId] });
    },
  });
}

export function useUpdateCategory() {
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
      data: UpdateMenuCategoryInput;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["categories", vars.businessId] });
    },
  });
}

export function useDeleteCategory() {
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
      fetchWithAuth(`/businesses/${businessId}/categories/${id}`, { method: "DELETE" }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["categories", vars.businessId] });
    },
  });
}

export function useReorderCategories() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      data,
    }: {
      businessId: string;
      data: ReorderMenuCategoriesInput;
    }) =>
      fetchWithAuth(`/businesses/${businessId}/categories/reorder`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["categories", vars.businessId] });
    },
  });
}
