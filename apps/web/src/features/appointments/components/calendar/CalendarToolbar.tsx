import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ToolbarProps, View } from 'react-big-calendar';
import type { CalendarEvent } from '../../types';

const VIEW_LABELS: Partial<Record<string, string>> = {
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
};

export function CalendarToolbar({
  label,
  onNavigate,
  onView,
  view,
  views,
}: ToolbarProps<CalendarEvent>) {
  const viewNames = Array.isArray(views)
    ? views
    : (Object.keys(views) as View[]);

  return (
    <div className="flex items-center gap-1 pb-4">
      <button
        type="button"
        onClick={() => onNavigate('TODAY')}
        className="px-3 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors mr-1"
      >
        Hoy
      </button>

      <button
        type="button"
        onClick={() => onNavigate('PREV')}
        aria-label="Anterior"
        className="p-1.5 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => onNavigate('NEXT')}
        aria-label="Siguiente"
        className="p-1.5 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <span className="flex-1 px-2 text-xl font-normal">{label}</span>

      <div className="flex items-center border border-border rounded-md overflow-hidden">
        {viewNames.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onView(v)}
            className={
              v === view
                ? 'px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground'
                : 'px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors border-l border-border first:border-l-0'
            }
          >
            {VIEW_LABELS[v] ?? v}
          </button>
        ))}
      </div>
    </div>
  );
}
