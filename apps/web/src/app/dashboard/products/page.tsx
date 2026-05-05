"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Copy, Trash2, UtensilsCrossed, ArrowRight } from "lucide-react";
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
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (!activeBusinessId) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand/60">
          <UtensilsCrossed className="h-8 w-8 text-warm-gray" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-coffee">Selecciona un negocio</p>
          <p className="max-w-xs text-sm leading-relaxed text-warm-gray">
            Necesitas tener un negocio activo para gestionar tus productos.
          </p>
        </div>
        <Link
          href="/dashboard/business"
          className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-terracotta-deep"
        >
          Ir a Mi Negocio <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-coffee">Productos</h1>
          <p className="mt-1 text-sm text-warm-gray">
            Gestiona el menú de tu carta digital.
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="bg-terracotta text-white shadow-sm transition-colors hover:bg-terracotta-deep">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo producto
          </Button>
        </Link>
      </div>

      {products?.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-sand bg-white py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sand/40">
            <UtensilsCrossed className="h-6 w-6 text-warm-gray" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-coffee">Sin productos aún</p>
            <p className="max-w-xs text-sm text-warm-gray">
              Agrega productos a tu menú para que tus clientes puedan hacer pedidos.
            </p>
          </div>
          <Link href="/dashboard/products/new">
            <Button variant="outline" className="rounded-xl border-sand">
              <Plus className="mr-2 h-4 w-4" />
              Agregar primer producto
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
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
              className="flex items-center gap-4 rounded-xl border border-sand bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-cream">
                  <UtensilsCrossed className="h-6 w-6 text-warm-gray/50" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-coffee truncate">{product.name}</h3>
                  {!product.isAvailable && (
                    <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px]">Agotado</Badge>
                  )}
                  {!product.isVisible && (
                    <Badge variant="outline" className="border-sand text-warm-gray text-[10px]">Oculto</Badge>
                  )}
                </div>
                <p className="text-sm text-warm-gray">
                  {getCategoryName(product.categoryId)} · S/ {Number(product.basePrice || 0).toFixed(2)}
                </p>
                {product.tags?.length > 0 && (
                  <div className="mt-1 flex gap-1 flex-wrap">
                    {product.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="border-sand text-[10px] text-warm-gray">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDuplicate(product.id)}
                  className="h-8 w-8 rounded-lg text-warm-gray hover:bg-sand/60 hover:text-coffee"
                  aria-label="Duplicar producto"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Link href={`/dashboard/products/${product.id}/edit`}>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-8 w-8 rounded-lg text-warm-gray hover:bg-sand/60 hover:text-coffee"
                    aria-label="Editar producto"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(product.id)}
                  className="h-8 w-8 rounded-lg text-warm-gray hover:bg-red-50 hover:text-red-600"
                  aria-label="Eliminar producto"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
