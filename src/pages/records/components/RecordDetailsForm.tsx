import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { FileText, DollarSign, Tag, Users } from 'lucide-react';
import { useTokens } from '@/hooks/useTokens';
import _ from 'lodash';

export function RecordDetailsForm({ categories }: { categories: any[] }) {
  const { register, setValue, formState, control } = useFormContext();
  const type = useWatch({ name: 'type' });
  const isShared = useWatch({ name: 'isShared' });
  const categoryId = useWatch({ name: 'categoryId' });
  const t = useTokens();
  const isDark = t.bg.page === '#020617';

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const handleCategoryChange = (val: string | number) => {
    setValue('categoryId', val);
    const selected = _.find(categories, { id: val });
    setValue('categoryName', selected?.name || '');
  };

  const sharedActiveBg = isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff';
  const sharedActiveBorder = isDark ? 'rgba(99,102,241,0.35)' : '#c7d2fe';
  const sharedActiveText = isDark ? '#a5b4fc' : '#3730a3';
  const sharedInactiveBg = t.bg.muted;
  const sharedInactiveBorder = t.border.default;
  const sharedInactiveText = t.text.muted;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Descrição */}
      <Input
        label="Descrição"
        placeholder="Ex: Conta de luz, Supermercado, Salário mensal..."
        {...register('description')}
        error={formState.errors.description?.message as string}
        icon={<FileText size={18} className="text-primary-400" />}
      />

      {/* Valor em destaque */}
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

      {/* Categoria + Data */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {type === 'expense' ? (
          <div>
            <Select
              label="Categoria"
              placeholder={expenseCategories.length > 0 ? 'Selecione uma categoria' : 'Nenhuma categoria cadastrada'}
              options={expenseCategories.map((c) => ({ value: c.id, label: c.name }))}
              value={categoryId}
              onChange={handleCategoryChange}
              error={formState.errors.categoryId?.message as string}
              disabled={expenseCategories.length === 0}
              searchable={expenseCategories.length > 5}
            />
            {expenseCategories.length === 0 && (
              <p style={{ fontSize: 11, color: '#d97706', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Tag size={11} />
                Cadastre categorias de despesa primeiro
              </p>
            )}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: t.bg.muted,
            border: `1px solid ${t.border.default}`,
            borderRadius: 10,
            padding: '12px 16px',
          }}>
            <p style={{ fontSize: 13, color: t.text.muted, textAlign: 'center' }}>
              {type === 'salary' ? '💰 Salário não requer categoria' : '✨ Extra não requer categoria'}
            </p>
          </div>
        )}

        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Data"
              value={field.value}
              onChange={field.onChange}
              error={formState.errors.date?.message as string}
            />
          )}
        />
      </div>

      {/* Toggle compartilhado — apenas para despesas */}
      {type === 'expense' && (
        <div
          style={{
            background: isShared ? sharedActiveBg : sharedInactiveBg,
            border: `1.5px solid ${isShared ? sharedActiveBorder : sharedInactiveBorder}`,
            borderRadius: 14,
            padding: '14px 16px',
            transition: 'all 0.18s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: isShared ? (isDark ? 'rgba(99,102,241,0.2)' : '#e0e7ff') : t.bg.mutedStrong,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Users size={16} color={isShared ? sharedActiveText : t.text.muted} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: isShared ? sharedActiveText : t.text.secondary, marginBottom: 2 }}>
                  {isShared ? 'Despesa compartilhada' : 'Despesa individual'}
                </p>
                <p style={{ fontSize: 11, color: isShared ? sharedActiveText : t.text.muted, opacity: 0.8 }}>
                  {isShared
                    ? 'Dividida entre os membros da família'
                    : 'Apenas do responsável selecionado'}
                </p>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              type="button"
              onClick={() => setValue('isShared', !isShared)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 999,
                background: isShared ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1'),
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                flexShrink: 0,
                transition: 'background 0.18s ease',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 3,
                left: isShared ? 23 : 3,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transition: 'left 0.18s ease',
              }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
