// Main seeder entry point
// Import individual seeders and execute them in order

async function main() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Example:
    // await seedClinics();
    // await seedUsers();
    
    console.log('✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
