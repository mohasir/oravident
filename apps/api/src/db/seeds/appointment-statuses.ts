import { db } from "../index.ts";
import { appointmentStatuses } from "../schema/index.ts";

export async function seedAppointmentStatuses() {
  console.log("📅 Seeding Appointment Statuses...");
  const data = [
    { name: "Pendiente", color: "#FF9800", bgColor: "#FFF3E0" }, 
    { name: "Confirmada", color: "#4CAF50", bgColor: "#E8F5E9" }, 
    { name: "Reagendada", color: "#2196F3", bgColor: "#E3F2FD" },
    { name: "Cancelada", color: "#F44336", bgColor: "#FFEBEE" },
    { name: "Completada", color: "#9C27B0", bgColor: "#F3E5F5" },
    { name: "No Asistió", color: "#607D8B", bgColor: "#ECEFF1" },
  ];

  for (const s of data) {
    await db.insert(appointmentStatuses).values(s).onConflictDoNothing();
  }
}
