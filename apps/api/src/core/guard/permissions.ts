import type { Action, ActionKey } from './actions.ts';
import type { Resource, ResourceKey } from './resources.ts';
import { permissionsMatrix }        from './permissions.matrix.ts';


export type PermissionKey  = `${ActionKey}_${ResourceKey}`;
export type PermissionCode = `${Action}-${Resource}`;

export const PERMISSIONS = Object.fromEntries(
  permissionsMatrix.flatMap(({ resource, actions }) =>
    actions.map((action) => [
      `${action.toUpperCase()}_${resource.toUpperCase()}` as PermissionKey,
      `${action}-${resource}` as PermissionCode,
    ]),
  ),
) as Record<PermissionKey, PermissionCode>;
