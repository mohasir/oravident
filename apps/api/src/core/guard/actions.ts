export const ACTIONS = {
  CREATE: 'create',
  LIST:   'list',
  GET:    'get',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

export type Action    = (typeof ACTIONS)[keyof typeof ACTIONS];
export type ActionKey = keyof typeof ACTIONS;
