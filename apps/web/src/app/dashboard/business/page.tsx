"use client";

import { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader2, Plus, Store, Save, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  useBusinesses,
  useCreateBusiness,
  useUpdateBusiness,
} from "@/hooks/use-business";
import { useDashboardStore } from "@/stores/dashboard";
import { ImageUpload } from "@/components/image-upload";
import Link from "next/link";

export default function BusinessPage() {
  const { organization } = useOrganization();
  const { data: businesses, isLoading } = useBusinesses(organization?.id);
  const { activeBusinessId, setActiveBusinessId } = useDashboardStore();
  const createBusiness = useCreateBusiness();
  const updateBusiness = useUpdateBusiness();

  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    name: "",
    description: "",
    whatsappNumber: "",
    address: "",
    googleMapsUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    facebookUrl: "",
    logoUrl: "",
    bannerUrl: "",
    currency: "PEN",
    isPublished: false,
    manualStatus: "AUTO" as "AUTO" | "OPEN" | "CLOSED",
  });

  const activeBusiness = businesses?.find(
    (b: { id: string }) => b.id === activeBusinessId,
  );

  useEffect(() => {
    if (activeBusiness) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        slug: activeBusiness.slug,
        name: activeBusiness.name,
        description: activeBusiness.description || "",
        whatsappNumber: activeBusiness.whatsappNumber,
        address: activeBusiness.address || "",
        googleMapsUrl: activeBusiness.googleMapsUrl || "",
        instagramUrl: activeBusiness.instagramUrl || "",
        tiktokUrl: activeBusiness.tiktokUrl || "",
        facebookUrl: activeBusiness.facebookUrl || "",
        logoUrl: activeBusiness.logoUrl || "",
        bannerUrl: activeBusiness.bannerUrl || "",
        currency: activeBusiness.currency || "PEN",
        isPublished: activeBusiness.isPublished,
        manualStatus: activeBusiness.manualStatus,
      });
    }
  }, [activeBusiness]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isCreating) {
        const newBusiness = await createBusiness.mutateAsync(form);
        setActiveBusinessId(newBusiness.id);
        setIsCreating(false);
        toast.success("Negocio creado correctamente");
      } else if (activeBusinessId) {
        await updateBusiness.mutateAsync({
          id: activeBusinessId,
          data: {
            name: form.name,
            description: form.description,
            whatsappNumber: form.whatsappNumber,
            address: form.address,
            googleMapsUrl: form.googleMapsUrl,
            instagramUrl: form.instagramUrl,
            tiktokUrl: form.tiktokUrl,
            facebookUrl: form.facebookUrl,
            logoUrl: form.logoUrl,
            bannerUrl: form.bannerUrl,
            currency: form.currency,
            isPublished: form.isPublished,
            manualStatus: form.manualStatus,
          },
        });
        toast.success("Negocio actualizado correctamente");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (!businesses || businesses.length === 0) {
    if (!isCreating) {
      return (
        <div className="flex flex-col items-center gap-5 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand/60">
            <Store className="h-8 w-8 text-warm-gray" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-coffee">No tienes ningún negocio</p>
            <p className="max-w-xs text-sm leading-relaxed text-warm-gray">
              Crea tu primer negocio para empezar a recibir pedidos por WhatsApp.
            </p>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-terracotta text-white shadow-sm transition-colors hover:bg-terracotta-deep"
          >
            <Plus className="mr-2 h-4 w-4" />
            Crear negocio
          </Button>
        </div>
      );
    }

    return (
      <div className="max-w-xl">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-coffee">Crear negocio</h1>
          <p className="mt-1 text-sm text-warm-gray">Completa los datos básicos para empezar.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
            <div className="space-y-4">
              <div>
                <Label htmlFor="slug" className="text-coffee">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="mi-restaurante"
                  required
                  className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                />
                <p className="mt-1 text-xs text-warm-gray">
                  Solo letras minúsculas, números y guiones.
                </p>
              </div>
              <div>
                <Label htmlFor="name" className="text-coffee">Nombre del negocio</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Mi Restaurante"
                  required
                  className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp" className="text-coffee">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={form.whatsappNumber}
                  onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                  placeholder="+51 999 999 999"
                  required
                  className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={createBusiness.isPending}
              className="bg-terracotta text-white shadow-sm transition-colors hover:bg-terracotta-deep"
            >
              {createBusiness.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Crear negocio
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreating(false)}
              className="rounded-xl border-sand"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-coffee">Mi Negocio</h1>
          <p className="mt-1 text-sm text-warm-gray">
            Gestiona la información de {activeBusiness?.name || "tu negocio"}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeBusiness?.slug && (
            <Link
              href={`/${activeBusiness.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-sand bg-white px-3.5 py-2 text-sm font-medium text-coffee shadow-sm transition-colors hover:bg-sand/40"
            >
              <ExternalLink className="h-4 w-4" />
              Ver carta
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="rounded-xl border-sand"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo negocio
          </Button>
        </div>
      </div>

      {isCreating && (
        <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-coffee">Crear nuevo negocio</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="new-slug" className="text-coffee">Slug (URL)</Label>
                <Input
                  id="new-slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="mi-restaurante"
                  required
                  className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                />
              </div>
              <div>
                <Label htmlFor="new-name" className="text-coffee">Nombre</Label>
                <Input
                  id="new-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Mi Restaurante"
                  required
                  className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="new-whatsapp" className="text-coffee">WhatsApp</Label>
              <Input
                id="new-whatsapp"
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                placeholder="+51 999 999 999"
                required
                className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={createBusiness.isPending}
                className="bg-terracotta text-white shadow-sm transition-colors hover:bg-terracotta-deep"
              >
                {createBusiness.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Crear negocio
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  if (activeBusiness) {
                    setForm({
                      slug: activeBusiness.slug,
                      name: activeBusiness.name,
                      description: activeBusiness.description || "",
                      whatsappNumber: activeBusiness.whatsappNumber,
                      address: activeBusiness.address || "",
                      googleMapsUrl: activeBusiness.googleMapsUrl || "",
                      instagramUrl: activeBusiness.instagramUrl || "",
                      tiktokUrl: activeBusiness.tiktokUrl || "",
                      facebookUrl: activeBusiness.facebookUrl || "",
                      logoUrl: activeBusiness.logoUrl || "",
                      bannerUrl: activeBusiness.bannerUrl || "",
                      currency: activeBusiness.currency || "PEN",
                      isPublished: activeBusiness.isPublished,
                      manualStatus: activeBusiness.manualStatus,
                    });
                  }
                }}
                className="rounded-xl border-sand"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {!isCreating && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información general */}
          <section className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-coffee">Información general</h2>
              <p className="text-sm text-warm-gray">Los datos básicos de tu negocio.</p>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name" className="text-coffee">Nombre</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className="text-coffee">Slug</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    disabled
                    className="mt-1.5 rounded-xl border-sand bg-sand/30 text-warm-gray"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-coffee">Descripción</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="whatsapp" className="text-coffee">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={form.whatsappNumber}
                    onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                    className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-coffee">Dirección</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Imágenes */}
          <section className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-coffee">Imágenes</h2>
              <p className="text-sm text-warm-gray">Logo y banner de tu carta digital.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label className="text-coffee">Logo</Label>
                <div className="mt-1.5">
                  <ImageUpload
                    value={form.logoUrl}
                    onChange={(url) => setForm({ ...form, logoUrl: url })}
                  />
                </div>
              </div>
              <div>
                <Label className="text-coffee">Banner</Label>
                <div className="mt-1.5">
                  <ImageUpload
                    value={form.bannerUrl}
                    onChange={(url) => setForm({ ...form, bannerUrl: url })}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Redes sociales */}
          <section className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-coffee">Redes sociales</h2>
              <p className="text-sm text-warm-gray">Enlaces que aparecerán en tu carta pública.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="instagram" className="text-coffee">Instagram</Label>
                <Input
                  id="instagram"
                  value={form.instagramUrl}
                  onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                />
              </div>
              <div>
                <Label htmlFor="facebook" className="text-coffee">Facebook</Label>
                <Input
                  id="facebook"
                  value={form.facebookUrl}
                  onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                />
              </div>
              <div>
                <Label htmlFor="tiktok" className="text-coffee">TikTok</Label>
                <Input
                  id="tiktok"
                  value={form.tiktokUrl}
                  onChange={(e) => setForm({ ...form, tiktokUrl: e.target.value })}
                  placeholder="https://tiktok.com/@..."
                  className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                />
              </div>
              <div>
                <Label htmlFor="maps" className="text-coffee">Google Maps</Label>
                <Input
                  id="maps"
                  value={form.googleMapsUrl}
                  onChange={(e) => setForm({ ...form, googleMapsUrl: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
                />
              </div>
            </div>
          </section>

          {/* Configuración */}
          <section className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-coffee">Configuración</h2>
              <p className="text-sm text-warm-gray">Visibilidad y estado de tu carta.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-cream/40 p-4">
                <div>
                  <Label htmlFor="published" className="text-coffee">Publicado</Label>
                  <p className="text-sm text-warm-gray">
                    Tu página pública estará visible para los clientes.
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={form.isPublished}
                  onCheckedChange={(checked) => setForm({ ...form, isPublished: checked })}
                />
              </div>
              <div>
                <Label htmlFor="status" className="text-coffee">Estado manual</Label>
                <div className="relative mt-1.5">
                  <select
                    id="status"
                    value={form.manualStatus}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        manualStatus: e.target.value as "AUTO" | "OPEN" | "CLOSED",
                      })
                    }
                    className="w-full appearance-none rounded-xl border border-sand bg-cream/40 px-3 py-2.5 pr-8 text-sm text-coffee focus-visible:border-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/30"
                  >
                    <option value="AUTO">Automático (según horarios)</option>
                    <option value="OPEN">Forzar abierto</option>
                    <option value="CLOSED">Forzar cerrado</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateBusiness.isPending}
              className="bg-terracotta text-white shadow-sm transition-colors hover:bg-terracotta-deep"
            >
              {updateBusiness.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
