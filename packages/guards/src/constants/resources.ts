export const RESOURCES = {
  APPOINTMENT:    'appointment',
  PATIENT:        'patient',
  CLINIC:         'clinic',
  BRANCH:         'branch',
  WORKER:         'worker',
  SERVICE:        'service',
  SCHEDULE:       'schedule',
  USER:           'user',
  ROLE:           'role',
  NOTIFICATION:   'notification',
  COMMUNICATION:  'communication',
} as const;

export type ResourceType    = (typeof RESOURCES)[keyof typeof RESOURCES];
export type ResourceKeyType = keyof typeof RESOURCES;
