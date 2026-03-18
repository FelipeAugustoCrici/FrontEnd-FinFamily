import { cn } from '@/components/ui/Button';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Tag,
  User,
  DollarSign,
  FileText,
} from 'lucide-react';
import type { ParsedLaunch } from './quickLaunch.parser';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

interface Props {
  parsed: ParsedLaunch;
  categoryName: string | null;
  personName: string | null;
  dateLabel: string;
}

const Row = ({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div className="flex items-center gap-2.5 text-sm">
    <Icon size={14} className="text-primary-400 shrink-0" />
    <span className="text-primary-500 w-24 shrink-0">{label}</span>
    <span className={cn('font-semibold text-primary-800 truncate', valueClass)}>{value}</span>
  </div>
);

export function QuickLaunchPreview({ parsed, categoryName, personName, dateLabel }: Props) {
  const isIncome = parsed.type !== 'expense';
  const typeLabel =
    parsed.type === 'salary' ? 'Salário' : parsed.type === 'income' ? 'Receita' : 'Despesa';

  return (
    <div className="rounded-xl border border-primary-100 bg-primary-50/60 p-4 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
      {/* type badge */}
      <div className="flex items-center gap-2 mb-1">
        <div
          className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center',
            isIncome ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600',
          )}
        >
          {isIncome ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
        </div>
        <span
          className={cn(
            'text-xs font-bold uppercase tracking-wide',
            isIncome ? 'text-success-600' : 'text-danger-600',
          )}
        >
          {typeLabel}
        </span>
        {parsed.confidence >= 0.7 && (
          <span className="ml-auto text-xs text-success-600 font-medium">✓ pronto para salvar</span>
        )}
      </div>

      <Row icon={FileText} label="Descrição" value={parsed.description || '—'} />
      <Row
        icon={DollarSign}
        label="Valor"
        value={parsed.amount !== null ? fmt(parsed.amount) : '—'}
        valueClass={
          parsed.amount !== null
            ? isIncome
              ? 'text-success-600'
              : 'text-danger-600'
            : 'text-primary-400'
        }
      />
      <Row icon={Calendar} label="Data" value={dateLabel} />
      <Row icon={Tag} label="Categoria" value={categoryName ?? '—'} />
      <Row icon={User} label="Responsável" value={personName ?? '—'} />
    </div>
  );
}
