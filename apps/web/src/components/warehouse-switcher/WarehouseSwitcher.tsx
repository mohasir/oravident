'use client';

import { Building2, Check, ChevronsUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
  cn,
} from '@repo/ui';
import { useConfigStore } from '@/lib/config';

interface WarehouseSwitcherProps {
  onOpenChange?: (open: boolean) => void;
}

export function WarehouseSwitcher({ onOpenChange }: WarehouseSwitcherProps) {
  const branches = useConfigStore((state) => state.branches);
  const selectedBranch = useConfigStore((state) => state.selectedBranch);
  const setSelectedBranch = useConfigStore((state) => state.setSelectedBranch);

  if (branches && branches.length === 0 && selectedBranch === null) {
    return null;
  }

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between gap-2 px-3 h-16 py-2"
          size="lg"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="size-4 shrink-0 text-muted-foreground" />
            <div className="flex flex-col justify-start items-start min-w-0 w-full">
              <span className="truncate text-sm font-medium w-full text-left">
                {selectedBranch?.name}
              </span>

              <span className="truncate text-xs font-medium text-muted-foreground w-full text-left">
                {selectedBranch?.address}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="size-3.5 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="start">
        {branches.map((branch) => (
          <DropdownMenuItem
            key={branch.id}
            onSelect={() => setSelectedBranch(branch)}
            className="flex items-start gap-2 py-2"
          >
            <Check
              className={cn(
                'size-4 mt-0.5 shrink-0',
                selectedBranch?.id === branch.id ? 'opacity-100' : 'opacity-0',
              )}
            />
            <div className="min-w-0">
              <p className="text-sm font-medium leading-none">{branch.name}</p>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {branch.address}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
