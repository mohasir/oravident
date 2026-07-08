import { startOfDay, parseISO, isValid, set } from 'date-fns';
import type { Branch } from '@/features/branches/types';

export function getDefaultDates(initialDate?: Date) {
  if (!initialDate) return { startsAt: '', endsAt: '' };
  const isFromMonthView =
    initialDate.getHours() === 0 && initialDate.getMinutes() === 0;
  const start = isFromMonthView
    ? set(initialDate, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 })
    : set(initialDate, { seconds: 0, milliseconds: 0 });
  const end = set(start, { hours: start.getHours() + 1 });
  return { startsAt: start.toISOString(), endsAt: end.toISOString() };
}

/** Converts JS getDay() (0=Sun…6=Sat) to backend convention (1=Mon…7=Sun) */
export function jsToSystemDay(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

/** Returns true if the date should be disabled in the date picker */
export function isAppointmentDateDisabled(
  date: Date,
  branch?: Branch,
): boolean {
  if (date < startOfDay(new Date())) return true;
  if (branch) {
    return !branch.schedules.some((s) => s.dayOfWeek === jsToSystemDay(date));
  }
  return false;
}

/** Returns the branch schedule (openTime/closeTime) for a given ISO date string */
export function getScheduleForDate(
  isoDate: string | undefined,
  branch?: Branch,
) {
  if (!isoDate || !branch) return undefined;
  const date = parseISO(isoDate);
  if (!isValid(date)) return undefined;
  console.log(
    branch.schedules.find((s) => s.dayOfWeek === jsToSystemDay(date)),
  );
  return branch.schedules.find((s) => s.dayOfWeek === jsToSystemDay(date));
}
