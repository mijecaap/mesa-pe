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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Producto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Editar producto</h1>
      <ProductForm initialData={product} />
    </div>
  );
}
