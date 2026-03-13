import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { Input, Select } from '@/components/ui/Input';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { FileText, DollarSign, Calendar, Tag } from 'lucide-react';
import _ from 'lodash';

export function RecordDetailsForm({ categories }: { categories: any[] }) {
  const { register, setValue, formState, control } = useFormContext();
  const type = useWatch({ name: 'type' });

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setValue('categoryId', categoryId);

    if (categoryId) {
      const selected = _.find(categories, { id: categoryId });
      setValue('categoryName', selected?.name || '');
    } else {
      setValue('categoryName', '');
    }
  };

  return (
    <div className="space-y-4">
      <Input
        label="Descrição"
        placeholder="Ex: Conta de luz, Supermercado, etc."
        {...register('description')}
        error={formState.errors.description?.message as string}
        icon={<FileText size={18} className="text-primary-400" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name="value"
          control={control}
          render={({ field }) => (
            <CurrencyInput
              label="Valor (R$)"
              placeholder="0,00"
              value={field.value}
              onChange={field.onChange}
              error={formState.errors.value?.message as string}
              icon={<DollarSign size={18} className="text-primary-400" />}
            />
          )}
        />

        {type === 'expense' && (
          <div className="relative">
            <Select
              label="Categoria"
              {...register('categoryId')}
              options={[
                {
                  value: '',
                  label:
                    expenseCategories.length > 0
                      ? 'Selecione uma categoria'
                      : 'Nenhuma categoria cadastrada',
                },
                ...expenseCategories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              onChange={handleCategoryChange}
              error={formState.errors.categoryId?.message as string}
              disabled={expenseCategories.length === 0}
            />
            {expenseCategories.length === 0 && (
              <p className="text-xs text-amber-600 mt-1 ml-0.5 flex items-center gap-1">
                <Tag size={12} />
                Cadastre categorias de despesa primeiro
              </p>
            )}
          </div>
        )}

        {type !== 'expense' && (
          <div className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">
              {type === 'salary'
                ? '💰 Salário não requer categoria'
                : '✨ Extra não requer categoria'}
            </p>
          </div>
        )}
      </div>

      <Input
        label="Data"
        type="date"
        {...register('date')}
        error={formState.errors.date?.message as string}
        icon={<Calendar size={18} className="text-primary-400" />}
      />
    </div>
  );
}
