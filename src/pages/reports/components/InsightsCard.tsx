import { Card } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, Target, AlertCircle, Lightbulb } from 'lucide-react';
import type { SummaryData } from '../types/reports.types';
import { formatCurrency } from '../utils/reports-helpers';

interface InsightsCardProps {
  summary: SummaryData;
}

export function InsightsCard({ summary }: InsightsCardProps) {
  const { comparison, budgetAlerts, aiReport, totals } = summary;

  const hasPositiveBalance = totals.balance > 0;
  const hasIncomeIncrease = comparison.incomeChange > 0;
  const hasExpenseIncrease = comparison.expenseChange > 0;
  const hasAlerts = budgetAlerts.some((alert) => alert.alert);

  return (
    <Card title="Insights e Recomendações">
      <div className="space-y-4">
        {/* Resumo da IA */}
        {aiReport?.summary && (
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Lightbulb size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-800 mb-1">Resumo do Período</p>
              <p className="text-sm text-blue-700">{aiReport.summary}</p>
            </div>
          </div>
        )}

        {/* Saldo Positivo/Negativo */}
        {hasPositiveBalance ? (
          <div className="flex items-start gap-3 p-4 bg-success-50 border border-success-200 rounded-lg">
            <TrendingUp size={20} className="text-success-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-success-800 mb-1">Saldo Positivo</p>
              <p className="text-sm text-success-700">
                Você economizou {formatCurrency(totals.balance)} este mês. Continue assim!
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <TrendingDown size={20} className="text-danger-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-danger-800 mb-1">Atenção: Saldo Negativo</p>
              <p className="text-sm text-danger-700">
                Suas despesas superaram as receitas em {formatCurrency(Math.abs(totals.balance))}.
                Revise seus gastos.
              </p>
            </div>
          </div>
        )}

        {/* Mudança nas Receitas */}
        {hasIncomeIncrease && Math.abs(comparison.incomeChange) > 0 && (
          <div className="flex items-start gap-3 p-4 bg-success-50 border border-success-200 rounded-lg">
            <TrendingUp size={20} className="text-success-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-success-800 mb-1">Aumento de Receitas</p>
              <p className="text-sm text-success-700">
                Suas receitas aumentaram {formatCurrency(comparison.incomeChange)} em relação ao mês
                anterior.
              </p>
            </div>
          </div>
        )}

        {/* Mudança nas Despesas */}
        {hasExpenseIncrease && Math.abs(comparison.expenseChange) > 0 && (
          <div className="flex items-start gap-3 p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <TrendingDown size={20} className="text-warning-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-warning-800 mb-1">Atenção: Aumento de Despesas</p>
              <p className="text-sm text-warning-700">
                Suas despesas aumentaram {formatCurrency(comparison.expenseChange)} em relação ao
                mês anterior. Considere revisar seu orçamento.
              </p>
            </div>
          </div>
        )}

        {/* Alertas de Orçamento */}
        {hasAlerts && (
          <div className="flex items-start gap-3 p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <AlertCircle size={20} className="text-warning-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-warning-800 mb-1">Alertas de Orçamento</p>
              <div className="text-sm text-warning-700 space-y-1">
                {budgetAlerts
                  .filter((alert) => alert.alert)
                  .map((alert, index) => (
                    <p key={index}>
                      • {alert.category.name}: {alert.percent.toFixed(0)}% do limite atingido (
                      {formatCurrency(alert.spent)} de {formatCurrency(alert.limit)})
                    </p>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Insights da IA */}
        {aiReport?.insights && aiReport.insights.length > 0 && (
          <div className="space-y-2">
            {aiReport.insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-primary-50 border border-primary-200 rounded-lg"
              >
                <Target size={20} className="text-primary-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-primary-700">{insight}</p>
              </div>
            ))}
          </div>
        )}

        {/* Recomendações da IA */}
        {aiReport?.recommendations && aiReport.recommendations.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-primary-800">Recomendações:</p>
            {aiReport.recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <span className="text-primary-600 font-semibold">{index + 1}.</span>
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
