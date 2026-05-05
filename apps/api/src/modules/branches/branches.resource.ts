import { BranchSelect } from '@core/db/schema/branches.ts';
import { formatDate } from '@common/utils/date.ts';

export type Branch = BranchSelect;

export const branchResource = (branch: Branch) => {
  return {
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
  };
};

export const branchCollectionResource = (branches: Branch[]) => {
  return branches.map(branchResource);
};
