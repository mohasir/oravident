'use client';

import { Plus } from 'lucide-react';
import { Button } from '@repo/ui';
import { ReactNode } from 'react';

interface AddButtonProps {
  onClick?: () => void;
  label: string;
  className?: string;
  asChild?: boolean;
  children?: ReactNode;
}

export function AddButton({ onClick, label, className, asChild }: AddButtonProps) {
  return (
    <Button
      onClick={onClick}
      asChild={asChild}
      className={`h-10 w-10 p-0 md:h-auto md:w-auto md:px-4 md:py-2 flex items-center justify-center ${className || ''}`}
    >
      <Plus className="h-5 w-5 md:mr-2 md:h-4 md:w-4" />
      <span className="hidden md:inline">{label}</span>
    </Button>
  );
}
