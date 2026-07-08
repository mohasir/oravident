import type { EventProps } from 'react-big-calendar';
import { format } from 'date-fns';
import { useState } from 'react';
import type { CalendarEvent } from '../../types';

export function MonthEvent({ event }: EventProps<CalendarEvent>) {
  const color = event.resource?.branch?.color || 'var(--primary)';
  const timeStr = format(event.start, 'HH:mm');
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-1 w-full overflow-hidden min-w-0 rounded px-0.5 transition-colors duration-150 p-1"
      style={{ backgroundColor: hovered ? `${color}26` : 'transparent' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-[11px] text-primary font-semibold shrink-0 leading-none">
        {timeStr}
      </span>
      <span className="text-[11px] text-primary truncate leading-none">
        {event.title}
      </span>
    </div>
  );
}
