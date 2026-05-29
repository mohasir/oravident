import { Calendar, dateFnsLocalizer, View, SlotInfo } from 'react-big-calendar';
import type { CalendarEvent } from '../types';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, Skeleton } from '@repo/ui';

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

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
        startAccessor="start"
        endAccessor="end"
        date={date}
        view={view}
        onNavigate={onNavigate}
        onView={onView}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable
        culture="es"
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
