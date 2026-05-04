import posthog from "posthog-js";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.capture(eventName, properties);
  }

  // Tracking dual: también enviar al backend
  if (typeof window !== "undefined") {
    const businessId = properties?.business_id as string | undefined;
    const entityId = properties?.product_id as string | undefined;
    const entityType = entityId ? "product" : undefined;

    const payload = {
      businessId: businessId || "unknown",
      eventName,
      entityType,
      entityId,
      metadata: properties ?? {},
      sessionId: getSessionId(),
    };

    // Fire-and-forget: no bloquear ni esperar respuesta
    fetch(`${API_URL}/analytics/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Silenciar errores de red para no afectar UX
    });
  }
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem("mesa-session-id");
  if (!sessionId) {
    sessionId = `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    sessionStorage.setItem("mesa-session-id", sessionId);
  }
  return sessionId;
}
