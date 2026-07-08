import { parse, format } from 'date-fns';
import type * as React from 'react';

const CONTROL_KEYS = new Set([
  'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
  'ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Escape', 'Home', 'End',
]);

const ALLOWED_PATTERN = /^[0-9:apmAPM\s]$/;

export function isValidTimeInputKey(e: React.KeyboardEvent<HTMLInputElement>): boolean {
  if (e.ctrlKey || e.metaKey) return true;
  if (CONTROL_KEYS.has(e.key)) return true;
  return ALLOWED_PATTERN.test(e.key);
}

export const DEFAULT_MIN = '00:00';
export const DEFAULT_MAX = '23:45';
export const DEFAULT_VALUE = '08:00';

export function generateSlots(min: string, max: string, interval: number): string[] {
  const minParts = min.split(':').map(Number);
  const maxParts = max.split(':').map(Number);
  const start = (minParts[0] ?? 0) * 60 + (minParts[1] ?? 0);
  const end = (maxParts[0] ?? 0) * 60 + (maxParts[1] ?? 0);
  const slots: string[] = [];
  for (let current = start; current <= end; current += interval) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
  return slots;
}

export function formatSlotLabel(slot: string): string {
  return format(parse(slot, 'HH:mm', new Date()), 'hh:mm a');
}
