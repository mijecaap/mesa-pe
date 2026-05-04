"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { OnboardingShell } from "../onboarding-shell";
import { useCreateProduct } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { ImageUpload } from "@/components/image-upload";

interface ProductStepProps {
  businessId: string;
  onNext: () => void;
  onBack: () => void;
}

export function ProductStep({ businessId, onNext, onBack }: ProductStepProps) {
  const createProduct = useCreateProduct();
  const { data: categories } = useCategories(businessId);
  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    basePrice: "",
    imageUrl: "",
    isVisible: true,
    isAvailable: true,
    tags: [] as string[],
  });

  const handleSubmit = async () => {
    if (!form.name || !form.categoryId || !form.basePrice) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    try {
      await createProduct.mutateAsync({
        businessId,
        data: {
          categoryId: form.categoryId,
          name: form.name,
          description: form.description,
          basePrice: parseFloat(form.basePrice),
          imageUrl: form.imageUrl,
          isVisible: form.isVisible,
          isAvailable: form.isAvailable,
          tags: form.tags as ("new" | "popular" | "promo" | "vegetarian" | "spicy")[],
        },
      });
      toast.success("Producto creado");
      onNext();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear producto");
    }
  };

  return (
    <OnboardingShell
      step={4}
      title="Primer producto"
      description="Agrega tu primer producto a la carta."
      onNext={handleSubmit}
      onBack={onBack}
      nextDisabled={createProduct.isPending}
      isNextLoading={createProduct.isPending}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="prod-category">Categoría *</Label>
          <select
            id="prod-category"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
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
          <Label htmlFor="prod-name">Nombre del producto *</Label>
          <Input
            id="prod-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ej: Lomo Saltado"
          />
        </div>
        <div>
          <Label htmlFor="prod-desc">Descripción</Label>
          <Input
            id="prod-desc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Ingredientes o detalles"
          />
        </div>
        <div>
          <Label htmlFor="prod-price">Precio (PEN) *</Label>
          <Input
            id="prod-price"
            type="number"
            step="0.01"
            min="0"
            value={form.basePrice}
            onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label>Imagen</Label>
          <ImageUpload
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
          />
        </div>
      </div>
    </OnboardingShell>
  );
}
