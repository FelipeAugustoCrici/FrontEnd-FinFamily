import { useFormContext, useWatch } from 'react-hook-form';
import { Select } from '@/components/ui/Input';
import { useEffect } from 'react';

export function FamilySelector({ families }: { families: any[] }) {
  const { register, setValue, formState } = useFormContext();
  const familyId = useWatch({ name: 'familyId' });

  // Como o sistema permite apenas uma família, pega a primeira
  const family = families[0];
  const people = family?.members || [];

  // Auto-seleciona a família se houver apenas uma
  useEffect(() => {
    if (families.length === 1 && !familyId) {
      setValue('familyId', families[0].id);
    }
  }, [families, familyId, setValue]);

  return (
    <div className="space-y-4">
      {/* Campo de família oculto, pois só há uma */}
      <input type="hidden" {...register('familyId')} />

      {family && (
        <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-xs text-primary-600 font-medium mb-1">Família</p>
          <p className="text-sm font-semibold text-primary-800">{family.name}</p>
        </div>
      )}

      <Select
        label="Responsável"
        {...register('personId')}
        options={[
          {
            value: '',
            label:
              people.length > 0
                ? 'Selecione um responsável'
                : 'Nenhum membro cadastrado na família',
          },
          ...people.map((p: { id: string; name: string }) => ({ value: p.id, label: p.name })),
        ]}
        disabled={people.length === 0}
        error={formState.errors.personId?.message as string}
      />

      {people.length === 0 && (
        <p className="text-xs text-amber-600 mt-1">
          Adicione membros à sua família antes de criar lançamentos
        </p>
      )}
    </div>
  );
}
