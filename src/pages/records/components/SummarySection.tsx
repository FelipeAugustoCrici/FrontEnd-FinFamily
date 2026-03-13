import _ from 'lodash';
import { useFormContext, useWatch } from 'react-hook-form';
import { Card } from '@/components/ui/Card';
import { Person } from '@/types';
import { formatMonthYear } from '@/common/utils/date';

type RegistrationFormData = {
  description: string;
  value: string;
  date: string;
  personId: string;
};

type SummarySectionProps = {
  people: Person[];
};

export function SummarySection({ people }: SummarySectionProps) {
  const { control } = useFormContext<RegistrationFormData>();

  const description = useWatch({ control, name: 'description' });
  const value = useWatch({ control, name: 'value' });
  const date = useWatch({ control, name: 'date' });
  const personId = useWatch({ control, name: 'personId' });

  const personName = _.find(people, { id: personId })?.name || 'Não definido';

  const formattedDate = date ? formatMonthYear(date) : '-';

  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));

  return (
    <Card title="Resumo" className="bg-primary-50 border border-primary-200 sticky top-24">
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-primary-500">Descrição</span>
          <span className="font-semibold text-primary-800 text-right max-w-[140px] truncate">
            {description || '-'}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-primary-500">Responsável</span>
          <span className="font-semibold text-primary-800">{personName}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-primary-500">Referência</span>
          <span className="font-semibold text-primary-800">{formattedDate}</span>
        </div>

        <div className="pt-4 border-t border-primary-200">
          <p className="text-xs uppercase tracking-widest text-primary-500 font-bold mb-1">
            Valor total
          </p>
          <p className="text-3xl font-bold text-primary-900">{formattedValue}</p>
        </div>
      </div>
    </Card>
  );
}
