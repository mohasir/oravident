import { ACTIONS, RESOURCES, type ActionType, type ResourceType } from '../constants/index.ts';

export type PermissionsMatrixItem = {
  resource: ResourceType;
  actions: readonly ActionType[];
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
