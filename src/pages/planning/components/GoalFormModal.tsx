import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCreateGoal } from '../hooks/useCreateGoal';
import { DollarSign, FileText, Calendar } from 'lucide-react';

const goalSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  targetValue: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Valor inválido'),
  deadline: z.string().optional(),
  familyId: z.string().min(1, 'Família é obrigatória'),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyId: string;
}

export function GoalFormModal({ isOpen, onClose, familyId }: GoalFormModalProps) {
  const createGoal = useCreateGoal();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      description: '',
      targetValue: '',
      deadline: '',
      familyId,
    },
  });

  const onSubmit = (data: GoalFormData) => {
    createGoal.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Meta Financeira">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Descrição da Meta"
          placeholder="Ex: Viagem de férias, Comprar carro, etc."
          {...register('description')}
          error={errors.description?.message}
          icon={<FileText size={18} className="text-primary-400" />}
        />

        <Input
          label="Valor Alvo (R$)"
          type="text"
          placeholder="0,00"
          {...register('targetValue')}
          error={errors.targetValue?.message}
          icon={<DollarSign size={18} className="text-primary-400" />}
          onInput={(e) => {
            let value = e.currentTarget.value.replace(/[^\d.,]/g, '');
            value = value.replace(',', '.');
            const parts = value.split('.');
            if (parts.length > 2) {
              value = parts[0] + '.' + parts.slice(1).join('');
            }
            e.currentTarget.value = value;
          }}
        />

        <Input
          label="Prazo (Opcional)"
          type="date"
          {...register('deadline')}
          error={errors.deadline?.message}
          icon={<Calendar size={18} className="text-primary-400" />}
        />

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={createGoal.isPending}>
            {createGoal.isPending ? 'Criando...' : 'Criar Meta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
