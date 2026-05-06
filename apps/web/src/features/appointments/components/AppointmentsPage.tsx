'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@repo/ui';
import { AppointmentsCalendar } from './AppointmentsCalendar';
import { useAppointmentsCalendar } from '../hooks/useAppointmentsCalendar';
import { AppointmentDetailDialog } from './AppointmentDetailDialog';
import { CreateAppointmentDialog } from './CreateAppointmentDialog';
import { useQueryAppointment } from '../hooks/useAppointmentsQuery';

export function AppointmentsPage() {
  const { t } = useTranslation('admin');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('appointment.index.add', 'Nueva cita')}
        </Button>
      </div>
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
