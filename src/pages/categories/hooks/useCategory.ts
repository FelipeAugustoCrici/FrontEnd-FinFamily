import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/categories.service';

export function useCategory(id?: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getById(id!),
    enabled: !!id,
  });
}
