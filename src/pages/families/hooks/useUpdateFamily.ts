import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import { familyService } from '../services/families.service';
import { FamilyFormData } from '../components/FamilyForm';

export function useUpdateFamily() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FamilyFormData }) =>
      familyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      showToast({
        title: 'Sucesso',
        description: 'Família atualizada com sucesso!',
        variant: 'success',
      });
    },
    onError: () => {
      showToast({
        title: 'Erro',
        description: 'Erro ao atualizar família',
        variant: 'error',
      });
    },
  });
}
