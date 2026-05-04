import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const assignments = [
  {
    slug: 'la-lucha-sangucheria',
    email: 'lalucha+clerk_test@example.com',
    clerkId: 'user_3DFQJ6cggRULRcEuRVjo9rXOexS',
  },
  {
    slug: 'puku-puku-cafe',
    email: 'puku+clerk_test@example.com',
    clerkId: 'user_3DFQKtTmX3bP1Z4H9CwYM5yJ9wN',
  },
  {
    slug: 'tanta-lima',
    email: 'tanta+clerk_test@example.com',
    clerkId: 'user_3DFQMafA2L4Fe8JzxYctvVwWw3I',
  },
  {
    slug: 'don-mamino',
    email: 'mamino+clerk_test@example.com',
    clerkId: 'user_3DFQOZQSwxG6jY3afdKOlIvaAMe',
  },
  {
    slug: 'cafe-del-centro',
    email: 'cafe+clerk_test@example.com',
    clerkId: 'user_3DFQQMGyxnSiTH3XPIRgGcHulMp',
  },
];

async function main() {
  console.log('🔄 Actualizando emails y Clerk IDs con formato de test...');

  for (const assign of assignments) {
    // Buscar usuario por email anterior (sin +clerk_test)
    const oldEmail = assign.email.replace('+clerk_test', '');
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: assign.email },
          { email: oldEmail },
          { clerkId: assign.clerkId },
        ],
      },
    });

    let user;
    if (existingUser) {
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          clerkId: assign.clerkId,
          email: assign.email,
        },
      });
      console.log(`🔄 Usuario actualizado: ${assign.email} → ${assign.clerkId}`);
    } else {
      user = await prisma.user.create({
        data: {
          clerkId: assign.clerkId,
          email: assign.email,
          name: assign.email.split('+')[0],
        },
      });
      console.log(`👤 Usuario creado: ${assign.email} → ${assign.clerkId}`);
    }

    // Reasignar negocio
    const business = await prisma.business.findUnique({
      where: { slug: assign.slug },
    });

    if (!business) {
      console.log(`⚠️ Negocio "${assign.slug}" no encontrado, saltando...`);
      continue;
    }

    await prisma.business.update({
      where: { id: business.id },
      data: {
        ownerId: user.id,
        organizationId: null,
      },
    });

    console.log(`✅ "${business.name}" reasignado a ${assign.email}`);
  }

  console.log('🎉 Actualización completada');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
