import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import { recordService } from '../services/records.service';
import type { RecordFormData } from '../components/RecordForm';

// Mapear tipo do formulário para tipo do backend
const mapFormTypeToBackendType = (formType: string, isRecurring: boolean): string => {
  if (formType === 'expense') {
    return isRecurring ? 'fixed' : 'variable';
  }
  if (formType === 'salary') {
    return 'fixed'; // Salários são sempre fixos
  }
  if (formType === 'income') {
    return 'temporary'; // Extras/bônus são temporários
  }
  return 'variable';
};

export function useUpdateRecord() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data: formData }: { id: string; data: RecordFormData }) => {
      const backendType = mapFormTypeToBackendType(formData.type, formData.isRecurring);

      const data: any = {
        ...formData,
        formType: formData.type, // Mantém o tipo do formulário para determinar a rota
        type: backendType, // Tipo do backend
        value: Number(formData.value),
        durationMonths: formData.durationMonths ? Number(formData.durationMonths) : undefined,
      };

      return recordService.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['extras'] });
      showToast({
        title: 'Sucesso',
        description: 'Lançamento atualizado com sucesso!',
        variant: 'success',
      });
    },
    onError: () => {
      showToast({
        title: 'Erro',
        description: 'Erro ao atualizar lançamento',
        variant: 'error',
      });
    },
  });
}
