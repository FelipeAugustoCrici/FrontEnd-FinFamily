import { PiggyBank, CreditCard, ShoppingBag, TrendingUp } from 'lucide-react';
import type { GoalType } from '../types/planning.types';

export const GOAL_TYPE_META: Record<
  GoalType,
  { label: string; icon: typeof PiggyBank; color: string; bg: string; border: string }
> = {
  savings: {
    label: 'Reserva / Poupança',
    icon: PiggyBank,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  debt: {
    label: 'Pagar Dívida',
    icon: CreditCard,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
  purchase: {
    label: 'Comprar Algo',
    icon: ShoppingBag,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  investment: {
    label: 'Investimento',
    icon: TrendingUp,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
  },
};

export type BadgeLevel = 'iniciante' | 'avancando' | 'quase-la' | 'concluido';

export function getBadge(pct: number): { level: BadgeLevel; label: string; color: string } {
  if (pct >= 100) return { level: 'concluido', label: 'Concluído 🎉', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  if (pct >= 75) return { level: 'quase-la', label: 'Quase lá 🔥', color: 'text-amber-600 bg-amber-50 border-amber-200' };
  if (pct >= 25) return { level: 'avancando', label: 'Avançando 💪', color: 'text-sky-600 bg-sky-50 border-sky-200' };
  return { level: 'iniciante', label: 'Iniciante 🌱', color: 'text-slate-500 bg-slate-50 border-slate-200' };
}

export function getMotivation(pct: number): string {
  if (pct >= 100) return 'Meta atingida! Parabéns! 🎉';
  if (pct >= 75) return 'Quase lá! Continue assim! 🔥';
  if (pct >= 50) return 'Mais da metade! Você está indo bem!';
  if (pct >= 25) return 'Bom começo! Continue avançando 💪';
  return 'Cada contribuição conta. Vamos lá!';
}

export function getProgressBarColor(pct: number): string {
  if (pct >= 100) return 'from-emerald-400 to-emerald-600';
  if (pct >= 75) return 'from-amber-400 to-amber-500';
  if (pct >= 50) return 'from-sky-400 to-sky-600';
  return 'from-primary-400 to-primary-600';
}

export function estimateMonths(remaining: number, contributions: { value: number; date: string }[]): number | null {
  if (remaining <= 0) return 0;
  if (contributions.length < 2) return null;
  const sorted = [...contributions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const first = new Date(sorted[0].date).getTime();
  const last = new Date(sorted[sorted.length - 1].date).getTime();
  const diffMonths = (last - first) / (1000 * 60 * 60 * 24 * 30);
  if (diffMonths <= 0) return null;
  const total = contributions.reduce((s, c) => s + c.value, 0);
  const monthlyAvg = total / diffMonths;
  if (monthlyAvg <= 0) return null;
  return Math.ceil(remaining / monthlyAvg);
}

export const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
