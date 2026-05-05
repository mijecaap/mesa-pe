import { ProductForm } from "@/components/product-form";

export default function NewProductPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-coffee">Nuevo producto</h1>
        <p className="mt-1 text-sm text-warm-gray">Agrega un producto a tu menú.</p>
      </div>
      <ProductForm />
    </div>
  );
}
