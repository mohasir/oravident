'use client';

import { useTranslation } from 'react-i18next';
import { DoctorsTable } from './DoctorsTable';

export function DoctorsPageIndex() {
  const { t } = useTranslation('admin');

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.index.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('doctor.index.description')}
          </p>
        </div>
      </div>

      <DoctorsTable />
    </div>
  );
}
