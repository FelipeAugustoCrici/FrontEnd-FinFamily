import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import { planningService } from '../services/planning.service';

export function useAddContribution() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({
      goalId,
      value,
      date,
      observation,
      personId,
    }: {
      goalId: string;
      value: number;
      date?: string;
      observation?: string;
      personId?: string;
    }) => planningService.addContribution(goalId, { value, date, observation, personId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      showToast({ title: 'Sucesso', description: 'Contribuição adicionada!', variant: 'success' });
    },
    onError: () => {
      showToast({ title: 'Erro', description: 'Erro ao adicionar contribuição', variant: 'error' });
    },
  });
}
