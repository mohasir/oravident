'use client';

import { format, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@repo/ui';

interface AgendaDateProps {
  day: Date;
  label: string;
}

export function AgendaDate({ day }: AgendaDateProps) {
  const today = isToday(day);
  const dayNum = format(day, 'd');
  const month = format(day, 'MMM', { locale: es }).toUpperCase();
  const weekday = format(day, 'EEE', { locale: es }).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-1 py-1 select-none">
      <span
        className={cn(
          'text-2xl font-light leading-none w-10 h-10 flex items-center justify-center rounded-full transition-colors',
          today
            ? 'bg-primary text-primary-foreground font-medium'
            : 'text-foreground'
        )}
      >
        {dayNum}
      </span>
      <span className="text-[10px] font-medium tracking-wide text-muted-foreground">
        {month}, {weekday}
      </span>
    </div>
  );
}
