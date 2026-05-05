"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Megaphone,
  Calendar,
  ExternalLink,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  usePromotions,
  useCreatePromotion,
  useUpdatePromotion,
  useDeletePromotion,
} from "@/hooks/use-promotions";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import { useDashboardStore } from "@/stores/dashboard";
import { ImageUpload } from "@/components/image-upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  type CreatePromotionInput,
  type UpdatePromotionInput,
} from "@mesa/shared-types";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    title: z
      .string({ required_error: "El título es obligatorio" })
      .min(1, "El título es obligatorio")
      .max(120, "El título no puede tener más de 120 caracteres"),
    description: z
      .string()
      .max(500, "La descripción no puede tener más de 500 caracteres")
      .optional()
      .nullable()
      .or(z.literal("")),
    imageUrl: z
      .string()
      .url("Ingresa una URL válida (ej: https://ejemplo.com/imagen.jpg)")
      .optional()
      .nullable()
      .or(z.literal("")),
    ctaUrl: z
      .string()
      .url("Ingresa una URL válida (ej: https://ejemplo.com)")
      .optional()
      .nullable()
      .or(z.literal("")),
    buttonText: z
      .string()
      .max(50, "El texto no puede tener más de 50 caracteres")
      .optional()
      .nullable()
      .or(z.literal("")),
    startDate: z.string().optional().nullable().or(z.literal("")),
    endDate: z.string().optional().nullable().or(z.literal("")),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: "La fecha de fin debe ser igual o posterior a la de inicio",
      path: ["endDate"],
    },
  );

type PromotionFormData = z.infer<typeof formSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500">
      <Info className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

function RequiredIndicator() {
  return <span className="ml-0.5 text-red-400" aria-label="obligatorio">*</span>;
}

function OptionalHint() {
  return (
    <span className="ml-1 text-[11px] font-normal text-warm-gray/70">
      (opcional)
    </span>
  );
}

