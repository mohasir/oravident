import { PublicUser } from '@/core/db/schema/users.ts';
import { formatDate } from '@common/utils/date.ts';

export const userResource = (user: PublicUser) => {
  return {
    id: user.id,
    email: user.email,
    isPlatformAdmin: user.isPlatformAdmin,
    isActive: user.isActive,
    createdAt: formatDate(user.createdAt),
    updatedAt: formatDate(user.updatedAt),
  };
};

export const userCollectionResource = (usersArr: PublicUser[]) => {
  return usersArr.map(userResource);
};
