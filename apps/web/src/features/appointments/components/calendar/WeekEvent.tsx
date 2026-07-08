import type { EventProps } from 'react-big-calendar';
import { format } from 'date-fns';
import { useLayoutEffect, useRef } from 'react';
import type { CalendarEvent } from '../../types';

export function WeekEvent({ event }: EventProps<CalendarEvent>) {
  const color = event.resource?.branch?.color ?? 'var(--primary)';
  const timeRange = `${format(event.start, 'HH:mm')} - ${format(event.end, 'HH:mm')}`;
  const title = event.title;
  const branchName = event.resource?.branch?.name;
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const eventEl = ref.current?.closest('.rbc-event') as HTMLElement | null;
    if (!eventEl) return;
    eventEl.style.backgroundColor = `${color}18`;
    eventEl.style.color = color;
  }, [color]);

  return (
    <div ref={ref} className="h-full overflow-hidden px-1 flex flex-col">
      <p className="text-[11px] font-semibold leading-tight truncate">
        {title}
      </p>
      <p className="text-[11px] leading-2.75 my-0.5 opacity-70">
        {timeRange}
      </p>
      {branchName && (
        <p className="text-[11px] leading-2.75 opacity-60 truncate">
          {branchName}
        </p>
      )}
    </div>
  );
}
