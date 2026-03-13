import { useFormContext, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Repeat } from 'lucide-react';

export function RecurrenceSection() {
  const { register } = useFormContext();
  const isRecurring = useWatch({ name: 'isRecurring' });

  return (
    <div className="space-y-4 pt-6 mt-6 border-t border-gray-200/50">
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          {...register('isRecurring')}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 cursor-pointer"
        />
        <Repeat
          size={18}
          className="text-primary-400 group-hover:text-primary-600 transition-colors"
        />
        <span className="font-semibold text-primary-700 group-hover:text-primary-800 transition-colors">
          Lançamento recorrente
        </span>
      </label>

      {isRecurring && (
        <div className="pl-7 animate-in fade-in slide-in-from-top-2 duration-200">
          <Input
            label="Duração (meses)"
            type="number"
            min="1"
            placeholder="Ex: 12"
            {...register('durationMonths')}
          />
          <p className="text-xs text-gray-500 mt-1 ml-0.5">
            O lançamento será repetido automaticamente pelos próximos meses
          </p>
        </div>
      )}
    </div>
  );
}
