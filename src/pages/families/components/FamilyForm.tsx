import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { FamilyFormHeader } from './FamilyFormHeader';

import { Family } from '../types/family.types';

function FamilySummary() {
  const name = useWatch({ name: 'name' });
  const description = useWatch({ name: 'description' });

  return (
    <Card title="Resumo" className="bg-primary-50 border border-primary-200 sticky top-24">
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-primary-500">Nome</span>
          <span className="font-semibold text-primary-800 text-right max-w-[140px] truncate">
            {name || '-'}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-primary-500">Descrição</span>
          <span className="font-semibold text-primary-800 text-right max-w-[140px] truncate">
            {description || '-'}
          </span>
        </div>

        <div className="pt-4 border-t border-primary-200">
          <p className="text-xs uppercase tracking-widest text-primary-500 font-bold mb-1">
            Status
          </p>
          <p className="text-xl font-bold text-primary-900">Ativo</p>
        </div>
      </div>
    </Card>
  );
}

const familySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
});

export type FamilyFormData = z.infer<typeof familySchema>;

interface FamilyFormProps {
  initialData?: Partial<Family>;
  onSubmit: (data: FamilyFormData) => void;
  isLoading?: boolean;
  showSummary?: boolean;
}

export function FamilyForm({
  initialData,
  onSubmit,
  isLoading,
  showSummary = true,
}: FamilyFormProps) {
  const methods = useForm<FamilyFormData>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8">
        <FamilyFormHeader isEdit={!!initialData?.id} isLoading={!!isLoading} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={showSummary ? 'md:col-span-2 space-y-6' : 'md:col-span-3 space-y-6'}>
            <Card title="Informações da Família">
              <div className="space-y-4">
                <Input
                  label="Nome"
                  placeholder="Digite o nome"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  label="Descrição"
                  placeholder="Digite a descrição (opcional)"
                  error={errors.description?.message}
                  {...register('description')}
                />
              </div>
            </Card>
          </div>

          {showSummary && <FamilySummary />}
        </div>
      </form>
    </FormProvider>
  );
}
