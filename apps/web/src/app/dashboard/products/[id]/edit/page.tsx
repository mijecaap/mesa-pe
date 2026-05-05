"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProductForm } from "@/components/product-form";
import { useProducts } from "@/hooks/use-products";
import { useDashboardStore } from "@/stores/dashboard";

export default function EditProductPage() {
  const params = useParams();
  const { activeBusinessId } = useDashboardStore();
  const { data: products, isLoading } = useProducts(activeBusinessId ?? undefined);

  const product = products?.find((p: { id: string }) => p.id === params.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-lg font-semibold text-coffee">Producto no encontrado</p>
        <p className="text-sm text-warm-gray">El producto que buscas no existe o fue eliminado.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-coffee">Editar producto</h1>
        <p className="mt-1 text-sm text-warm-gray">Actualiza la información de {product.name}.</p>
      </div>
      <ProductForm initialData={product} />
    </div>
  );
}
