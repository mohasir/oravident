import { BranchScheduleSelect } from '@core/db/schema/branch_schedules.ts';
import { formatDate } from '@common/utils/date.ts';

const DAY_NAMES: Record<number, string> = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
};

export const branchScheduleResource = (schedule: BranchScheduleSelect) => ({
  id: schedule.id,
  branchId: schedule.branchId,
  clinicId: schedule.clinicId,
  dayOfWeek: schedule.dayOfWeek,
  dayName: DAY_NAMES[schedule.dayOfWeek] ?? null,
  openTime: schedule.openTime,
  closeTime: schedule.closeTime,
  createdAt: formatDate(schedule.createdAt),
});

export const branchScheduleCollectionResource = (
  schedules: BranchScheduleSelect[],
) => schedules.map(branchScheduleResource);
