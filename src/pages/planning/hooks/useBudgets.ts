import { useQuery } from '@tanstack/react-query';
import { planningService } from '../services/planning.service';

export function useBudgets(month?: number, year?: number) {
  return useQuery({
    queryKey: ['budgets', month, year],
    queryFn: () => planningService.getBudgets(month, year),
  });
}
