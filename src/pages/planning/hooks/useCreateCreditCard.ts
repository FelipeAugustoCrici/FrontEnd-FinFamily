import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import { planningService } from '../services/planning.service';
import type { CreditCardFormData } from '../types/planning.types';

export function useCreateCreditCard() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: CreditCardFormData) => {
      const payload = {
        ...data,
        limit: Number(data.limit),
        closingDay: Number(data.closingDay),
        dueDay: Number(data.dueDay),
      };
      return planningService.createCreditCard(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditCards'] });
      showToast({
        title: 'Sucesso',
        description: 'Cartão criado com sucesso!',
        variant: 'success',
      });
    },
    onError: () => {
      showToast({
        title: 'Erro',
        description: 'Erro ao criar cartão',
        variant: 'error',
      });
    },
  });
}
