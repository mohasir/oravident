import { useState } from 'react';
import type { ActionDef, ProcessedItem } from '../types';

export function useDataTableRowActions(actions: ActionDef[]) {
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});

  const items: ProcessedItem[] = actions.map((action, i) => {
    if ('separator' in action) return { separator: true };

    const { label, variant, onAction } = action;

    const onClick = () => {
      const result = onAction();
      if (result instanceof Promise) {
        setLoadingMap((prev) => ({ ...prev, [i]: true }));
        result.finally(() =>
          setLoadingMap((prev) => ({ ...prev, [i]: false })),
        );
      }
    };

    return { label, variant, onClick, isLoading: loadingMap[i] ?? false };
  });

  const isAnyLoading = Object.values(loadingMap).some(Boolean);

  return { items, isAnyLoading };
}
