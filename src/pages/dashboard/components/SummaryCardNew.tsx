import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useCountUp } from '@/hooks/useCountUp';

type Props = {
  title: string;
  value: number;
  type: 'income' | 'expense' | 'balance' | 'investment';
  icon: React.ComponentType<{ size: number; className?: string }>;
  change?: number;
  subtitle?: string;
};

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

type ColorSet = {
  bg: string; border: string; shadow: string;
  iconBg: string; iconColor: string;
  valueColor: string; labelColor: string; subtitleColor: string;
};

const LIGHT: Record<string, ColorSet> = {
  income:     { bg: '#ecfdf5', border: '#d1fae5', shadow: 'rgba(16,185,129,0.08)',  iconBg: '#a7f3d0', iconColor: '#059669', valueColor: '#047857', labelColor: '#6b7280', subtitleColor: '#9ca3af' },
  expense:    { bg: '#fff1f2', border: '#fecdd3', shadow: 'rgba(244,63,94,0.08)',   iconBg: '#fda4af', iconColor: '#e11d48', valueColor: '#be123c', labelColor: '#6b7280', subtitleColor: '#9ca3af' },
  balance:    { bg: '#ffffff', border: '#e2e8f0', shadow: 'rgba(0,0,0,0.06)',       iconBg: '#f1f5f9', iconColor: '#475569', valueColor: '#1e293b', labelColor: '#6b7280', subtitleColor: '#9ca3af' },
  investment: { bg: '#eff6ff', border: '#bfdbfe', shadow: 'rgba(59,130,246,0.08)', iconBg: '#bfdbfe', iconColor: '#2563eb', valueColor: '#1d4ed8', labelColor: '#6b7280', subtitleColor: '#9ca3af' },
};

const DARK: Record<string, ColorSet> = {
  income:     { bg: 'linear-gradient(135deg,#052e1b,#064e3b)', border: 'rgba(110,231,183,0.15)', shadow: 'rgba(74,222,128,0.08)',  iconBg: 'rgba(110,231,183,0.15)', iconColor: '#6ee7b7', valueColor: '#a7f3d0', labelColor: '#94a3b8', subtitleColor: '#64748b' },
  expense:    { bg: 'linear-gradient(135deg,#3f0a0a,#7f1d1d)', border: 'rgba(252,165,165,0.15)', shadow: 'rgba(248,113,113,0.08)', iconBg: 'rgba(252,165,165,0.15)', iconColor: '#fca5a5', valueColor: '#fecaca', labelColor: '#94a3b8', subtitleColor: '#64748b' },
  balance:    { bg: '#0f172a',                                  border: 'rgba(255,255,255,0.07)', shadow: 'rgba(0,0,0,0.3)',        iconBg: 'rgba(255,255,255,0.07)', iconColor: '#94a3b8', valueColor: '#f1f5f9', labelColor: '#94a3b8', subtitleColor: '#64748b' },
  investment: { bg: 'linear-gradient(135deg,#0a1f44,#1e3a8a)', border: 'rgba(147,197,253,0.15)', shadow: 'rgba(96,165,250,0.08)',  iconBg: 'rgba(147,197,253,0.15)', iconColor: '#93c5fd', valueColor: '#bfdbfe', labelColor: '#94a3b8', subtitleColor: '#64748b' },
};

export function SummaryCardNew({ title, value, type, icon: Icon, change, subtitle }: Props) {
  const { isDark } = useTheme();
  const cfg = isDark ? DARK[type] : LIGHT[type];
  const hasChange = change !== undefined;
  const isPositiveChange = (change ?? 0) >= 0;
  const animatedValue = useCountUp(value, 650);

  const changeBg    = isPositiveChange ? (isDark ? 'rgba(110,231,183,0.15)' : '#d1fae5') : (isDark ? 'rgba(252,165,165,0.15)' : '#fecdd3');
  const changeColor = isPositiveChange ? (isDark ? '#6ee7b7' : '#047857')                : (isDark ? '#fca5a5' : '#be123c');

  return (
    <div
      className="rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: cfg.bg,
        borderColor: cfg.border,
        boxShadow: `0 4px 20px ${cfg.shadow}, 0 1px 4px rgba(0,0,0,0.06)`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cfg.iconBg }}>
          <span style={{ color: cfg.iconColor, display: 'flex' }}>
            <Icon size={20} />
          </span>
        </div>
        {hasChange && (
          <div
            className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
            style={{ backgroundColor: changeBg, color: changeColor }}
          >
            {isPositiveChange ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {fmt(Math.abs(change!))}
          </div>
        )}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: cfg.labelColor }}>{title}</p>
      <p className="text-2xl font-black" style={{ color: cfg.valueColor }}>{fmt(animatedValue)}</p>
      {subtitle && <p className="text-xs mt-1" style={{ color: cfg.subtitleColor }}>{subtitle}</p>}
    </div>
  );
}
