import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import { planningService } from '../services/planning.service';
import type { BudgetFormData } from '../types/planning.types';

export function useCreateBudget() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: BudgetFormData) => {
      const payload = {
        ...data,
        limitValue: Number(data.limitValue),
        month: Number(data.month),
        year: Number(data.year),
      };
      return planningService.createBudget(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      showToast({
        title: 'Sucesso',
        description: 'Orçamento criado com sucesso!',
        variant: 'success',
      });
    },
    onError: () => {
      showToast({
        title: 'Erro',
        description: 'Erro ao criar orçamento',
        variant: 'error',
      });
    },
  });
}
