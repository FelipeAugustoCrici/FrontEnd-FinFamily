import { useState, useRef, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Sparkles, Zap, ChevronRight, X } from 'lucide-react';
import { useTokens } from '@/hooks/useTokens';
import { parseSmartInput, saveUserPattern } from '../hooks/useSmartParser';
import _ from 'lodash';

interface SmartInputProps {
  categories: any[];
}

const CONFIDENCE_LABEL = {
  high: { text: 'Padrão seu', color: '#10b981' },
  medium: { text: 'Sugestão', color: '#94a3b8' },
  low: { text: 'Sem categoria', color: '#f59e0b' },
};

const TYPE_LABEL: Record<string, { label: string; emoji: string }> = {
  expense: { label: 'Despesa', emoji: '💸' },
  salary:  { label: 'Salário', emoji: '💰' },
  income:  { label: 'Extra',   emoji: '✨' },
};

export function SmartInput({ categories }: SmartInputProps) {
  const { setValue } = useFormContext();
  const t = useTokens();
  const isDark = t.bg.page === '#020617';

  const [text, setText] = useState('');
  const [parsed, setParsed] = useState<ReturnType<typeof parseSmartInput>>(null);
  const [applied, setApplied] = useState(false);
  const [focused, setFocused] = useState(false);

  const debouncedParse = useRef(
    _.debounce((val: string) => {
      setParsed(parseSmartInput(val));
      setApplied(false);
    }, 220)
  ).current;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
    if (!val.trim()) { setParsed(null); return; }
    debouncedParse(val);
  }, [debouncedParse]);

  const applyParsed = () => {
    if (!parsed) return;
    setValue('description', parsed.description);
    if (parsed.value) setValue('value', parsed.value);
    setValue('type', parsed.type);
    if (parsed.suggestedCategoryName) {
      const match = categories.find(
        (c) => c.name.toLowerCase() === parsed.suggestedCategoryName.toLowerCase()
          && (parsed.type === 'expense' ? c.type === 'expense' : c.type === 'income')
      );
      if (match) {
        setValue('categoryId', match.id);
        setValue('categoryName', match.name);
        saveUserPattern(parsed.description.toLowerCase(), match.name, parsed.type);
      }
    }
    setApplied(true);
    setText('');
    setParsed(null);
  };

  const clear = () => { setText(''); setParsed(null); setApplied(false); };

  // Cores do container
  const containerBg   = isDark ? 'rgba(99,102,241,0.07)' : '#f5f3ff';
  const containerBorder = isDark
    ? (focused || parsed ? 'rgba(99,102,241,0.40)' : 'rgba(99,102,241,0.18)')
    : (focused || parsed ? '#a5b4fc' : '#ddd6fe');

  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const inputBorder = focused
    ? '#6366f1'
    : isDark ? 'rgba(255,255,255,0.10)' : '#e2e8f0';
  const inputShadow = focused ? '0 0 0 3px rgba(99,102,241,0.18)' : 'none';

  return (
    <div style={{
      background: containerBg,
      border: `1.5px solid ${containerBorder}`,
      borderRadius: 16,
      padding: '14px 14px 12px',
      transition: 'border-color 0.2s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <Zap size={12} color="#6366f1" />
        <span style={{
          fontSize: 10, fontWeight: 800,
          color: isDark ? '#a5b4fc' : '#4338ca',
          textTransform: 'uppercase', letterSpacing: '0.09em',
        }}>
          Preenchimento Inteligente
        </span>
        <span style={{
          fontSize: 9, padding: '2px 7px', borderRadius: 999, fontWeight: 700,
          background: isDark ? 'rgba(99,102,241,0.20)' : '#e0e7ff',
          color: isDark ? '#a5b4fc' : '#4338ca',
        }}>
          Beta
        </span>
      </div>

      {/* Input */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 12, top: '50%',
          transform: 'translateY(-50%)', pointerEvents: 'none',
        }}>
          <Sparkles size={15} color={focused || parsed ? '#6366f1' : t.text.muted} />
        </div>

        <input
          type="text"
          value={text}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyParsed(); } }}
          placeholder="Ex: iFood 45, Salário 3500, Gasolina 150..."
          style={{
            width: '100%',
            padding: '10px 36px 10px 36px',
            borderRadius: 10,
            border: `1.5px solid ${inputBorder}`,
            background: inputBg,
            color: t.text.primary,
            fontSize: 13,
            outline: 'none',
            boxShadow: inputShadow,
            transition: 'border-color 0.18s, box-shadow 0.18s',
            boxSizing: 'border-box',
          }}
        />

        {text && (
          <button
            type="button"
            onClick={clear}
            style={{
              position: 'absolute', right: 10, top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: t.text.muted, display: 'flex', alignItems: 'center', padding: 2,
            }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Sugestão */}
      {parsed && !applied && (
        <div style={{
          marginTop: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          flexWrap: 'wrap',
        }}>
          {/* Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', flex: 1 }}>
            {/* Tipo */}
            <span style={{
              fontSize: 11, fontWeight: 700,
              padding: '4px 10px', borderRadius: 999,
              background: isDark ? 'rgba(255,255,255,0.08)' : '#ede9fe',
              color: isDark ? '#e2e8f0' : '#5b21b6',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span>{TYPE_LABEL[parsed.type]?.emoji}</span>
              {TYPE_LABEL[parsed.type]?.label}
            </span>

            {/* Categoria */}
            {parsed.suggestedCategoryName && (
              <span style={{
                fontSize: 11, fontWeight: 600,
                padding: '4px 10px', borderRadius: 999,
                background: isDark ? 'rgba(16,185,129,0.12)' : '#d1fae5',
                color: isDark ? '#6ee7b7' : '#065f46',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span style={{ fontSize: 9, fontWeight: 800, opacity: 0.65, letterSpacing: '0.05em' }}>CATEGORIA</span>
                {parsed.suggestedCategoryName}
              </span>
            )}

            {/* Valor */}
            {parsed.value && (
              <span style={{
                fontSize: 11, fontWeight: 700,
                padding: '4px 10px', borderRadius: 999,
                background: isDark ? 'rgba(245,158,11,0.14)' : '#fef9c3',
                color: isDark ? '#fcd34d' : '#92400e',
              }}>
                R$ {Number(parsed.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}

            {/* Confiança */}
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: CONFIDENCE_LABEL[parsed.confidence].color,
            }}>
              {CONFIDENCE_LABEL[parsed.confidence].text}
            </span>
          </div>

          {/* Botão Aplicar */}
          <button
            type="button"
            onClick={applyParsed}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '7px 16px', borderRadius: 10,
              border: 'none', background: '#6366f1',
              color: '#ffffff', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', flexShrink: 0,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Aplicar <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* Feedback aplicado */}
      {applied && (
        <div style={{
          marginTop: 10, fontSize: 12, fontWeight: 600,
          color: isDark ? '#6ee7b7' : '#166534',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ✓ Campos preenchidos automaticamente
        </div>
      )}
    </div>
  );
}
