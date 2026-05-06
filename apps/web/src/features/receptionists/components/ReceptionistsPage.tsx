'use client';

import { useTranslation } from 'react-i18next';
import { ReceptionistsTable } from './ReceptionistsTable';

export function ReceptionistsPageIndex() {
  const { t } = useTranslation('admin');

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('receptionist.index.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('receptionist.index.description')}
          </p>
        </div>
      </div>

      <ReceptionistsTable />
    </div>
  );
}
