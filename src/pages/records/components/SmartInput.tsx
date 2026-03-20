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
  medium: { text: 'Sugestão', color: '#6366f1' },
  low: { text: 'Sem categoria', color: '#f59e0b' },
};

const TYPE_LABEL: Record<string, string> = {
  expense: '💸 Despesa',
  salary: '💰 Salário',
  income: '✨ Extra',
};

export function SmartInput({ categories }: SmartInputProps) {
  const { setValue } = useFormContext();
  const t = useTokens();
  const isDark = t.bg.page === '#020617';

  const [text, setText] = useState('');
  const [parsed, setParsed] = useState<ReturnType<typeof parseSmartInput>>(null);
  const [applied, setApplied] = useState(false);
  const [focused, setFocused] = useState(false);

  // Debounce parse para não travar o input
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

    // Tenta encontrar a categoria pelo nome (case-insensitive)
    if (parsed.suggestedCategoryName) {
      const match = categories.find(
        (c) => c.name.toLowerCase() === parsed.suggestedCategoryName.toLowerCase()
          && (parsed.type === 'expense' ? c.type === 'expense' : c.type === 'income')
      );
      if (match) {
        setValue('categoryId', match.id);
        setValue('categoryName', match.name);
        // Salva padrão do usuário para aprendizado
        saveUserPattern(parsed.description.toLowerCase(), match.name, parsed.type);
      }
    }

    setApplied(true);
    setText('');
    setParsed(null);
  };

  const clear = () => {
    setText('');
    setParsed(null);
    setApplied(false);
  };

  const borderColor = focused
    ? '#6366f1'
    : parsed
      ? (isDark ? 'rgba(99,102,241,0.35)' : '#c7d2fe')
      : t.border.input;

  const glowShadow = focused ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Zap size={13} color="#6366f1" />
        <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#a5b4fc' : '#4338ca', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Preenchimento Inteligente
        </span>
        <span style={{
          fontSize: 10,
          padding: '1px 7px',
          borderRadius: 999,
          background: isDark ? 'rgba(99,102,241,0.15)' : '#e0e7ff',
          color: isDark ? '#a5b4fc' : '#4338ca',
          fontWeight: 600,
        }}>
          Beta
        </span>
      </div>

      {/* Input */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}>
          <Sparkles size={16} color={focused || parsed ? '#6366f1' : t.text.muted} />
        </div>

        <input
          type="text"
          value={text}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyParsed(); } }}
          placeholder='Ex: iFood 45, Salário 3500, Gasolina 150...'
          style={{
            width: '100%',
            padding: '11px 40px 11px 38px',
            borderRadius: 12,
            border: `1.5px solid ${borderColor}`,
            background: t.bg.input,
            color: t.text.primary,
            fontSize: 13,
            outline: 'none',
            boxShadow: glowShadow,
            transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
            boxSizing: 'border-box',
          }}
        />

        {text && (
          <button
            type="button"
            onClick={clear}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: t.text.muted,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Preview da sugestão */}
      {parsed && !applied && (
        <div style={{
          marginTop: 8,
          background: isDark ? 'rgba(99,102,241,0.08)' : '#f5f3ff',
          border: `1px solid ${isDark ? 'rgba(99,102,241,0.20)' : '#ddd6fe'}`,
          borderRadius: 12,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          animation: 'fadeIn 0.15s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
            {/* Tipo */}
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: 999,
              background: isDark ? 'rgba(99,102,241,0.15)' : '#ede9fe',
              color: isDark ? '#a5b4fc' : '#5b21b6',
            }}>
              {TYPE_LABEL[parsed.type]}
            </span>

            {/* Categoria sugerida */}
            {parsed.suggestedCategoryName && (
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 9px',
                borderRadius: 999,
                background: isDark ? 'rgba(16,185,129,0.12)' : '#d1fae5',
                color: isDark ? '#6ee7b7' : '#065f46',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.7 }}>CATEGORIA</span>
                {parsed.suggestedCategoryName}
              </span>
            )}

            {/* Valor */}
            {parsed.value && (
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: 999,
                background: isDark ? 'rgba(245,158,11,0.12)' : '#fef9c3',
                color: isDark ? '#fcd34d' : '#92400e',
              }}>
                R$ {Number(parsed.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}

            {/* Confiança */}
            <span style={{
              fontSize: 10,
              color: CONFIDENCE_LABEL[parsed.confidence].color,
              fontWeight: 600,
              opacity: 0.8,
            }}>
              {CONFIDENCE_LABEL[parsed.confidence].text}
            </span>
          </div>

          {/* Botão aplicar */}
          <button
            type="button"
            onClick={applyParsed}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '7px 14px',
              borderRadius: 8,
              border: 'none',
              background: '#6366f1',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'opacity 0.15s ease',
            }}
          >
            Aplicar <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* Feedback de aplicado */}
      {applied && (
        <div style={{
          marginTop: 8,
          fontSize: 12,
          color: isDark ? '#6ee7b7' : '#166534',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          ✓ Campos preenchidos automaticamente
        </div>
      )}
    </div>
  );
}
