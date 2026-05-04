const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchPublic(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    const error = await res.json().catch(() => ({ message: "Error desconocido" }));
    throw new Error(error.message || `Error ${res.status}`);
  }

  return res.json();
}
