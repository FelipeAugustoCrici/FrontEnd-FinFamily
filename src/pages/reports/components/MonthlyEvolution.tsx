import { Card } from '@/components/ui/Card';
import type { MonthlyData } from '../types/reports.types';
import { formatCurrency, calculateAverage } from '../utils/reports-helpers';

interface MonthlyEvolutionProps {
  data: MonthlyData[];
}

export function MonthlyEvolution({ data }: MonthlyEvolutionProps) {
  const avgIncome = calculateAverage(data.map((d) => d.income));
  const avgExpense = calculateAverage(data.map((d) => d.expense));
  const avgBalance = calculateAverage(data.map((d) => d.balance));

  return (
    <Card title="Evolução Mensal">
      <div className="space-y-4">
        {data.map((month, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-primary-700">{month.month}</span>
              <div className="flex gap-4">
                <span className="text-success-600">↑ {formatCurrency(month.income)}</span>
                <span className="text-danger-600">↓ {formatCurrency(month.expense)}</span>
                <span
                  className={`font-semibold ${
                    month.balance >= 0 ? 'text-success-600' : 'text-danger-600'
                  }`}
                >
                  = {formatCurrency(month.balance)}
                </span>
              </div>
            </div>
            <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-success-500 to-primary-500"
                style={{
                  width: `${month.income > 0 ? Math.min((month.balance / month.income) * 100, 100) : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-primary-100 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-primary-500 mb-1">Média de Receitas</p>
          <p className="text-lg font-bold text-success-600">{formatCurrency(avgIncome)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-primary-500 mb-1">Média de Despesas</p>
          <p className="text-lg font-bold text-danger-600">{formatCurrency(avgExpense)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-primary-500 mb-1">Saldo Médio</p>
          <p className="text-lg font-bold text-primary-800">{formatCurrency(avgBalance)}</p>
        </div>
      </div>
    </Card>
  );
}
