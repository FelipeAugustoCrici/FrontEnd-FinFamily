import { useQuery } from '@tanstack/react-query';
import { familyService } from '../services/families.service';

export function useFamily(id?: string) {
  return useQuery({
    queryKey: ['family', id],
    queryFn: () => familyService.getById(id!),
    enabled: !!id,
  });
}
