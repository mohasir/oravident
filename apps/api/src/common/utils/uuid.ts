export const compareUUIDs = (
  uuid1: string | null | undefined,
  uuid2: string | null | undefined,
): boolean => {
  if (!uuid1 || !uuid2) return false;
  return uuid1.toLowerCase() === uuid2.toLowerCase();
};

export const isUUIDInList = (
  uuid: string | null | undefined,
  list: readonly string[],
): boolean => {
  if (!uuid) return false;
  const lowerUuid = uuid.toLowerCase();
  return list.some((item) => item.toLowerCase() === lowerUuid);
};
