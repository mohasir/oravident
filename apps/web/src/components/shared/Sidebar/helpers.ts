import { NavGroup } from '@/constants/navigation';
import { useCan } from '@/lib/auth';

export const isGroupVisible = (
  group: NavGroup,
  can: ReturnType<typeof useCan>['can'],
): boolean => {
  return group.items.some((item) => {
    if (item.children?.length) {
      return item.children.some(
        (child) => !child.guard?.length || can(child.guard),
      );
    }
    return !item.guard?.length || can(item.guard);
  });
};
