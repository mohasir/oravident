'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@repo/ui';
import { Plus } from 'lucide-react';
import { BranchesTable } from './BranchesTable';
import { CreateBranchDialog } from './CreateBranchDialog';
import { EditBranchDialog } from './EditBranchDialog';
import type { Branch } from '../types';

export function BranchesPageIndex() {
  const { t } = useTranslation('admin');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('branch.index.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('branch.index.description')}
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('branch.index.add')}
        </Button>
      </div>

      <BranchesTable onEdit={setEditingBranch} />

      <CreateBranchDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <EditBranchDialog
        branch={editingBranch}
        open={!!editingBranch}
        onOpenChange={(open) => !open && setEditingBranch(null)}
      />
    </div>
  );
}
