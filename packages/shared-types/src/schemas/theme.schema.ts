import { z } from "zod";

export const themePresetSchema = z.enum([
  "terracotta",
  "ocean",
  "forest",
  "midnight",
  "custom",
]);

export const fontFamilySchema = z.enum(["sans", "serif", "mono"]);

export const businessThemeSchema = z.object({
  preset: themePresetSchema,
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Debe ser un color HEX válido"),
  backgroundColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Debe ser un color HEX válido"),
  textColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Debe ser un color HEX válido"),
  accentColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Debe ser un color HEX válido"),
  fontFamily: fontFamilySchema.default("sans"),
});

export type BusinessTheme = z.infer<typeof businessThemeSchema>;
export type ThemePreset = z.infer<typeof themePresetSchema>;
export type FontFamily = z.infer<typeof fontFamilySchema>;
