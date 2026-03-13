import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import { familyService } from '../services/families.service';

export function useDeleteFamily() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => familyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      showToast({
        title: 'Sucesso',
        description: 'Família excluída com sucesso!',
        variant: 'success',
      });
    },
    onError: () => {
      showToast({
        title: 'Erro',
        description: 'Erro ao excluir família',
        variant: 'error',
      });
    },
  });
}
