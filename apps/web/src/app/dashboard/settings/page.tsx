"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardStore } from "@/stores/dashboard";
import { useBusiness, useUpdateBusiness } from "@/hooks/use-business";
import {
  usePaymentMethods,
  useCreatePaymentMethod,
  useDeletePaymentMethod,
} from "@/hooks/use-payment-methods";
import {
  useDeliveryZones,
  useCreateDeliveryZone,
  useDeleteDeliveryZone,
} from "@/hooks/use-delivery-zones";

export default function SettingsPage() {
  const { activeBusinessId } = useDashboardStore();
  const { data: business } = useBusiness(activeBusinessId ?? undefined);
  const updateBusiness = useUpdateBusiness();

  const { data: paymentMethods } = usePaymentMethods(activeBusinessId ?? undefined);
  const createPaymentMethod = useCreatePaymentMethod();
  const deletePaymentMethod = useDeletePaymentMethod();

  const { data: deliveryZones } = useDeliveryZones(activeBusinessId ?? undefined);
  const createDeliveryZone = useCreateDeliveryZone();
  const deleteDeliveryZone = useDeleteDeliveryZone();

  const [paymentForm, setPaymentForm] = useState<{
    type: "YAPE" | "PLIN" | "CASH" | "TRANSFER" | "POS";
    name: string;
    details: string;
    isActive: boolean;
  }>({
    type: "YAPE",
    name: "",
    details: "",
    isActive: true,
  });

  const [zoneForm, setZoneForm] = useState({
    name: "",
    deliveryFee: "",
    minimumOrderAmount: "",
    estimatedMinutes: "",
    isActive: true,
  });

  const handleUpdateBusiness = async (field: string, value: unknown) => {
    if (!activeBusinessId) return;
    try {
      await updateBusiness.mutateAsync({
        id: activeBusinessId,
        data: { [field]: value },
      });
      toast.success("Actualizado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusinessId) return;
    try {
      await createPaymentMethod.mutateAsync({
        businessId: activeBusinessId,
        data: paymentForm,
      });
      setPaymentForm({ type: "YAPE", name: "", details: "", isActive: true });
      toast.success("Método de pago agregado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    }
  };

  const handleAddZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusinessId) return;
    try {
      await createDeliveryZone.mutateAsync({
        businessId: activeBusinessId,
        data: {
          ...zoneForm,
          deliveryFee: parseFloat(zoneForm.deliveryFee),
          minimumOrderAmount: zoneForm.minimumOrderAmount
            ? parseFloat(zoneForm.minimumOrderAmount)
            : undefined,
          estimatedMinutes: zoneForm.estimatedMinutes
            ? parseInt(zoneForm.estimatedMinutes)
            : undefined,
        },
      });
      setZoneForm({
        name: "",
        deliveryFee: "",
        minimumOrderAmount: "",
        estimatedMinutes: "",
        isActive: true,
      });
      toast.success("Zona de delivery agregada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    }
  };

  if (!activeBusinessId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Selecciona un negocio para configurar.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Configuración</h1>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="zones">Delivery</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información general</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={business?.name || ""}
                  onChange={(e) => handleUpdateBusiness("name", e.target.value)}
                />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input
                  value={business?.whatsappNumber || ""}
                  onChange={(e) =>
                    handleUpdateBusiness("whatsappNumber", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Dirección</Label>
                <Input
                  value={business?.address || ""}
                  onChange={(e) =>
                    handleUpdateBusiness("address", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Moneda</Label>
                <Input
                  value={business?.currency || "PEN"}
                  onChange={(e) =>
                    handleUpdateBusiness("currency", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Publicado</Label>
                  <p className="text-sm text-muted-foreground">
                    Página pública visible
                  </p>
                </div>
                <Switch
                  checked={business?.isPublished || false}
                  onCheckedChange={(checked) =>
                    handleUpdateBusiness("isPublished", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods?.map((pm: {
                id: string;
                type: string;
                name: string;
                details?: string;
                isActive: boolean;
              }) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">
                      {pm.name}{" "}
                      <span className="text-xs text-muted-foreground">
                        ({pm.type})
                      </span>
                    </p>
                    {pm.details && (
                      <p className="text-sm text-muted-foreground">
                        {pm.details}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      deletePaymentMethod.mutate({
                        businessId: activeBusinessId,
                        id: pm.id,
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}

              <form onSubmit={handleAddPayment} className="space-y-3 border-t pt-4">
                <p className="font-medium">Agregar método de pago</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label>Tipo</Label>
                    <select
                      value={paymentForm.type}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          type: e.target.value as typeof paymentForm.type,
                        })
                      }
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    >
                      <option value="YAPE">Yape</option>
                      <option value="PLIN">Plin</option>
                      <option value="CASH">Efectivo</option>
                      <option value="TRANSFER">Transferencia</option>
                      <option value="POS">POS / Tarjeta</option>
                    </select>
                  </div>
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={paymentForm.name}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, name: e.target.value })
                      }
                      placeholder="Ej: Yape de Juan"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>Detalles</Label>
                  <Input
                    value={paymentForm.details}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, details: e.target.value })
                    }
                    placeholder="Número de cuenta, nombre del titular..."
                  />
                </div>
                <Button type="submit" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Zonas de delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {deliveryZones?.map((zone: {
                id: string;
                name: string;
                deliveryFee: number;
                minimumOrderAmount?: number;
                estimatedMinutes?: number;
              }) => (
                <div
                  key={zone.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{zone.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Delivery: S/ {zone.deliveryFee}
                      {zone.minimumOrderAmount
                        ? ` · Mínimo: S/ ${zone.minimumOrderAmount}`
                        : ""}
                      {zone.estimatedMinutes
                        ? ` · ${zone.estimatedMinutes} min`
                        : ""}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      deleteDeliveryZone.mutate({
                        businessId: activeBusinessId,
                        id: zone.id,
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}

              <form onSubmit={handleAddZone} className="space-y-3 border-t pt-4">
                <p className="font-medium">Agregar zona</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={zoneForm.name}
                      onChange={(e) =>
                        setZoneForm({ ...zoneForm, name: e.target.value })
                      }
                      placeholder="Ej: Miraflores"
                      required
                    />
                  </div>
                  <div>
                    <Label>Costo de delivery (PEN)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={zoneForm.deliveryFee}
                      onChange={(e) =>
                        setZoneForm({ ...zoneForm, deliveryFee: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label>Pedido mínimo (opcional)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={zoneForm.minimumOrderAmount}
                      onChange={(e) =>
                        setZoneForm({
                          ...zoneForm,
                          minimumOrderAmount: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Tiempo estimado (min, opcional)</Label>
                    <Input
                      type="number"
                      value={zoneForm.estimatedMinutes}
                      onChange={(e) =>
                        setZoneForm({
                          ...zoneForm,
                          estimatedMinutes: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button type="submit" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar zona
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
