import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.ts";
import { ENV } from "@/core/config/env.ts";
import { sql } from "drizzle-orm";

export const queryClient = postgres(ENV.DATABASE_URL);

export type Database = PostgresJsDatabase<typeof schema>;

export const db = drizzle(queryClient, { schema });

export async function testDatabaseConnection() {
  try {
    // Try a simple query to verify connection
    await db.execute(sql`SELECT 1`);
    console.log('🐘 Database connection established successfully.');
  } catch (error) {
    console.error('❌ DATABASE CONNECTION ERROR:');
    console.error('Check if your DATABASE_URL is correct and the database is running.');
    if (error instanceof Error) {
      console.error(`Message: ${error.message}`);
    }
    process.exit(1);
  }
}
