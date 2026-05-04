import { CreateOrderLeadInput } from "@mesa/shared-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function createOrderLead(
  slug: string,
  data: CreateOrderLeadInput
) {
  const res = await fetch(
    `${API_URL}/businesses/public/${slug}/order-leads`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al registrar el pedido");
  }

  return res.json();
}
