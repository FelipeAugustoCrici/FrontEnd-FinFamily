import { useQuery } from '@tanstack/react-query';
import { planningService } from '../services/planning.service';

export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: planningService.getGoals,
  });
}
