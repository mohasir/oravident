import { db } from '../index.ts';
import { appointmentStatuses } from '../schema/index.ts';
import { APPOINTMENT_STATUSES_DATA } from './fixtures/appointment-statuses.ts';

export async function seedAppointmentStatuses() {
  console.log('📅 Seeding Appointment Statuses...');

  for (const status of APPOINTMENT_STATUSES_DATA) {
    await db
      .insert(appointmentStatuses)
      .values(status)
      .onConflictDoUpdate({
        target: appointmentStatuses.id,
        set: {
          name: status.name,
          color: status.color,
          bgColor: status.bgColor,
        },
      });
  }
}
