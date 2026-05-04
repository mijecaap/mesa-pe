# Mesa.pe — Plan de Sprints (MVP: 6 Semanas)

## Sprint 1: Fundamentos y Autenticación (Semana 1)

**Meta:** Tener el proyecto corriendo y autenticación funcional.

### Tareas

- [ ] Setup de monorepo con `pnpm` workspaces.
- [ ] Configuración de Next.js 14+ con Tailwind CSS y shadcn/ui.
- [ ] Configuración de NestJS con estructura modular.
- [ ] Configuración de Prisma + PostgreSQL (Neon).
- [ ] Integración de Clerk en frontend (login, registro, organizaciones).
- [ ] Sincronización Clerk ↔ Backend (webhooks o validación JWT).
- [ ] Creación de schema base (`User`, `Business` en Prisma).
- [ ] Deploy inicial en Vercel (Web) y Railway (API).
- [ ] Configuración de Sentry en ambos proyectos.

### Entregable

Repositorio con auth funcional y health check de API desplegada.

---

## Sprint 2: Dashboard Admin — Negocio y Menú (Semana 2)

**Meta:** El dueño puede crear y gestionar su negocio y menú completo.

### Tareas

- [ ] CRUD completo de Negocio (perfil, slug único, descripción, WhatsApp, dirección).
- [ ] CRUD de Horarios de atención (día por día, override temporal).
- [ ] CRUD de Categorías (crear, editar, eliminar, reordenar con drag & drop).
- [ ] CRUD de Productos (nombre, descripción, precio, foto, categoría, estado visible/agotado/oculto).
- [ ] Subida de imágenes a Cloudflare R2 (endpoints firmados).
- [ ] Configuración de métodos de pago (Yape, Plin, efectivo, transferencia, POS).
- [ ] Configuración de zonas de delivery (nombre, costo, pedido mínimo).
- [ ] Validación de slug único y seguridad de tenant.

### Entregable

Dashboard funcional donde un usuario puede crear un negocio completo con 20+ productos.

---

## Sprint 3: Página Pública del Negocio (Semana 3)

**Meta:** El cliente final ve una carta digital hermosa y funcional en su celular.

### Tareas

- [ ] Ruta dinámica pública: `/{slug}`.
- [ ] Render optimizado para móvil (fotos grandes, botones táctiles, diseño limpio).
- [ ] SEO dinámico: `generateMetadata` por negocio, Open Graph tags, Schema.org `Restaurant`.
- [ ] Mostrar estado abierto/cerrado según horarios configurados.
- [ ] Galería de fotos del negocio (logo, banner, platos).
- [ ] Secciones: Hero (logo+nombre+estado), Promociones, Categorías (sticky horizontal), Productos, Horarios, Ubicación, Métodos de pago.
- [ ] Botón flotante de WhatsApp.

### Entregable

URL pública funcional que se vea profesional en celular y pase Lighthouse 85+.

---

## Sprint 4: Carrito y Pedidos por WhatsApp (Semana 4)

**Meta:** El cliente puede armar un pedido y enviarlo por WhatsApp de forma ordenada.

### Tareas

- [ ] Carrito con Zustand + persistencia en `localStorage`.
- [ ] Modal de producto con selección de modificadores/variantes (tamaños, toppings, etc.).
- [ ] Cálculo de subtotal y total.
- [ ] Modal de checkout: selección de modalidad (Mesa/Recojo/Delivery), datos del cliente, notas.
- [ ] Si es delivery: selección de zona y cálculo de delivery fee.
- [ ] Generador de mensaje WhatsApp estructurado (`wa.me/{numero}?text={mensaje}`).
- [ ] Registro de `OrderLead` en backend antes de redirigir a WhatsApp.
- [ ] Tracking de eventos analytics: `add_to_cart`, `whatsapp_click`, `order_started`.

### Entregable

Flujo completo de pedido por WhatsApp funcional desde la página pública.

---

## Sprint 5: QR, Onboarding y Pulido (Semana 5)

**Meta:** El producto está listo para ser usado por negocios reales.

### Tareas

- [ ] Generación y descarga de QR en PNG/SVG (apunta a `/{slug}`).
- [ ] Onboarding guiado de 6 pasos:
  1. Datos del negocio
  2. Horarios
  3. Primeras categorías
  4. Primeros productos
  5. WhatsApp
  6. Descargar QR / Copiar link
- [ ] Checklist de lanzamiento en dashboard.
- [ ] Manejo de "Modo cerrado" (página pública cuando el negocio no atiende).
- [ ] Visualización clara de productos agotados (badge, opacidad, deshabilitado).
- [ ] Búsqueda y filtro de productos en página pública.
- [ ] Feedback visual y micro-interacciones (toasts, loaders).

### Entregable

Producto listo para que un negocio real lo configure y use sin ayuda.

---

## Sprint 6: Analytics y Preparación para el Mercado (Semana 6)

**Meta:** El dueño ve valor en las métricas y preparamos la salida comercial.

### Tareas

- [ ] Dashboard de analytics:
  - Visitas últimos 7/30 días
  - Clics a WhatsApp
  - Pedidos iniciados
  - Productos más vistos
  - Productos más agregados al carrito
  - Horas/días con más visitas
- [ ] Tabla de `OrderLead` en admin (historial de pedidos iniciados).
- [ ] Landing page comercial para `Mesa.pe` (home estática con pricing, features, CTA).
- [ ] Implementación de límites de planes:
  - Free: 10 productos, marca de agua, 1 QR
  - Starter: 50 productos, QR, WhatsApp, página pública
  - Pro: ilimitado razonable, analytics, promos, delivery zones
- [ ] Crear 3-5 demos ficticias de negocios reales para outbound.
- [ ] Pulido final de UX/UI, corrección de bugs, optimización de performance.

### Entregable

MVP completo listo para validación con negocios reales.
