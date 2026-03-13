import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categories.service';
import { useToast } from '@/hooks/useToast';
import { CategoryFormData } from '../schemas/category.schema';

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: CategoryFormData) => categoryService.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      });

      showToast({
        title: 'Categoria criada',
        description: 'A categoria foi cadastrada com sucesso.',
        variant: 'success',
      });
    },

    onError: () => {
      showToast({
        title: 'Erro ao criar categoria',
        description: 'Tente novamente em alguns instantes.',
        variant: 'error',
      });
    },
  });
}
