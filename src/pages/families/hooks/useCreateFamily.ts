import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import { familyService } from '../services/families.service';
import { FamilyFormData } from '../components/FamilyForm';

export function useCreateFamily() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: FamilyFormData) => familyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      showToast({
        title: 'Sucesso',
        description: 'Família criada com sucesso!',
        variant: 'success',
      });
    },
    onError: () => {
      showToast({
        title: 'Erro',
        description: 'Erro ao criar família',
        variant: 'error',
      });
    },
  });
}
