export const DB_LIMITS = {
  NAME: 100,
  EMAIL: 100,
  SLUG: 100,
  PASSWORD: 100,
  PHONE: 20, // Formato E.164
  SHORT_NAME: 50,
  URL: 500,
  ZIP_CODE: 20,
  COLOR_HEX: 7,
  TIMEZONE: 50,
  ID_NUMBER: 20,
  GENDER: 20,
  PREFIX: 20
} as const;
