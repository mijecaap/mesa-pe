import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SEED_USER_ID = 'seed-user-001';
const SEED_CLERK_ID = 'seed_clerk_id_001';
const SEED_ORG_ID = 'seed-org-001';
const SEED_CLERK_ORG_ID = process.env.SEED_CLERK_ORG_ID ?? 'seed_clerk_org_001';

const businesses = [
  {
    slug: 'la-lucha-sangucheria',
    name: 'La Lucha Sanguchería',
    description: 'Los mejores sándwiches de chicharrón y jamón del norte de Lima. Pan fresco todos los días.',
    whatsappNumber: '+51999999001',
    address: 'Av. La Mar 1240, Miraflores, Lima',
    googleMapsUrl: 'https://maps.google.com/?q=La+Lucha',
    instagramUrl: 'https://instagram.com/lalucha',
    plan: 'PRO',
    isPublished: true,
    categories: [
      { name: 'Clásicos', description: 'Los favoritos de siempre', items: [
        { name: 'Sándwich de Chicharrón', basePrice: 18.00, description: 'Chicharrón crocante, camote y salsa criolla', tags: ['popular'] },
        { name: 'Sándwich de Jamón', basePrice: 16.00, description: 'Jamón del país, queso fresco y lechuga', tags: ['new'] },
        { name: 'Sándwich de Lomo', basePrice: 20.00, description: 'Lomo saltado en pan artesanal', tags: [] },
      ]},
      { name: 'Bebidas', description: 'Refrescantes y naturales', items: [
        { name: 'Chicha Morada', basePrice: 8.00, description: 'Chicha morada natural', tags: [] },
        { name: 'Limonada Frozen', basePrice: 10.00, description: 'Limonada con hierbabuena', tags: ['popular'] },
        { name: 'Café Pasado', basePrice: 6.00, description: 'Café peruano recién pasado', tags: [] },
      ]},
    ],
    paymentMethods: [
      { type: 'YAPE', name: 'Yape La Lucha', details: '999999001' },
      { type: 'CASH', name: 'Efectivo', details: 'Soles' },
    ],
    zones: [
      { name: 'Miraflores', deliveryFee: 5.00, estimatedMinutes: 25 },
      { name: 'San Isidro', deliveryFee: 7.00, estimatedMinutes: 35 },
    ],
  },
  {
    slug: 'puku-puku-cafe',
    name: 'Puku Puku Café',
    description: 'Café de especialidad peruano en ambiente acogedor. Desayunos y postres artesanales.',
    whatsappNumber: '+51999999002',
    address: 'Jr. Carabaya 815, Centro de Lima',
    googleMapsUrl: 'https://maps.google.com/?q=Puku+Puku',
    instagramUrl: 'https://instagram.com/pukupukucafe',
    plan: 'STARTER',
    isPublished: true,
    categories: [
      { name: 'Cafés', description: 'Cafés de especialidad', items: [
        { name: 'Espresso', basePrice: 9.00, description: 'Doble espresso intenso', tags: [] },
        { name: 'Cappuccino', basePrice: 12.00, description: 'Con leche cremada y arte latte', tags: ['popular'] },
        { name: 'Flat White', basePrice: 13.00, description: 'Café australiano suave', tags: ['new'] },
        { name: 'Cold Brew', basePrice: 14.00, description: 'Extracción en frío 12 horas', tags: [] },
      ]},
      { name: 'Pastelería', description: 'Dulces del día', items: [
        { name: 'Tarta de Limón', basePrice: 15.00, description: 'Merengue suave y base de galleta', tags: ['popular'] },
        { name: 'Brownie de Chocolate', basePrice: 12.00, description: 'Con nueces pecanas', tags: [] },
        { name: 'Cheesecake', basePrice: 16.00, description: 'Estilo Nueva York con frutos rojos', tags: [] },
      ]},
    ],
    paymentMethods: [
      { type: 'YAPE', name: 'Yape Puku Puku', details: '999999002' },
      { type: 'PLIN', name: 'Plin Puku Puku', details: '999999002' },
      { type: 'CASH', name: 'Efectivo', details: 'Soles' },
    ],
    zones: [
      { name: 'Centro Histórico', deliveryFee: 4.00, estimatedMinutes: 20 },
      { name: 'Cercado de Lima', deliveryFee: 6.00, estimatedMinutes: 30 },
    ],
  },
  {
    slug: 'tanta-lima',
    name: 'Tanta',
    description: 'Propuesta gastronómica de Gastón Acurio. Sabores peruanos en formatos casuales.',
    whatsappNumber: '+51999999003',
    address: 'Av. Pancho Fierro 117, San Isidro',
    googleMapsUrl: 'https://maps.google.com/?q=Tanta+Lima',
    instagramUrl: 'https://instagram.com/tanta',
    plan: 'FREE',
    isPublished: true,
    categories: [
      { name: 'Entradas', description: 'Para compartir', items: [
        { name: 'Causa Limeña', basePrice: 22.00, description: 'Papa amarilla, pollo y palta', tags: ['popular', 'vegetarian'] },
        { name: 'Papa a la Huancaína', basePrice: 18.00, description: 'Clásica crema de ají amarillo', tags: ['vegetarian'] },
        { name: 'Anticuchos', basePrice: 28.00, description: 'Corazón de res en brochetas', tags: [] },
      ]},
      { name: 'Principales', description: 'Platos de fondo', items: [
        { name: 'Lomo Saltado', basePrice: 38.00, description: 'Con papas fritas y arroz', tags: ['popular'] },
        { name: 'Ají de Gallina', basePrice: 32.00, description: 'Crema de ají amarillo con gallina', tags: [] },
        { name: 'Arroz con Mariscos', basePrice: 42.00, description: 'Para dos personas', tags: ['promo'] },
      ]},
    ],
    paymentMethods: [
      { type: 'YAPE', name: 'Yape Tanta', details: '999999003' },
      { type: 'CASH', name: 'Efectivo', details: 'Soles' },
    ],
    zones: [
      { name: 'San Isidro', deliveryFee: 6.00, estimatedMinutes: 30 },
    ],
  },
  {
    slug: 'don-mamino',
    name: 'Don Mamino',
    description: 'Tradición limeña desde 1958. Sánguches de pavo, pollo y chicharrón en pan criollo.',
    whatsappNumber: '+51999999004',
    address: 'Jirón de la Unión 749, Lima',
    googleMapsUrl: 'https://maps.google.com/?q=Don+Mamino',
    instagramUrl: 'https://instagram.com/donmamino',
    plan: 'STARTER',
    isPublished: true,
    categories: [
      { name: 'Sánguches', description: 'Clásicos peruanos', items: [
        { name: 'Sánguche de Pavo', basePrice: 19.00, description: 'Pavo horneado con salsa tártara', tags: ['popular'] },
        { name: 'Sánguche de Pollo', basePrice: 17.00, description: 'Pollo deshilachado y palta', tags: [] },
        { name: 'Sánguche de Chicharrón', basePrice: 18.00, description: 'Chicharrón de cerdo crocante', tags: [] },
        { name: 'Sánguche de Asado', basePrice: 20.00, description: 'Carne asada con cebolla', tags: ['new'] },
      ]},
      { name: 'Bebidas', description: 'Bebidas tradicionales', items: [
        { name: 'Inca Kola', basePrice: 6.00, description: '600ml', tags: [] },
        { name: 'Jugo de Naranja', basePrice: 10.00, description: 'Natural exprimido', tags: [] },
      ]},
    ],
    paymentMethods: [
      { type: 'YAPE', name: 'Yape Don Mamino', details: '999999004' },
      { type: 'PLIN', name: 'Plin Don Mamino', details: '999999004' },
      { type: 'CASH', name: 'Efectivo', details: 'Soles' },
    ],
    zones: [
      { name: 'Cercado de Lima', deliveryFee: 5.00, estimatedMinutes: 25 },
      { name: 'Miraflores', deliveryFee: 8.00, estimatedMinutes: 40 },
    ],
  },
  {
    slug: 'cafe-del-centro',
    name: 'Café del Centro',
    description: 'Cafetería bohemia en el corazón de Barranco. Música en vivo los fines de semana.',
    whatsappNumber: '+51999999005',
    address: 'Av. Grau 269, Barranco',
    googleMapsUrl: 'https://maps.google.com/?q=Cafe+del+Centro',
    instagramUrl: 'https://instagram.com/cafedelcentro',
    plan: 'PRO',
    isPublished: true,
    categories: [
      { name: 'Cafés', description: 'Especialidad', items: [
        { name: 'Pour Over', basePrice: 15.00, description: 'Método V60 con grano local', tags: ['popular'] },
        { name: 'Aeropress', basePrice: 14.00, description: 'Cuerpo limpio y brillante', tags: [] },
        { name: 'Latte de Olla', basePrice: 13.00, description: 'Con canela y piloncillo', tags: ['new'] },
      ]},
      { name: 'Brunch', description: 'Todo el día', items: [
        { name: 'Avocado Toast', basePrice: 22.00, description: 'Palta, huevo pochado y semillas', tags: ['vegetarian'] },
        { name: 'Panqueques', basePrice: 18.00, description: 'Con miel de chancaca y fruta', tags: [] },
        { name: 'Huevos Benedictinos', basePrice: 26.00, description: 'Con salsa holandesa casera', tags: ['popular'] },
      ]},
      { name: 'Postres', description: 'Dulces tentaciones', items: [
        { name: 'Torta de Chocolate', basePrice: 16.00, description: '70% cacao con ganache', tags: [] },
        { name: 'Alfajores', basePrice: 8.00, description: 'Dulce de leche casero', tags: ['popular'] },
      ]},
    ],
    paymentMethods: [
      { type: 'YAPE', name: 'Yape Café del Centro', details: '999999005' },
      { type: 'PLIN', name: 'Plin Café del Centro', details: '999999005' },
      { type: 'CASH', name: 'Efectivo', details: 'Soles' },
    ],
    zones: [
      { name: 'Barranco', deliveryFee: 4.00, estimatedMinutes: 20 },
      { name: 'Miraflores', deliveryFee: 6.00, estimatedMinutes: 30 },
      { name: 'Chorrillos', deliveryFee: 7.00, estimatedMinutes: 35 },
    ],
  },
];

