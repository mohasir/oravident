import { startOfDay } from 'date-fns';

interface MonthDateHeaderProps {
  date: Date;
  label: string;
  isOffRange: boolean;
  onDrillDown: (e: React.SyntheticEvent) => void;
}

export function MonthDateHeader({
  date,
  label,
  isOffRange,
  onDrillDown,
}: MonthDateHeaderProps) {
  const isPast = startOfDay(date) < startOfDay(new Date());

  return (
    <a
      role="cell"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onDrillDown(e);
      }}
      style={{ cursor: isPast ? 'not-allowed' : undefined }}
      className={['rbc-button-link', isOffRange ? 'rbc-off-range' : '']
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </a>
  );
}
