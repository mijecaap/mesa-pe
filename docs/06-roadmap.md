# Mesa.pe — Roadmap Post-MVP

## Fase 0: Validación Manual (Previo al MVP)

**Duración:** 1-2 semanas (paralelo al desarrollo)

**Objetivo:** Validar interés antes y durante la construcción.

**Acciones:**

- [ ] Crear landing simple con formulario de interés.
- [ ] Diseñar 3 demos ficticias de negocios reales.
- [ ] Contactar 30 negocios reales por Google Maps/Instagram.
- [ ] Ofrecer demo personalizada gratuita.
- [ ] Medir interés y disposición de pago.

**Entregables:**

- Lista de dolores reales.
- Pricing validado.
- 3-5 negocios interesados.

---

## Fase 1: MVP (6 semanas)

**Incluye:**

- Auth (Clerk).
- Crear negocio.
- Página pública.
- Carta digital.
- Productos con fotos.
- Carrito.
- Pedido por WhatsApp.
- QR.
- Horarios.
- Métodos de pago visibles.
- Analítica básica.

**Meta:** 10 negocios pagos en 90 días.

---

## Fase 2: Beta Pagada (4-6 semanas)

**Incluye:**

- Mejoras según feedback de primeros usuarios.
- **Promociones:** banners, productos destacados, combos.
- **Zonas de delivery:** configuración avanzada por distritos/mapas.
- **Plantillas visuales:** 2+ temas para la página pública (minimal, food visual).
- **Exportar QR:** en PDF y PNG de alta calidad.
- **Mejor onboarding:** tooltips, guías inline, videos cortos.
- **Planes y límites:** definición final de tiers y feature flags.
- **Pago manual o integración inicial:** registrar suscripciones (Yape/Plin manual al inicio, Culqi/Mercado Pago si hay demanda).

**Meta:** 30 negocios activos, churn < 10%.

---

## Fase 3: Growth (2-3 meses)

**Incluye:**

- **Pagos online:** integración Culqi o Mercado Pago (checkout con tarjeta, Yape).
- **Confirmación de pedidos:** panel interno de pedidos con estados (nuevo, confirmado, preparando, listo, entregado).
- **Modo mesa:** QR por mesa individual (`?table=5`) para pedidos en local.
- **Fidelización simple:** clientes frecuentes, historial de pedidos, puntos básicos.
- **Cupones:** códigos de descuento por porcentaje o monto fijo.
- **Integración Google Business Profile parcial:** checklist avanzado, sincronización de menú vía API si es posible.
- **WhatsApp Business API:** para negocios con mayor volumen (confirmaciones automáticas, plantillas).

**Meta:** 100 negocios activos, MRR objetivo.

---

## Fase 4: Operación Gastronómica Ligera (3+ meses)

**Incluye:**

- **Panel de pedidos completo:** gestión de estados, notificaciones sonoras, vista de cocina.
- **Impresión simple:** integración con impresoras térmicas o envío a impresora vía browser.
- **Inventario liviano:** stock por producto, alertas de agotamiento.
- **Múltiples sedes:** gestión de branch/sucursales.
- **Roles avanzados:** owner, admin, cajero, mesero, cocinero.
- **Reportes avanzados:** ventas por período, productos más vendidos, horarios pico.
- **API pública:** para integraciones con sistemas de terceros.

**Meta:** Producto completo para restaurantes pequeños y medianos.

---

## Línea de Tiempo Visual

```
Semanas:  1-2      3-8         9-14        15-26       27+
          |        |           |           |           |
Fases:    [Validación] [ MVP ] [Beta Pagada] [ Growth ] [ Operación ]
          Landing    Auth      Promos      Pagos       Panel Pedidos
          Demos      Menú      Plantillas  Modo Mesa   Inventario
          Outreach   Pública   Delivery    Fidelización Múltiples Sedes
                     WhatsApp  Setup       Cupones     Roles
                     QR        Pagos       Google BP   API Pública
                     Analytics manual      WhatsApp API
```
