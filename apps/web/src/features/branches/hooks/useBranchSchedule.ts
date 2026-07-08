'use client';

import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { DAYS } from '../helpers';
import type { CreateBranchFormInput } from '../schemas/branch.schema';

export function useBranchSchedule() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<CreateBranchFormInput>();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'schedules',
  });

  const selectedSchedules = watch('schedules') ?? [];

  const [sundayClosed, setSundayClosed] = useState(
    () => !selectedSchedules.some((s) => s.days?.includes(7)),
  );

  const usedDays = new Set(selectedSchedules.flatMap((s) => s.days ?? []));
  const availableDayCount = sundayClosed ? 6 : 7;
  const canAddMore = usedDays.size < availableDayCount;

  const addSchedule = () => {
    if (!canAddMore) return;
    const allDays = sundayClosed ? DAYS.filter((d) => d.value !== 7) : DAYS;
    const nextDay = allDays.find((day) => !usedDays.has(day.value));
    append({
      days: nextDay ? [nextDay.value] : [1],
      openTime: '09:00',
      closeTime: '18:00',
    });
  };

  const toggleDay = (index: number, dayValue: number) => {
    const schedule = selectedSchedules[index];
    const currentDays = schedule?.days ?? [];
    const base = { openTime: schedule?.openTime ?? '09:00', closeTime: schedule?.closeTime ?? '18:00' };
    if (currentDays.includes(dayValue)) {
      if (currentDays.length === 1) return;
      update(index, { ...base, days: currentDays.filter((d) => d !== dayValue) });
    } else {
      update(index, { ...base, days: [...currentDays, dayValue].sort((a, b) => a - b) });
    }
  };

  const handleSundayClosed = (closed: boolean) => {
    if (closed) {
      for (let i = fields.length - 1; i >= 0; i--) {
        const schedule = selectedSchedules[i];
        if (schedule?.days?.includes(7)) {
          const newDays = schedule.days.filter((d) => d !== 7);
          if (newDays.length === 0) {
            remove(i);
          } else {
            update(i, {
              days: newDays,
              openTime: schedule.openTime ?? '09:00',
              closeTime: schedule.closeTime ?? '18:00',
            });
          }
        }
      }
    }
    setSundayClosed(closed);
  };

  const getAvailableDays = (currentIndex: number) => {
    const currentDays = selectedSchedules[currentIndex]?.days ?? [];
    const otherUsedDays = new Set(
      selectedSchedules
        .filter((_, i) => i !== currentIndex)
        .flatMap((s) => s.days ?? []),
    );

    return DAYS.filter((day) => (sundayClosed ? day.value !== 7 : true)).map((day) => ({
      ...day,
      disabled: otherUsedDays.has(day.value),
      selected: currentDays.includes(day.value),
    }));
  };

  return {
    fields,
    addSchedule,
    removeSchedule: remove,
    canAddMore,
    getAvailableDays,
    toggleDay,
    sundayClosed,
    setSundayClosed: handleSundayClosed,
    errors: errors.schedules,
  };
}
