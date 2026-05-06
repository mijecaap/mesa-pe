"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Crown,
  Check,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDashboardStore } from "@/stores/dashboard";
import { useBusiness } from "@/hooks/use-business";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import {
  useSubscription,
  useDaysRemaining,
} from "@/hooks/use-subscription";
import {
  useUpgradeRequests,
  useCreateUpgradeRequest,
} from "@/hooks/use-upgrade-request";
import { ImageUpload } from "@/components/image-upload";
import { Progress } from "@/components/ui/progress";
import type { PlanType } from "@mesa/shared-types";

const plansConfig: {
  name: PlanType;
  price: string;
  description: string;
  features: string[];
  cta: string;
}[] = [
  {
    name: "FREE",
    price: "S/ 0",
    description: "Perfecto para empezar",
    features: [
      "Hasta 10 productos",
      "Hasta 5 categorías",
      "1 promoción activa",
      "Temas visuales",
      "Código QR básico",
      "Pedidos por WhatsApp",
      "Marca de agua Mesa.pe",
    ],
    cta: "Plan actual",
  },
  {
    name: "STARTER",
    price: "S/ 29",
    description: "Para negocios en crecimiento",
    features: [
      "Hasta 50 productos",
      "Hasta 10 categorías",
      "3 promociones activas",
      "Temas visuales personalizados",
      "Código QR personalizado",
      "Pedidos por WhatsApp",
      "Sin marca de agua",
    ],
    cta: "Solicitar Starter",
  },
  {
    name: "PRO",
    price: "S/ 79",
    description: "Para negocios establecidos",
    features: [
      "Productos ilimitados",
      "Categorías ilimitadas",
      "Promociones ilimitadas",
      "Temas visuales personalizados",
      "Analytics avanzados",
      "Múltiples métodos de pago",
      "Soporte prioritario",
    ],
    cta: "Solicitar Pro",
  },
];

function PlanBadge({ plan }: { plan: string }) {
  const variants: Record<string, string> = {
    FREE: "bg-warm-gray/10 text-warm-gray border-warm-gray/20",
    STARTER: "bg-moss/10 text-moss border-moss/20",
    PRO: "bg-terracotta/10 text-terracotta border-terracotta/20",
  };
  return (
    <Badge
      variant="outline"
      className={`text-xs uppercase tracking-wider ${variants[plan] ?? variants.FREE}`}
    >
      {plan === "FREE" ? "Free" : plan === "STARTER" ? "Starter" : "Pro"}
    </Badge>
  );
}

