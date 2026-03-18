import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Button } from '@/components/ui/Button';
import { useCreateGoal } from '../hooks/useCreateGoal';
import { FileText, Calendar } from 'lucide-react';
import { GOAL_TYPE_META } from './goalUtils';
import type { GoalType } from '../types/planning.types';

const goalSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  type: z.enum(['savings', 'debt', 'purchase', 'investment']),
  targetValue: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Valor inválido'),
  deadline: z.string().optional(),
  familyId: z.string().min(1),
});

type FormData = z.infer<typeof goalSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  familyId: string;
}

export function GoalFormModal({ isOpen, onClose, familyId }: Props) {
  const createGoal = useCreateGoal();

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, control } = useForm<FormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: { description: '', type: 'savings', targetValue: '', deadline: '', familyId },
  });

  const selectedType = watch('type');

  const onSubmit = (data: FormData) => {
    createGoal.mutate(data, {
      onSuccess: () => { reset(); onClose(); },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Meta Financeira">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Tipo de meta</p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(GOAL_TYPE_META) as [GoalType, typeof GOAL_TYPE_META[GoalType]][]).map(([key, meta]) => {
              const Icon = meta.icon;
              const active = selectedType === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setValue('type', key)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                    active ? `${meta.bg} ${meta.border} ${meta.color}` : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <Icon size={16} />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        <Input
          label="Nome da Meta"
          placeholder="Ex: Viagem de férias, Carro novo..."
          {...register('description')}
          error={errors.description?.message}
          icon={<FileText size={16} className="text-primary-400" />}
        />

        <Controller
          name="targetValue"
          control={control}
          render={({ field }) => (
            <CurrencyInput
              label="Valor Alvo (R$)"
              placeholder="0,00"
              value={field.value}
              onChange={field.onChange}
              error={errors.targetValue?.message}
            />
          )}
        />

        <Input
          label="Prazo (opcional)"
          type="date"
          {...register('deadline')}
          error={errors.deadline?.message}
          icon={<Calendar size={16} className="text-primary-400" />}
        />

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={createGoal.isPending}>
            {createGoal.isPending ? 'Criando...' : 'Criar Meta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
