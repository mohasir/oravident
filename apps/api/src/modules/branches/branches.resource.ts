import { BranchSelect } from '@core/db/schema/branches.ts';
import { formatDate } from '@common/utils/date.ts';
import { omitFields } from '@common/utils/resource.ts';
import { branchScheduleCollectionResource } from '@modules/branches/schedule/branch_schedules.resource.ts';
import { BranchWithSchedules } from '@modules/branches/branches.service.ts';

export type Branch = BranchSelect;

export const branchResource = (branch: BranchWithSchedules) => ({
  id: branch.id,
  clinicId: branch.clinicId,
  name: branch.name,
  slug: branch.slug,
  address: branch.address,
  email: branch.email,
  phone: branch.phone,
  latitude: branch.latitude,
  longitude: branch.longitude,
  settings: branch.settings,
  isActive: branch.isActive,
  color: branch.color,
  createdAt: formatDate(branch.createdAt),
  schedules: omitFields(branchScheduleCollectionResource(branch.schedules), [
    'clinicId',
    'branchId',
  ]),
});

export const branchCollectionResource = (branches: BranchWithSchedules[]) =>
  branches.map(branchResource);
