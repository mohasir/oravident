'use client';

import { useAppointmentForm } from '../hooks/useAppointmentForm';
import {
  Button,
  Input,
  Alert,
  FormField,
  cn,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DatePicker,
  TimeSlotPicker,
} from '@repo/ui';
import { Controller } from 'react-hook-form';
import { parseISO, isValid, format } from 'date-fns';
import type { Appointment, AppointmentStatus } from '../types';

interface AppointmentFormProps {
  initialData?: Appointment;
  initialDate?: Date;
  onSuccess?: () => void;
  className?: string;
}

export function AppointmentForm({
  initialData,
  initialDate,
  onSuccess,
  className,
}: AppointmentFormProps) {
  const {
    form,
    onSubmit,
    isSubmitting,
    isDirty,
    isEditing,
    t,
    branches,
    patients,
    doctors,
    services,
    statuses,
    isDateDisabled,
    isTimeDisabled,
    scheduleMin,
    scheduleMax,
    startsAt,
    endsAt,
    handleDateChange,
    handleTimeChange,
  } = useAppointmentForm({
    initialData,
    initialDate,
    onSuccess,
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className={cn('grid gap-6', className)}>
      {errors.root && <Alert.error>{errors.root.message}</Alert.error>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label={t('appointment.form.fields.branch.label', 'Sucursal')}
          required
          htmlFor="branchId"
          error={errors.branchId?.message ? t(errors.branchId.message) : undefined}
        >
          <Controller
            control={control}
            name="branchId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <SelectTrigger id="branchId">
                  <SelectValue placeholder={t('common.select.placeholder', 'Seleccionar...')} />
                </SelectTrigger>
                <SelectContent>
                  {branches.length > 0 ? (
                    branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-xs text-muted-foreground">
                      {t('common.noResults', 'No hay resultados')}
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField
          label={t('appointment.form.fields.status.label', 'Estado')}
          required
          htmlFor="statusId"
          error={errors.statusId?.message ? t(errors.statusId.message) : undefined}
        >
          <Controller
            control={control}
            name="statusId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <SelectTrigger id="statusId">
                  <SelectValue placeholder={t('common.select.placeholder', 'Seleccionar...')} />
                </SelectTrigger>
                <SelectContent>
                  {statuses.length > 0 ? (
                    statuses.map((status: AppointmentStatus) => (
                      <SelectItem key={status.id} value={status.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                          {status.name}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-xs text-muted-foreground">
                      {t('common.noResults', 'No hay resultados')}
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label={t('appointment.form.fields.patient.label', 'Paciente')}
          required
          htmlFor="patientId"
          error={errors.patientId?.message ? t(errors.patientId.message) : undefined}
        >
          <Controller
            control={control}
            name="patientId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <SelectTrigger id="patientId">
                  <SelectValue placeholder={t('common.select.placeholder', 'Seleccionar...')} />
                </SelectTrigger>
                <SelectContent>
                  {patients.length > 0 ? (
                    patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {`${patient.firstName} ${patient.lastName}`}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-xs text-muted-foreground">
                      {t('common.noResults', 'No hay resultados')}
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField
          label={t('appointment.form.fields.worker.label', 'Doctor(a)')}
          required
          htmlFor="workerId"
          error={errors.workerId?.message ? t(errors.workerId.message) : undefined}
        >
          <Controller
            control={control}
            name="workerId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <SelectTrigger id="workerId">
                  <SelectValue placeholder={t('common.select.placeholder', 'Seleccionar...')} />
                </SelectTrigger>
                <SelectContent>
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {`${doctor.prefix || ''} ${doctor.fullName}`.trim()}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-xs text-muted-foreground">
                      {t('common.noResults', 'No hay resultados')}
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label={t('appointment.form.fields.service.label', 'Servicio')}
          required
          htmlFor="serviceId"
          error={errors.serviceId?.message ? t(errors.serviceId.message) : undefined}
        >
          <Controller
            control={control}
            name="serviceId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <SelectTrigger id="serviceId">
                  <SelectValue placeholder={t('common.select.placeholder', 'Seleccionar...')} />
                </SelectTrigger>
                <SelectContent>
                  {services.length > 0 ? (
                    services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-xs text-muted-foreground">
                      {t('common.noResults', 'No hay resultados')}
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField
          label={t('appointment.form.fields.price.label', 'Costo (Opcional)')}
          htmlFor="price"
          error={errors.price?.message ? t(errors.price.message) : undefined}
        >
          <Input
            id="price"
            {...register('price')}
            placeholder="0.00"
            type="number"
            step="0.01"
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">{t('appointment.form.sections.schedule', 'Horario de la cita')}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label={t('appointment.form.fields.date.label', 'Fecha')}
            required
            htmlFor="appointment-date"
            error={errors.startsAt?.message ? t(errors.startsAt.message) : undefined}
          >
            <DatePicker
              value={startsAt ? parseISO(startsAt) : undefined}
              onChange={(date) => {
                handleDateChange(date, 'startsAt');
                handleDateChange(date, 'endsAt');
              }}
              placeholder={t('common.select.date', 'Seleccionar fecha')}
              disabledDays={isDateDisabled}
            />
          </FormField>

          <FormField
            label={t('appointment.form.fields.startTime.label', 'Hora Inicio')}
            required
            htmlFor="startTime"
          >
            <TimeSlotPicker
              value={startsAt && isValid(parseISO(startsAt)) ? format(parseISO(startsAt), 'HH:mm') : undefined}
              onChange={(value) => handleTimeChange(value, 'startsAt')}
              min={scheduleMin}
              max={scheduleMax}
              placeholder={t('common.select.time', 'Seleccionar hora')}
              disabled={isTimeDisabled}
            />
          </FormField>

          <FormField
            label={t('appointment.form.fields.endTime.label', 'Hora Fin')}
            required
            htmlFor="endTime"
            error={errors.endsAt?.message ? t(errors.endsAt.message) : undefined}
          >
            <TimeSlotPicker
              value={endsAt && isValid(parseISO(endsAt)) ? format(parseISO(endsAt), 'HH:mm') : undefined}
              onChange={(value) => handleTimeChange(value, 'endsAt')}
              min={scheduleMin}
              max={scheduleMax}
              placeholder={t('common.select.time', 'Seleccionar hora')}
              disabled={isTimeDisabled}
            />
          </FormField>
        </div>
      </div>

      <FormField
        label={t('appointment.form.fields.notes.label', 'Notas')}
        htmlFor="notes"
        error={errors.notes?.message ? t(errors.notes.message) : undefined}
      >
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder={t('appointment.form.fields.notes.placeholder', 'Notas adicionales...')}
        />
      </FormField>

      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
        disabled={isEditing && !isDirty}
      >
        {isEditing
          ? t('appointment.form.submitEdit', 'Actualizar Cita')
          : t('appointment.form.submit', 'Crear Cita')}
      </Button>
    </form>
  );
}
