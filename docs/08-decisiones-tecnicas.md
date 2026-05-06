# Mesa.pe — Decisiones Técnicas Importantes

## 1. ¿Monolito Next.js o Next.js + NestJS?

**Decisión:** Next.js + NestJS.

**Ventajas:**

- Backend más profesional y modular.
- Mejor arquitectura para escalabilidad.
- Más fácil demostrar skills backend en portafolio.
- Preparado para integraciones futuras (pagos, WhatsApp API, etc.).
- Encaja con Repository Pattern y arquitectura limpia.

**Desventaja:** Más complejidad inicial, pero manejable.

---

## 2. ¿REST o tRPC?

**Decisión:** REST.

**Motivos:**

- NestJS + Swagger queda claro y profesional.
- Más fácil de mostrar como API pública/documentada.
- Mejor si luego se integran apps externas o partners.
- Mayor adopción en el mercado laboral.

---

## 3. ¿Clerk o Better Auth?

**Decisión:** Clerk.

**Motivos:**

- Acelera el desarrollo del MVP (auth listo en horas, no días).
- Soporte nativo para organizaciones (multi-tenant).
- Webhooks para sincronización con backend.
- Menos código propio de mantenimiento.
- Permite enfocarse en el producto, no en reinventar auth.

**Consideración:** Si en el futuro se requiere control total o reducir costos de vendor, se puede migrar a Better Auth, pero Clerk es la decisión correcta para validar negocio rápido.

---

## 4. ¿Pagos desde el día 1?

**Decisión:** No. Sistema de suscripciones manual.

**Estrategia:**

- Para los primeros clientes: cobrar manualmente por Yape/Plin/transferencia.
- El dueño del negocio solicita upgrade desde `/dashboard/plan` y sube comprobante opcional a R2.
- El equipo Mesa.pe gestiona solicitudes desde `/dashboard/admin`: aprueba/rechaza con un click.
- Al aprobar, se crea automáticamente un `Subscription` con fecha de inicio y fin.
- Expiración lazy: cada vez que se consultan feature flags, se verifica si la suscripción activa expiró y se hace downgrade automático a FREE.
- `business.plan` sigue siendo la fuente de verdad del plan activo; `Subscription` es el historial y control de fechas.
- Integrar Mercado Pago o Culqi cuando exista validación real y flujo de ingresos.

---

## 5. ¿WhatsApp Business API desde el día 1?

**Decisión:** No.

**Estrategia:**

- Empezar con enlaces `wa.me` con mensaje prellenado.
- Sin aprobación de Meta, sin costo por mensaje.
- Implementación rápida y compatible con hábitos actuales del restaurante.
- Integrar WhatsApp Business Platform Cloud API en Fase 3 o cuando haya demanda real.

**Consideración:** Meta cobra por mensajes entregados y las plantillas requieren aprobación. No conviene para MVP.

---

## 6. ¿Google Business Profile API desde el día 1?

**Decisión:** No.

**Estrategia:**

- Empezar con checklist para optimizar perfil manualmente.
- Proveer link público de carta para pegar en Google Maps.
- Generar descripciones y textos de promociones.
- Integrar Business Profile APIs (Food Menus) en Fase 3 si hay demanda.

---

## 7. ¿App móvil nativa?

**Decisión:** No en MVP ni en corto plazo.

**Justificación:**

- El producto es mobile-first web (PWA si es necesario).
- El cliente final no necesita instalar nada (escanea QR y listo).
- El dueño puede administrar desde el navegador de su celular.
- Una app nativa duplica el costo de desarrollo y mantenimiento.

---

## 8. ¿POS o facturación electrónica?

**Decisión:** Fuera del MVP.

**Justificación:**

- El producto se posiciona como herramienta de ventas directa, no como reemplazo de POS.
- La facturación SUNAT agrega complejidad regulatoria innecesaria para validar MVP.
- Se puede integrar en Fase 4 si los usuarios lo demandan.

---

## 9. ¿Integración con Rappi/PedidosYa/Justo?

**Decisión:** Fuera del MVP.

**Justificación:**

- El valor principal es vender directo, sin intermediarios.
- Las apps de delivery ya tienen sus propios sistemas.
- El dueño que usa Mesa.pe quiere reducir dependencia de ellas, no aumentarla.

---

## 10. Resumen de Decisiones

| Decisión        | Opción Elegida   | Justificación Principal                      |
| --------------- | ---------------- | -------------------------------------------- |
| Arquitectura    | Next.js + NestJS | Profesional, escalable, mejor portafolio     |
| API Style       | REST + Swagger   | Documentación clara, interoperable           |
| Auth            | Clerk            | Velocidad, multi-tenant, menos mantenimiento |
| Pagos (SaaS)    | Manual inicial   | Validar antes de automatizar                 |
| WhatsApp        | wa.me links      | Sin fricción, sin costo, sin aprobación      |
| Google BP       | Checklist manual | API compleja, bajo impacto en MVP            |
| App nativa      | No               | Web mobile-first es suficiente               |
| POS/Facturación | No               | Fuera del scope de ventas directa            |
| Delivery apps   | No               | Enfocado en venta directa                    |
