import { useFormContext, useWatch } from 'react-hook-form';

const TYPES = [
  {
    id: 'expense',
    label: 'Despesa',
    color: 'red',
    borderColor: 'border-red-400',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    icon: '💸',
  },
  {
    id: 'salary',
    label: 'Salário',
    color: 'green',
    borderColor: 'border-green-400',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    icon: '💰',
  },
  {
    id: 'income',
    label: 'Extra / Bônus',
    color: 'blue',
    borderColor: 'border-blue-400',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: '✨',
  },
];

export function RecordTypeSelector() {
  const { register } = useFormContext();
  const selectedType = useWatch({ name: 'type' });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {TYPES.map((type) => {
        const isSelected = selectedType === type.id;

        return (
          <label key={type.id} className="cursor-pointer">
            <input type="radio" {...register('type')} value={type.id} className="hidden peer" />
            <div
              className={`
                p-4 border-2 rounded-xl text-center font-semibold transition-all duration-200
                hover:shadow-md
                ${
                  isSelected
                    ? `${type.borderColor} ${type.bgColor} ${type.textColor} shadow-sm`
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
              `}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-sm">{type.label}</div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
