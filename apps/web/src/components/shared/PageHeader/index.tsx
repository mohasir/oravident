'use client';

import { AddButton } from '../AddButton';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  children?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  actionLabel,
  onActionClick,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between space-y-2 mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm md:text-base text-slate-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {actionLabel && onActionClick && (
          <AddButton label={actionLabel} onClick={onActionClick} />
        )}
        {children}
      </div>
    </div>
  );
}
