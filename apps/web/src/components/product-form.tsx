"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
      <section className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-coffee">Información del producto</h2>
          <p className="text-sm text-warm-gray">Los datos básicos que verán tus clientes.</p>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="category" className="text-coffee">Categoría</Label>
            <div className="relative mt-1.5">
              <select
                id="category"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full appearance-none rounded-xl border border-sand bg-cream/40 px-3 py-2.5 pr-8 text-sm text-coffee focus-visible:border-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/30"
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
          </div>
          <div>
            <Label htmlFor="name" className="text-coffee">Nombre</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
            />
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
          <div>
            <Label htmlFor="price" className="text-coffee">Precio (PEN)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
              required
              className="mt-1.5 rounded-xl border-sand bg-cream/40 focus-visible:border-terracotta focus-visible:ring-terracotta/30"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-coffee">Imagen</h2>
          <p className="text-sm text-warm-gray">Una foto atractiva aumenta los pedidos.</p>
        </div>
        <ImageUpload
          value={form.imageUrl}
          onChange={(url) => setForm({ ...form, imageUrl: url })}
        />
      </section>

      <section className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-coffee">Etiquetas</h2>
          <p className="text-sm text-warm-gray">Destaca características especiales del producto.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TAGS.map((tag) => {
            const isActive = form.tags.includes(tag.value as typeof form.tags[number]);
            return (
              <button
                key={tag.value}
                type="button"
                onClick={() => toggleTag(tag.value as typeof form.tags[number])}
                className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-terracotta text-white"
                    : "border border-sand bg-cream text-warm-gray hover:bg-sand/60"
                }`}
              >
                {isActive && <Check className="h-3 w-3" />}
                {tag.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-coffee">Visibilidad</h2>
          <p className="text-sm text-warm-gray">Controla si el producto aparece en tu carta.</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-cream/40 p-4">
            <div>
              <Label htmlFor="visible" className="text-coffee">Visible en menú</Label>
              <p className="text-sm text-warm-gray">Mostrar este producto en la página pública.</p>
            </div>
            <Switch
              id="visible"
              checked={form.isVisible}
              onCheckedChange={(checked) => setForm({ ...form, isVisible: checked })}
            />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-cream/40 p-4">
            <div>
              <Label htmlFor="available" className="text-coffee">Disponible</Label>
              <p className="text-sm text-warm-gray">Marca como agotado si no está disponible temporalmente.</p>
            </div>
            <Switch
              id="available"
              checked={form.isAvailable}
              onCheckedChange={(checked) => setForm({ ...form, isAvailable: checked })}
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/products")}
          className="rounded-xl border-sand"
        >
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={createProduct.isPending || updateProduct.isPending}
          className="bg-terracotta text-white shadow-sm transition-colors hover:bg-terracotta-deep"
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
