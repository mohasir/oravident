import { BranchServiceSelect } from '@core/db/schema/branch_services.ts';
import { formatDate } from '@common/utils/date.ts';

export const branchServiceResource = (record: BranchServiceSelect) => ({
  id: record.id,
  branchId: record.branchId,
  serviceId: record.serviceId,
  clinicId: record.clinicId,
  priceOverride: record.priceOverride,
  isActive: record.isActive,
  createdAt: formatDate(record.createdAt),
  updatedAt: formatDate(record.updatedAt),
});

export const branchServiceCollectionResource = (records: BranchServiceSelect[]) =>
  records.map(branchServiceResource);
