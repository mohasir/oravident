'use client';

import type { EventProps } from 'react-big-calendar';
import type { CalendarEvent } from '../../types';

export function AgendaEvent({ event }: EventProps<CalendarEvent>) {
  const serviceName = event.resource?.service?.name;
  const patientName = event.resource?.patient?.fullName;
  const branchName = event.resource?.branch?.name;

  return (
    <div className="py-0.5">
      <p className="text-sm font-medium leading-snug">
        {serviceName ?? event.title}
      </p>
      {(patientName ?? branchName) && (
        <p className="text-xs text-muted-foreground mt-0.5">
          {[patientName, branchName].filter(Boolean).join(' · ')}
        </p>
      )}
    </div>
  );
}
