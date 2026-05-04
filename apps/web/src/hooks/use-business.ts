"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api";
import type { CreateBusinessInput, UpdateBusinessInput } from "@mesa/shared-types";

export function useBusinesses(orgId?: string | null) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["businesses", orgId ?? "personal"],
    queryFn: () =>
      orgId
        ? fetchWithAuth(`/businesses/org/${orgId}`)
        : fetchWithAuth("/businesses/me"),
  });
}

export function useBusiness(id?: string) {
  const { fetchWithAuth } = useApiClient();
  return useQuery({
    queryKey: ["business", id],
    queryFn: () => fetchWithAuth(`/businesses/${id}`),
    enabled: !!id,
  });
}

export function useCreateBusiness() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBusinessInput) =>
      fetchWithAuth("/businesses", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}

export function useUpdateBusiness() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBusinessInput }) =>
      fetchWithAuth(`/businesses/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["business", vars.id] });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}

export function useDeleteBusiness() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchWithAuth(`/businesses/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}
