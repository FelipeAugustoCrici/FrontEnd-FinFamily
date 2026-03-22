import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ArrowDownCircle, Wallet, TrendingUp } from 'lucide-react';
import { useTokens } from '@/hooks/useTokens';

type RecordTypeOption = {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  primary: boolean;
  activeColor: string;
  activeBg: (isDark: boolean) => string;
  activeBorder: (isDark: boolean) => string;
  activeText: (isDark: boolean) => string;
  glow: string;
};

const TYPES: RecordTypeOption[] = [
  {
    id: 'expense',
    label: 'Gastei',
    sublabel: 'Pagamentos e saídas',
    icon: <ArrowDownCircle size={22} />,
    primary: true,
    activeColor: '#ef4444',
    activeBg: (d) => d ? 'rgba(239,68,68,0.10)' : '#fef2f2',
    activeBorder: (d) => d ? 'rgba(239,68,68,0.50)' : '#fca5a5',
    activeText: (d) => d ? '#fca5a5' : '#991b1b',
    glow: 'rgba(239,68,68,0.18)',
  },
  {
    id: 'salary',
    label: 'Recebi salário',
    sublabel: 'Renda principal',
    icon: <Wallet size={22} />,
    primary: false,
    activeColor: '#10b981',
    activeBg: (d) => d ? 'rgba(16,185,129,0.10)' : '#ecfdf5',
    activeBorder: (d) => d ? 'rgba(16,185,129,0.50)' : '#6ee7b7',
    activeText: (d) => d ? '#6ee7b7' : '#166534',
    glow: 'rgba(16,185,129,0.18)',
  },
  {
    id: 'income',
    label: 'Recebi extra',
    sublabel: 'Renda adicional',
    icon: <TrendingUp size={22} />,
    primary: false,
    activeColor: '#6366f1',
    activeBg: (d) => d ? 'rgba(99,102,241,0.10)' : '#eef2ff',
    activeBorder: (d) => d ? 'rgba(99,102,241,0.50)' : '#a5b4fc',
    activeText: (d) => d ? '#a5b4fc' : '#3730a3',
    glow: 'rgba(99,102,241,0.18)',
  },
];

function TypeCard({
  option,
  isSelected,
  isDark,
  t,
  onSelect,
}: {
  option: RecordTypeOption;
  isSelected: boolean;
  isDark: boolean;
  t: ReturnType<typeof useTokens>;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const borderColor = isSelected
    ? option.activeBorder(isDark)
    : hovered
    ? t.border.focus
    : t.border.default;

  const bg = isSelected
    ? option.activeBg(isDark)
    : hovered
    ? t.bg.cardHover
    : t.bg.card;

  const iconColor = isSelected
    ? option.activeText(isDark)
    : hovered
    ? t.text.primary
    : t.text.muted;

  const titleColor = isSelected ? option.activeText(isDark) : t.text.primary;
  const subColor = isSelected ? option.activeText(isDark) : t.text.muted;

  return (
    <label
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        display: 'block',
        flex: option.primary ? '1.15' : '1',
      }}
    >
      <div
        onClick={onSelect}
        style={{
          padding: option.primary ? '18px 14px' : '16px 12px',
          borderRadius: 16,
          border: `2px solid ${borderColor}`,
          background: bg,
          textAlign: 'center',
          transition: 'all 0.18s ease',
          boxShadow: isSelected
            ? `0 0 0 4px ${option.glow}, 0 4px 16px ${option.glow}`
            : hovered
            ? `0 2px 12px rgba(0,0,0,0.12)`
            : 'none',
          transform: isSelected ? 'translateY(-1px)' : hovered ? 'translateY(-1px)' : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {option.primary && isSelected && (
          <span style={{
            position: 'absolute', top: 6, right: 8,
            fontSize: 9, fontWeight: 800, letterSpacing: '0.06em',
            color: option.activeText(isDark),
            opacity: 0.7, textTransform: 'uppercase',
          }}>
            mais usado
          </span>
        )}

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: option.primary ? 44 : 38,
          height: option.primary ? 44 : 38,
          borderRadius: '50%',
          margin: '0 auto 10px',
          background: isSelected
            ? `${option.activeColor}22`
            : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          color: iconColor,
          transition: 'all 0.18s ease',
        }}>
          {option.icon}
        </div>

        <div style={{
          fontSize: option.primary ? 14 : 13,
          fontWeight: 700,
          color: titleColor,
          marginBottom: 3,
          transition: 'color 0.18s',
          lineHeight: 1.2,
        }}>
          {option.label}
        </div>

        <div style={{
          fontSize: 11,
          color: subColor,
          opacity: isSelected ? 0.9 : 0.7,
          transition: 'color 0.18s',
          lineHeight: 1.3,
        }}>
          {option.sublabel}
        </div>
      </div>
    </label>
  );
}

export function RecordTypeSelector() {
  const { register, setValue } = useFormContext();
  const selectedType = useWatch({ name: 'type' });
  const t = useTokens();
  const isDark = t.bg.page === '#020617';

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3">
        {TYPES.map((option) => (
          <TypeCard
            key={option.id}
            option={option}
            isSelected={selectedType === option.id}
            isDark={isDark}
            t={t}
            onSelect={() => setValue('type', option.id, { shouldValidate: true })}
          />
        ))}
        <input type="radio" {...register('type')} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
