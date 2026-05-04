# Mesa.pe — Documentación de Estrategia

## 1. Visión y Objetivos de Negocio

**Producto:** SaaS mobile-first para presencia digital, carta online, QR, pedidos por WhatsApp, página pública, analítica y herramientas comerciales para cafeterías, dark kitchens y restaurantes pequeños en Perú.

**Promesa Principal:**

> _"Tu carta, web, QR y pedidos por WhatsApp listos para vender en menos de 30 minutos."_

**Objetivo de Negocio (MVP):**

- Conseguir los primeros **10 negocios pagos** dentro de los primeros 60 a 90 días posteriores al MVP.
- Generar ingresos recurrentes mediante suscripciones mensuales.

**Segmento inicial:** Cafeterías, pastelerías, sangucherías, juguerías, dark kitchens de 1 marca y negocios de comida rápida local que ya reciben pedidos por WhatsApp/Instagram pero tienen la carta desordenada o desactualizada.

**Diferenciadores clave:**

1. Perú-first (soles, Yape/Plin, WhatsApp, lenguaje local).
2. Diseño superior mobile-first.
3. SEO local y optimización para Google Business Profile.
4. Pedidos por WhatsApp sin fricción (sin login obligatorio para el comprador).
5. Analytics accionable para el dueño.

---

## 2. Estructura de Documentación

Esta carpeta `docs/` contiene toda la estrategia y planificación del producto:

| Archivo                     | Contenido                                       |
| --------------------------- | ----------------------------------------------- |
| `01-introduccion.md`        | Visión, objetivos y diferenciadores             |
| `02-stack-tecnico.md`       | Stack tecnológico completo y justificación      |
| `03-arquitectura.md`        | Arquitectura de sistemas, flujos y seguridad    |
| `04-modelo-datos.md`        | Modelo de datos Prisma y relaciones             |
| `05-plan-sprints.md`        | Plan de implementación por sprints (6 semanas)  |
| `06-roadmap.md`             | Roadmap post-MVP y evolución del producto       |
| `07-go-to-market.md`        | Estrategia de salida al mercado y precios       |
| `08-decisiones-tecnicas.md` | Decisiones técnicas importantes y justificación |
| `TODO.md`                   | Lista de tareas y control de progreso           |

---

## 3. Principios de Desarrollo

1. **Mobile-first:** Tanto la página pública como el dashboard deben funcionar perfectamente en celular.
2. **Multi-tenant desde el día 1:** Todas las entidades privadas están asociadas a `businessId`.
3. **Seguridad por diseño:** Validación de tenant en todos los endpoints privados.
4. **Performance:** Página pública con Lighthouse Performance objetivo 85+ en móvil.
5. **SEO-first:** Cada página pública debe tener metadatos únicos, Open Graph y datos estructurados.
