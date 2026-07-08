'use client';

import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from '../../index';
import {
  generateSlots,
  formatSlotLabel,
  isValidTimeInputKey,
  DEFAULT_MIN,
  DEFAULT_MAX,
} from './timeSlotPicker.helpers';

interface TimeSlotPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  interval?: number;
  placeholder?: string;
  disabled?: boolean;
}

export function TimeSlotPicker({
  value,
  onChange,
  min,
  max,
  interval = 15,
  placeholder = 'Seleccionar hora',
  disabled,
}: TimeSlotPickerProps) {
  const slots = generateSlots(min ?? DEFAULT_MIN, max ?? DEFAULT_MAX, interval);

  return (
    <Combobox
      value={value ?? null}
      onValueChange={(v) => onChange?.(v as string)}
      items={slots}
    >
      <ComboboxInput
        className="h-9.5"
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={(e) => {
          if (!isValidTimeInputKey(e)) e.preventDefault();
        }}
      />
      <ComboboxContent>
        <ComboboxList>
          {(slot: string) => (
            <ComboboxItem key={slot} value={slot}>
              {formatSlotLabel(slot)}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>Sin resultados</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
}
