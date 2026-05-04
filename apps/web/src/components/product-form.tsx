"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/image-upload";
import { useCategories } from "@/hooks/use-categories";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-products";
import { useDashboardStore } from "@/stores/dashboard";

const AVAILABLE_TAGS = [
  { value: "new", label: "Nuevo" },
  { value: "popular", label: "Popular" },
  { value: "promo", label: "Promo" },
  { value: "vegetarian", label: "Vegetariano" },
  { value: "spicy", label: "Picante" },
];

interface ProductFormProps {
  initialData?: {
    id: string;
    categoryId: string;
    name: string;
    description?: string;
    basePrice: number;
    imageUrl?: string;
    isVisible: boolean;
    isAvailable: boolean;
    tags: string[];
  };
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const { activeBusinessId } = useDashboardStore();
  const { data: categories } = useCategories(activeBusinessId ?? undefined);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [form, setForm] = useState<{
    categoryId: string;
    name: string;
    description: string;
    basePrice: string;
    imageUrl: string;
    isVisible: boolean;
    isAvailable: boolean;
    tags: ("new" | "popular" | "promo" | "vegetarian" | "spicy")[];
  }>({
    categoryId: initialData?.categoryId || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    basePrice: initialData?.basePrice?.toString() || "",
    imageUrl: initialData?.imageUrl || "",
    isVisible: initialData?.isVisible ?? true,
    isAvailable: initialData?.isAvailable ?? true,
    tags: (initialData?.tags || []) as ("new" | "popular" | "promo" | "vegetarian" | "spicy")[],
  });

  const toggleTag = (tag: "new" | "popular" | "promo" | "vegetarian" | "spicy") => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusinessId) return;

    const data = {
      ...form,
      basePrice: parseFloat(form.basePrice),
    };

    try {
      if (initialData) {
        await updateProduct.mutateAsync({
          businessId: activeBusinessId,
          id: initialData.id,
          data,
        });
        toast.success("Producto actualizado");
      } else {
        await createProduct.mutateAsync({
          businessId: activeBusinessId,
          data,
        });
        toast.success("Producto creado");
      }
      router.push("/dashboard/products");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="category">Categoría</Label>
            <select
              id="category"
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              required
            >
              <option value="">Seleccionar categoría</option>
              {categories?.map((cat: { id: string; name: string }) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
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
          <div>
            <Label htmlFor="price">Precio (PEN)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={form.basePrice}
              onChange={(e) =>
                setForm({ ...form, basePrice: e.target.value })
              }
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imagen</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Etiquetas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => (
              <button
                key={tag.value}
                type="button"
                onClick={() => toggleTag(tag.value as typeof form.tags[number])}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  form.tags.includes(tag.value as typeof form.tags[number])
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibilidad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="visible">Visible en menú</Label>
              <p className="text-sm text-muted-foreground">
                Mostrar este producto en la página pública
              </p>
            </div>
            <Switch
              id="visible"
              checked={form.isVisible}
              onCheckedChange={(checked) =>
                setForm({ ...form, isVisible: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="available">Disponible</Label>
              <p className="text-sm text-muted-foreground">
                Marcar como agotado si no está disponible
              </p>
            </div>
            <Switch
              id="available"
              checked={form.isAvailable}
              onCheckedChange={(checked) =>
                setForm({ ...form, isAvailable: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/products")}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={createProduct.isPending || updateProduct.isPending}
        >
          {(createProduct.isPending || updateProduct.isPending) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          <Save className="mr-2 h-4 w-4" />
          Guardar producto
        </Button>
      </div>
    </form>
  );
}
