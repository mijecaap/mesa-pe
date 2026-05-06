"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api";

export function useAdminMe() {
  const { fetchWithAuth, isReady } = useApiClient();
  return useQuery({
    queryKey: ["admin-me"],
    queryFn: () => fetchWithAuth("/admin/me"),
    enabled: isReady,
    retry: false,
  });
}

export function useAdminBusinesses(
  query?: string,
  plan?: string,
  page = 1,
  limit = 20,
  enabled = true,
) {
  const { fetchWithAuth, isReady } = useApiClient();

  return useQuery({
    queryKey: ["admin-businesses", query, plan, page, limit],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (plan) params.set("plan", plan);
      params.set("page", String(page));
      params.set("limit", String(limit));
      return fetchWithAuth(`/admin/businesses?${params.toString()}`);
    },
    enabled: enabled && isReady,
  });
}

export function useAdminBusiness(id?: string) {
  const { fetchWithAuth, isReady } = useApiClient();
  return useQuery({
    queryKey: ["admin-business", id],
    queryFn: () => fetchWithAuth(`/admin/businesses/${id}`),
    enabled: !!id && isReady,
  });
}

export function useAdminUpgradeRequests(enabled = true) {
  const { fetchWithAuth, isReady } = useApiClient();
  return useQuery({
    queryKey: ["admin-upgrade-requests"],
    queryFn: () => fetchWithAuth("/admin/upgrade-requests"),
    enabled: enabled && isReady,
  });
}

export function useApproveUpgradeRequest() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      notes,
    }: {
      id: string;
      notes?: string;
    }) =>
      fetchWithAuth(`/admin/upgrade-requests/${id}/approve`, {
        method: "POST",
        body: JSON.stringify({ notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-upgrade-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-businesses"] });
    },
  });
}

export function useRejectUpgradeRequest() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      notes,
    }: {
      id: string;
      notes: string;
    }) =>
      fetchWithAuth(`/admin/upgrade-requests/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-upgrade-requests"] });
    },
  });
}

export function useAdminCreateSubscription() {
  const { fetchWithAuth } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      data,
    }: {
      businessId: string;
      data: { plan: string; endsAt: string; notes?: string };
    }) =>
      fetchWithAuth(`/admin/businesses/${businessId}/subscription`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-business", vars.businessId] });
      queryClient.invalidateQueries({ queryKey: ["admin-businesses"] });
    },
  });
}
