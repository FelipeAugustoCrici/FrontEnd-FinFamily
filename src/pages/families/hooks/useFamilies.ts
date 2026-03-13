import { useQuery } from '@tanstack/react-query';
import { familyService } from '../services/families.service';

export function useFamilies(search?: string) {
  return useQuery({
    queryKey: ['families', search],
    queryFn: () => familyService.list(),
  });
}
