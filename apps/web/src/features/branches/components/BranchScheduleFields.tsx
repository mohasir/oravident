'use client';

import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button, FormField, Separator, Switch, TimePicker } from '@repo/ui';
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
    toggleDay,
    sundayClosed,
    setSundayClosed,
    errors,
  } = useBranchSchedule();

  const [showSchedules, setShowSchedules] = useState(fields.length > 0);

  return (
    <div className="space-y-4">
      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-medium">
            {t('branch.form.schedules.title', 'Schedules')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t(
              'branch.form.schedules.description',
              'Define the branch opening hours',
            )}
          </p>
        </div>
        <Switch checked={showSchedules} onCheckedChange={setShowSchedules} />
      </div>

      {showSchedules && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                size="sm"
                checked={sundayClosed}
                onCheckedChange={setSundayClosed}
              />
              <span className="text-sm text-muted-foreground">
                {t('branch.form.schedules.sundayClosed', 'Sunday closed')}
              </span>
            </div>
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
            {fields.map((field, index) => {
              const availableDays = getAvailableDays(index);
              const rowErrors = [
                errors?.[index]?.days?.message,
                errors?.[index]?.openTime?.message,
                errors?.[index]?.closeTime?.message,
              ]
                .filter(Boolean)
                .map((msg) => t(msg!));

              return (
                <div key={field.id} className="border rounded-lg bg-card">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {t('branch.form.fields.days.label', 'Days')}
                      </span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeSchedule(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div id={`day-${index}`} className="flex gap-1">
                      {availableDays.map((day) => (
                        <Button
                          key={day.value}
                          type="button"
                          variant={day.selected ? 'default' : 'outline'}
                          size="sm"
                          disabled={day.disabled}
                          onClick={() => toggleDay(index, day.value)}
                          title={t(day.key, day.label)}
                          className="flex-1 text-xs font-semibold px-0"
                        >
                          {t(day.key, day.label).slice(0, 3)}
                        </Button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        label={t(
                          'branch.form.fields.openTime.label',
                          'Open Time',
                        )}
                        htmlFor={`openTime-${index}`}
                      >
                        <Controller
                          control={control}
                          name={`schedules.${index}.openTime` as const}
                          render={({ field: timeField }) => (
                            <TimePicker
                              value={timeField.value}
                              onChange={(e) =>
                                timeField.onChange(e.target.value)
                              }
                            />
                          )}
                        />
                      </FormField>

                      <FormField
                        label={t(
                          'branch.form.fields.closeTime.label',
                          'Close Time',
                        )}
                        htmlFor={`closeTime-${index}`}
                      >
                        <Controller
                          control={control}
                          name={`schedules.${index}.closeTime` as const}
                          render={({ field: timeField }) => (
                            <TimePicker
                              value={timeField.value}
                              onChange={(e) =>
                                timeField.onChange(e.target.value)
                              }
                            />
                          )}
                        />
                      </FormField>
                    </div>
                  </div>

                  {rowErrors.length > 0 && (
                    <ul className="px-4 pb-3 space-y-1">
                      {rowErrors.map((msg) => (
                        <li key={msg} className="text-sm text-destructive">
                          {msg}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            {fields.length === 0 && (
              <div className="text-center py-6 border border-dashed rounded-lg text-muted-foreground">
                {t('branch.form.schedules.empty', 'No schedules added yet.')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
