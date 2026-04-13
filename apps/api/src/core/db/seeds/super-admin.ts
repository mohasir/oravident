import { db } from "../index.ts";
import { users } from "../schema/index.ts";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function seedSuperAdmin() {
  console.log("👤 Seeding SuperAdmin...");

  const email = "sambarberena@gmail.com";
  const password = "admin123*";

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    console.log("⚠️ SuperAdmin already exists, skipping...");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await db.insert(users).values({
    email,
    passwordHash,
    isPlatformAdmin: true,
    isActive: true,
  });

  console.log("✅ SuperAdmin created successfully!");
}
