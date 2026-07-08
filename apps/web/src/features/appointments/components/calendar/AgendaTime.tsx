'use client';

import { format, isValid } from 'date-fns';
import type { CalendarEvent } from '../../types';

interface AgendaTimeSlotProps {
  event: object;
  label: string;
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date) return isValid(value) ? value : null;
  if (typeof value === 'string') {
    const d = new Date(value);
    return isValid(d) ? d : null;
  }
  return null;
}

export function AgendaTime({ event, label }: AgendaTimeSlotProps) {
  const calEvent = event as CalendarEvent & { start?: unknown; end?: unknown };
  const color = calEvent.resource?.branch?.color ?? 'var(--primary)';

  const startDate = toDate(calEvent.start);
  const endDate = toDate(calEvent.end);

  const startStr = startDate ? format(startDate, 'h:mm') : null;
  const endStr = endDate ? format(endDate, 'h:mmaaa').replace(':00', '') : null;

  const timeLabel = startStr && endStr ? `${startStr} - ${endStr}` : label;

  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap">
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm text-muted-foreground">{timeLabel}</span>
    </div>
  );
}
