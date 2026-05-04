---
name: Mesa.pe
description: Sistema visual para la carta digital y dashboard de Mesa.pe. Cálido, editorial y peruano.
colors:
  terracotta: "#C25E3A"
  terracotta-deep: "#A3492D"
  cream: "#FDF8F3"
  coffee: "#2A211E"
  coffee-deep: "#1a1513"
  moss: "#4A6B5D"
  warm-gray: "#7D6F65"
  sand: "#EDE6DE"
  white: "#FFFFFF"
typography:
  display:
    fontFamily: "Playfair Display, ui-serif, Georgia, serif"
    fontSize: "clamp(2.5rem, 5vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Playfair Display, ui-serif, Georgia, serif"
    fontSize: "clamp(2rem, 4vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.15em"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
  "2xl": "1.125rem"
  "3xl": "1.375rem"
components:
  button-primary:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.terracotta-deep}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1.25rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.coffee}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1.25rem"
  card-default:
    backgroundColor: "{colors.white}"
    textColor: "{colors.coffee}"
    rounded: "{rounded.2xl}"
    padding: "1.5rem"
  input-default:
    backgroundColor: "transparent"
    textColor: "{colors.coffee}"
    rounded: "{rounded.lg}"
    padding: "0.25rem 0.625rem"
---

# Design System: Mesa.pe

## 1. Overview

**North Star creativo: "La Carta Artesanal"**

Un sistema visual que se siente como una carta de restaurante hecha a mano en papel artesanal. Tipografía editorial que da autoridad, colores cálidos que evocan adobe peruano y cerámica, y formas generosas que acogen al usuario. Rechaza la frialdad del SaaS corporativo y la saturación de las apps de delivery.

La interfaz no compite con la comida; la enmarca. Cada superficie respira. La jerarquía tipográfica guía sin gritar. Los colores cálidos establecen confianza inmediata, como entrar a un local familiar en Lima.

**Key Characteristics:**
- Editorial tipográfica con serif display + sans body
- Paleta cálida de terracota, crema y café; sin negros puros ni blancos puros
- Formas redondeadas generosas (6px–22px), nunca afiladas
- Elevación plana por defecto; sombras solo como respuesta a estado
- Movimiento sutil con ease-out-quart, nunca elástico ni con rebote

## 2. Colors

Paleta cálida y terrosa, inspirada en la cerámica peruana y el adobe de barrio.

