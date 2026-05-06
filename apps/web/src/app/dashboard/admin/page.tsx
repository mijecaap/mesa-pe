"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Search,
  Check,
  X,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAdminBusinesses,
  useAdminUpgradeRequests,
  useApproveUpgradeRequest,
  useRejectUpgradeRequest,
  useAdminCreateSubscription,
} from "@/hooks/use-admin";
import type { PlanType } from "@mesa/shared-types";

function PlanBadge({ plan }: { plan: string }) {
  const variants: Record<string, string> = {
    FREE: "bg-warm-gray/10 text-warm-gray",
    STARTER: "bg-moss/10 text-moss",
    PRO: "bg-terracotta/10 text-terracotta",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${variants[plan] ?? variants.FREE}`}
    >
      {plan === "FREE" ? "Free" : plan === "STARTER" ? "Starter" : "Pro"}
    </span>
  );
}

function SubscriptionModal({
  open,
  onOpenChange,
  businessId,
  businessName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  businessId: string;
  businessName: string;
}) {
  const [plan, setPlan] = useState<PlanType>("STARTER");
  const [endsAt, setEndsAt] = useState("");
  const [notes, setNotes] = useState("");
  const createSub = useAdminCreateSubscription();

  const handleSubmit = async () => {
    if (!endsAt) {
      toast.error("Selecciona una fecha de fin");
      return;
    }
    try {
      await createSub.mutateAsync({
        businessId,
        data: { plan, endsAt, notes: notes || undefined },
      });
      toast.success("Suscripción creada correctamente");
      onOpenChange(false);
      setEndsAt("");
      setNotes("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear suscripción");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-coffee">Gestionar suscripción</DialogTitle>
          <DialogDescription className="text-warm-gray">
            {businessName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-coffee">Plan</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["FREE", "STARTER", "PRO"] as PlanType[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlan(p)}
                  className={`rounded-xl border px-2 py-2 text-xs font-medium transition-all ${
                    plan === p
                      ? "border-terracotta bg-terracotta/5 text-terracotta ring-1 ring-terracotta/20"
                      : "border-sand text-coffee hover:border-terracotta/30"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-coffee">Vigente hasta</Label>
            <Input
              type="date"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="mt-2 rounded-xl border-sand bg-cream/40"
            />
          </div>
          <div>
            <Label className="text-coffee">Notas (opcional)</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Pagó por Yape el 05/05"
              className="mt-2 rounded-xl border-sand bg-cream/40"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" className="rounded-xl border-sand" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="rounded-xl bg-terracotta text-white hover:bg-terracotta-deep"
            onClick={handleSubmit}
            disabled={createSub.isPending}
          >
            {createSub.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminPage() {
  const [query, setQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [selectedBusinessName, setSelectedBusinessName] = useState("");
  const [subModalOpen, setSubModalOpen] = useState(false);

  const businessesQuery = useAdminBusinesses(query, planFilter, page, 20, true);
  const { data: upgradeRequests, isLoading: requestsLoading } = useAdminUpgradeRequests(true);
  const approveRequest = useApproveUpgradeRequest();
  const rejectRequest = useRejectUpgradeRequest();

  const handleApprove = async (id: string) => {
    try {
      await approveRequest.mutateAsync({ id });
      toast.success("Solicitud aprobada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  const handleReject = async (id: string) => {
    const notes = window.prompt("Motivo del rechazo (opcional):");
    if (notes === null) return;
    try {
      await rejectRequest.mutateAsync({ id, notes });
      toast.success("Solicitud rechazada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  const businesses = businessesQuery.data?.data ?? [];
  const meta = businessesQuery.data?.meta;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-coffee">Panel de admin</h1>
        <p className="mt-1 text-sm text-warm-gray">
          Gestiona negocios, suscripciones y solicitudes de upgrade.
        </p>
      </div>

      <Tabs defaultValue="businesses">
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-cream/60 p-1.5 max-w-xs">
          <TabsTrigger value="businesses" className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:text-coffee data-[state=active]:shadow-sm text-sm">
            Negocios
          </TabsTrigger>
          <TabsTrigger value="requests" className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:text-coffee data-[state=active]:shadow-sm text-sm">
            Solicitudes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="businesses" className="mt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-gray" />
              <Input
                placeholder="Buscar por nombre o slug..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="rounded-xl border-sand bg-white pl-9"
              />
            </div>
            <div className="relative w-40">
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-sand bg-white px-3 py-2 pr-8 text-sm text-coffee focus-visible:border-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/30"
              >
                <option value="">Todos los planes</option>
                <option value="FREE">Free</option>
                <option value="STARTER">Starter</option>
                <option value="PRO">Pro</option>
              </select>
            </div>
            <Button
              variant="outline"
              className="rounded-xl border-sand"
              onClick={() => businessesQuery.refetch()}
              disabled={businessesQuery.isFetching}
            >
              {businessesQuery.isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Buscar"
              )}
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-sand bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sand bg-cream/40 text-left">
                    <th className="px-4 py-3 font-semibold text-coffee">Negocio</th>
                    <th className="px-4 py-3 font-semibold text-coffee">Plan</th>
                    <th className="px-4 py-3 font-semibold text-coffee">Vigente hasta</th>
                    <th className="px-4 py-3 font-semibold text-coffee text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {businessesQuery.isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-warm-gray">
                        <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                      </td>
                    </tr>
                  ) : businesses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-warm-gray">
                        No se encontraron negocios
                      </td>
                    </tr>
                  ) : (
                    businesses.map((b: {
                      id: string;
                      name: string;
                      slug: string;
                      plan: string;
                      subscriptions: { endsAt: string; status: string }[];
                    }) => (
                      <tr key={b.id} className="border-b border-sand last:border-0 hover:bg-cream/30">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-coffee">{b.name}</p>
                            <p className="text-xs text-warm-gray">/{b.slug}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <PlanBadge plan={b.plan} />
                        </td>
                        <td className="px-4 py-3">
                          {b.subscriptions?.[0]?.status === "ACTIVE" ? (
                            <span className="flex items-center gap-1 text-xs text-coffee">
                              <Clock className="h-3 w-3 text-warm-gray" />
                              {new Date(b.subscriptions[0].endsAt).toLocaleDateString("es-PE")}
                            </span>
                          ) : (
                            <span className="text-xs text-warm-gray">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg border-sand text-xs"
                            onClick={() => {
                              setSelectedBusinessId(b.id);
                              setSelectedBusinessName(b.name);
                              setSubModalOpen(true);
                            }}
                          >
                            Gestionar
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-sand px-4 py-3">
                <p className="text-xs text-warm-gray">
                  Página {meta.page} de {meta.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg border-sand text-xs"
                    disabled={meta.page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg border-sand text-xs"
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-sand bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sand bg-cream/40 text-left">
                    <th className="px-4 py-3 font-semibold text-coffee">Negocio</th>
                    <th className="px-4 py-3 font-semibold text-coffee">Plan solicitado</th>
                    <th className="px-4 py-3 font-semibold text-coffee">Pago</th>
                    <th className="px-4 py-3 font-semibold text-coffee">Fecha</th>
                    <th className="px-4 py-3 font-semibold text-coffee text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsLoading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-warm-gray">
                        <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                      </td>
                    </tr>
                  ) : !upgradeRequests || upgradeRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-warm-gray">
                        No hay solicitudes pendientes
                      </td>
                    </tr>
                  ) : (
                    upgradeRequests.map((req: {
                      id: string;
                      business: { name: string; slug: string };
                      requestedPlan: string;
                      paymentMethod: string;
                      receiptUrl?: string;
                      createdAt: string;
                    }) => (
                      <tr key={req.id} className="border-b border-sand last:border-0 hover:bg-cream/30">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-coffee">{req.business?.name}</p>
                            <p className="text-xs text-warm-gray">/{req.business?.slug}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <PlanBadge plan={req.requestedPlan} />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-coffee">{req.paymentMethod}</span>
                          {req.receiptUrl && (
                            <a
                              href={req.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-xs text-terracotta hover:underline"
                            >
                              Ver comprobante
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-warm-gray">
                          {new Date(req.createdAt).toLocaleDateString("es-PE")}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              className="rounded-lg bg-moss text-white hover:bg-moss/90 text-xs"
                              onClick={() => handleApprove(req.id)}
                              disabled={approveRequest.isPending}
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg border-red-200 text-red-600 hover:bg-red-50 text-xs"
                              onClick={() => handleReject(req.id)}
                              disabled={rejectRequest.isPending}
                            >
                              <X className="mr-1 h-3 w-3" />
                              Rechazar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {selectedBusinessId && (
        <SubscriptionModal
          open={subModalOpen}
          onOpenChange={setSubModalOpen}
          businessId={selectedBusinessId}
          businessName={selectedBusinessName}
        />
      )}
    </div>
  );
}
