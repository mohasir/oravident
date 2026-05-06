'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  Button,
  cn,
} from '@repo/ui';
import { useTranslation } from 'react-i18next';
import type { Branch } from '../types';
import { DAYS } from '../helpers';

interface BranchScheduleDialogProps {
  branch: Branch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BranchScheduleDialog({
  branch,
  open,
  onOpenChange,
}: BranchScheduleDialogProps) {
  const { t } = useTranslation('admin');

  if (!branch) return null;

  const sortedSchedules = [...branch.schedules].sort(
    (a, b) => a.dayOfWeek - b.dayOfWeek,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {t('branch.schedule.title', 'Branch Schedule')} - {branch.name}
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-3">
            {DAYS.map((day) => {
              const schedule = branch.schedules.find(
                (s) => s.dayOfWeek === day.value,
              );
              return (
                <div
                  key={day.value}
                  className={cn(
                    'flex items-center justify-between p-2 rounded-lg border',
                    schedule ? 'bg-card' : 'bg-muted/30 opacity-60',
                  )}
                >
                  <span className="font-medium">{t(day.key, day.label)}</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {schedule ? (
                      <>
                        <span>{schedule.openTime}</span>
                        <span>-</span>
                        <span>{schedule.closeTime}</span>
                      </>
                    ) : (
                      <span className="text-xs">
                        {t('branch.schedule.closed', 'Closed')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogBody>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            {t('common.close', 'Close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
