import type { BusinessTheme, ThemePreset } from "@mesa/shared-types";

export interface ThemeCssVariables {
  "--theme-primary": string;
  "--theme-primary-hover": string;
  "--theme-bg": string;
  "--theme-surface": string;
  "--theme-text": string;
  "--theme-text-secondary": string;
  "--theme-text-muted": string;
  "--theme-accent": string;
  "--theme-border": string;
  "--theme-inverse-bg": string;
  "--theme-inverse-text": string;
  "--theme-inverse-text-secondary": string;
  "--theme-inverse-text-muted": string;
  "--theme-font-family": string;
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

function mixColors(color1: string, color2: string, ratio: number) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = c1.r * ratio + c2.r * (1 - ratio);
  const g = c1.g * ratio + c2.g * (1 - ratio);
  const b = c1.b * ratio + c2.b * (1 - ratio);
  return rgbToHex(r, g, b);
}

function isDarkColor(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return r * 0.299 + g * 0.587 + b * 0.114 < 128;
}

function darken(hex: string, amount: number) {
  return mixColors(hex, "#000000", 1 - amount);
}

export function generateThemeVariables(theme: BusinessTheme): ThemeCssVariables {
  const { primaryColor, backgroundColor, textColor, accentColor, fontFamily } = theme;

  const isDarkBg = isDarkColor(backgroundColor);

  return {
    "--theme-primary": primaryColor,
    "--theme-primary-hover": darken(primaryColor, 0.15),
    "--theme-bg": backgroundColor,
    "--theme-surface": isDarkBg
      ? mixColors(backgroundColor, "#ffffff", 0.92)
      : "#ffffff",
    "--theme-text": textColor,
    "--theme-text-secondary": mixColors(textColor, backgroundColor, 0.55),
    "--theme-text-muted": mixColors(textColor, backgroundColor, 0.35),
    "--theme-accent": accentColor,
    "--theme-border": mixColors(textColor, backgroundColor, 0.12),
    "--theme-inverse-bg": textColor,
    "--theme-inverse-text": backgroundColor,
    "--theme-inverse-text-secondary": mixColors(backgroundColor, textColor, 0.60),
    "--theme-inverse-text-muted": mixColors(backgroundColor, textColor, 0.40),
    "--theme-font-family": fontFamily === "serif" ? "Georgia, serif" : fontFamily === "mono" ? "monospace" : "system-ui, -apple-system, sans-serif",
  };
}

export const themePresets: Record<
  Exclude<ThemePreset, "custom">,
  BusinessTheme
> = {
  terracotta: {
    preset: "terracotta",
    primaryColor: "#C25E3A",
    backgroundColor: "#FDF8F3",
    textColor: "#2A211E",
    accentColor: "#4A6B5D",
    fontFamily: "sans",
  },
  ocean: {
    preset: "ocean",
    primaryColor: "#1E5A8A",
    backgroundColor: "#F5F8FA",
    textColor: "#1A202C",
    accentColor: "#2D8A7A",
    fontFamily: "sans",
  },
  forest: {
    preset: "forest",
    primaryColor: "#2D5A27",
    backgroundColor: "#F7F9F4",
    textColor: "#1C2416",
    accentColor: "#B8860B",
    fontFamily: "sans",
  },
  midnight: {
    preset: "midnight",
    primaryColor: "#E8A43A",
    backgroundColor: "#1A1A2E",
    textColor: "#F0F0F0",
    accentColor: "#4ECDC4",
    fontFamily: "sans",
  },
};

export function getThemeVariables(
  theme: Record<string, unknown> | null | undefined
): ThemeCssVariables {
  if (!theme) {
    return generateThemeVariables(themePresets.terracotta);
  }
  const preset = theme.preset as string;
  if (preset !== "custom" && themePresets[preset as Exclude<ThemePreset, "custom">]) {
    return generateThemeVariables(themePresets[preset as Exclude<ThemePreset, "custom">]);
  }
  return generateThemeVariables(theme as BusinessTheme);
}

export function variablesToStyle(
  vars: ThemeCssVariables
): React.CSSProperties {
  return vars as unknown as React.CSSProperties;
}
