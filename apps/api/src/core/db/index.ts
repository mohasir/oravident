import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.ts";

const queryClient = postgres(process.env.DATABASE_URL!);

export type Database = PostgresJsDatabase<typeof schema>;

export const db = drizzle(queryClient, { schema });
