"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts, useDeleteProduct, useDuplicateProduct } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useDashboardStore } from "@/stores/dashboard";

export default function ProductsPage() {
  const { activeBusinessId } = useDashboardStore();
  const { data: products, isLoading } = useProducts(activeBusinessId ?? undefined);
  const { data: categories } = useCategories(activeBusinessId ?? undefined);
  const deleteProduct = useDeleteProduct();
  const duplicateProduct = useDuplicateProduct();

  const getCategoryName = (categoryId: string) => {
    return categories?.find((c: { id: string; name: string }) => c.id === categoryId)?.name || "Sin categoría";
  };

  const handleDelete = async (id: string) => {
    if (!activeBusinessId) return;
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await deleteProduct.mutateAsync({ businessId: activeBusinessId, id });
      toast.success("Producto eliminado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar");
    }
  };

  const handleDuplicate = async (id: string) => {
    if (!activeBusinessId) return;
    try {
      await duplicateProduct.mutateAsync({ businessId: activeBusinessId, id });
      toast.success("Producto duplicado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al duplicar");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!activeBusinessId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Selecciona un negocio para gestionar productos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo producto
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {products?.map((product: {
          id: string;
          name: string;
          description?: string;
          basePrice: number;
          imageUrl?: string;
          isVisible: boolean;
          isAvailable: boolean;
          tags: string[];
          categoryId: string;
        }) => (
          <div
            key={product.id}
            className="flex items-center gap-4 rounded-lg border bg-card p-4"
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-16 w-16 rounded-md object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
                <span className="text-xs text-muted-foreground">Sin foto</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">{product.name}</h3>
                {!product.isAvailable && (
                  <Badge variant="destructive">Agotado</Badge>
                )}
                {!product.isVisible && (
                  <Badge variant="secondary">Oculto</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {getCategoryName(product.categoryId)} · S/ {product.basePrice}
              </p>
              <div className="mt-1 flex gap-1">
                {product.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDuplicate(product.id)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Link href={`/dashboard/products/${product.id}/edit`}>
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(product.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
