# Mesa.pe — Modelo de Datos

## 1. Entidades Principales

```
User (via Clerk)
  └── Organization (Clerk Org)
       └── Business
            ├── OpeningHour[]
            ├── DeliveryZone[]
            ├── PaymentMethod[]
            ├── MenuCategory[]
            │    └── MenuItem[]
            │         └── ModifierGroup[]
            │              └── ModifierOption[]
            ├── Promotion[]
            ├── MediaAsset[]
            ├── AnalyticsEvent[]
            ├── OrderLead[]
            ├── Subscription[]
            └── UpgradeRequest[]
```

## 2. Schema Prisma Completo

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  businesses Business[]
}

model Business {
  id              String   @id @default(cuid())
  ownerId         String
  slug            String   @unique
  name            String
  description     String?
  whatsappNumber  String
  address         String?
  googleMapsUrl   String?
  instagramUrl    String?
  tiktokUrl       String?
  facebookUrl     String?
  logoUrl         String?
  bannerUrl       String?
  currency        String   @default("PEN")
  isPublished     Boolean  @default(false)
  manualStatus    String   @default("AUTO") // OPEN, CLOSED, AUTO
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  owner           User             @relation(fields: [ownerId], references: [id])
  categories      MenuCategory[]
  items           MenuItem[]
  zones           DeliveryZone[]
  paymentMethods  PaymentMethod[]
  promotions      Promotion[]
  analytics       AnalyticsEvent[]
  orderLeads      OrderLead[]
  openingHours    OpeningHour[]
}

model OpeningHour {
  id         String   @id @default(cuid())
  businessId String
  dayOfWeek  Int      // 0=Domingo, 1=Lunes, ...
  openTime   String   // "08:00"
  closeTime  String   // "22:00"
  isClosed   Boolean  @default(false)
  business   Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
}

model MenuCategory {
  id          String    @id @default(cuid())
  businessId  String
  name        String
  description String?
  sortOrder   Int       @default(0)
  isVisible   Boolean   @default(true)
  business    Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
  items       MenuItem[]
}

model MenuItem {
  id          String    @id @default(cuid())
  businessId  String
  categoryId  String
  name        String
  description String?
  basePrice   Decimal   @db.Decimal(10, 2)
  imageUrl    String?
  isVisible   Boolean   @default(true)
  isAvailable Boolean   @default(true)
  tags        String[]
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  business    Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
  category    MenuCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  modifiers   ModifierGroup[]
}

model ModifierGroup {
  id            String    @id @default(cuid())
  menuItemId    String
  name          String
  isRequired    Boolean   @default(false)
  selectionType String    @default("SINGLE") // SINGLE, MULTIPLE
  minSelections Int?
  maxSelections Int?
  sortOrder     Int       @default(0)
  menuItem      MenuItem  @relation(fields: [menuItemId], references: [id], onDelete: Cascade)
  options       ModifierOption[]
}

model ModifierOption {
  id              String        @id @default(cuid())
  modifierGroupId String
  name            String
  priceDelta      Decimal       @default(0) @db.Decimal(10, 2)
  isAvailable     Boolean       @default(true)
  sortOrder       Int           @default(0)
  modifierGroup   ModifierGroup @relation(fields: [modifierGroupId], references: [id], onDelete: Cascade)
}

model DeliveryZone {
  id                 String   @id @default(cuid())
  businessId         String
  name               String
  deliveryFee        Decimal  @db.Decimal(10, 2)
  minimumOrderAmount Decimal? @db.Decimal(10, 2)
  estimatedMinutes   Int?
  isActive           Boolean  @default(true)
  business           Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
}

model PaymentMethod {
  id         String   @id @default(cuid())
  businessId String
  type       String   // YAPE, PLIN, CASH, TRANSFER, POS
  name       String
  details    String?  // Número de Yape, cuenta bancaria, etc.
  qrImageUrl String?
  isActive   Boolean  @default(true)
  business   Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
}

model Promotion {
  id          String   @id @default(cuid())
  businessId  String
  title       String
  description String?
  imageUrl    String?
  startDate   DateTime?
  endDate     DateTime?
  isActive    Boolean  @default(true)
  business    Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
}

model OrderLead {
  id                   String   @id @default(cuid())
  businessId           String
  customerName         String
  customerPhone        String?
  fulfillmentType      String   // DINE_IN, PICKUP, DELIVERY
  tableNumber          String?
  address              String?
  deliveryZoneId       String?
  itemsSummary         Json     // Detalle del carrito
  subtotal             Decimal  @db.Decimal(10, 2)
  deliveryFee          Decimal? @db.Decimal(10, 2)
  total                Decimal  @db.Decimal(10, 2)
  preferredPaymentMethod String?
  note                 String?
  whatsappMessage      String   @db.Text
  status               String   @default("STARTED") // STARTED, SENT_TO_WHATSAPP, CANCELLED
  createdAt            DateTime @default(now())
  business             Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
}

model AnalyticsEvent {
  id         String   @id @default(cuid())
  businessId String
  eventName  String
  entityType String?
  entityId   String?
  metadata   Json?
  sessionId  String?
  userAgent  String?
  referrer   String?
  ipAddress  String?
  createdAt  DateTime @default(now())
  business   Business @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@index([businessId, eventName, createdAt])
}

model Subscription {
  id          String   @id @default(cuid())
  businessId  String
  plan        String
  status      String   @default("ACTIVE")
  isTrial     Boolean  @default(false)
  startsAt    DateTime @default(now())
  endsAt      DateTime
  notes       String?
  createdBy   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  business    Business @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@index([businessId, status])
  @@index([endsAt, status])
}

model UpgradeRequest {
  id            String   @id @default(cuid())
  businessId    String
  requestedPlan String
  paymentMethod String
  status        String   @default("PENDING")
  receiptUrl    String?
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  business      Business @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@index([businessId, status])
  @@index([status, createdAt])
}
```

## 3. Índices Recomendados

- `Business.slug` — único (ya definido).
- `MenuCategory.businessId + sortOrder`.
- `MenuItem.businessId + categoryId + sortOrder`.
- `MenuItem.businessId + isVisible + isAvailable`.
- `AnalyticsEvent.businessId + eventName + createdAt` (ya definido).
- `OrderLead.businessId + createdAt`.

## 4. Notas de Diseño

- **OrderLead:** En el MVP no es una orden confirmada, sino un "pedido iniciado" antes de abrir WhatsApp. La confirmación ocurre fuera del sistema (el restaurante responde por WhatsApp).
- **User:** Se mantiene una tabla `User` ligera para referencias internas, pero la fuente de verdad de autenticación es Clerk.
- **MediaAsset:** Las imágenes se almacenan en Cloudflare R2. La URL pública se guarda directamente en las entidades (`logoUrl`, `imageUrl`, etc.) para evitar joins innecesarios en la página pública.
