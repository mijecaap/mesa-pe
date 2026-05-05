"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Users, Settings, CreditCard, Truck, Building2, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { useOrganization, OrganizationSwitcher } from "@clerk/nextjs";
import Link from "next/link";
import { useDashboardTour } from "@/hooks/use-dashboard-tour";

function RestartTourButton() {
  const { restartTour } = useDashboardTour();

  return (
    <div className="flex items-center justify-between rounded-xl border border-sand bg-cream/40 p-4">
      <div>
        <Label className="text-coffee">Tour del dashboard</Label>
        <p className="text-sm text-warm-gray">
          Vuelve a ver el tour guiado por las funciones principales.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          restartTour();
          toast.success("Tour reiniciado. Recarga la página para verlo.");
        }}
        className="rounded-xl border-sand hover:bg-sand/40"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reiniciar tour
      </Button>
    </div>
  );
}

export default function SettingsPage() {
  const { activeBusinessId } = useDashboardStore();
  const { data: business } = useBusiness(activeBusinessId ?? undefined);
  const updateBusiness = useUpdateBusiness();
  const { organization } = useOrganization();

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
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand/60">
          <Settings className="h-8 w-8 text-warm-gray" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-coffee">Selecciona un negocio</p>
          <p className="max-w-xs text-sm leading-relaxed text-warm-gray">
            Necesitas tener un negocio activo para configurar.
          </p>
        </div>
        <Link
          href="/dashboard/business"
          className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-terracotta-deep"
        >
          Ir a Mi Negocio <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-coffee">Configuración</h1>
        <p className="mt-1 text-sm text-warm-gray">
          Ajustes de tu negocio.
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4 rounded-xl bg-cream/60 p-1.5">
          <TabsTrigger value="general" className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:text-coffee data-[state=active]:shadow-sm text-sm">
            <Building2 className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />
            General
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:text-coffee data-[state=active]:shadow-sm text-sm">
            <CreditCard className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />
            Pagos
          </TabsTrigger>
          <TabsTrigger value="zones" className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:text-coffee data-[state=active]:shadow-sm text-sm">
            <Truck className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />
            Delivery
          </TabsTrigger>
          <TabsTrigger value="team" className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:text-coffee data-[state=active]:shadow-sm text-sm">
            <Users className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />
            Equipo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-coffee">Información general</h2>
              <p className="text-sm text-warm-gray">Datos básicos de tu negocio.</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-coffee">Nombre</Label>
                <Input
                  value={business?.name || ""}
                  onChange={(e) => handleUpdateBusiness("name", e.target.value)}
                  className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                />
              </div>
              <div>
                <Label className="text-coffee">WhatsApp</Label>
                <Input
                  value={business?.whatsappNumber || ""}
                  onChange={(e) => handleUpdateBusiness("whatsappNumber", e.target.value)}
                  className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                />
              </div>
              <div>
                <Label className="text-coffee">Dirección</Label>
                <Input
                  value={business?.address || ""}
                  onChange={(e) => handleUpdateBusiness("address", e.target.value)}
                  className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                />
              </div>
              <div>
                <Label className="text-coffee">Moneda</Label>
                <Input
                  value={business?.currency || "PEN"}
                  onChange={(e) => handleUpdateBusiness("currency", e.target.value)}
                  className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-cream/40 p-4">
                <div>
                  <Label className="text-coffee">Publicado</Label>
                  <p className="text-sm text-warm-gray">Página pública visible para los clientes.</p>
                </div>
                <Switch
                  checked={business?.isPublished || false}
                  onCheckedChange={(checked) => handleUpdateBusiness("isPublished", checked)}
                />
              </div>

              <RestartTourButton />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4 mt-4">
          <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-coffee">Métodos de pago</h2>
              <p className="text-sm text-warm-gray">Opciones de pago que verán tus clientes.</p>
            </div>
            <div className="space-y-3">
              {paymentMethods?.map((pm: {
                id: string;
                type: string;
                name: string;
                details?: string;
                isActive: boolean;
              }) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between rounded-xl border border-sand bg-cream/30 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-coffee">
                      {pm.name}{" "}
                      <span className="text-xs text-warm-gray">({pm.type})</span>
                    </p>
                    {pm.details && (
                      <p className="text-xs text-warm-gray">{pm.details}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      deletePaymentMethod.mutate({
                        businessId: activeBusinessId,
                        id: pm.id,
                      })
                    }
                    className="h-8 w-8 rounded-lg text-warm-gray hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}

              <form onSubmit={handleAddPayment} className="space-y-3 border-t border-sand pt-4">
                <p className="text-sm font-semibold text-coffee">Agregar método de pago</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label className="text-xs text-warm-gray">Tipo</Label>
                    <div className="relative mt-1">
                      <select
                        value={paymentForm.type}
                        onChange={(e) =>
                          setPaymentForm({
                            ...paymentForm,
                            type: e.target.value as typeof paymentForm.type,
                          })
                        }
                        className="w-full appearance-none rounded-xl border border-sand bg-cream/40 px-3 py-2.5 pr-8 text-sm text-coffee focus-visible:border-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/30"
                      >
                        <option value="YAPE">Yape</option>
                        <option value="PLIN">Plin</option>
                        <option value="CASH">Efectivo</option>
                        <option value="TRANSFER">Transferencia</option>
                        <option value="POS">POS / Tarjeta</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-warm-gray">Nombre</Label>
                    <Input
                      value={paymentForm.name}
                      onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                      placeholder="Ej: Yape de Juan"
                      required
                      className="mt-1 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-warm-gray">Detalles</Label>
                  <Input
                    value={paymentForm.details}
                    onChange={(e) => setPaymentForm({ ...paymentForm, details: e.target.value })}
                    placeholder="Número de cuenta, nombre del titular..."
                    className="mt-1 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl bg-terracotta text-white hover:bg-terracotta-deep"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar
                </Button>
              </form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="zones" className="space-y-4 mt-4">
          <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-coffee">Zonas de delivery</h2>
              <p className="text-sm text-warm-gray">Define dónde entregas y cuánto cobras.</p>
            </div>
            <div className="space-y-3">
              {deliveryZones?.map((zone: {
                id: string;
                name: string;
                deliveryFee: number;
                minimumOrderAmount?: number;
                estimatedMinutes?: number;
              }) => (
                <div
                  key={zone.id}
                  className="flex items-center justify-between rounded-xl border border-sand bg-cream/30 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-coffee">{zone.name}</p>
                    <p className="text-xs text-warm-gray">
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
                    size="icon-sm"
                    onClick={() =>
                      deleteDeliveryZone.mutate({
                        businessId: activeBusinessId,
                        id: zone.id,
                      })
                    }
                    className="h-8 w-8 rounded-lg text-warm-gray hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}

              <form onSubmit={handleAddZone} className="space-y-3 border-t border-sand pt-4">
                <p className="text-sm font-semibold text-coffee">Agregar zona</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label className="text-xs text-warm-gray">Nombre</Label>
                    <Input
                      value={zoneForm.name}
                      onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })}
                      placeholder="Ej: Miraflores"
                      required
                      className="mt-1 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-warm-gray">Costo de delivery (PEN)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={zoneForm.deliveryFee}
                      onChange={(e) => setZoneForm({ ...zoneForm, deliveryFee: e.target.value })}
                      required
                      className="mt-1 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                    />
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label className="text-xs text-warm-gray">Pedido mínimo (opcional)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={zoneForm.minimumOrderAmount}
                      onChange={(e) => setZoneForm({ ...zoneForm, minimumOrderAmount: e.target.value })}
                      className="mt-1 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-warm-gray">Tiempo estimado (min, opcional)</Label>
                    <Input
                      type="number"
                      value={zoneForm.estimatedMinutes}
                      onChange={(e) => setZoneForm({ ...zoneForm, estimatedMinutes: e.target.value })}
                      className="mt-1 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl bg-terracotta text-white hover:bg-terracotta-deep"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar zona
                </Button>
              </form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4 mt-4">
          <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-coffee">Organización</h2>
              <p className="text-sm text-warm-gray">Gestiona tu equipo y negocios.</p>
            </div>
            {organization ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-cream/40 p-4">
                  <p className="text-sm font-medium text-coffee">Organización activa</p>
                  <p className="text-sm text-warm-gray">{organization.name}</p>
                </div>
                <div className="rounded-xl border border-sand bg-cream/30 p-4">
                  <p className="text-sm text-warm-gray mb-2">
                    Cambiar o crear otra organización
                  </p>
                  <OrganizationSwitcher hidePersonal />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-cream/40 p-4">
                  <p className="text-sm font-medium text-coffee">Negocio personal</p>
                  <p className="text-sm text-warm-gray">
                    Actualmente estás gestionando tu negocio de forma individual.
                    Si tienes un equipo o varios locales, crea una organización
                    para invitar miembros y administrar múltiples negocios en equipo.
                  </p>
                </div>
                <div className="rounded-xl border border-sand bg-cream/30 p-4">
                  <p className="text-sm text-warm-gray mb-2">Crear organización</p>
                  <OrganizationSwitcher hidePersonal />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
