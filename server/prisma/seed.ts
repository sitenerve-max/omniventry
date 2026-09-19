import { PrismaClient, RoleName } from '@prisma/client';
import { hashPassword } from '../src/common/password';
import { normalizeMpn } from '../src/common/mpn';

const prisma = new PrismaClient();

// Dev-only demo password for every seeded account. Never used outside local/demo environments.
const DEMO_PASSWORD = 'Demo@12345';

const SEED_ALLOWED_ENVIRONMENTS = ['development', 'test'];

/** The seed creates accounts with a well-known password, so it must never run outside dev/test. */
function assertSeedAllowed(): void {
  const env = process.env.NODE_ENV;
  if (!env || !SEED_ALLOWED_ENVIRONMENTS.includes(env)) {
    throw new Error(
      `Refusing to seed demo data: NODE_ENV is "${env ?? 'unset'}". ` +
        `The demo seed only runs when NODE_ENV is one of: ${SEED_ALLOWED_ENVIRONMENTS.join(', ')}.`,
    );
  }
}

async function main() {
  assertSeedAllowed();
  console.log('Seeding roles...');
  const roles = await Promise.all(
    Object.values(RoleName).map((name) => prisma.role.upsert({ where: { name }, create: { name }, update: {} })),
  );
  const roleId = (name: RoleName) => roles.find((r) => r.name === name)!.id;

  console.log('Seeding demo admin user...');
  const adminPasswordHash = await hashPassword(DEMO_PASSWORD);
  await prisma.user.upsert({
    where: { email: 'admin@demo.oeminventory.local' },
    create: {
      email: 'admin@demo.oeminventory.local',
      passwordHash: adminPasswordHash,
      name: 'Demo Staff A',
      roles: { create: { roleId: roleId(RoleName.SUPER_ADMIN) } },
    },
    update: {},
  });

  console.log('Seeding demo customer...');
  const customer = await prisma.customer.upsert({
    where: { id: 'demo-customer-a' },
    create: { id: 'demo-customer-a', companyName: 'Demo Company A (IoT & Telematics)', isVerified: true },
    update: {},
  });
  const customerPasswordHash = await hashPassword(DEMO_PASSWORD);
  const customerUser = await prisma.user.upsert({
    where: { email: 'buyer@demo.oeminventory.local' },
    create: {
      email: 'buyer@demo.oeminventory.local',
      passwordHash: customerPasswordHash,
      name: 'Demo User A',
      roles: { create: { roleId: roleId(RoleName.CUSTOMER) } },
      customerUser: { create: { customerId: customer.id } },
    },
    update: {},
  });

  console.log('Seeding demo suppliers...');
  const supplierAPasswordHash = await hashPassword(DEMO_PASSWORD);
  const supplierA = await prisma.supplier.upsert({
    where: { id: 'demo-supplier-a' },
    create: {
      id: 'demo-supplier-a',
      companyName: 'Demo Supplier A (Franchised Stockist)',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      isVerified: true,
      supplierScore: 98,
    },
    update: {},
  });
  await prisma.user.upsert({
    where: { email: 'supplier-a@demo.oeminventory.local' },
    create: {
      email: 'supplier-a@demo.oeminventory.local',
      passwordHash: supplierAPasswordHash,
      name: 'Demo Staff B',
      roles: { create: { roleId: roleId(RoleName.SUPPLIER) } },
      supplierUser: { create: { supplierId: supplierA.id } },
    },
    update: {},
  });

  const supplierB = await prisma.supplier.upsert({
    where: { id: 'demo-supplier-b' },
    create: {
      id: 'demo-supplier-b',
      companyName: 'Demo Supplier B (Independent Stockist)',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      isVerified: true,
      supplierScore: 94,
    },
    update: {},
  });

  console.log('Seeding manufacturers, categories, products...');
  const ti = await prisma.manufacturer.upsert({
    where: { name: 'Texas Instruments' },
    create: { name: 'Texas Instruments' },
    update: {},
  });
  const stm = await prisma.manufacturer.upsert({
    where: { name: 'STMicroelectronics' },
    create: { name: 'STMicroelectronics' },
    update: {},
  });
  const analogCategory = await prisma.category.upsert({
    where: { id: 'cat-analog-ic' },
    create: { id: 'cat-analog-ic', name: 'Analog IC' },
    update: {},
  });
  const mcuCategory = await prisma.category.upsert({
    where: { id: 'cat-mcu' },
    create: { id: 'cat-mcu', name: 'Microcontroller' },
    update: {},
  });

  const lm358 = await prisma.product.upsert({
    where: { mpn_manufacturerId: { mpn: 'LM358DR', manufacturerId: ti.id } },
    create: {
      mpn: 'LM358DR',
      normalizedMpn: normalizeMpn('LM358DR'),
      manufacturerId: ti.id,
      categoryId: analogCategory.id,
      description: 'Dual Operational Amplifier, 3V to 32V, SOIC-8',
      packageType: 'SOIC-8',
      lifecycle: 'Active',
      rohsCompliant: true,
      reachCompliant: true,
    },
    update: {},
  });

  const stm32 = await prisma.product.upsert({
    where: { mpn_manufacturerId: { mpn: 'STM32F103C8T6', manufacturerId: stm.id } },
    create: {
      mpn: 'STM32F103C8T6',
      normalizedMpn: normalizeMpn('STM32F103C8T6'),
      manufacturerId: stm.id,
      categoryId: mcuCategory.id,
      description: '32-Bit ARM Cortex-M3 MCU, 72MHz, 64KB Flash, LQFP-48',
      packageType: 'LQFP-48',
      lifecycle: 'Active',
      rohsCompliant: true,
      reachCompliant: true,
    },
    update: {},
  });

  console.log('Seeding inventory + lots...');
  const lm358InventoryA = await prisma.inventory.upsert({
    where: { id: 'inv-lm358-supplier-a' },
    create: {
      id: 'inv-lm358-supplier-a',
      productId: lm358.id,
      supplierId: supplierA.id,
      quantity: 45000,
      unitPrice: 4.85,
      currency: 'INR',
      moq: 2500,
      status: 'ACTIVE',
      condition: 'New & Original',
      countryOfOrigin: 'India',
      location: 'Bangalore',
      leadTime: 'Same Day Dispatch',
      rohs: true,
      reach: true,
      certificateAvailable: true,
    },
    update: {},
  });
  await prisma.inventoryLot.upsert({
    where: { id: 'lot-lm358-supplier-a' },
    create: {
      id: 'lot-lm358-supplier-a',
      inventoryId: lm358InventoryA.id,
      lotNumber: 'LOT-TI-2026-089',
      quantity: 45000,
      availableQuantity: 45000,
      dateCode: '2418+ (2024)',
      packaging: 'Tape & Reel (2,500)',
      unitPrice: 4.85,
    },
    update: {},
  });

  const lm358InventoryB = await prisma.inventory.upsert({
    where: { id: 'inv-lm358-supplier-b' },
    create: {
      id: 'inv-lm358-supplier-b',
      productId: lm358.id,
      supplierId: supplierB.id,
      quantity: 60000,
      unitPrice: 4.65,
      currency: 'INR',
      moq: 5000,
      status: 'ACTIVE',
      condition: 'Factory Sealed',
      countryOfOrigin: 'India',
      location: 'Pune',
      leadTime: '24-48 Hours Dispatch',
      rohs: true,
      reach: true,
      certificateAvailable: true,
    },
    update: {},
  });
  await prisma.inventoryLot.upsert({
    where: { id: 'lot-lm358-supplier-b' },
    create: {
      id: 'lot-lm358-supplier-b',
      inventoryId: lm358InventoryB.id,
      lotNumber: 'LOT-TI-2026-090',
      quantity: 60000,
      availableQuantity: 60000,
      dateCode: '2345+ (2023)',
      packaging: 'Tape & Reel (2,500)',
      unitPrice: 4.65,
    },
    update: {},
  });

  const stm32Inventory = await prisma.inventory.upsert({
    where: { id: 'inv-stm32-supplier-a' },
    create: {
      id: 'inv-stm32-supplier-a',
      productId: stm32.id,
      supplierId: supplierA.id,
      quantity: 15000,
      unitPrice: 145.0,
      currency: 'INR',
      moq: 250,
      status: 'ACTIVE',
      condition: 'New & Original',
      countryOfOrigin: 'India',
      location: 'Bangalore',
      leadTime: 'Same Day Dispatch',
      rohs: true,
      reach: true,
      certificateAvailable: true,
    },
    update: {},
  });
  await prisma.inventoryLot.upsert({
    where: { id: 'lot-stm32-supplier-a' },
    create: {
      id: 'lot-stm32-supplier-a',
      inventoryId: stm32Inventory.id,
      lotNumber: 'LOT-ST-2026-041',
      quantity: 15000,
      availableQuantity: 15000,
      dateCode: '2412+ (2024)',
      packaging: 'Tray (250 pcs)',
      unitPrice: 145.0,
    },
    update: {},
  });

  console.log('Seeding a demo RFQ...');
  await prisma.rfq.upsert({
    where: { rfqNumber: 'RFQ-2026-0841' },
    create: {
      rfqNumber: 'RFQ-2026-0841',
      customerId: customer.id,
      createdByUserId: customerUser.id,
      status: 'SUBMITTED',
      deliveryLocation: 'Electronic City, Bangalore, Karnataka',
      currency: 'INR',
      paymentTerms: '30 Days Net',
      remarks: 'Seed demo RFQ for local development.',
      items: {
        create: [
          { mpn: 'LM358DR', manufacturer: 'Texas Instruments', requiredQuantity: 10000, targetPriceInr: 4.5 },
          { mpn: 'STM32F103C8T6', manufacturer: 'STMicroelectronics', requiredQuantity: 2500, targetPriceInr: 140 },
        ],
      },
    },
    update: {},
  });

  console.log(`Seed complete. Demo accounts (password "${DEMO_PASSWORD}"):`);
  console.log('  admin@demo.oeminventory.local (SUPER_ADMIN)');
  console.log('  buyer@demo.oeminventory.local (CUSTOMER)');
  console.log('  supplier-a@demo.oeminventory.local (SUPPLIER)');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
