import type { EventProps } from 'react-big-calendar';
import { format } from 'date-fns';
import { useLayoutEffect, useRef } from 'react';
import type { CalendarEvent } from '../../types';

export function DayEvent({ event }: EventProps<CalendarEvent>) {
  const color = event.resource?.branch?.color ?? 'var(--primary)';
  const worker = event.resource?.worker;
  const workerLabel = worker
    ? `${worker.prefix ?? ''} ${worker.fullName}`.trim()
    : null;
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const eventEl = ref.current?.closest('.rbc-event') as HTMLElement | null;
    if (!eventEl) return;
    eventEl.style.backgroundColor = `${color}18`;
    eventEl.style.color = color;
  }, [color]);

  return (
    <div ref={ref} className="h-full overflow-hidden px-2 py-1 flex flex-col gap-0.5">
      <p className="text-[12px] font-semibold leading-tight truncate">
        {event.resource?.patient?.fullName ?? event.title}
      </p>
      {event.resource?.service?.name && (
        <p className="text-[11px] leading-tight opacity-80 truncate">
          {event.resource.service.name}
        </p>
      )}
      <p className="text-[11px] leading-tight opacity-70">
        {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
      </p>
      {workerLabel && (
        <p className="text-[10px] leading-tight opacity-60 truncate">
          {workerLabel}
        </p>
      )}
    </div>
  );
}
