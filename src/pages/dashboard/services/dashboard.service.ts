import { api } from '@/services/api.service';
import { DashboardSummary } from '../types/dashboard.types';

export async function getSummary(month: number, year: number): Promise<DashboardSummary> {
  const { data } = await api.get('/finance/summary', {
    params: { month, year },
  });

  return data;
}
