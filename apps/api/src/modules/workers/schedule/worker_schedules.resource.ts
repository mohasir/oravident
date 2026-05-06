import { WorkerScheduleSelect } from '@core/db/schema/worker_schedules.ts';
import { formatDate } from '@common/utils/date.ts';

const DAY_NAMES: Record<number, string> = {
  1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
  4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday',
};

export const workerScheduleResource = (schedule: WorkerScheduleSelect) => ({
  id: schedule.id,
  workerId: schedule.workerId,
  branchId: schedule.branchId,
  clinicId: schedule.clinicId,
  dayOfWeek: schedule.dayOfWeek,
  dayName: DAY_NAMES[schedule.dayOfWeek] ?? null,
  startTime: schedule.startTime,
  endTime: schedule.endTime,
  isActive: schedule.isActive,
  createdAt: formatDate(schedule.createdAt),
});

export const workerScheduleCollectionResource = (schedules: WorkerScheduleSelect[]) =>
  schedules.map(workerScheduleResource);