function PromotionForm({
  initial,
  businessId,
  onSuccess,
}: {
  initial?: Partial<PromotionFormData> & { id?: string };
  businessId: string;
  onSuccess: () => void;
}) {
  const create = useCreatePromotion();
  const update = useUpdatePromotion();
  const isEditing = !!initial?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      imageUrl: initial?.imageUrl ?? "",
      ctaUrl: initial?.ctaUrl ?? "",
      buttonText: initial?.buttonText ?? "",
      startDate: initial?.startDate
        ? new Date(initial.startDate).toISOString().slice(0, 10)
        : "",
      endDate: initial?.endDate
        ? new Date(initial.endDate).toISOString().slice(0, 10)
        : "",
      isActive: initial?.isActive ?? true,
    },
  });

  const imageUrl = watch("imageUrl");
  const isActive = watch("isActive");

  const onSubmit = async (data: PromotionFormData) => {
    try {
      const payload = {
        ...data,
        imageUrl: data.imageUrl || null,
        ctaUrl: data.ctaUrl || null,
        description: data.description || null,
        buttonText: data.buttonText || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      };

      if (isEditing && initial?.id) {
        await update.mutateAsync({
          businessId,
          id: initial.id,
          data: payload as UpdatePromotionInput,
        });
        toast.success("Promoción actualizada");
      } else {
        await create.mutateAsync({
          businessId,
          data: payload as CreatePromotionInput,
        });
        toast.success("Promoción creada");
      }
      onSuccess();
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado";
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Título */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Título
          <RequiredIndicator />
        </Label>
        <Input
          id="title"
          placeholder="Ej: 2x1 en hamburguesas todos los martes"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
          {...register("title")}
        />
        <FieldError message={errors.title?.message} />
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Descripción
          <OptionalHint />
        </Label>
        <Textarea
          id="description"
          placeholder="Detalles de la promoción, términos y condiciones..."
          rows={3}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        <div className="flex items-center justify-between">
          <FieldError message={errors.description?.message} />
          <p className="text-[11px] text-warm-gray/60">
            Máx. 500 caracteres
          </p>
        </div>
      </div>

      {/* Imagen */}
      <div className="space-y-2">
        <Label>
          Imagen del banner
          <OptionalHint />
        </Label>
        <ImageUpload
          value={imageUrl || ""}
          onChange={(url) => setValue("imageUrl", url, { shouldValidate: true })}
        />
        <FieldError message={errors.imageUrl?.message} />
      </div>

      {/* Botón y URL */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="buttonText">
            Texto del botón
            <OptionalHint />
          </Label>
          <Input
            id="buttonText"
            placeholder="Ver detalles"
            {...register("buttonText")}
          />
          <FieldError message={errors.buttonText?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctaUrl">
            URL del botón
            <OptionalHint />
          </Label>
          <Input
            id="ctaUrl"
            placeholder="https://..."
            aria-invalid={!!errors.ctaUrl}
            {...register("ctaUrl")}
          />
          <FieldError message={errors.ctaUrl?.message} />
        </div>
      </div>

      {/* Fechas */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">
            Fecha de inicio
            <OptionalHint />
          </Label>
          <Input id="startDate" type="date" {...register("startDate")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">
            Fecha de fin
            <OptionalHint />
          </Label>
          <Input
            id="endDate"
            type="date"
            aria-invalid={!!errors.endDate}
            {...register("endDate")}
          />
          <FieldError message={errors.endDate?.message} />
        </div>
      </div>

      {/* Activo */}
      <div className="flex items-center justify-between rounded-xl border border-sand bg-cream/40 p-4">
        <div className="space-y-0.5">
          <Label htmlFor="isActive" className="text-sm font-medium">
            Promoción activa
          </Label>
          <p className="text-xs text-warm-gray">
            Solo las promociones activas aparecen en tu carta pública.
          </p>
        </div>
        <Switch
          id="isActive"
          checked={isActive ?? true}
          onCheckedChange={(v) => setValue("isActive", v)}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          className="bg-terracotta text-white hover:bg-terracotta-deep"
          disabled={isSubmitting || create.isPending || update.isPending}
        >
          {isSubmitting || create.isPending || update.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isEditing ? "Guardar cambios" : "Crear promoción"}
        </Button>
      </div>
    </form>
  );
}

export default function PromotionsPage() {
  const { activeBusinessId } = useDashboardStore();
  const { data: promotions, isLoading } = usePromotions(
    activeBusinessId ?? undefined,
  );
  const { data: flags } = useFeatureFlags(activeBusinessId ?? undefined);
  const deletePromotion = useDeletePromotion();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<
    (PromotionFormData & { id: string }) | null
  >(null);

  const handleDelete = async (id: string) => {
    if (!activeBusinessId) return;
    if (!confirm("¿Eliminar esta promoción?")) return;
    try {
      await deletePromotion.mutateAsync({ businessId: activeBusinessId, id });
      toast.success("Promoción eliminada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar");
    }
  };

  const isWithinRange = (p: {
    startDate?: string | null;
    endDate?: string | null;
  }) => {
    const now = new Date();
    if (p.startDate && new Date(p.startDate) > now) return false;
    if (p.endDate && new Date(p.endDate) < now) return false;
    return true;
  };

  const canCreate = flags?.canCreatePromotion ?? true;
  const promotionsRemaining = flags?.promotionsRemaining ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (!activeBusinessId) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand/60">
          <Megaphone className="h-8 w-8 text-warm-gray" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-coffee">
            Selecciona un negocio
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-warm-gray">
            Necesitas tener un negocio activo para gestionar tus promociones.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-coffee">
            Promociones
          </h1>
          <p className="mt-1 text-sm text-warm-gray">
            Crea banners y ofertas destacadas para tu carta digital.
          </p>
        </div>
        <Button
          className="bg-terracotta text-white shadow-sm transition-colors hover:bg-terracotta-deep"
          disabled={!canCreate}
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva promoción
        </Button>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditing(null);
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar promoción" : "Nueva promoción"}
              </DialogTitle>
            </DialogHeader>
            <PromotionForm
              key={editing?.id || "new"}
              businessId={activeBusinessId}
              initial={editing ?? undefined}
              onSuccess={() => {
                setDialogOpen(false);
                setEditing(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {typeof promotionsRemaining === "number" && (
        <div className="flex items-center gap-2 text-xs text-warm-gray">
          <Badge variant="outline" className="border-sand text-[10px]">
            {promotionsRemaining === 0
              ? "Límite alcanzado"
              : `${promotionsRemaining} promoción${promotionsRemaining === 1 ? "" : "es"} restante${promotionsRemaining === 1 ? "" : "s"}`}
          </Badge>
          {promotionsRemaining === 0 && (
            <span className="text-terracotta">
              Actualiza tu plan para crear más promociones.
            </span>
          )}
        </div>
      )}

      {promotions?.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-sand bg-white py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sand/40">
            <Megaphone className="h-6 w-6 text-warm-gray" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-coffee">
              Sin promociones aún
            </p>
            <p className="max-w-xs text-sm text-warm-gray">
              Crea tu primera promoción para destacar ofertas en tu carta digital.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-xl border-sand"
            onClick={() => setDialogOpen(true)}
            disabled={!canCreate}
          >
            <Plus className="mr-2 h-4 w-4" />
            Crear primera promoción
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {promotions?.map(
            (promo: {
              id: string;
              title: string;
              description?: string | null;
              imageUrl?: string | null;
              ctaUrl?: string | null;
              buttonText?: string | null;
              startDate?: string | null;
              endDate?: string | null;
              isActive: boolean;
            }) => {
              const inRange = isWithinRange(promo);
              return (
                <div
                  key={promo.id}
                  className={cn(
                    "flex flex-col gap-4 rounded-xl border border-sand bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center",
                    !promo.isActive && "opacity-60",
                  )}
                >
                  {promo.imageUrl ? (
                    <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg sm:w-32">
                      <img
                        src={promo.imageUrl}
                        alt={promo.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-24 w-full shrink-0 items-center justify-center rounded-lg bg-cream sm:w-32">
                      <Megaphone className="h-8 w-8 text-warm-gray/40" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-coffee">
                        {promo.title}
                      </h3>
                      {!promo.isActive && (
                        <Badge
                          variant="outline"
                          className="border-sand text-warm-gray text-[10px]"
                        >
                          Inactiva
                        </Badge>
                      )}
                      {promo.isActive && !inRange && (
                        <Badge
                          variant="outline"
                          className="border-amber-200 text-amber-700 text-[10px]"
                        >
                          Fuera de vigencia
                        </Badge>
                      )}
                      {promo.isActive && inRange && (
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">
                          Activa
                        </Badge>
                      )}
                    </div>
                    {promo.description && (
                      <p className="mt-1 text-sm text-warm-gray line-clamp-2">
                        {promo.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-warm-gray">
                      {(promo.startDate || promo.endDate) && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {promo.startDate
                            ? new Date(promo.startDate).toLocaleDateString(
                                "es-PE",
                              )
                            : "Sin inicio"}
                          {" — "}
                          {promo.endDate
                            ? new Date(promo.endDate).toLocaleDateString(
                                "es-PE",
                              )
                            : "Sin fin"}
                        </span>
                      )}
                      {promo.ctaUrl && (
                        <span className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">
                            {promo.ctaUrl}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setEditing({
                          id: promo.id,
                          title: promo.title,
                          description: promo.description ?? "",
                          imageUrl: promo.imageUrl ?? "",
                          ctaUrl: promo.ctaUrl ?? "",
                          buttonText: promo.buttonText ?? "",
                          startDate: promo.startDate ?? "",
                          endDate: promo.endDate ?? "",
                          isActive: promo.isActive,
                        });
                        setDialogOpen(true);
                      }}
                      className="h-8 w-8 rounded-lg text-warm-gray hover:bg-sand/60 hover:text-coffee"
                      aria-label="Editar promoción"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(promo.id)}
                      className="h-8 w-8 rounded-lg text-warm-gray hover:bg-red-50 hover:text-red-600"
                      aria-label="Eliminar promoción"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}
