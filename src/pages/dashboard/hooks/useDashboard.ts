import { useQuery } from '@tanstack/react-query';
import { getSummary } from '../services/dashboard.service';
import { DashboardSummary } from '@/pages/dashboard/types/dashboard.types';

interface UseDashboardParams {
  month: number;
  year: number;
}

export function useDashboard({ month, year }: UseDashboardParams) {
  return useQuery<DashboardSummary, Error>({
    queryKey: ['dashboard-summary', month, year],
    queryFn: () => getSummary(month, year),
    enabled: !!month && !!year,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}
