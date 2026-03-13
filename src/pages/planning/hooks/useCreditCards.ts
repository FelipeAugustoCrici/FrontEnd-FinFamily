import { useQuery } from '@tanstack/react-query';
import { planningService } from '../services/planning.service';

export function useCreditCards() {
  return useQuery({
    queryKey: ['creditCards'],
    queryFn: planningService.getCreditCards,
  });
}
