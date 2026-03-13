import { useUrlFilters } from '@/hooks/useUrlFilters';
import { RecordStatus } from '../types/record.types';

export function useRecordFilters() {
  const filters = useUrlFilters();

  return {
    ...filters,
    status: filters.status as RecordStatus | 'ALL',
    setStatus: (value: RecordStatus | 'ALL') => filters.setStatus(value),
  };
}
