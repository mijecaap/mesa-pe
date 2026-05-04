import { UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFCF8] px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F0EB]">
        <UtensilsCrossed className="h-10 w-10 text-[#8D817C]" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-[#2B2D42]">
        Página no encontrada
      </h1>
      <p className="max-w-sm text-[#8D817C]">
        El negocio que buscas no existe o aún no ha sido publicado.
      </p>
    </div>
  );
}
