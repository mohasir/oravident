'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/shared/PageHeader';
import { AppointmentsCalendar } from './AppointmentsCalendar';
import { useAppointmentsCalendar } from '../hooks/useAppointmentsCalendar';
import { AppointmentDetailDialog } from './AppointmentDetailDialog';
import { CreateAppointmentDialog } from './CreateAppointmentDialog';
import { useQueryAppointment } from '../hooks/useAppointmentsQuery';

export function AppointmentsPage() {
  const { t } = useTranslation('admin');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { selectedAppointmentId, setSelectedAppointmentId, ...calendarProps } =
    useAppointmentsCalendar();

  const { data: appointmentDetail, isLoading: isDetailLoading } =
    useQueryAppointment(selectedAppointmentId || '');

  return (
    <div>
      <PageHeader
        title={t('appointment.index.title', 'Citas')}
        actionLabel={t('appointment.index.add', 'Nueva cita')}
        onActionClick={() => setIsCreateDialogOpen(true)}
      />
      <div className="space-y-4">
        <AppointmentsCalendar {...calendarProps} />
      </div>

      {/* Detalle de Cita */}
      <AppointmentDetailDialog
        appointment={appointmentDetail?.data || null}
        isLoading={isDetailLoading}
        open={!!selectedAppointmentId}
        onOpenChange={(open) => !open && setSelectedAppointmentId(null)}
      />

      {/* Crear Nueva Cita */}
      <CreateAppointmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
