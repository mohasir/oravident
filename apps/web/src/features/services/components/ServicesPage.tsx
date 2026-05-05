'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@repo/ui';
import { Plus } from 'lucide-react';
import { ServicesTable } from './ServicesTable';
import { CreateServiceDialog } from './CreateServiceDialog';
import { EditServiceDialog } from './EditServiceDialog';
import type { Service } from '../types';

export function ServicesPageIndex() {
  const { t } = useTranslation('admin');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('service.index.title', 'Services')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('service.index.description', 'Manage the services offered by your clinic.')}
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('service.index.add', 'Add Service')}
        </Button>
      </div>

      <ServicesTable onEdit={setEditingService} />

      <CreateServiceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <EditServiceDialog
        service={editingService ?? undefined}
        open={!!editingService}
        onOpenChange={(open) => !open && setEditingService(null)}
      />
    </div>
  );
}
