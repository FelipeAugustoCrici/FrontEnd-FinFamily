import _ from 'lodash';
import { useFormContext, useWatch } from 'react-hook-form';
import { Person } from '@/types';
import { formatMonthYear } from '@/common/utils/date';
import { useTokens } from '@/hooks/useTokens';

type SummarySectionProps = {
  people: Person[];
};

const TYPE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  expense: { label: 'Despesa', icon: '💸', color: '#ef4444' },
  salary:  { label: 'Salário', icon: '💰', color: '#10b981' },
  income:  { label: 'Extra / Bônus', icon: '✨', color: '#6366f1' },
};

export function SummarySection({ people }: SummarySectionProps) {
  const { control } = useFormContext();
  const t = useTokens();
  const isDark = t.bg.page === '#020617';

  const description = useWatch({ control, name: 'description' });
  const value = useWatch({ control, name: 'value' });
  const date = useWatch({ control, name: 'date' });
  const personId = useWatch({ control, name: 'personId' });
  const type = useWatch({ control, name: 'type' });

  const personName = _.find(people, { id: personId })?.name || '—';
  const formattedDate = date ? formatMonthYear(date) : '—';
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));

  const typeInfo = TYPE_LABELS[type] || TYPE_LABELS.expense;

  const accentBg = isDark ? 'rgba(99,102,241,0.10)' : '#eef2ff';
  const accentBorder = isDark ? 'rgba(99,102,241,0.20)' : '#e0e7ff';

  return (
    <div style={{
      background: t.bg.card,
      border: `1px solid ${t.border.default}`,
      borderRadius: 18,
      padding: 20,
      boxShadow: t.shadow.card,
      position: 'sticky',
      top: 96,
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    }}>
      {}
      <p style={{ fontSize: 11, fontWeight: 700, color: t.text.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
        Prévia do Lançamento
      </p>

      {}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: accentBg,
        border: `1px solid ${accentBorder}`,
        borderRadius: 10,
        padding: '8px 12px',
        marginBottom: 16,
      }}>
        <span style={{ fontSize: 18 }}>{typeInfo.icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: typeInfo.color }}>{typeInfo.label}</span>
      </div>

      {}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, color: t.text.muted, marginBottom: 4 }}>Valor total</p>
        <p style={{
          fontSize: 32,
          fontWeight: 800,
          color: typeInfo.color,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          {formattedValue}
        </p>
      </div>

      {}
      <div style={{ height: 1, background: t.border.divider, marginBottom: 16 }} />

      {}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ fontSize: 12, color: t.text.muted, flexShrink: 0 }}>Descrição</span>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: t.text.primary,
            textAlign: 'right',
            maxWidth: 140,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {description || '—'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: t.text.muted }}>Responsável</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: t.text.primary }}>{personName}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: t.text.muted }}>Referência</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: t.text.primary }}>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
