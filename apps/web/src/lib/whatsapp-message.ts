import type { CartItem } from "@mesa/shared-types";
import type { PublicBusiness } from "@/hooks/use-public-business";

interface CheckoutData {
  customerName: string;
  customerPhone?: string | null;
  fulfillmentType: string;
  tableNumber?: string | null;
  address?: string | null;
  deliveryZoneName?: string | null;
  preferredPaymentMethod?: string | null;
  note?: string | null;
}

export function generateWhatsAppMessage(
  business: PublicBusiness,
  cartItems: CartItem[],
  checkout: CheckoutData
): string {
  const lines: string[] = [];

  lines.push(`🍽️ *Pedido Mesa.pe — ${business.name}*`);
  lines.push("");

  lines.push(`👤 *Cliente:* ${checkout.customerName}`);
  if (checkout.customerPhone) {
    lines.push(`📞 *Teléfono:* ${checkout.customerPhone}`);
  }

  if (checkout.fulfillmentType === "DINE_IN" && checkout.tableNumber) {
    lines.push(`🪑 *Mesa:* #${checkout.tableNumber}`);
  } else if (checkout.fulfillmentType === "PICKUP") {
    lines.push(`📦 *Tipo:* Recojo en local`);
  } else if (checkout.fulfillmentType === "DELIVERY") {
    lines.push(`🛵 *Tipo:* Delivery`);
    if (checkout.address) lines.push(`📍 *Dirección:* ${checkout.address}`);
    if (checkout.deliveryZoneName)
      lines.push(`🗺️ *Zona:* ${checkout.deliveryZoneName}`);
  }

  if (checkout.preferredPaymentMethod) {
    lines.push(`💳 *Pago:* ${checkout.preferredPaymentMethod}`);
  }

  if (checkout.note) {
    lines.push(`📝 *Nota:* ${checkout.note}`);
  }

  lines.push("");
  lines.push("*Productos:*");

  let subtotal = 0;

  cartItems.forEach((item, index) => {
    const modifiersTotal = item.modifiers.reduce((sum, mod) => {
      return sum + mod.options.reduce((s, opt) => s + opt.priceDelta, 0);
    }, 0);
    const unitPrice = item.basePrice + modifiersTotal;
    const totalPrice = unitPrice * item.quantity;
    subtotal += totalPrice;

    lines.push(
      `${index + 1}. ${item.name} x${item.quantity} — ${formatPrice(
        totalPrice,
        business.currency
      )}`
    );

    item.modifiers.forEach((mod) => {
      const opts = mod.options.map((o) => o.name).join(", ");
      lines.push(`   └ ${mod.groupName}: ${opts}`);
    });
  });

  lines.push("");
  lines.push(`Subtotal: ${formatPrice(subtotal, business.currency)}`);

  let deliveryFee = 0;
  if (checkout.fulfillmentType === "DELIVERY" && business.zones) {
    const zone = business.zones.find((z) => z.name === checkout.deliveryZoneName);
    if (zone) {
      deliveryFee = parseFloat(zone.deliveryFee);
      lines.push(
        `Delivery: ${formatPrice(deliveryFee, business.currency)}`
      );
    }
  }

  const total = subtotal + deliveryFee;
  lines.push(`*Total: ${formatPrice(total, business.currency)}*`);
  lines.push("");
  lines.push("_Enviado desde mesa.pe_");

  return lines.join("\n");
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currency || "PEN",
    minimumFractionDigits: 2,
  }).format(price);
}
