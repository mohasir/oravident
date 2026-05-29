'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  Separator,
} from '@repo/ui';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  DollarSign,
  Info,
  History,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import { Skeleton } from '@repo/ui';
import type { Appointment } from '../types';

interface AppointmentDetailDialogProps {
  appointment: Appointment | null;
  isLoading?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailDialog({
  appointment,
  isLoading,
  open,
  onOpenChange,
}: AppointmentDetailDialogProps) {
  const { t } = useTranslation('admin');

  if (!open) return null;

  const startDate = appointment ? new Date(appointment.startsAt) : null;
  const endDate = appointment ? new Date(appointment.endsAt) : null;
  const createdAt = appointment ? new Date(appointment.createdAt) : null;
  const updatedAt = appointment ? new Date(appointment.updatedAt) : null;
  const cancelledAt = appointment?.cancelledAt ? new Date(appointment.cancelledAt) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex flex-col items-start gap-1">
            <DialogTitle>
              {t('appointment.detail.title', 'Detalle de la Cita')}
            </DialogTitle>
            {appointment?.status && (
              <div
                className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `${appointment.status.color}20`,
                  color: appointment.status.color,
                  border: `1px solid ${appointment.status.color}40`,
                }}
              >
                {appointment.status.name}
              </div>
            )}
          </div>
        </DialogHeader>
        <DialogBody>
          {isLoading || !appointment ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Paciente */}
                <div className="flex items-center space-x-3 text-sm">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold">
                      {t('appointment.detail.patient', 'Paciente')}
                    </p>
                    <p className="font-medium text-base">
                      {appointment.patient?.fullName ||
                        t('common.unknown', 'Desconocido')}
                    </p>
                  </div>
                </div>

                {/* Doctor */}
                <div className="flex items-center space-x-3 text-sm">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold">
                      {t('appointment.detail.worker', 'Doctor(a)')}
                    </p>
                    <p className="font-medium text-base">
                      {appointment.worker
                        ? `${appointment.worker.prefix || ''} ${appointment.worker.fullName}`.trim()
                        : t('common.unknown', 'Desconocido')}
                    </p>
                    {appointment.worker?.specialty && (
                      <p className="text-xs text-muted-foreground">
                        {appointment.worker.specialty}
                      </p>
                    )}
                  </div>
                </div>

                {/* Servicio */}
                <div className="flex items-center space-x-3 text-sm">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Stethoscope className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold">
                      {t('appointment.detail.service', 'Servicio')}
                    </p>
                    <p className="font-medium text-base">
                      {appointment.service?.name ||
                        t('common.unknown', 'Desconocido')}
                    </p>
                  </div>
                </div>

                {/* Costo */}
                <div className="flex items-center space-x-3 text-sm">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold">
                      {t('appointment.detail.price', 'Costo')}
                    </p>
                    <p className="font-medium text-base">
                      {appointment.price ? `$${appointment.price}` : t('common.not_specified', 'No especificado')}
                    </p>
                  </div>
                </div>

                {/* Fecha */}
                <div className="flex items-center space-x-3 text-sm">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold">
                      {t('appointment.detail.date', 'Fecha')}
                    </p>
                    <p className="font-medium text-base capitalize">
                      {startDate ? format(startDate, "EEEE, d 'de' MMMM yyyy", {
                        locale: es,
                      }) : ''}
                    </p>
                  </div>
                </div>

                {/* Horario */}
                <div className="flex items-center space-x-3 text-sm">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold">
                      {t('appointment.detail.time', 'Horario')}
                    </p>
                    <p className="font-medium text-base">
                      {startDate && endDate ? `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {appointment.notes && (
                <>
                  <Separator />
                  <div className="flex items-start space-x-3 text-sm">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-semibold">
                        {t('appointment.detail.notes', 'Notas')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 italic">
                        &quot;{appointment.notes}&quot;
                      </p>
                    </div>
                  </div>
                </>
              )}

              {cancelledAt && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-destructive">
                    <XCircle className="w-4 h-4" />
                    <p className="font-semibold text-sm uppercase">
                      {t('appointment.detail.cancelled_title', 'Cita Cancelada')}
                    </p>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">{t('appointment.detail.cancelled_at', 'Fecha de cancelación')}:</span>{' '}
                      {format(cancelledAt, "d 'de' MMMM, yyyy HH:mm", { locale: es })}
                    </p>
                    {appointment.cancelledBy && (
                      <p>
                        <span className="font-medium">{t('appointment.detail.cancelled_by', 'Cancelado por')}:</span>{' '}
                        {appointment.cancelledBy}
                      </p>
                    )}
                    {appointment.cancelReason && (
                      <p>
                        <span className="font-medium">{t('appointment.detail.cancel_reason', 'Motivo')}:</span>{' '}
                        {appointment.cancelReason}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <History className="w-3.5 h-3.5" />
                  <p className="text-xs font-semibold uppercase">
                    {t('appointment.detail.metadata', 'Historial del registro')}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <p>{t('appointment.detail.created_at', 'Creado el')}:</p>
                    <p className="font-medium text-foreground">
                      {createdAt ? format(createdAt, "d 'de' MMMM, yyyy HH:mm", { locale: es }) : '-'}
                    </p>
                  </div>
                  <div>
                    <p>{t('appointment.detail.updated_at', 'Última actualización')}:</p>
                    <p className="font-medium text-foreground">
                      {updatedAt ? format(updatedAt, "d 'de' MMMM, yyyy HH:mm", { locale: es }) : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
