import { useState, useMemo } from 'react';
import { View, Views } from 'react-big-calendar';
import { useAppointmentsQuery } from './useAppointmentsQuery';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export function useAppointmentsCalendar() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH);

  // For now, we fetch the whole month based on the current date
  const params = useMemo(() => ({
    startDate: format(startOfMonth(date), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    endDate: format(endOfMonth(date), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    pageSize: 1000, // Large enough to get all appointments for the month
  }), [date]);

  const { data, isLoading, error } = useAppointmentsQuery(params);

  const events = useMemo(() => {
    if (!data?.data?.items) return [];

    return data.data.items.map((apt) => ({
      id: apt.id,
      title: `${apt.patient?.fullName || 'Patient'} - ${apt.service?.name || 'Service'}`,
      start: new Date(apt.startsAt),
      end: new Date(apt.endsAt),
      resource: apt,
    }));
  }, [data]);

  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const onNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const onView = (newView: View) => {
    setView(newView);
  };

  const onSelectEvent = (event: any) => {
    setSelectedAppointmentId(event.id);
  };

  const onSelectSlot = (slotInfo: any) => {
    console.log('Selected slot:', slotInfo);
    // Here we would typically open a create dialog
  };

  return {
    events,
    date,
    view,
    isLoading,
    error,
    selectedAppointmentId,
    setSelectedAppointmentId,
    onNavigate,
    onView,
    onSelectEvent,
    onSelectSlot,
  };
}
