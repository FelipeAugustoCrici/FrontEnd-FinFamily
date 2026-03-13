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
} from 'lucide-react';

import { useDashboard } from './hooks/useDashboard';
import { SummaryCard, Header } from './components';
import { formatShortDate } from '@/common/utils/date';

export const Dashboard = () => {
  const navigate = useNavigate();

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data: summary, isLoading, error } = useDashboard({ month, year });

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="space-y-6">
        <div className="bg-primary-50 border border-primary-200 p-8 rounded-xl text-center space-y-4">
          <h2 className="text-xl font-bold text-primary-800">Ops! Algo deu errado.</h2>
          <p className="text-primary-600 max-w-md mx-auto">
            Não conseguimos carregar os dados do seu dashboard. Pode ser que você precise cadastrar
            sua primeira família.
          </p>
          <Button onClick={() => navigate('/cadastro')}>Começar Agora</Button>
        </div>
      </div>
    );
  }

  const recentTransactions = _.take(
    _.orderBy(
      [
        ..._.map(_.get(summary, 'details.salaries', []), (s) => {
          const yearS = (s as any).year;
          const monthS = (s as any).month;
          return {
            ...s,
            description: 'Salário',
            type: 'income' as const,
            date: new Date(yearS, monthS - 1, 5).toISOString(),
          };
        }),
        ..._.map(_.get(summary, 'details.extras', []), (e) => ({
          ...e,
          type: 'income' as const,
        })),
        ..._.map(_.get(summary, 'details.incomes', []), (i) => ({
          ...i,
          type: 'income' as const,
        })),
        ..._.map(_.get(summary, 'details.expenses', []), (e) => ({
          ...e,
          type: 'expense' as const,
        })),
      ],
      [(t) => new Date((t as any).date).getTime()],
      ['desc'],
    ),
    5,
  );

  return (
    <div className="space-y-8">
      <Header year={year} month={month} setMonth={setMonth} setYear={setYear} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Saldo Total"
          value={summary.totals?.balance || 0}
          type="balance"
          icon={Wallet}
        />
        <SummaryCard
          title="Entradas"
          value={summary.totals?.incomes || 0}
          type="income"
          icon={ArrowUpCircle}
          change={summary.comparison?.incomeChange}
        />
        <SummaryCard
          title="Saídas"
          value={summary.totals?.expenses || 0}
          type="expense"
          icon={ArrowDownCircle}
          change={summary.comparison?.expenseChange}
        />
        <SummaryCard
          title="Investimentos (Meta)"
          value={(summary.totals?.salary || 0) * 0.2}
          type="balance"
          icon={TrendingUp}
        />
      </div>

      {/* Visão de Rendas e Gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Previsibilidade de Renda">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-500 font-medium">Renda Fixa</span>
                  <span className="text-primary-800 font-bold">
                    {formatCurrency(summary.totals.fixedIncome || 0)}
                  </span>
                </div>
                <div className="w-full bg-success-50 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-success-600 h-full rounded-full"
                    style={{
                      width: `${(summary.totals.fixedIncome / summary.totals.incomes) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-500 font-medium">Renda Variável</span>
                  <span className="text-primary-800 font-bold">
                    {formatCurrency(summary.totals.variableIncome || 0)}
                  </span>
                </div>
                <div className="w-full bg-success-50 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-success-400 h-full rounded-full"
                    style={{
                      width: `${(summary.totals.variableIncome / summary.totals.incomes) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-primary-50">
              <p className="text-xs text-primary-400 uppercase font-bold tracking-wider mb-2">
                Índice de Previsibilidade
              </p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-success-600">
                  {(summary.totals.predictableIncomePercent || 0).toFixed(1)}%
                </span>
                <span className="text-sm text-primary-500 pb-1">da renda é garantida</span>
              </div>
              <p className="text-xs text-primary-400 mt-2">
                Fontes de renda fixas ajudam no planejamento de longo prazo.
              </p>
            </div>
          </div>
        </Card>

        <Card title="Estrutura de Gastos">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-500 font-medium">Gastos Fixos</span>
                  <span className="text-primary-800 font-bold">
                    {formatCurrency(summary.totals.fixedExpenses || 0)}
                  </span>
                </div>
                <div className="w-full bg-primary-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary-600 h-full rounded-full"
                    style={{
                      width: `${(summary.totals.fixedExpenses / summary.totals.expenses) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-500 font-medium">Gastos Variáveis</span>
                  <span className="text-primary-800 font-bold">
                    {formatCurrency(summary.totals.variableExpenses || 0)}
                  </span>
                </div>
                <div className="w-full bg-primary-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-danger-400 h-full rounded-full"
                    style={{
                      width: `${(summary.totals.variableExpenses / summary.totals.expenses) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-primary-50">
              <p className="text-xs text-primary-400 uppercase font-bold tracking-wider mb-2">
                Comprometimento da Renda
              </p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-primary-800">
                  {(summary.totals.fixedExpenseCommitment || 0).toFixed(1)}%
                </span>
                <span className="text-sm text-primary-500 pb-1">da renda mensal</span>
              </div>
              <p className="text-xs text-primary-400 mt-2">
                O ideal é manter gastos fixos abaixo de 50% da renda.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Relatórios por Pessoa */}
        <Card
          title="Contribuição por Membro"
          description="Percentual de renda por pessoa"
          className="lg:col-span-2"
        >
          <div className="space-y-6 py-2">
            {_.map(summary.perPerson, (p) => (
              <div key={p.id} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-bold text-primary-800">{p.name}</p>
                    <p className="text-xs text-primary-500">
                      Renda:{' '}
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(p.income)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary-700">
                      {p.contributionPercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-primary-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary-600 h-full rounded-full"
                    style={{ width: `${p.contributionPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Divisão Proporcional de Gastos"
          description="Quanto cada um deveria pagar baseado na renda"
        >
          <div className="space-y-4 py-2">
            {_.map(summary.perPerson, (p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-xl bg-primary-50/50 border border-primary-100"
              >
                <div>
                  <p className="text-sm font-bold text-primary-800">{p.name}</p>
                  <p className="text-xs text-primary-500">
                    Pagou:{' '}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      p.expenses,
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-primary-500 uppercase font-bold tracking-tighter">
                    Sugestão
                  </p>
                  <p className="text-sm font-bold text-primary-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      p.proportionalExpense,
                    )}
                  </p>
                </div>
              </div>
            ))}
            <p className="text-[10px] text-primary-400 italic mt-2 text-center">
              Cálculo baseado na proporção de renda individual sobre o total da família.
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card
            title="Transações Recentes"
            description="Seus últimos lançamentos financeiros"
            footer={
              <Button variant="ghost" className="w-full text-primary-600 hover:text-primary-800">
                Ver extrato completo <ArrowRight size={16} className="ml-2" />
              </Button>
            }
          >
            <div className="space-y-1">
              {recentTransactions.length === 0 ? (
                <p className="text-center py-8 text-primary-500 italic">
                  Nenhuma transação recente encontrada.
                </p>
              ) : (
                _.map(recentTransactions, (tx: any, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-primary-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          tx.type === 'income'
                            ? 'bg-success-50 text-success-600'
                            : 'bg-danger-50 text-danger-600',
                        )}
                      >
                        {tx.type === 'income' ? (
                          <ArrowUpCircle size={20} />
                        ) : (
                          <ArrowDownCircle size={20} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary-800">{tx.description}</p>
                        <p className="text-xs text-primary-500">
                          {(() => {
                            if (tx.categoryName) return tx.categoryName;
                            if (tx.category && typeof tx.category === 'object' && tx.category.name)
                              return tx.category.name;
                            return 'Receita';
                          })()}{' '}
                          • {formatShortDate(tx.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          'text-sm font-bold',
                          tx.type === 'income' ? 'text-success-600' : 'text-danger-600',
                        )}
                      >
                        {tx.type === 'expense' ? '- ' : ''}
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(tx.value)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* AI Analysis and Budgets */}
        <div className="space-y-6">
          <Card title="Saúde Financeira" className="text-center">
            <div className="relative inline-flex items-center justify-center mb-4">
              <svg className="w-24 h-24">
                <circle
                  className="text-primary-100"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="48"
                  cy="48"
                />
                <circle
                  className={cn(
                    summary.healthScore > 70
                      ? 'text-success-500'
                      : summary.healthScore > 40
                        ? 'text-warning-500'
                        : 'text-danger-500',
                  )}
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * summary.healthScore) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="48"
                  cy="48"
                />
              </svg>
              <span className="absolute text-xl font-bold text-primary-800">
                {summary.healthScore}%
              </span>
            </div>
            <p className="text-sm text-primary-500">Seu score de saúde financeira este mês</p>
          </Card>

          <Card className="bg-primary-800 text-white border-none shadow-lg shadow-primary-900/20">
            <h3 className="font-bold text-lg mb-2">IA Insights</h3>
            <p className="text-primary-200 text-sm leading-relaxed">{summary.aiReport}</p>
          </Card>

          {summary.budgetAlerts?.length > 0 && (
            <Card title="Alertas de Orçamento">
              <div className="space-y-4">
                {summary.budgetAlerts.map((item: any, idx: number) => {
                  const categoryName =
                    typeof item.category === 'object' && item.category?.name
                      ? item.category.name
                      : typeof item.category === 'string'
                        ? item.category
                        : 'Sem categoria';

                  return (
                    <div key={`${categoryName}-${idx}`} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-primary-700 capitalize">{categoryName}</span>
                        <span className={cn(item.alert ? 'text-danger-500' : 'text-primary-500')}>
                          {Math.round(item.percent)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-primary-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-1000',
                            item.percent > 90
                              ? 'bg-danger-500'
                              : item.percent > 70
                                ? 'bg-warning-500'
                                : 'bg-success-500',
                          )}
                          style={{ width: `${Math.min(item.percent, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
