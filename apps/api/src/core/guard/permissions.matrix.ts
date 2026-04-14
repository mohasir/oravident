import { ACTIONS, type Action } from './actions.ts';
import { RESOURCES, type Resource } from './resources.ts';

export type PermissionsMatrixItem = {
  resource: Resource;
  actions: readonly Action[];
};

const {CREATE, LIST, GET, UPDATE, DELETE} = ACTIONS;

export const permissionsMatrix = [
  {
    resource: RESOURCES.APPOINTMENT,
    actions: [CREATE, LIST, GET, UPDATE, DELETE],
  },
  {
    resource: RESOURCES.CLINIC,
    actions: [CREATE, LIST, GET, UPDATE, DELETE],
  },
  {
    resource: RESOURCES.PATIENT,
    actions: [CREATE, LIST, GET, UPDATE, DELETE],
  },
  {
    resource: RESOURCES.WORKER,
    actions: [CREATE, LIST, GET, UPDATE, DELETE],
  },
  {
    resource: RESOURCES.BRANCH,
    actions: [CREATE, LIST, GET, UPDATE, DELETE],
  },
  {
    resource: RESOURCES.SERVICE,
    actions: [CREATE, LIST, GET, UPDATE, DELETE],
  },
  {
    resource: RESOURCES.SCHEDULE,
    actions: [CREATE, LIST, GET, UPDATE, DELETE],
  },
  {
    resource: RESOURCES.USER,
    actions: [CREATE, LIST, GET, UPDATE, DELETE],
  },
  {
    resource: RESOURCES.ROLE,
    actions: [CREATE, LIST, GET, UPDATE, DELETE],
  },
  {
    resource: RESOURCES.NOTIFICATION,
    actions: [LIST, GET, UPDATE, DELETE],
  },
  {
    resource: RESOURCES.COMMUNICATION,
    actions: [CREATE, LIST, GET],
  },
] as const satisfies readonly PermissionsMatrixItem[];
