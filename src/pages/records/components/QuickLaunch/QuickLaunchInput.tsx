import { useState, useRef, useEffect, useCallback } from 'react';
import { Zap, Loader2, X, ChevronDown } from 'lucide-react';
import moment from 'moment';
import { cn } from '@/components/ui/Button';
import { useCategories } from '@/pages/categories/hooks/useCategories';
import { useUserFamily } from '@/hooks/useUserInfo';
import { useQuery } from '@tanstack/react-query';
import { familyService } from '@/pages/families/services/families.service';
import { useCreateRecord } from '../../hooks/useCreateRecord';
import { parseQuickLaunch, resolveCategoryName } from './quickLaunch.parser';
import { QuickLaunchPreview } from './QuickLaunchPreview';

const PLACEHOLDERS = [
  'mercado 150',
  'gasolina 80 ontem',
  'salário 2500 hoje',
  'ifood 45 alimentação',
  'internet 120 dia 10',
];

export function QuickLaunchInput() {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: family } = useUserFamily();
  const { data: categories = [] } = useCategories();
  const { data: families = [] } = useQuery({
    queryKey: ['families'],
    queryFn: () => familyService.list(),
  });

  const members: { id: string; name: string }[] = families.flatMap((f: any) => f.members ?? []);
  const createRecord = useCreateRecord();

  // Rotate placeholder
  useEffect(() => {
    const id = setInterval(() => setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length), 3000);
    return () => clearInterval(id);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const parsed = parseQuickLaunch(text, members, categories);
  const categoryName = resolveCategoryName(parsed.categoryHint, categories);
  const personName = members.find((m) => m.id === parsed.personHint)?.name ?? null;

  // Compara strings YYYY-MM-DD diretamente — sem conversão de timezone
  const todayStr = moment().format('YYYY-MM-DD');
  const yesterdayStr = moment().subtract(1, 'days').format('YYYY-MM-DD');
  const tomorrowStr = moment().add(1, 'days').format('YYYY-MM-DD');
  const dateLabel =
    parsed.date === todayStr ? 'Hoje' :
    parsed.date === yesterdayStr ? 'Ontem' :
    parsed.date === tomorrowStr ? 'Amanhã' :
    parsed.date.split('-').reverse().join('/');

  const canSave = parsed.description.length > 0 && parsed.amount !== null;

  const handleSave = useCallback(() => {
    if (!canSave) return;

    const familyId = family?.id ?? families[0]?.id ?? '';
    const defaultPersonId = members[0]?.id ?? '';

    const resolvedCategoryId = parsed.categoryHint && categories.find((c) => c.id === parsed.categoryHint)
      ? parsed.categoryHint
      : undefined;
    const resolvedCategoryName = categoryName ?? 'Outro';

    createRecord.mutate(
      {
        description: parsed.description,
        value: String(parsed.amount),
        date: parsed.date,
        type: parsed.type,
        categoryId: resolvedCategoryId,
        categoryName: resolvedCategoryName,
        personId: parsed.personHint ?? defaultPersonId,
        familyId,
        isRecurring: false,
      } as any,
      {
        onSuccess: () => {
          setText('');
          setOpen(false);
          inputRef.current?.focus();
        },
      },
    );
  }, [canSave, parsed, family, families, members, categories, categoryName, createRecord]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canSave) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setText('');
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl border-2 bg-white transition-all duration-200',
          open
            ? 'border-primary-400 shadow-md shadow-primary-100'
            : 'border-primary-200 hover:border-primary-300',
        )}
      >
        <div className="w-7 h-7 rounded-lg bg-primary-800 flex items-center justify-center shrink-0">
          <Zap size={14} className="text-white" />
        </div>

        <input
          ref={inputRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(e.target.value.length > 0);
          }}
          onFocus={() => text.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={`Lançamento rápido — ex: ${PLACEHOLDERS[placeholderIdx]}`}
          className="flex-1 bg-transparent text-sm text-primary-800 placeholder:text-primary-400 outline-none"
        />

        {text.length > 0 && (
          <button
            onClick={() => { setText(''); setOpen(false); }}
            className="text-primary-400 hover:text-primary-600 transition-colors"
          >
            <X size={15} />
          </button>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          className="text-primary-400 hover:text-primary-600 transition-colors"
        >
          <ChevronDown size={15} className={cn('transition-transform', open && 'rotate-180')} />
        </button>
      </div>

      {open && text.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl border border-primary-100 shadow-xl shadow-primary-900/10 p-4 space-y-4">
          <QuickLaunchPreview
            parsed={parsed}
            categoryName={categoryName}
            personName={personName}
            dateLabel={dateLabel}
          />

          {parsed.missingFields.length > 0 && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Faltando:{' '}
              {parsed.missingFields
                .map((f) => ({ description: 'descrição', amount: 'valor' }[f] ?? f))
                .join(', ')}
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!canSave || createRecord.isPending}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all',
                canSave
                  ? 'bg-primary-800 text-white hover:bg-primary-700 active:scale-[0.98]'
                  : 'bg-primary-100 text-primary-400 cursor-not-allowed',
              )}
            >
              {createRecord.isPending ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              Salvar{canSave ? ' (Enter)' : ''}
            </button>
            <button
              onClick={() => { setText(''); setOpen(false); }}
              className="px-4 py-2.5 rounded-lg text-sm text-primary-500 hover:bg-primary-50 transition-colors"
            >
              Cancelar (Esc)
            </button>
          </div>

          <p className="text-xs text-primary-400 text-center">
            Dica: "mercado 150 ontem" · "salário 2500" · "ifood 45 alimentação"
          </p>
        </div>
      )}
    </div>
  );
}
