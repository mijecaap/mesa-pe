import { ProductForm } from "@/components/product-form";

export default function NewProductPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Nuevo producto</h1>
      <ProductForm />
    </div>
  );
}
