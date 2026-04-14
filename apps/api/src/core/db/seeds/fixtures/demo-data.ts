import { ROLES } from "@/core/guard/roles.ts";

export const DEMO_CLINIC = {
  name: "Demo",
  slug: "demo",
  email: "contact@demo.com",
  timeZone: "America/Managua",
};

export const DEMO_BRANCH = {
  name: "Sucursal Central",
  slug: "central",
  address: "Edificio Principal, 123 Main St",
  phone: "+50523456789",
};

export const DEMO_USERS = [
  {
    email: "admin@demo.com",
    passwordHash: "mocked-hash-admin",
    metadata: { roleName: ROLES.ADMIN, prefix: "Lic.", specialty: "" }
  },
  {
    email: "doctor@demo.com",
    passwordHash: "mocked-hash-doctor",
    metadata: { roleName: ROLES.DOCTOR, prefix: "Dr.", specialty: "Odontología General" }
  },
  {
    email: "reception@demo.com",
    passwordHash: "mocked-hash-reception",
    metadata: { roleName: ROLES.RECEPTIONIST, prefix: "", specialty: "" }
  }
];

export const DEMO_BRANCH_SCHEDULES = [1, 2, 3, 4, 5].map(day => ({
  dayOfWeek: day,
  openTime: "08:00:00",
  closeTime: "18:00:00"
}));

export const DEMO_WORKER_SCHEDULES = [1, 2, 3, 4, 5].map(day => ({
  dayOfWeek: day,
  startTime: "09:00:00",
  endTime: "17:00:00"
}));

export const DEMO_SERVICES = [
  { 
    name: "General Consultation", 
    description: "Comprehensive dental checkup and evaluation of overall oral health",
    durationMinutes: 30, 
    price: "25.00" 
  },
  { 
    name: "Dental Cleaning", 
    description: "Professional removal of plaque, tartar, and surface stains",
    durationMinutes: 45, 
    price: "50.00" 
  },
  { 
    name: "Simple Extraction", 
    description: "Standard removal of a visible tooth without the need for complex surgery",
    durationMinutes: 60, 
    price: "80.00" 
  },
];
