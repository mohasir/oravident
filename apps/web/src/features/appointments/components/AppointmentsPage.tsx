'use client';

import { useTranslation } from 'react-i18next';
import { AppointmentsCalendar } from './AppointmentsCalendar';
import { useAppointmentsCalendar } from '../hooks/useAppointmentsCalendar';
import { AppointmentDetailDialog } from './AppointmentDetailDialog';
import { useQueryAppointment } from '../hooks/useAppointmentsQuery';

export function AppointmentsPage() {
  const { t } = useTranslation('admin');
  const {
    selectedAppointmentId,
    setSelectedAppointmentId,
    ...calendarProps
  } = useAppointmentsCalendar();

  const { data: appointmentDetail, isLoading: isDetailLoading } = useQueryAppointment(selectedAppointmentId || '');

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {t('appointment.index.title', 'Citas')}
        </h2>
      </div>
      <div className="space-y-4">
        <AppointmentsCalendar {...calendarProps} />
      </div>

      <AppointmentDetailDialog
        appointment={appointmentDetail?.data || null}
        isLoading={isDetailLoading}
        open={!!selectedAppointmentId}
        onOpenChange={(open) => !open && setSelectedAppointmentId(null)}
      />
    </div>
  );
}
