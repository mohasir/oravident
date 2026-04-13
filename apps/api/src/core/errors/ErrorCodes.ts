export const ErrorCodes = {
  system: {
    ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  },
  auth: {
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_TOKEN: 'INVALID_TOKEN',
  }

} as const;