function LimitProgress({
  label,
  used,
  total,
}: {
  label: string;
  used: number;
  total: number;
}) {
  const pct = Math.min(100, Math.round((used / total) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-coffee">{label}</span>
        <span className="text-warm-gray">
          {used} / {total}
        </span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}

function UpgradeModal({
  open,
  onOpenChange,
  businessId,
  defaultPlan,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  businessId: string;
  defaultPlan: PlanType;
}) {
  const [plan, setPlan] = useState<PlanType>(defaultPlan);
  const [paymentMethod, setPaymentMethod] = useState<string>("YAPE");
  const [receiptUrl, setReceiptUrl] = useState("");
  const createRequest = useCreateUpgradeRequest();

  const handleSubmit = async () => {
    try {
      await createRequest.mutateAsync({
        businessId,
        data: { requestedPlan: plan, paymentMethod, receiptUrl: receiptUrl || undefined },
      });
      toast.success("Solicitud enviada. Te contactaremos pronto.");
      onOpenChange(false);
      setReceiptUrl("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al enviar solicitud");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-coffee">Solicitar upgrade</DialogTitle>
          <DialogDescription className="text-warm-gray">
            Completa los datos y te contactaremos para activar tu plan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-coffee">Plan deseado</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["STARTER", "PRO"] as PlanType[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlan(p)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                    plan === p
                      ? "border-terracotta bg-terracotta/5 text-terracotta ring-1 ring-terracotta/20"
                      : "border-sand text-coffee hover:border-terracotta/30"
                  }`}
                >
                  {p === "STARTER" ? "Starter — S/ 29/mes" : "Pro — S/ 79/mes"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-coffee">Método de pago</Label>
            <div className="relative mt-2">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full appearance-none rounded-xl border border-sand bg-cream/40 px-3 py-2.5 pr-8 text-sm text-coffee focus-visible:border-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/30"
              >
                <option value="YAPE">Yape</option>
                <option value="PLIN">Plin</option>
                <option value="TRANSFER">Transferencia bancaria</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="text-coffee">Comprobante de pago (opcional)</Label>
            <p className="text-xs text-warm-gray mb-2">
              Si ya realizaste el pago, sube una captura.
            </p>
            <ImageUpload value={receiptUrl} onChange={setReceiptUrl} />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="rounded-xl border-sand"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            className="rounded-xl bg-terracotta text-white hover:bg-terracotta-deep"
            onClick={handleSubmit}
            disabled={createRequest.isPending}
          >
            {createRequest.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Enviar solicitud
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PlanPage() {
  const { activeBusinessId } = useDashboardStore();
  const { data: business, isLoading: businessLoading } = useBusiness(
    activeBusinessId ?? undefined,
  );
  const { data: flags, isLoading: flagsLoading } = useFeatureFlags(
    activeBusinessId ?? undefined,
  );
  const { data: subscription, isLoading: subLoading } = useSubscription(
    activeBusinessId ?? undefined,
  );
  const { data: daysData } = useDaysRemaining(activeBusinessId ?? undefined);
  const { data: upgradeRequests } = useUpgradeRequests(activeBusinessId ?? undefined);

  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("STARTER");

  const daysRemaining = daysData?.days ?? null;
  const pendingRequest = upgradeRequests?.find(
    (r: { status: string }) => r.status === "PENDING",
  );

  if (businessLoading || flagsLoading || subLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (!activeBusinessId || !business) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand/60">
          <Crown className="h-8 w-8 text-warm-gray" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-coffee">Selecciona un negocio</p>
          <p className="max-w-xs text-sm leading-relaxed text-warm-gray">
            Necesitas tener un negocio activo para ver y gestionar tu plan.
          </p>
        </div>
      </div>
    );
  }

  const currentPlan = (business.plan as PlanType) ?? "FREE";
  const limits = [
    {
      label: "Productos",
      used: (flags?.productsRemaining ?? 0) > 0
        ? ((flags?.productsLimit ?? 10) - (flags?.productsRemaining ?? 0))
        : (flags?.productsLimit ?? 10),
      total: flags?.productsLimit ?? 10,
    },
    {
      label: "Categorías",
      used: (flags?.categoriesRemaining ?? 0) > 0
        ? ((flags?.categoriesLimit ?? 5) - (flags?.categoriesRemaining ?? 0))
        : (flags?.categoriesLimit ?? 5),
      total: flags?.categoriesLimit ?? 5,
    },
    {
      label: "Promociones",
      used: (flags?.promotionsRemaining ?? 0) > 0
        ? ((flags?.promotionsLimit ?? 1) - (flags?.promotionsRemaining ?? 0))
        : (flags?.promotionsLimit ?? 1),
      total: flags?.promotionsLimit ?? 1,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-coffee">Tu plan</h1>
        <p className="mt-1 text-sm text-warm-gray">
          Gestiona tu suscripción y conoce los límites de tu negocio.
        </p>
      </div>

      {/* Current plan card */}
      <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PlanBadge plan={currentPlan} />
              {subscription?.isTrial && (
                <Badge
                  variant="outline"
                  className="border-amber-200 bg-amber-50 text-amber-700"
                >
                  Prueba gratis
                </Badge>
              )}
              {subscription?.status === "ACTIVE" && daysRemaining !== null && daysRemaining <= 7 && (
                <Badge
                  variant="outline"
                  className="border-amber-200 bg-amber-50 text-amber-700"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  Expira en {daysRemaining} día{daysRemaining !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <p className="text-sm text-warm-gray">
              {subscription?.isTrial
                ? `Prueba gratuita de 30 días. Expira el ${new Date(subscription.endsAt).toLocaleDateString("es-PE", {
                    day: "numeric",
                    month: "long",
                  })}.`
                : currentPlan === "FREE"
                  ? "Estás en el plan gratuito. Actualiza para desbloquear más funciones."
                  : subscription?.status === "ACTIVE"
                    ? `Vigente hasta ${new Date(subscription.endsAt).toLocaleDateString("es-PE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}`
                    : "Plan activo"}
            </p>
          </div>

          {(currentPlan === "FREE" || subscription?.isTrial) && !pendingRequest && (
            <Button
              className="bg-terracotta text-white hover:bg-terracotta-deep"
              onClick={() => {
                setSelectedPlan(subscription?.isTrial ? currentPlan : "STARTER");
                setUpgradeOpen(true);
              }}
            >
              {subscription?.isTrial ? "Mantener mi plan" : "Solicitar upgrade"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {pendingRequest && (
            <Badge
              variant="outline"
              className="border-blue-200 bg-blue-50 text-blue-700"
            >
              Solicitud {pendingRequest.requestedPlan} pendiente
            </Badge>
          )}
        </div>
      </div>

      {/* Usage limits */}
      <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-coffee">
          Uso del plan
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {limits.map((limit) => (
            <LimitProgress
              key={limit.label}
              label={limit.label}
              used={limit.used}
              total={limit.total}
            />
          ))}
        </div>
      </div>

      {/* Plan comparison */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-coffee">
          Comparativa de planes
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plansConfig.map((plan) => {
            const isCurrent = plan.name === currentPlan;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-6 transition-shadow hover:shadow-md ${
                  isCurrent
                    ? "border-terracotta bg-terracotta/5 ring-1 ring-terracotta/20"
                    : "border-sand bg-white"
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-2 left-4 rounded-full bg-terracotta px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    {subscription?.isTrial ? "Prueba gratis" : "Actual"}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-coffee">
                    {plan.name === "FREE"
                      ? "Free"
                      : plan.name === "STARTER"
                        ? "Starter"
                        : "Pro"}
                  </h3>
                  <p className="mt-0.5 text-xs text-warm-gray">{plan.description}</p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-display text-2xl font-bold text-coffee">
                      {plan.price}
                    </span>
                    <span className="text-xs text-warm-gray">/mes</span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-moss" />
                        <span className="text-coffee/90">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5">
                  {isCurrent ? (
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-sand"
                      disabled={!subscription?.isTrial}
                      onClick={() => {
                        if (subscription?.isTrial) {
                          setSelectedPlan(plan.name);
                          setUpgradeOpen(true);
                        }
                      }}
                    >
                      {subscription?.isTrial ? "Mantener plan" : "Plan activo"}
                    </Button>
                  ) : (
                    <Button
                      className="w-full rounded-xl bg-terracotta text-white hover:bg-terracotta-deep"
                      onClick={() => {
                        setSelectedPlan(plan.name);
                        setUpgradeOpen(true);
                      }}
                    >
                      {plan.cta}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <UpgradeModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        businessId={activeBusinessId}
        defaultPlan={selectedPlan}
      />
    </div>
  );
}
