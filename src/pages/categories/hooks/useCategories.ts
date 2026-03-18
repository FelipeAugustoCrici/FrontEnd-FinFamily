import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/categories.service';
import { useUserFamily } from '@/hooks/useUserInfo';

export function useCategories() {
  const { data: family } = useUserFamily();
  const familyId = family?.id;

  return useQuery({
    queryKey: ['categories', familyId],
    queryFn: async () => {
      const result = await categoryService.list(familyId, undefined, 1, 500);
      return result.data;
    },
    staleTime: 1000 * 60 * 10,
    enabled: true,
  });
}

export function useCategoriesPaginated(type: 'expense' | 'income', page: number) {
  const { data: family } = useUserFamily();
  const familyId = family?.id;

  return useQuery({
    queryKey: ['categories-paginated', familyId, type, page],
    queryFn: () => categoryService.list(familyId, type, page, 10),
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });
}
