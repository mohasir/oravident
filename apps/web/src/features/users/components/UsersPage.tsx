'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@repo/ui';
import { Plus } from 'lucide-react';
import { UsersTable } from './UsersTable';

export function UsersPageIndex() {
  const { t } = useTranslation('admin');

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('user.index.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('user.index.description')}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('user.index.add')}
        </Button>
      </div>
      <UsersTable />
    </div>
  );
}
