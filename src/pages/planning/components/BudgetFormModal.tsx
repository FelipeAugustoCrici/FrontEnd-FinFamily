import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { useCreateBudget } from '../hooks/useCreateBudget';
import { Calendar } from 'lucide-react';
import { useCategories } from '@/pages/categories/hooks/useCategories';

const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  categoryName: z.string(),
  limitValue: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Valor inválido'),
  month: z.string().min(1, 'Mês é obrigatório'),
  year: z.string().min(1, 'Ano é obrigatório'),
  familyId: z.string().min(1, 'Família é obrigatória'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyId: string;
}

export function BudgetFormModal({ isOpen, onClose, familyId }: BudgetFormModalProps) {
  const createBudget = useCreateBudget();
  const { data: categories = [] } = useCategories();
  const expenseCategories = categories.filter((c: any) => c.type === 'expense');

  const currentDate = new Date();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      categoryId: '',
      categoryName: '',
      limitValue: '',
      month: (currentDate.getMonth() + 1).toString(),
      year: currentDate.getFullYear().toString(),
      familyId,
    },
  });

  const onSubmit = (data: BudgetFormData) => {
    createBudget.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    const category = categories.find((c: any) => c.id === categoryId);
    setValue('categoryId', categoryId);
    setValue('categoryName', category?.name || '');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Orçamento">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Categoria"
          {...register('categoryId')}
          options={[
            { value: '', label: 'Selecione uma categoria' },
            ...expenseCategories.map((c: any) => ({ value: c.id, label: c.name })),
          ]}
          onChange={handleCategoryChange}
          error={errors.categoryId?.message}
        />

        <Controller
          name="limitValue"
          control={control}
          render={({ field }) => (
            <CurrencyInput
              label="Limite Mensal"
              placeholder="0,00"
              value={field.value}
              onChange={field.onChange}
              error={errors.limitValue?.message}
            />
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Mês"
            type="number"
            min="1"
            max="12"
            {...register('month')}
            error={errors.month?.message}
            icon={<Calendar size={18} className="text-primary-400" />}
          />

          <Input
            label="Ano"
            type="number"
            min="2020"
            max="2099"
            {...register('year')}
            error={errors.year?.message}
            icon={<Calendar size={18} className="text-primary-400" />}
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={createBudget.isPending}>
            {createBudget.isPending ? 'Criando...' : 'Criar Orçamento'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
