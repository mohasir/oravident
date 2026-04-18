import { clinics } from '@core/db/schema/clinics.ts';

export type Clinic = typeof clinics.$inferSelect;

export const clinicResource = (clinic: Clinic) => {
  return {
    id: clinic.id,
    name: clinic.name,
    slug: clinic.slug,
    email: clinic.email,
    phone: clinic.phone,
    timeZone: clinic.timeZone,
    settings: clinic.settings,
    isActive: clinic.isActive,
    createdAt: clinic.createdAt,
  };
};

export const clinicCollectionResource = (clinics: Clinic[]) => {
  return clinics.map(clinicResource);
};