### Primary
- **Terracota Caliente** (#C25E3A): Color de acción principal. Botones CTA, acentos tipográficos, badges de éxito. Usado con moderación; su rareza es el punto.
- **Terracota Profundo** (#A3492D): Estado hover del primario. Textura de arcilla cocida.

### Secondary
- **Musgo Andino** (#4A6B5D): Indicadores de estado positivo, checks, iconos de confirmación. Contraste orgánico contra la calidez del terracota.

### Neutral
- **Café Oscuro** (#2A211E): Texto principal y encabezados. Tinte cálido, nunca negro puro.
- **Café Profundo** (#1a1513): Estado hover de superficies oscuras. Usado con extrema moderación.
- **Crema** (#FDF8F3): Fondo principal de la landing y secciones cálidas. Tinte hacia el terracota.
- **Blanco** (#FFFFFF): Fondo de cards y superficies elevadas.
- **Gris Cálido** (#7D6F65): Texto secundario, descripciones, metadatos. Siempre legible sobre crema o blanco.
- **Arena** (#EDE6DE): Bordes sutiles, divisores, fondos de elementos inactivos. El pegamento visual del sistema.

### Named Rules
**La Regla del Acento Escaso.** El terracota ocupa ≤10% de cualquier pantalla. Su rareza es el punto. Nunca lo uses como fondo de sección completa; el hero CTA es la única excepción controlada.

## 3. Typography

**Display Font:** Playfair Display (con ui-serif, Georgia, serif)
**Body Font:** DM Sans (con ui-sans-serif, system-ui, sans-serif)

**Carácter:** La combinación editorial da autoridad sin rigidez. Playfair aporta el gesto de una carta escrita a mano; DM Sans mantiene la legibilidad en interfaces densas.

### Hierarchy
- **Display** (semibold, clamp(2.5rem, 5vw, 3.25rem), line-height 1.15, tracking -0.02em): Títulos hero de landing. Solo en h1.
- **Headline** (semibold, clamp(2rem, 4vw, 2.5rem), line-height 1.2, tracking -0.01em): Títulos de sección (Features, Pricing, FAQ).
- **Title** (semibold, 1.25rem, line-height 1.3): Títulos de card, nombres de producto, subtítulos de dashboard.
- **Body** (regular, 1rem, line-height 1.6): Párrafos, descripciones, contenido de formularios. Máximo 70ch.
- **Label** (medium, 0.75rem, line-height 1.4, letter-spacing 0.15em, uppercase): Etiquetas de sección ("Funciones", "Precios", "FAQ"), metadata, badges.

### Named Rules
**La Regla de la Cursiva Reservada.** La cursiva de Playfair Display se usa solo para énfasis dentro de display/headline, nunca en body ni en labels. Máximo una palabra por título.

## 4. Elevation

El sistema es plano por defecto. La profundidad se comunica mediante tonalidad (capas de crema/blanco/arena) y bordes sutiles, no mediante sombras agresivas. Las sombras aparecen únicamente como respuesta a estado: hover en cards, elevación de modales.

### Shadow Vocabulary
- **Sombra de Respuesta** (`box-shadow: 0 10px 15px -3px rgba(42, 33, 30, 0.08), 0 4px 6px -4px rgba(42, 33, 30, 0.04)`): Hover en cards y botones. Sutil, nunca dramática.
- **Sombra de Superposición** (`box-shadow: 0 25px 50px -12px rgba(42, 33, 30, 0.15)`): Modales, sheets, dropdowns. La única sombra profunda permitida.

### Named Rules
**La Regla de la Plancha.** Las superficies están planas en reposo. Si una card tiene sombra sin que el usuario interactúe con ella, está mal.

## 5. Components

### Buttons
- **Shape:** Redondeado generoso (10px / `rounded-lg`). Botones principales son `pill` (completamente redondeados) en la landing; `rounded-lg` en el dashboard.
- **Primary:** Fondo terracota, texto blanco, padding 0.5rem 1.25rem. Peso medium.
- **Hover / Focus:** Fondo cambia a terracota profundo. Transición 0.2s ease-out.
- **Outline / Ghost:** Borde café oscuro o arena, fondo transparente. Hover invierte a fondo café con texto crema.
- **Destructive:** Fondo rojo tenue (destructive/10), texto rojo intenso. Nunca fondo rojo sólido.

### Cards / Containers
- **Corner Style:** 18px / `rounded-xl`. Generoso pero no circular.
- **Background:** Blanco sobre fondo crema; o crema sobre blanco.
- **Shadow Strategy:** Ninguna en reposo. Sombra de respuesta en hover.
- **Border:** 1px arena (#EDE6DE) cuando está sobre fondo crema. Sin borde cuando está sobre blanco.
- **Internal Padding:** 1.5rem (24px) por defecto; 1rem (16px) para cards compactas (`size="sm"`).

### Inputs / Fields
- **Style:** Borde 1px arena (#EDE6DE), fondo transparente, esquinas 10px (`rounded-lg`).
- **Focus:** Borde cambia a gris cálido medio, anillo sutil de 3px con opacidad 50%.
- **Error:** Borde rojo destructivo, anillo rojo tenue. Nunca fondo rojo.

### Navigation
- **Landing:** Sticky top, fondo crema/80 con backdrop-blur, borde inferior arena/60. Links con hover a café oscuro.
- **Dashboard:** Fondo blanco/95 con backdrop-blur, borde inferior border-color. Sidebar con fondo muted/30, items con fondo primary en estado activo.
- **Mobile:** Sidebar colapsa a bottom nav o hamburger. Sin cambios de color.

### [Signature Component: Phone Mock]
El mock de celular en el hero es distintivo: aspect-ratio 9/17, borde grueso café oscuro (5px), notch simulado, contenido de carta digital con cards internas de crema. Usado únicamente en la landing.

## 6. Do's and Don'ts

### Do:
- **Do** usar crema (#FDF8F3) como fondo de sección cálida y blanco (#FFFFFF) para cards flotantes.
- **Do** mantener el terracota en ≤10% de la superficie visible por pantalla.
- **Do** usar Playfair Display en cursiva para una sola palabra de énfasis en títulos de sección.
- **Do** respetar 70ch máximo en bloques de texto body.
- **Do** usar sombras solo en estado hover o superposición activa.

### Don't:
- **Don't** usar gradientes azul-morado, ilustraciones de personas sonriendo en oficinas, o copy en inglés. PRODUCT.md prohíbe el look de SaaS corporativo genérico.
- **Don't** usar bordes laterales gruesos como acento en cards o listas (side-stripe borders).
- **Don't** usar texto con degradado (`background-clip: text`). Énfasis mediante peso o tamaño, nunca mediante gradiente.
- **Don't** usar glassmorphism decorativo. Blur solo con propósito funcional (backdrop-blur en nav sticky).
- **Don't** usar el template de hero-metric (número grande + label pequeño + stats + gradiente). PRODUCT.md rechaza los clichés de landing SaaS.
- **Don't** usar grids de cards idénticas con icono + título + texto repetidos sin variación.
- **Don't** abrir un modal como primera opción. Agota alternativas inline y progresivas primero.
