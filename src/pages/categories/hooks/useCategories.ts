import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/categories.service';
import { useUserFamily } from '@/hooks/useUserInfo';

export function useCategories() {
  const { data: family } = useUserFamily();
  const familyId = family?.id;

  return useQuery({
    queryKey: ['categories', familyId],
    queryFn: () => categoryService.list(familyId),
    staleTime: 1000 * 60 * 10,
    enabled: true, // busca mesmo sem familyId (retorna globais)
  });
}
