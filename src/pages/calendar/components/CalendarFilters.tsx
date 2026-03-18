import React from 'react';
import { cn } from '@/components/ui/Button';
import type { CalendarFilter } from '../types/calendar.types';

interface Props {
  filter: CalendarFilter;
  onChange: (f: CalendarFilter) => void;
}

const typeOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'income', label: 'Receitas' },
  { value: 'expense', label: 'Despesas' },
] as const;

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'PAID', label: 'Pagos' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'OVERDUE', label: 'Vencidos' },
] as const;

export function CalendarFilters({ filter, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex gap-1 bg-primary-50 rounded-lg p-1">
        {typeOptions.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange({ ...filter, type: o.value })}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              (filter.type ?? 'all') === o.value
                ? 'bg-white text-primary-800 shadow-sm'
                : 'text-primary-500 hover:text-primary-700',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="flex gap-1 bg-primary-50 rounded-lg p-1">
        {statusOptions.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange({ ...filter, status: o.value })}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              (filter.status ?? 'all') === o.value
                ? 'bg-white text-primary-800 shadow-sm'
                : 'text-primary-500 hover:text-primary-700',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
