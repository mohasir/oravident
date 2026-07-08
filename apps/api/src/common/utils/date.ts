import dayjs from 'dayjs';

// Normalizes a DB time string (HH:MM:SS or HH:MM) to HH:MM
export const formatTime = (time: string | null | undefined): string | null => {
  if (!time) return null;
  const parsed = dayjs(`1970-01-01T${time}`);
  return parsed.isValid() ? parsed.format('HH:mm') : null;
};

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
