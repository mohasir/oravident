import { seedSuperAdmin } from "./super-admin.ts";
import { seedAppointmentStatuses } from "./appointment-statuses.ts";
import { seedMainDemo } from "./main-demo.ts";

async function main() {
  console.log('🌱 Starting database seeding...');
  
  try {
    await seedAppointmentStatuses();
    await seedSuperAdmin();
    await seedMainDemo();
    
    console.log('✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
