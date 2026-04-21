import { ROLES } from '@repo/guards';

export const DEMO_IDS = {
  CLINIC: 'A14833FE-7AEC-4B39-B0A9-836A54AF725E',
  BRANCH: 'B85DEE5B-0518-49C9-A661-C54A9E4A817B',
  USER_ADMIN: '4DEB7CE8-863E-4B7B-850A-4BB6D76E4446',
  USER_DOCTOR: 'CF0EAB4E-B615-4863-89EE-DF06B6A58DA1',
  USER_RECEPTION: 'DF2CCC2C-1C04-4189-9F74-D23EF852FBDF',
  WORKER_ADMIN: '07242C30-E21C-47BF-A2F1-E16D2AEA6B45',
  WORKER_DOCTOR: '2F6C02A0-2D73-4C99-ABC3-2629FAA44BB3',
  WORKER_RECEPTION: 'AC77363C-D636-411E-A72B-8A96B3878C80',
} as const;

export const DEMO_CLINIC = {
  name: 'Demo',
  slug: 'demo',
  email: 'contact@demo.com',
  timezone: 'America/Managua',
};

export const DEMO_BRANCH = {
  name: 'Sucursal Central',
  slug: 'central',
  address: 'Edificio Principal, 123 Main St',
  phone: '+50523456789',
};

export const DEMO_USERS = [
  {
    email: 'admin@demo.com',
    password: 'password123',
    metadata: {
      roleName: ROLES.ADMIN,
      prefix: 'Lic.',
      specialty: '',
      firstName: 'Admin',
      lastName: 'Demo',
      phone: '+50588888888',
      gender: 'OTHER' as const,
    },
  },
  {
    email: 'doctor@demo.com',
    password: 'password123',
    metadata: {
      roleName: ROLES.DOCTOR,
      prefix: 'Dr.',
      specialty: 'Odontología General',
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '+50577777777',
      gender: 'MALE' as const,
    },
  },
  {
    email: 'reception@demo.com',
    password: 'password123',
    metadata: {
      roleName: ROLES.RECEPTIONIST,
      prefix: 'Srta.',
      specialty: '',
      firstName: 'María',
      lastName: 'López',
      phone: '+50566666666',
      gender: 'FEMALE' as const,
    },
  },
] as const;

export const DEMO_BRANCH_SCHEDULES = [1, 2, 3, 4, 5].map((day) => ({
  dayOfWeek: day,
  openTime: '08:00:00',
  closeTime: '18:00:00',
}));

export const DEMO_WORKER_SCHEDULES = [1, 2, 3, 4, 5].map((day) => ({
  dayOfWeek: day,
  startTime: '09:00:00',
  endTime: '17:00:00',
}));

export const DEMO_SERVICES = [
  {
    name: 'General Consultation',
    description:
      'Comprehensive dental checkup and evaluation of overall oral health',
    durationMinutes: 30,
    price: '25.00',
  },
  {
    name: 'Dental Cleaning',
    description: 'Professional removal of plaque, tartar, and surface stains',
    durationMinutes: 45,
    price: '50.00',
  },
  {
    name: 'Simple Extraction',
    description:
      'Standard removal of a visible tooth without the need for complex surgery',
    durationMinutes: 60,
    price: '80.00',
  },
];
