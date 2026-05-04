"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Upload, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Solo se permiten imágenes JPG, PNG o WebP");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen debe ser menor a 5MB");
        return;
      }

      setIsUploading(true);

      try {
        // Get presigned URL
        const presignedRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/media/presigned-url`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type,
              fileSize: file.size,
            }),
          },
        );

        if (!presignedRes.ok) throw new Error("Error al obtener URL de subida");
        const { presignedUrl, key } = await presignedRes.json();

        // Upload to R2
        await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        // Confirm upload
        const confirmRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/media/confirm`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key }),
          },
        );

        if (!confirmRes.ok) throw new Error("Error al confirmar subida");
        const { publicUrl } = await confirmRes.json();

        onChange(publicUrl);
        toast.success("Imagen subida correctamente");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error al subir imagen");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange],
  );

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
          <img
            src={value}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex aspect-video w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted">
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="mt-2 text-sm text-muted-foreground">
                Click para subir imagen
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
