import type { ActionType, ActionKeyType, ResourceKeyType, ResourceType } from '../constants/index.ts';
import { permissionsMatrix } from '../mappings/permissions.matrix.ts';

export type PermissionKeyType = `${Uppercase<ActionKeyType>}_${Uppercase<ResourceKeyType>}`;
export type PermissionType    = `${ActionType}-${ResourceType}`;

export const PERMISSIONS = Object.fromEntries(
  permissionsMatrix.flatMap(({ resource, actions }) =>
    actions.map((action) => {
        const actionKey = action.toUpperCase();
        const resourceKey = resource.toUpperCase();
        return [
            `${actionKey}_${resourceKey}` as PermissionKeyType,
            `${action}-${resource}` as PermissionType,
        ];
    }),
  ),
) as Record<PermissionKeyType, PermissionType>;
