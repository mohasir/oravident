import { db } from "../index.ts";
import { clinics, services } from "../schema/index.ts";

export async function seedMainDemo() {
  console.log("🏥 Seeding Demo Clinic & Services...");

  const existingClinic = await db.query.clinics.findFirst();
  if (existingClinic) {
    console.log("⚠️ Demo clinic already exists, skipping...");
    return;
  }

  const [clinic] = await db.insert(clinics).values({
    name: "Dental Smiles",
    slug: "dental-smiles",
    email: "contacto@dentalsmiles.com",
    timeZone: "America/Managua",
  }).returning();
  
  if (!clinic) {
    throw new Error("Failed to create clinic during seeding");
  }

  await db.insert(services).values([
    { clinicId: clinic.id, name: "Consulta General", durationMinutes: 30, price: "25.00" },
    { clinicId: clinic.id, name: "Limpieza Dental", durationMinutes: 45, price: "50.00" },
    { clinicId: clinic.id, name: "Extracción Simple", durationMinutes: 60, price: "80.00" },
  ]);
}
