import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/Card';
import { RecordFormHeader } from './RecordFormHeader';
import { FamilySelector } from './FamilySelector';
import { RecordTypeSelector } from './RecordTypeSelector';
import { RecordDetailsForm } from './RecordDetailsForm';
import { RecurrenceSection } from './RecurrenceSection';
import { SummarySection } from './SummarySection';

import { Record } from '../types/record.types';

const recordSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  value: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Valor inválido'),
  date: z.string().min(1, 'Data é obrigatória'),
  categoryName: z.string().optional(),
  categoryId: z.string().optional(),
  type: z.enum(['expense', 'salary', 'income']),
  personId: z.string().min(1, 'Responsável é obrigatório'),
  familyId: z.string().min(1, 'Família é obrigatória'),
  isRecurring: z.boolean(),
  durationMonths: z.string().optional(),
  isShared: z.boolean().default(true),
});

export type RecordFormData = z.infer<typeof recordSchema>;

interface RecordFormProps {
  initialData?: Partial<Record>;
  onSubmit: (data: RecordFormData) => void;
  isLoading?: boolean;
  families?: any[];
  categories?: any[];
  people?: any[];
}

export function RecordForm({
  initialData,
  onSubmit,
  isLoading,
  families = [],
  categories = [],
  people = [],
}: RecordFormProps) {
  const mapBackendTypeToFormType = (data?: any): 'expense' | 'salary' | 'income' => {
    if (data?.recordType) {
      return data.recordType;
    }

    if (!data?.sourceId && !data?.recurringId && !data?.categoryId) {
      return 'expense';
    }

    if (data?.sourceId) {
      return 'salary';
    }

    return 'expense';
  };

  const getFamilyId = () => {
    const data = initialData as any;

    if (data?.person?.familyId) return data.person.familyId;
    if (data?.person?.family?.id) return data.person.family.id;
    if (data?.familyId) return data.familyId;

    if (families.length > 0) return families[0].id;

    return '';
  };

  const familyIdValue = getFamilyId();

  const methods = useForm<RecordFormData>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      description: initialData?.description || '',
      value: initialData?.value?.toString() || '',
      date: initialData?.date
        ? initialData.date.split('T')[0]
        : new Date().toISOString().split('T')[0],
      categoryName: '',
      categoryId: initialData?.categoryId || '',
      type: mapBackendTypeToFormType(initialData),
      personId: initialData?.personId || '',
      familyId: familyIdValue,
      isRecurring: !!(initialData as any)?.recurringId,
      durationMonths: '',
      isShared: (initialData as any)?.isShared !== false,
    },
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (initialData) {
      const data = initialData as any;
      reset({
        description: data.description || '',
        value: data.value?.toString() || '',
        date: data.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0],
        categoryName: data.categoryName,
        categoryId: data.categoryId || '',
        type: mapBackendTypeToFormType(data),
        personId: data.personId || '',
        familyId:
          data.person?.familyId ||
          data.person?.family?.id ||
          data.familyId ||
          (families.length > 0 ? families[0].id : ''),
        isRecurring: !!data.recurringId,
        durationMonths: '',
        isShared: data.isShared !== false,
      });
    }
  }, [initialData, families, reset]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8">
        <RecordFormHeader isEdit={!!initialData?.id} isLoading={!!isLoading} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card title="Família e Responsável">
              <FamilySelector families={families} />
            </Card>

            <Card title="Tipo de Registro">
              <RecordTypeSelector />
            </Card>

            <Card title="Informações do Lançamento">
              <RecordDetailsForm categories={categories} />
              <RecurrenceSection />
            </Card>
          </div>

          <SummarySection people={people} />
        </div>
      </form>
    </FormProvider>
  );
}