function getOpeningHours() {
  return [
    { dayOfWeek: 0, openTime: '08:00', closeTime: '20:00', isClosed: false },
    { dayOfWeek: 1, openTime: '07:00', closeTime: '22:00', isClosed: false },
    { dayOfWeek: 2, openTime: '07:00', closeTime: '22:00', isClosed: false },
    { dayOfWeek: 3, openTime: '07:00', closeTime: '22:00', isClosed: false },
    { dayOfWeek: 4, openTime: '07:00', closeTime: '22:00', isClosed: false },
    { dayOfWeek: 5, openTime: '07:00', closeTime: '23:00', isClosed: false },
    { dayOfWeek: 6, openTime: '08:00', closeTime: '23:00', isClosed: false },
  ];
}

function randomDate(daysBack: number) {
  const now = new Date();
  const offset = Math.floor(Math.random() * daysBack);
  const d = new Date(now);
  d.setDate(d.getDate() - offset);
  d.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60));
  return d;
}

async function main() {
  console.log('🌱 Iniciando seed...');

  // 1. Crear o reutilizar usuario seed
  let user = await prisma.user.findUnique({ where: { clerkId: SEED_CLERK_ID } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: SEED_USER_ID,
        clerkId: SEED_CLERK_ID,
        email: 'seed@mesa.pe',
        name: 'Seed User',
      },
    });
    console.log('👤 Usuario seed creado');
  }

  // 2. Crear o reutilizar organización seed
  // Si SEED_CLERK_ORG_ID está configurado (tu org real de Clerk), la usamos.
  // Si no, creamos una org dummy para que el modelo B2B funcione en desarrollo.
  let org = await prisma.organization.findUnique({
    where: { clerkOrgId: SEED_CLERK_ORG_ID },
  });
  if (!org) {
    org = await prisma.organization.create({
      data: {
        id: SEED_ORG_ID,
        clerkOrgId: SEED_CLERK_ORG_ID,
        name: 'Seed Organization',
        slug: 'seed-org',
      },
    });
    console.log(`🏢 Organización seed creada (${SEED_CLERK_ORG_ID})`);
  } else {
    console.log(`🏢 Usando organización existente: ${org.clerkOrgId}`);
  }

  for (const biz of businesses) {
    const existing = await prisma.business.findUnique({ where: { slug: biz.slug } });
    if (existing) {
      console.log(`⏩ Negocio "${biz.name}" ya existe, saltando...`);
      continue;
    }

    const business = await prisma.business.create({
      data: {
        ownerId: user.id,
        organizationId: org.clerkOrgId,
        slug: biz.slug,
        name: biz.name,
        description: biz.description,
        whatsappNumber: biz.whatsappNumber,
        address: biz.address,
        googleMapsUrl: biz.googleMapsUrl,
        instagramUrl: biz.instagramUrl,
        plan: biz.plan,
        isPublished: biz.isPublished,
        openingHours: { create: getOpeningHours() },
        paymentMethods: { create: biz.paymentMethods },
        zones: { create: biz.zones },
      },
    });

    console.log(`🏪 Creado: ${biz.name}`);

    for (const cat of biz.categories) {
      const category = await prisma.menuCategory.create({
        data: {
          businessId: business.id,
          name: cat.name,
          description: cat.description,
          sortOrder: biz.categories.indexOf(cat),
        },
      });

      for (const item of cat.items) {
        await prisma.menuItem.create({
          data: {
            businessId: business.id,
            categoryId: category.id,
            name: item.name,
            description: item.description,
            basePrice: item.basePrice,
            tags: item.tags,
            sortOrder: cat.items.indexOf(item),
          },
        });
      }
    }

    // Generar AnalyticsEvent de prueba (~100 eventos)
    const eventTypes: string[] = ['page_view', 'product_view', 'add_to_cart', 'whatsapp_click', 'order_started'];
    const eventsToCreate = [];
    for (let i = 0; i < 120; i++) {
      const eventName = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      eventsToCreate.push({
        businessId: business.id,
        eventName,
        entityType: eventName === 'page_view' ? null : 'product',
        entityId: null,
        metadata: eventName === 'whatsapp_click' ? { source: 'checkout' } : {},
        sessionId: `seed-session-${Math.floor(Math.random() * 20)}`,
        createdAt: randomDate(30),
      });
    }
    await prisma.analyticsEvent.createMany({ data: eventsToCreate });
    console.log(`📊 ${eventsToCreate.length} eventos de analytics creados`);

    // Generar algunos OrderLeads
    const leadsToCreate = [];
    for (let i = 0; i < 15; i++) {
      leadsToCreate.push({
        businessId: business.id,
        customerName: `Cliente ${i + 1}`,
        customerPhone: `+51999999${String(i).padStart(3, '0')}`,
        fulfillmentType: ['DINE_IN', 'PICKUP', 'DELIVERY'][Math.floor(Math.random() * 3)],
        itemsSummary: [
          { name: 'Producto demo', quantity: 1, unitPrice: 20, totalPrice: 20, modifiers: [] },
        ] as unknown as Parameters<typeof prisma.orderLead.create>[0]['data']['itemsSummary'],
        subtotal: 20,
        total: 25,
        whatsappMessage: 'Hola, quiero hacer un pedido...',
        status: 'STARTED',
        createdAt: randomDate(30),
      });
    }
    await prisma.orderLead.createMany({ data: leadsToCreate });
    console.log(`🛒 ${leadsToCreate.length} order leads creados`);
  }

  console.log('✅ Seed completado con éxito');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
