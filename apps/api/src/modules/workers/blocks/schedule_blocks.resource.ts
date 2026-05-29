import { ScheduleBlockSelect } from '@core/db/schema/schedule_blocks.ts';
import { formatDate } from '@common/utils/date.ts';

export const scheduleBlockResource = (block: ScheduleBlockSelect) => ({
  id: block.id,
  workerId: block.workerId,
  branchId: block.branchId,
  clinicId: block.clinicId,
  startAt: formatDate(block.startAt),
  endAt: formatDate(block.endAt),
  reason: block.reason,
  createdAt: formatDate(block.createdAt),
});

export const scheduleBlockCollectionResource = (blocks: ScheduleBlockSelect[]) =>
  blocks.map(scheduleBlockResource);
