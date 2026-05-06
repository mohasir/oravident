'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import {
  Button,
  FormField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TimePicker,
} from '@repo/ui';
import { useTranslation } from 'react-i18next';
import type { CreateBranchFormInput } from '@/features/branches/schemas/branch.schema';
import { useBranchSchedule } from '@/features/branches/hooks/useBranchSchedule';

export function BranchScheduleFields() {
  const { t } = useTranslation('admin');
  const { control } = useFormContext<CreateBranchFormInput>();
  const {
    fields,
    addSchedule,
    removeSchedule,
    canAddMore,
    getAvailableDays,
    errors,
  } = useBranchSchedule();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          {t('branch.form.schedules.title', 'Schedules')}
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSchedule}
          disabled={!canAddMore}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('branch.form.schedules.add', 'Add Schedule')}
        </Button>
      </div>

      <div className="grid gap-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 sm:grid-cols-[1.5fr_1.2fr_1.2fr_auto] gap-4 items-end border p-4 rounded-lg relative bg-card"
          >
            <FormField
              label={t('branch.form.fields.day.label', 'Day')}
              htmlFor={`day-${index}`}
              error={
                errors?.[index]?.dayOfWeek?.message
                  ? t(errors[index].dayOfWeek.message)
                  : undefined
              }
            >
              <Controller
                control={control}
                name={`schedules.${index}.dayOfWeek` as const}
                render={({ field: selectField }) => (
                  <Select
                    onValueChange={(value) =>
                      selectField.onChange(Number(value))
                    }
                    value={selectField.value?.toString()}
                  >
                    <SelectTrigger id={`day-${index}`}>
                      <SelectValue
                        placeholder={t(
                          'branch.form.fields.day.placeholder',
                          'Select day',
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableDays(index).map((day) => (
                        <SelectItem
                          key={day.value}
                          value={day.value.toString()}
                          disabled={day.disabled}
                        >
                          {t(day.key, day.label)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField
              label={t('branch.form.fields.openTime.label', 'Open Time')}
              htmlFor={`openTime-${index}`}
              error={
                errors?.[index]?.openTime?.message
                  ? t(errors[index].openTime.message)
                  : undefined
              }
            >
              <Controller
                control={control}
                name={`schedules.${index}.openTime` as const}
                render={({ field: timeField }) => (
                  <TimePicker
                    value={timeField.value}
                    onChange={(e) => timeField.onChange(e.target.value)}
                  />
                )}
              />
            </FormField>

            <FormField
              label={t('branch.form.fields.closeTime.label', 'Close Time')}
              htmlFor={`closeTime-${index}`}
              error={
                errors?.[index]?.closeTime?.message
                  ? t(errors[index].closeTime.message)
                  : undefined
              }
            >
              <Controller
                control={control}
                name={`schedules.${index}.closeTime` as const}
                render={({ field: timeField }) => (
                  <TimePicker
                    value={timeField.value}
                    onChange={(e) => timeField.onChange(e.target.value)}
                  />
                )}
              />
            </FormField>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeSchedule(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-6 border border-dashed rounded-lg text-muted-foreground">
            {t('branch.form.schedules.empty', 'No schedules added yet.')}
          </div>
        )}
      </div>
    </div>
  );
}
