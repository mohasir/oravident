import { BranchSelect } from '@core/db/schema/branches.ts';
import { formatDate } from '@common/utils/date.ts';

export type Branch = BranchSelect;

export const branchResource = (branch: Branch) => {
  return {
    id: branch.id,
    clinicId: branch.id,
    name: branch.name,
    slug: branch.slug,
    email: branch.email,
    phone: branch.phone,
    latitude: branch.latitude,
    longitude: branch.longitude,
    settings: branch.settings,
    isActive: branch.isActive,
    createdAt: formatDate(branch.createdAt),
  };
};

export const branchCollectionResource = (branches: Branch[]) => {
  return branches.map(branchResource);
};
