"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Palette,
  Eye,
  Check,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBusiness, useUpdateBusiness } from "@/hooks/use-business";
import { useDashboardStore } from "@/stores/dashboard";
import { themePresets, generateThemeVariables } from "@/lib/theme";
import { ThemePreview } from "@/components/theme-preview";
import type { BusinessTheme, ThemePreset } from "@mesa/shared-types";

const fontOptions = [
  { value: "sans", label: "Sans-serif", sample: "Aa" },
  { value: "serif", label: "Serif", sample: "Aa" },
  { value: "mono", label: "Monospace", sample: "Aa" },
];

function ThemePreviewCard({
  preset,
  isActive,
  onClick,
}: {
  preset: Exclude<ThemePreset, "custom">;
  isActive: boolean;
  onClick: () => void;
}) {
  const theme = themePresets[preset];
  const vars = generateThemeVariables(theme);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col gap-3 rounded-xl border p-4 text-left transition-all ${
        isActive
          ? "border-terracotta ring-2 ring-terracotta/20 shadow-md"
          : "border-sand hover:border-terracotta/40 hover:shadow-sm"
      }`}
    >
      {isActive && (
        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-white">
          <Check className="h-3 w-3" />
        </div>
      )}
      <div
        className="h-24 w-full rounded-lg border border-black/5"
        style={{ backgroundColor: vars["--theme-bg"] }}
      >
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <div
            className="h-6 w-16 rounded-full"
            style={{ backgroundColor: vars["--theme-primary"] }}
          />
          <div
            className="h-2 w-24 rounded-full"
            style={{ backgroundColor: vars["--theme-border"] }}
          />
          <div
            className="h-2 w-16 rounded-full"
            style={{ backgroundColor: vars["--theme-border"] }}
          />
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-coffee capitalize">
          {preset === "terracotta" ? "Terracota" : preset === "ocean" ? "Océano" : preset === "forest" ? "Bosque" : "Midnight"}
        </p>
        <p className="mt-0.5 text-xs text-warm-gray">
          {preset === "terracotta"
            ? "Cálido y acogedor"
            : preset === "ocean"
            ? "Fresco y profesional"
            : preset === "forest"
            ? "Natural y orgánico"
            : "Elegante y moderno"}
        </p>
      </div>
    </button>
  );
}

function DesignEditor({ business }: { business: { id: string; slug: string; name: string; theme: Record<string, unknown> | null } }) {
  const updateBusiness = useUpdateBusiness();

  const initialPreset = (business.theme?.preset as ThemePreset) || "terracotta";
  const initialCustom = business.theme?.preset === "custom";

  const [selectedPreset, setSelectedPreset] = useState<ThemePreset>(initialPreset);
  const [customColors, setCustomColors] = useState({
    primaryColor: (business.theme?.primaryColor as string) || "#C25E3A",
    backgroundColor: (business.theme?.backgroundColor as string) || "#FDF8F3",
    textColor: (business.theme?.textColor as string) || "#2A211E",
    accentColor: (business.theme?.accentColor as string) || "#4A6B5D",
  });
  const [fontFamily, setFontFamily] = useState<"sans" | "serif" | "mono">(
    (business.theme?.fontFamily as "sans" | "serif" | "mono") || "sans"
  );
  const [isCustom, setIsCustom] = useState(initialCustom);

  const previewTheme: BusinessTheme = isCustom
    ? {
        preset: "custom",
        ...customColors,
        fontFamily,
      }
    : {
        ...(themePresets as Record<string, BusinessTheme>)[selectedPreset],
        fontFamily,
      };

  const previewUrl = business?.slug ? `/${business.slug}` : "";

  const handleSave = async () => {
    try {
      await updateBusiness.mutateAsync({
        id: business.id,
        data: { theme: previewTheme },
      });
      toast.success("Diseño guardado correctamente");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    }
  };

  const handleReset = () => {
    setSelectedPreset("terracotta");
    setCustomColors({
      primaryColor: "#C25E3A",
      backgroundColor: "#FDF8F3",
      textColor: "#2A211E",
      accentColor: "#4A6B5D",
    });
    setFontFamily("sans");
    setIsCustom(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-coffee">
            Diseño
          </h1>
          <p className="mt-1 text-sm text-warm-gray">
            Personaliza los colores y la apariencia de tu carta digital.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-xl border-sand"
            onClick={handleReset}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Restablecer
          </Button>
          <Button
            className="bg-terracotta text-white hover:bg-terracotta-deep"
            onClick={handleSave}
            disabled={updateBusiness.isPending}
          >
            {updateBusiness.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Guardar cambios
          </Button>
        </div>
      </div>

      {/* Theme presets */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-coffee">
          Temas predefinidos
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(themePresets) as Exclude<ThemePreset, "custom">[]).map((preset) => (
            <ThemePreviewCard
              key={preset}
              preset={preset}
              isActive={!isCustom && selectedPreset === preset}
              onClick={() => {
                setSelectedPreset(preset);
                setIsCustom(false);
              }}
            />
          ))}
        </div>
      </section>

      {/* Custom colors */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-coffee">
            Colores personalizados
          </h2>
          <button
            type="button"
            onClick={() => setIsCustom(true)}
            className={`text-xs font-medium transition-colors ${
              isCustom ? "text-terracotta" : "text-warm-gray hover:text-coffee"
            }`}
          >
            {isCustom ? "Modo personalizado activo" : "Usar personalizado"}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-sand bg-white p-4">
            <Label className="text-sm font-medium text-coffee">
              Color primario
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColors.primaryColor}
                onChange={(e) => {
                  setCustomColors((prev) => ({ ...prev, primaryColor: e.target.value }));
                  setIsCustom(true);
                }}
                className="h-10 w-10 cursor-pointer rounded-lg border border-sand bg-transparent p-0.5"
              />
              <input
                type="text"
                value={customColors.primaryColor}
                onChange={(e) => {
                  setCustomColors((prev) => ({ ...prev, primaryColor: e.target.value }));
                  setIsCustom(true);
                }}
                className="w-24 rounded-lg border border-sand px-2 py-1.5 text-xs font-mono text-coffee focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta/30"
              />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-sand bg-white p-4">
            <Label className="text-sm font-medium text-coffee">
              Color de fondo
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColors.backgroundColor}
                onChange={(e) => {
                  setCustomColors((prev) => ({ ...prev, backgroundColor: e.target.value }));
                  setIsCustom(true);
                }}
                className="h-10 w-10 cursor-pointer rounded-lg border border-sand bg-transparent p-0.5"
              />
              <input
                type="text"
                value={customColors.backgroundColor}
                onChange={(e) => {
                  setCustomColors((prev) => ({ ...prev, backgroundColor: e.target.value }));
                  setIsCustom(true);
                }}
                className="w-24 rounded-lg border border-sand px-2 py-1.5 text-xs font-mono text-coffee focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta/30"
              />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-sand bg-white p-4">
            <Label className="text-sm font-medium text-coffee">
              Color de texto
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColors.textColor}
                onChange={(e) => {
                  setCustomColors((prev) => ({ ...prev, textColor: e.target.value }));
                  setIsCustom(true);
                }}
                className="h-10 w-10 cursor-pointer rounded-lg border border-sand bg-transparent p-0.5"
              />
              <input
                type="text"
                value={customColors.textColor}
                onChange={(e) => {
                  setCustomColors((prev) => ({ ...prev, textColor: e.target.value }));
                  setIsCustom(true);
                }}
                className="w-24 rounded-lg border border-sand px-2 py-1.5 text-xs font-mono text-coffee focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta/30"
              />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-sand bg-white p-4">
            <Label className="text-sm font-medium text-coffee">
              Color de acento
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColors.accentColor}
                onChange={(e) => {
                  setCustomColors((prev) => ({ ...prev, accentColor: e.target.value }));
                  setIsCustom(true);
                }}
                className="h-10 w-10 cursor-pointer rounded-lg border border-sand bg-transparent p-0.5"
              />
              <input
                type="text"
                value={customColors.accentColor}
                onChange={(e) => {
                  setCustomColors((prev) => ({ ...prev, accentColor: e.target.value }));
                  setIsCustom(true);
                }}
                className="w-24 rounded-lg border border-sand px-2 py-1.5 text-xs font-mono text-coffee focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-coffee">
          Tipografía
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {fontOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFontFamily(opt.value as "sans" | "serif" | "mono")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                fontFamily === opt.value
                  ? "border-terracotta bg-terracotta/5 ring-1 ring-terracotta/20"
                  : "border-sand bg-white hover:border-terracotta/30"
              }`}
            >
              <span
                className="text-2xl font-bold text-coffee"
                style={{
                  fontFamily:
                    opt.value === "serif"
                      ? "Georgia, serif"
                      : opt.value === "mono"
                      ? "monospace"
                      : "system-ui, sans-serif",
                }}
              >
                {opt.sample}
              </span>
              <span className="text-xs font-medium text-warm-gray">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-coffee">
            Vista previa
          </h2>
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-terracotta hover:underline"
            >
              <Eye className="h-3.5 w-3.5" />
              Ver página pública
            </a>
          )}
        </div>

        <ThemePreview theme={previewTheme} businessName={business?.name} />
      </section>
    </div>
  );
}

export default function DesignPage() {
  const { activeBusinessId } = useDashboardStore();
  const { data: business, isLoading } = useBusiness(activeBusinessId ?? undefined);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (!activeBusinessId || !business) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand/60">
          <Palette className="h-8 w-8 text-warm-gray" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-coffee">
            Selecciona un negocio
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-warm-gray">
            Necesitas tener un negocio activo para personalizar su diseño.
          </p>
        </div>
      </div>
    );
  }

  return <DesignEditor key={business.id} business={business} />;
}
