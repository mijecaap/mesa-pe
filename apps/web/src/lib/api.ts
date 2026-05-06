import { useAuth } from "@clerk/nextjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function useApiClient() {
  const { getToken, isLoaded } = useAuth();

  async function fetchWithAuth(
    endpoint: string,
    options: RequestInit = {},
  ) {
    const token = await getToken();
    const url = `${API_URL}${endpoint}`;

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Error desconocido" }));
      throw new Error(error.message || `Error ${res.status}`);
    }

    return res.json();
  }

  return { fetchWithAuth, isReady: isLoaded };
}
