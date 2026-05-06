'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/shared/PageHeader';
import { BranchesTable } from './BranchesTable';
import { CreateBranchDialog } from './CreateBranchDialog';
import { EditBranchDialog } from './EditBranchDialog';
import { BranchScheduleDialog } from './BranchScheduleDialog';
import type { Branch } from '../types';

export function BranchesPageIndex() {
  const { t } = useTranslation('admin');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [viewingScheduleBranch, setViewingScheduleBranch] = useState<Branch | null>(null);

  return (
    <div>
      <PageHeader
        title={t('branch.index.title')}
        subtitle={t('branch.index.description')}
        actionLabel={t('branch.index.add')}
        onActionClick={() => setIsCreateDialogOpen(true)}
      />

      <BranchesTable
        onEdit={setEditingBranch}
        onViewSchedule={setViewingScheduleBranch}
      />

      <CreateBranchDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <EditBranchDialog
        branch={editingBranch}
        open={!!editingBranch}
        onOpenChange={(open) => !open && setEditingBranch(null)}
      />

      <BranchScheduleDialog
        branch={viewingScheduleBranch}
        open={!!viewingScheduleBranch}
        onOpenChange={(open) => !open && setViewingScheduleBranch(null)}
      />
    </div>
  );
}
