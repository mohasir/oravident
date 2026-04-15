import { ROLES } from "@/core/guard/roles.ts";

export const DEMO_CLINIC = {
  name: "Demo",
  slug: "demo",
  email: "contact@demo.com",
  timezone: "America/Managua",
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
    password: "password123",
    metadata: { 
      roleName: ROLES.ADMIN, 
      prefix: "Lic.", 
      specialty: "",
      firstName: "Admin",
      lastName: "Demo",
      phone: "+50588888888",
      gender: "OTHER" as const
    }
  },
  {
    email: "doctor@demo.com",
    password: "password123",
    metadata: { 
      roleName: ROLES.DOCTOR, 
      prefix: "Dr.", 
      specialty: "Odontología General",
      firstName: "Juan",
      lastName: "Pérez",
      phone: "+50577777777",
      gender: "MALE" as const
    }
  },
  {
    email: "reception@demo.com",
    password: "password123",
    metadata: { 
      roleName: ROLES.RECEPTIONIST, 
      prefix: "Srta.", 
      specialty: "",
      firstName: "María",
      lastName: "López",
      phone: "+50566666666",
      gender: "FEMALE" as const
    }
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
