import React, { useState } from 'react';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

import { Card } from '@/components/ui/Card';
import { Button, cn } from '@/components/ui/Button';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  TrendingUp,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Brain,
} from 'lucide-react';

import { useDashboard } from './hooks/useDashboard';
import { SummaryCard, Header } from './components';
import { CreditCardsSummary } from './components/CreditCardsSummary';
import { UpcomingWeekCard } from '@/pages/calendar/components/UpcomingWeekCard';
import { formatShortDate } from '@/common/utils/date';
import { QuickLaunchInput } from '@/pages/records/components/QuickLaunch/QuickLaunchInput';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export const Dashboard = () => {
  const navigate = useNavigate();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data: summary, isLoading, error } = useDashboard({ month, year });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="bg-primary-50 border border-primary-200 p-8 rounded-xl text-center space-y-4">
        <h2 className="text-xl font-bold text-primary-800">Ops! Algo deu errado.</h2>
        <p className="text-primary-600 max-w-md mx-auto">
          Não conseguimos carregar os dados do seu dashboard.
        </p>
        <Button onClick={() => navigate('/register')}>Começar Agora</Button>
      </div>
    );
  }

  const recentTransactions = _.take(
    _.orderBy(
      [
        ..._.map(_.get(summary, 'details.salaries', []), (s) => ({
          ...s,
          description: 'Salário',
          type: 'income' as const,
          date: new Date((s as any).year, (s as any).month - 1, 5).toISOString(),
        })),
        ..._.map(_.get(summary, 'details.extras', []), (e) => ({ ...e, type: 'income' as const })),
        ..._.map(_.get(summary, 'details.incomes', []), (i) => ({ ...i, type: 'income' as const })),
        ..._.map(_.get(summary, 'details.expenses', []), (e) => ({ ...e, type: 'expense' as const })),
      ],
      [(t) => new Date((t as any).date).getTime()],
      ['desc'],
    ),
    5,
  );

  const budgetAlerts = summary.budgetAlerts ?? [];
  const alertsWithName = budgetAlerts.map((item: any) => ({
    ...item,
    categoryName:
      typeof item.category === 'object' && item.category?.name
        ? item.category.name
        : typeof item.category === 'string'
          ? item.category
          : 'Sem categoria',
  }));

  return (
    <div className="space-y-8">
      <Header year={year} month={month} setMonth={setMonth} setYear={setYear} />

      {/* Quick Launch */}
      <QuickLaunchInput />

      {/* Row 1 — Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Saldo Total" value={summary.totals?.balance || 0} type="balance" icon={Wallet} />
        <SummaryCard title="Entradas" value={summary.totals?.incomes || 0} type="income" icon={ArrowUpCircle} change={summary.comparison?.incomeChange} />
        <SummaryCard title="Saídas" value={summary.totals?.expenses || 0} type="expense" icon={ArrowDownCircle} change={summary.comparison?.expenseChange} />
        <SummaryCard title="Investimentos (Meta)" value={(summary.totals?.salary || 0) * 0.2} type="balance" icon={TrendingUp} />
      </div>

      {/* Row 2 — Saúde Financeira + Próximos 7 dias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saúde Financeira */}
        {(() => {
          const score = summary.healthScore ?? 0;
          const isGood = score > 70;
          const isMid = score > 40;
          const scoreColor = isGood ? 'text-success-600' : isMid ? 'text-amber-500' : 'text-danger-500';
          const trackColor = isGood ? 'text-success-500' : isMid ? 'text-amber-400' : 'text-danger-500';
          const badgeCls = isGood
            ? 'bg-success-50 text-success-700 border-success-200'
            : isMid
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-danger-50 text-danger-700 border-danger-200';
          const label = isGood ? 'Ótimo' : isMid ? 'Atenção' : 'Crítico';

          const expenseRatio = summary.totals.incomes > 0
            ? (summary.totals.expenses / summary.totals.incomes) * 100
            : 0;
          const savingsRate = Math.max(0, 100 - expenseRatio);

          return (
            <Card title="Saúde Financeira" description="Resumo da sua situação financeira no mês">
              <div className="flex flex-col gap-5">
                {/* Score principal */}
                <div className="flex items-center gap-5">
                  <div className="relative inline-flex items-center justify-center shrink-0">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
                      <circle className="text-primary-100" strokeWidth="7" stroke="currentColor" fill="transparent" r="34" cx="40" cy="40" />
                      <circle
                        className={trackColor}
                        strokeWidth="7"
                        strokeDasharray={213.6}
                        strokeDashoffset={213.6 - (213.6 * score) / 100}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="34"
                        cx="40"
                        cy="40"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className={cn('text-xl font-bold', scoreColor)}>{score}%</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border w-fit inline-block', badgeCls)}>
                      {label}
                    </span>
                    <p className="text-sm text-primary-600 font-medium">Score de saúde financeira</p>
                    <p className="text-xs text-primary-400 leading-relaxed">
                      {isGood
                        ? 'Suas finanças estão equilibradas. Continue assim!'
                        : isMid
                          ? 'Atenção: seus gastos estão próximos da renda.'
                          : 'Seus gastos superam a renda. Revise o orçamento.'}
                    </p>
                  </div>
                </div>

                {/* Mini métricas */}
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-primary-50">
                  <div className="bg-primary-50 rounded-xl p-3 space-y-1">
                    <p className="text-xs text-primary-400 font-medium uppercase tracking-wide">Taxa de Gastos</p>
                    <p className={cn('text-lg font-bold', expenseRatio > 90 ? 'text-danger-600' : expenseRatio > 70 ? 'text-amber-500' : 'text-primary-800')}>
                      {expenseRatio.toFixed(1)}%
                    </p>
                    <p className="text-xs text-primary-400">da renda comprometida</p>
                  </div>
                  <div className="bg-success-50 rounded-xl p-3 space-y-1">
                    <p className="text-xs text-success-600 font-medium uppercase tracking-wide">Taxa de Poupança</p>
                    <p className={cn('text-lg font-bold', savingsRate < 10 ? 'text-danger-600' : 'text-success-700')}>
                      {savingsRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-success-600/70">do que sobra da renda</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })()}

        <UpcomingWeekCard />
      </div>

      {/* Row 3 — Alertas de Orçamento (full width, só aparece se houver alertas) */}
      {alertsWithName.length > 0 && (() => {
        const critical = alertsWithName.filter((a: any) => a.percent > 90).length;
        const warning = alertsWithName.filter((a: any) => a.percent > 70 && a.percent <= 90).length;
        const ok = alertsWithName.filter((a: any) => a.percent <= 70).length;
        return (
          <Card title="Alertas de Orçamento" description="Acompanhe o uso do orçamento por categoria">
            {/* Resumo rápido */}
            <div className="flex flex-wrap gap-3 mb-5">
              {critical > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-danger-50 border border-danger-200 rounded-full">
                  <AlertTriangle size={12} className="text-danger-500" />
                  <span className="text-xs font-semibold text-danger-700">{critical} crítico{critical > 1 ? 's' : ''}</span>
                </div>
              )}
              {warning > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
                  <AlertTriangle size={12} className="text-amber-500" />
                  <span className="text-xs font-semibold text-amber-700">{warning} atenção</span>
                </div>
              )}
              {ok > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-success-50 border border-success-200 rounded-full">
                  <span className="text-xs font-semibold text-success-700">{ok} no limite</span>
                </div>
              )}
            </div>

            {/* Grid de categorias */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {alertsWithName.map((item: any, idx: number) => {
                const pct = Math.min(item.percent, 100);
                const isCrit = item.percent > 90;
                const isWarn = item.percent > 70 && item.percent <= 90;
                const barCls = isCrit ? 'bg-danger-500' : isWarn ? 'bg-amber-400' : 'bg-success-500';
                const cardCls = isCrit
                  ? 'border-danger-200 bg-danger-50/40'
                  : isWarn
                    ? 'border-amber-200 bg-amber-50/40'
                    : 'border-primary-100 bg-primary-50/30';
                const pctCls = isCrit ? 'text-danger-600' : isWarn ? 'text-amber-600' : 'text-success-600';

                return (
                  <div key={`${item.categoryName}-${idx}`} className={cn('rounded-xl border p-4 space-y-3', cardCls)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isCrit && <AlertTriangle size={13} className="text-danger-500 shrink-0" />}
                        <span className="text-sm font-semibold text-primary-800 capitalize">{item.categoryName}</span>
                      </div>
                      <span className={cn('text-sm font-bold', pctCls)}>{Math.round(item.percent)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/70 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={cn('h-full rounded-full transition-all duration-700', barCls)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-primary-500">
                      <span>Gasto: <span className="font-semibold text-primary-700">{fmt(item.spent)}</span></span>
                      <span>Limite: <span className="font-semibold text-primary-700">{fmt(item.limit)}</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })()}

      {/* Row 4 — Previsibilidade de Renda + Estrutura de Gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Previsibilidade de Renda">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-500 font-medium">Renda Fixa</span>
                  <span className="text-primary-800 font-bold">{fmt(summary.totals.fixedIncome || 0)}</span>
                </div>
                <div className="w-full bg-success-50 h-2 rounded-full overflow-hidden">
                  <div className="bg-success-600 h-full rounded-full" style={{ width: `${(summary.totals.fixedIncome / summary.totals.incomes) * 100 || 0}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-500 font-medium">Renda Variável</span>
                  <span className="text-primary-800 font-bold">{fmt(summary.totals.variableIncome || 0)}</span>
                </div>
                <div className="w-full bg-success-50 h-2 rounded-full overflow-hidden">
                  <div className="bg-success-400 h-full rounded-full" style={{ width: `${(summary.totals.variableIncome / summary.totals.incomes) * 100 || 0}%` }} />
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-primary-50">
              <p className="text-xs text-primary-400 uppercase font-bold tracking-wider mb-2">Índice de Previsibilidade</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-success-600">{(summary.totals.predictableIncomePercent || 0).toFixed(1)}%</span>
                <span className="text-sm text-primary-500 pb-1">da renda é garantida</span>
              </div>
              <p className="text-xs text-primary-400 mt-2">Fontes de renda fixas ajudam no planejamento de longo prazo.</p>
            </div>
          </div>
        </Card>

        <Card title="Estrutura de Gastos">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-500 font-medium">Gastos Fixos</span>
                  <span className="text-primary-800 font-bold">{fmt(summary.totals.fixedExpenses || 0)}</span>
                </div>
                <div className="w-full bg-primary-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary-600 h-full rounded-full" style={{ width: `${(summary.totals.fixedExpenses / summary.totals.expenses) * 100 || 0}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-500 font-medium">Gastos Variáveis</span>
                  <span className="text-primary-800 font-bold">{fmt(summary.totals.variableExpenses || 0)}</span>
                </div>
                <div className="w-full bg-primary-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-danger-400 h-full rounded-full" style={{ width: `${(summary.totals.variableExpenses / summary.totals.expenses) * 100 || 0}%` }} />
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-primary-50">
              <p className="text-xs text-primary-400 uppercase font-bold tracking-wider mb-2">Comprometimento da Renda</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-primary-800">{(summary.totals.fixedExpenseCommitment || 0).toFixed(1)}%</span>
                <span className="text-sm text-primary-500 pb-1">da renda mensal</span>
              </div>
              <p className="text-xs text-primary-400 mt-2">O ideal é manter gastos fixos abaixo de 50% da renda.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 5 — Transações Recentes + Contribuição por Membro */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card
          title="Transações Recentes"
          description="Seus últimos lançamentos financeiros"
          className="lg:col-span-2"
          footer={
            <Button variant="ghost" className="w-full text-primary-600 hover:text-primary-800">
              Ver extrato completo <ArrowRight size={16} className="ml-2" />
            </Button>
          }
        >
          <div className="space-y-1">
            {recentTransactions.length === 0 ? (
              <p className="text-center py-8 text-primary-500 italic">Nenhuma transação recente encontrada.</p>
            ) : (
              _.map(recentTransactions, (tx: any, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-primary-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', tx.type === 'income' ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600')}>
                      {tx.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-800">{tx.description}</p>
                      <p className="text-xs text-primary-500">
                        {tx.categoryName ?? (tx.category?.name) ?? 'Receita'} • {formatShortDate(tx.date)}
                      </p>
                    </div>
                  </div>
                  <p className={cn('text-sm font-bold', tx.type === 'income' ? 'text-success-600' : 'text-danger-600')}>
                    {tx.type === 'expense' ? '- ' : ''}{fmt(tx.value)}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Contribuição por Membro" description="Percentual de renda por pessoa">
            <div className="space-y-5 py-2">
              {_.map(summary.perPerson, (p) => (
                <div key={p.id} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-bold text-primary-800">{p.name}</p>
                      <p className="text-xs text-primary-500">Renda: {fmt(p.income)}</p>
                    </div>
                    <p className="text-sm font-bold text-primary-700">{p.contributionPercent.toFixed(1)}%</p>
                  </div>
                  <div className="w-full bg-primary-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-primary-600 h-full rounded-full" style={{ width: `${p.contributionPercent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Divisão Proporcional" description="Sugestão baseada na renda">
            <div className="space-y-3 py-2">
              {_.map(summary.perPerson, (p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-primary-50/50 border border-primary-100">
                  <div>
                    <p className="text-sm font-bold text-primary-800">{p.name}</p>
                    <p className="text-xs text-primary-500">Pagou: {fmt(p.expenses)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-primary-500 uppercase font-bold tracking-tighter">Sugestão</p>
                    <p className="text-sm font-bold text-primary-700">{fmt(p.proportionalExpense)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Row 6 — Cartões */}
      <CreditCardsSummary month={month} year={year} />

      {/* Row 7 — IA Insights full width */}
      <div className="bg-primary-800 rounded-2xl p-5 text-white shadow-lg shadow-primary-900/20 flex items-start gap-4">
        <div className="w-9 h-9 bg-primary-700 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
          <Brain size={17} className="text-primary-200" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm mb-1">IA Insights</p>
          <p className="text-primary-300 text-sm leading-relaxed">{summary.aiReport}</p>
        </div>
      </div>
    </div>
  );
};
