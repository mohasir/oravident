import postgres from 'postgres';
import { ENV } from '@core/config/env.ts';

async function reset() {
  const url = ENV.DATABASE_URL;
  
  const sql = postgres(url);
  
  try {
    console.log("⚠️  Starting FULL database reset...");
    
    console.log("🗑️  Dropping public schema...");
    await sql.unsafe('DROP SCHEMA IF EXISTS public CASCADE');
    await sql.unsafe('CREATE SCHEMA public');
    
    console.log("🗑️  Dropping internal drizzle schema...");
    await sql.unsafe('DROP SCHEMA IF EXISTS drizzle CASCADE');
    
    console.log("✅ Database reset completed successfully (clean state).");
  } catch (error) {
    console.error("❌ Error during database reset:", error);
    process.exit(1);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

reset();
