import { useCallback } from 'react';
import { Calendar, dateFnsLocalizer, View, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/appointments-calendar.css';
import { Card, Skeleton } from '@repo/ui';
import type { CalendarEvent } from '../../types';
import { MonthEvent } from './MonthEvent';
import { MonthDateHeader } from './MonthDateHeader';
import { WeekEvent } from './WeekEvent';
import { DayEvent } from './DayEvent';
import { AgendaEvent } from './AgendaEvent';
import { AgendaDate } from './AgendaDate';
import { AgendaTime } from './AgendaTime';
import { CalendarToolbar } from './CalendarToolbar';

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const calendarComponents = {
  toolbar: CalendarToolbar,
  month: {
    event: MonthEvent,
    dateHeader: MonthDateHeader,
  },
  week: {
    event: WeekEvent,
  },
  day: {
    event: DayEvent,
  },
  agenda: {
    event: AgendaEvent,
    date: AgendaDate,
    time: AgendaTime,
  },
};

interface AppointmentsCalendarProps {
  events: CalendarEvent[];
  date: Date;
  view: View;
  isLoading: boolean;
  onNavigate: (newDate: Date) => void;
  onView: (newView: View) => void;
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectSlot: (slotInfo: SlotInfo) => void;
}

export function AppointmentsCalendar({
  events,
  date,
  view,
  isLoading,
  onNavigate,
  onView,
  onSelectEvent,
  onSelectSlot,
}: AppointmentsCalendarProps) {
  const eventPropGetter = useCallback(
    (event: CalendarEvent) => {
      if (view === 'agenda') return {};
      const color =
        event.resource?.branch?.color || event.resource?.status?.color;
      return {
        style: color ? { backgroundColor: color, borderColor: color } : {},
      };
    },
    [view],
  );

  const dayPropGetter = useCallback((d: Date) => {
    const isPast = startOfDay(d) < startOfDay(new Date());
    return isPast ? { className: 'rbc-day-past' } : {};
  }, []);

  const slotPropGetter = useCallback((d: Date) => {
    return d < new Date() ? { className: 'rbc-slot-past' } : {};
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6 h-175">
        <Skeleton className="w-full h-full" />
      </Card>
    );
  }

  return (
    <div className="h-175">
      <Calendar
        localizer={localizer}
        events={events}
        date={date}
        view={view}
        onNavigate={onNavigate}
        onView={onView}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable
        culture="es"
        components={calendarComponents}
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
        slotPropGetter={slotPropGetter}
        messages={{
          next: 'Siguiente',
          previous: 'Anterior',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'No hay citas en este rango.',
        }}
        style={{ height: '100%' }}
      />
    </div>
  );
}
