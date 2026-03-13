import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import { planningService } from '../services/planning.service';

export function useDeleteCreditCard() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => planningService.deleteCreditCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditCards'] });
      showToast({
        title: 'Sucesso',
        description: 'Cartão excluído com sucesso!',
        variant: 'success',
      });
    },
    onError: () => {
      showToast({
        title: 'Erro',
        description: 'Erro ao excluir cartão',
        variant: 'error',
      });
    },
  });
}
