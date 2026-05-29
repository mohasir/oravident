export const formatDate = (date: Date | null | undefined): string | null => {
  if (!date) return null;
  return date.toISOString();
};

export const formatDateOnly = (date: string | null | undefined): string | null => {
  if (!date) return null;
  return date;
};

// Returns 1=Monday ... 7=Sunday (UTC-based)
export const getDayOfWeek = (date: Date): number => {
  const day = date.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  return day === 0 ? 7 : day;
};

// Returns 'HH:MM' extracted in UTC — matches HH:MM time columns in DB
export const getTimeUTC = (date: Date): string => {
  const h = String(date.getUTCHours()).padStart(2, '0');
  const m = String(date.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};
