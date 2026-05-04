"use client";

import { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  useBusinesses,
  useCreateBusiness,
  useUpdateBusiness,
} from "@/hooks/use-business";
import { useDashboardStore } from "@/stores/dashboard";
import { ImageUpload } from "@/components/image-upload";

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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!businesses || businesses.length === 0) {
    if (!isCreating) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-semibold mb-2">
            No tienes ningún negocio
          </h2>
          <p className="text-muted-foreground mb-6">
            Crea tu primer negocio para empezar.
          </p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Crear negocio
          </Button>
        </div>
      );
    }

    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Crear negocio</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="mi-restaurante"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Solo letras minúsculas, números y guiones.
              </p>
            </div>
            <div>
              <Label htmlFor="name">Nombre del negocio</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Mi Restaurante"
                required
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={form.whatsappNumber}
                onChange={(e) =>
                  setForm({ ...form, whatsappNumber: e.target.value })
                }
                placeholder="+51 999 999 999"
                required
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={createBusiness.isPending}>
              {createBusiness.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Crear negocio
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreating(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mi Negocio</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo negocio
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información general</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={form.slug} disabled />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={form.whatsappNumber}
                  onChange={(e) =>
                    setForm({ ...form, whatsappNumber: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imágenes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Logo</Label>
              <ImageUpload
                value={form.logoUrl}
                onChange={(url) => setForm({ ...form, logoUrl: url })}
              />
            </div>
            <div>
              <Label>Banner</Label>
              <ImageUpload
                value={form.bannerUrl}
                onChange={(url) => setForm({ ...form, bannerUrl: url })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redes sociales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={form.instagramUrl}
                  onChange={(e) =>
                    setForm({ ...form, instagramUrl: e.target.value })
                  }
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={form.facebookUrl}
                  onChange={(e) =>
                    setForm({ ...form, facebookUrl: e.target.value })
                  }
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <Label htmlFor="tiktok">TikTok</Label>
                <Input
                  id="tiktok"
                  value={form.tiktokUrl}
                  onChange={(e) =>
                    setForm({ ...form, tiktokUrl: e.target.value })
                  }
                  placeholder="https://tiktok.com/@..."
                />
              </div>
              <div>
                <Label htmlFor="maps">Google Maps</Label>
                <Input
                  id="maps"
                  value={form.googleMapsUrl}
                  onChange={(e) =>
                    setForm({ ...form, googleMapsUrl: e.target.value })
                  }
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="published">Publicado</Label>
                <p className="text-sm text-muted-foreground">
                  Tu página pública estará visible
                </p>
              </div>
              <Switch
                id="published"
                checked={form.isPublished}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isPublished: checked })
                }
              />
            </div>
            <div>
              <Label htmlFor="status">Estado manual</Label>
              <select
                id="status"
                value={form.manualStatus}
                onChange={(e) =>
                  setForm({
                    ...form,
                    manualStatus: e.target.value as "AUTO" | "OPEN" | "CLOSED",
                  })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="AUTO">Automático (según horarios)</option>
                <option value="OPEN">Forzar abierto</option>
                <option value="CLOSED">Forzar cerrado</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={updateBusiness.isPending}>
            {updateBusiness.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
