import { useState, useRef, useEffect, useCallback } from 'react';
import { Zap, Loader2, X, ChevronDown } from 'lucide-react';
import moment from 'moment';
import { cn } from '@/components/ui/Button';
import { useCategories } from '@/pages/categories/hooks/useCategories';
import { useUserFamily, useUserInfo } from '@/hooks/useUserInfo';
import { useQuery } from '@tanstack/react-query';
import { familyService } from '@/pages/families/services/families.service';
import { useCreateRecord } from '../../hooks/useCreateRecord';
import { parseQuickLaunch, resolveCategoryName } from './quickLaunch.parser';
import { QuickLaunchPreview } from './QuickLaunchPreview';
import { useTheme } from '@/hooks/useTheme';
import { useTokens } from '@/hooks/useTokens';

const PLACEHOLDERS = [
  '💬 Ex: paguei 150 mercado',
  '💬 Ex: recebi 2500 de salario',
  '💬 Ex: ifood 45 alimentação',
  '💬 Ex: ganhei 500 do meu pai',
  '💬 Ex: gasolina 80 ontem',
];

export function QuickLaunchInput() {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [editedDescription, setEditedDescription] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const t = useTokens();

  const { data: family } = useUserFamily();
  const { data: userInfo } = useUserInfo();
  const { data: categories = [] } = useCategories();
  const { data: families = [] } = useQuery({
    queryKey: ['families'],
    queryFn: () => familyService.list(),
  });

  const members: { id: string; name: string }[] = families.flatMap((f: any) => f.members ?? []);
  const loggedMemberId = members.find(
    (m: any) => m.email && userInfo?.email && m.email === userInfo.email
  )?.id ?? members[0]?.id ?? '';
  const createRecord = useCreateRecord();

  useEffect(() => {
    const id = setInterval(() => setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const parsed = parseQuickLaunch(text, members, categories);
  const activeDescription = editedDescription ?? parsed.description;
  const categoryName = resolveCategoryName(parsed.categoryHint, categories);
  const personName = members.find((m) => m.id === parsed.personHint)?.name ?? null;

  const todayStr = moment().format('YYYY-MM-DD');
  const yesterdayStr = moment().subtract(1, 'days').format('YYYY-MM-DD');
  const tomorrowStr = moment().add(1, 'days').format('YYYY-MM-DD');
  const dateLabel =
    parsed.date === todayStr ? 'Hoje' :
    parsed.date === yesterdayStr ? 'Ontem' :
    parsed.date === tomorrowStr ? 'Amanhã' :
    parsed.date.split('-').reverse().join('/');

  const canSave = activeDescription.length > 0 && parsed.amount !== null;

  const handleSave = useCallback(() => {
    if (!canSave) return;
    const familyId = family?.id ?? families[0]?.id ?? '';
    const resolvedCategoryId = parsed.categoryHint && categories.find((c) => c.id === parsed.categoryHint)
      ? parsed.categoryHint : undefined;
    const resolvedCategoryName = categoryName ?? 'Outro';
    createRecord.mutate(
      {
        description: activeDescription,
        value: String(parsed.amount),
        date: parsed.date,
        type: parsed.type,
        categoryId: resolvedCategoryId,
        categoryName: resolvedCategoryName,
        personId: parsed.personHint ?? loggedMemberId,
        familyId,
        isRecurring: false,
      } as any,
      {
        onSuccess: () => {
          setText('');
          setEditedDescription(null);
          setOpen(false);
          inputRef.current?.focus();
        },
      },
    );
  }, [canSave, parsed, family, families, members, categories, categoryName, createRecord]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canSave) { e.preventDefault(); handleSave(); }
    if (e.key === 'Escape') { setText(''); setOpen(false); inputRef.current?.blur(); }
  };

const qi = t.quickInput;
  const wrapBdr    = focused ? qi.borderFocus : qi.border;
  const wrapShadow = focused ? qi.shadow : 'none';
  const zapBg      = focused ? qi.zapBgFocus : qi.zapBg;

  return (
    <div ref={containerRef} className="relative w-full">
      {}
      <div
        className="flex items-center gap-3 px-5 rounded-2xl border-2 transition-all duration-200"
        style={{ minHeight: '56px', background: qi.bg, borderColor: wrapBdr, boxShadow: wrapShadow }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
          style={{ background: zapBg, transform: focused ? 'scale(1.1)' : 'scale(1)' }}
        >
          <Zap size={15} className="text-white" />
        </div>

        <input
          ref={inputRef}
          value={text}
          onChange={(e) => { setText(e.target.value); setEditedDescription(null); setOpen(e.target.value.length > 0); }}
          onFocus={() => { setFocused(true); text.length > 0 && setOpen(true); }}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS[placeholderIdx]}
          className="flex-1 bg-transparent text-sm outline-none py-4"
          style={{ color: t.text.primary }}
        />

        {focused && !text && (
          <span className="text-xs shrink-0 hidden sm:block" style={{ color: t.text.subtle }}>
            Pressione Enter para adicionar
          </span>
        )}

        {text.length > 0 && (
          <button
            onClick={() => { setText(''); setEditedDescription(null); setOpen(false); }}
            className="p-1 rounded-lg transition-colors"
            style={{ color: t.text.muted }}
            onMouseEnter={e => (e.currentTarget.style.background = t.bg.muted)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={15} />
          </button>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          className="p-1 rounded-lg transition-colors"
          style={{ color: t.text.muted }}
          onMouseEnter={e => (e.currentTarget.style.background = t.bg.muted)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <ChevronDown size={15} className={cn('transition-transform duration-200', open && 'rotate-180')} />
        </button>
      </div>

      {}
      {open && text.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl p-4 space-y-4"
          style={{ background: qi.dropBg, border: `1px solid ${qi.dropBorder}`, boxShadow: qi.dropShadow }}
        >
          <QuickLaunchPreview
            parsed={parsed}
            categoryName={categoryName}
            personName={personName}
            dateLabel={dateLabel}
            description={activeDescription}
            onDescriptionChange={setEditedDescription}
          />

          {parsed.missingFields.length > 0 && (
            <p
              className="text-xs rounded-lg px-3 py-2"
              style={{ color: t.warning.text, background: t.warning.bg, border: `1px solid ${t.warning.border}` }}
            >
              Faltando:{' '}
              {parsed.missingFields.map((f) => ({ description: 'descrição', amount: 'valor' }[f] ?? f)).join(', ')}
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!canSave || createRecord.isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]"
              style={{
                background: canSave ? (isDark ? '#6366f1' : '#1e293b') : t.bg.muted,
                color: canSave ? '#ffffff' : t.text.disabled,
                cursor: canSave ? 'pointer' : 'not-allowed',
              }}
            >
              {createRecord.isPending ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              Salvar{canSave ? ' (Enter)' : ''}
            </button>
            <button
              onClick={() => { setText(''); setEditedDescription(null); setOpen(false); }}
              className="px-4 py-2.5 rounded-xl text-sm transition-colors duration-200"
              style={{ color: t.text.muted }}
              onMouseEnter={e => (e.currentTarget.style.background = t.bg.cardHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              Cancelar (Esc)
            </button>
          </div>

          <p className="text-xs text-center" style={{ color: t.text.subtle }}>
            Dica: "recebi 2500 de salario" · "enviei 150 para a Shirlley" · "mercado 80 ontem"
          </p>
        </div>
      )}
    </div>
  );
}
