export const formatDate = (date: Date | null | undefined): string | null => {
  if (!date) return null;
  return date.toISOString();
};

export const formatDateOnly = (date: string | null | undefined): string | null => {
  if (!date) return null;
  return date;
};
