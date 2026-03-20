import { useFormContext, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Repeat } from 'lucide-react';
import { useTokens } from '@/hooks/useTokens';

export function RecurrenceSection() {
  const { register } = useFormContext();
  const isRecurring = useWatch({ name: 'isRecurring' });
  const t = useTokens();
  const isDark = t.bg.page === '#020617';

  const activeBg = isDark ? 'rgba(99,102,241,0.10)' : '#eef2ff';
  const activeBorder = isDark ? 'rgba(99,102,241,0.30)' : '#c7d2fe';
  const activeText = isDark ? '#a5b4fc' : '#3730a3';

  return (
    <div
      style={{
        background: isRecurring ? activeBg : t.bg.muted,
        border: `1.5px solid ${isRecurring ? activeBorder : t.border.default}`,
        borderRadius: 14,
        padding: '14px 16px',
        transition: 'all 0.18s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: isRecurring ? (isDark ? 'rgba(99,102,241,0.2)' : '#e0e7ff') : t.bg.mutedStrong,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.18s ease',
        }}>
          <Repeat size={16} color={isRecurring ? activeText : t.text.muted} />
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: isRecurring ? activeText : t.text.secondary, marginBottom: 1 }}>
            Lançamento recorrente
          </p>
          <p style={{ fontSize: 11, color: isRecurring ? activeText : t.text.muted, opacity: 0.8 }}>
            Repetir automaticamente nos próximos meses
          </p>
        </div>

        {/* Toggle switch */}
        <div style={{ flexShrink: 0 }}>
          <input
            type="checkbox"
            {...register('isRecurring')}
            style={{ display: 'none' }}
            id="isRecurring"
          />
          <label
            htmlFor="isRecurring"
            style={{
              display: 'block',
              width: 44,
              height: 24,
              borderRadius: 999,
              background: isRecurring ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1'),
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.18s ease',
            }}
          >
            <div style={{
              position: 'absolute',
              top: 3,
              left: isRecurring ? 23 : 3,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              transition: 'left 0.18s ease',
            }} />
          </label>
        </div>
      </div>

      {/* Campo de duração com transição suave */}
      <div style={{
        overflow: 'hidden',
        maxHeight: isRecurring ? 120 : 0,
        opacity: isRecurring ? 1 : 0,
        transition: 'max-height 0.25s ease, opacity 0.2s ease',
        marginTop: isRecurring ? 14 : 0,
      }}>
        <Input
          label="Duração (meses)"
          type="number"
          min="1"
          placeholder="Ex: 12"
          {...register('durationMonths')}
        />
        <p style={{ fontSize: 11, color: t.text.muted, marginTop: 4 }}>
          O lançamento será repetido pelos próximos meses informados
        </p>
      </div>
    </div>
  );
}
