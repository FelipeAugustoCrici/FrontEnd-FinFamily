import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import { categoryService } from '../services/categories.service';

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories-paginated'] });
      showToast({
        title: 'Sucesso',
        description: 'Categoria excluída com sucesso!',
        variant: 'success',
      });
    },
    onError: () => {
      showToast({
        title: 'Erro',
        description: 'Erro ao excluir categoria',
        variant: 'error',
      });
    },
  });
}
