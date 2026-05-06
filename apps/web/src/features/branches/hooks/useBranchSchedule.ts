'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { DAYS } from '../helpers';
import type { CreateBranchFormInput } from '../schemas/branch.schema';
import { useTranslation } from 'react-i18next';

export function useBranchSchedule() {
  const { t } = useTranslation('admin');
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<CreateBranchFormInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedules',
  });

  const selectedSchedules = watch('schedules') || [];
  const selectedDays = selectedSchedules.map((s) => Number(s.dayOfWeek));

  const canAddMore = fields.length < 7;

  const addSchedule = () => {
    if (!canAddMore) return;

    // Find the first day that is not selected
    const nextDay = DAYS.find((day) => !selectedDays.includes(day.value));

    append({
      dayOfWeek: nextDay ? nextDay.value : 1,
      openTime: '09:00',
      closeTime: '18:00',
    });
  };

  const getAvailableDays = (currentIndex: number) => {
    const currentDay = Number(selectedSchedules[currentIndex]?.dayOfWeek);

    return DAYS.map((day) => ({
      ...day,
      disabled: selectedDays.includes(day.value) && day.value !== currentDay,
      label: t(day.key, day.label),
    }));
  };

  return {
    fields,
    addSchedule,
    removeSchedule: remove,
    canAddMore,
    getAvailableDays,
    errors: errors.schedules,
  };
}
