import { useFormContext, useWatch } from 'react-hook-form';
import { useTokens } from '@/hooks/useTokens';

const TYPES = [
  {
    id: 'expense',
    label: 'Despesa',
    icon: '💸',
    desc: 'Gastos e saídas',
    activeColor: '#ef4444',
    activeBg: (isDark: boolean) => isDark ? 'rgba(239,68,68,0.12)' : '#fef2f2',
    activeBorder: (isDark: boolean) => isDark ? 'rgba(239,68,68,0.4)' : '#fca5a5',
    activeText: (isDark: boolean) => isDark ? '#fca5a5' : '#991b1b',
  },
  {
    id: 'salary',
    label: 'Salário',
    icon: '💰',
    desc: 'Renda principal',
    activeColor: '#10b981',
    activeBg: (isDark: boolean) => isDark ? 'rgba(16,185,129,0.12)' : '#ecfdf5',
    activeBorder: (isDark: boolean) => isDark ? 'rgba(16,185,129,0.4)' : '#6ee7b7',
    activeText: (isDark: boolean) => isDark ? '#6ee7b7' : '#166534',
  },
  {
    id: 'income',
    label: 'Extra / Bônus',
    icon: '✨',
    desc: 'Renda adicional',
    activeColor: '#6366f1',
    activeBg: (isDark: boolean) => isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff',
    activeBorder: (isDark: boolean) => isDark ? 'rgba(99,102,241,0.4)' : '#a5b4fc',
    activeText: (isDark: boolean) => isDark ? '#a5b4fc' : '#3730a3',
  },
];

export function RecordTypeSelector() {
  const { register } = useFormContext();
  const selectedType = useWatch({ name: 'type' });
  const t = useTokens();
  const isDark = t.bg.page === '#020617';

  return (
    <div className="grid grid-cols-3 gap-3">
      {TYPES.map((type) => {
        const isSelected = selectedType === type.id;

        return (
          <label key={type.id} style={{ cursor: 'pointer' }}>
            <input type="radio" {...register('type')} value={type.id} style={{ display: 'none' }} />
            <div
              style={{
                padding: '16px 12px',
                borderRadius: 14,
                border: `2px solid ${isSelected ? type.activeBorder(isDark) : t.border.default}`,
                background: isSelected ? type.activeBg(isDark) : t.bg.card,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: isSelected ? `0 0 0 3px ${type.activeColor}22` : 'none',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>{type.icon}</div>
              <div style={{
                fontSize: 13,
                fontWeight: 700,
                color: isSelected ? type.activeText(isDark) : t.text.primary,
                marginBottom: 2,
              }}>
                {type.label}
              </div>
              <div style={{
                fontSize: 11,
                color: isSelected ? type.activeText(isDark) : t.text.muted,
                opacity: 0.8,
              }}>
                {type.desc}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
