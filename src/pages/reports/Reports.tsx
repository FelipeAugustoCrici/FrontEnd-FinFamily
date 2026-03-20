import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { SkeletonReports } from '@/components/ui/Skeleton';
import { Download, Loader2, Calendar } from 'lucide-react';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useReportsSummary } from './hooks/useReportsSummary';
import {
  MonthlyEvolution,
  CategoryExpenses,
  PersonExpenses,
  RecurringExpensesList,
  InsightsCard,
} from './components';
import {
  transformToMonthlyData,
  transformToCategoryExpenses,
  transformToPersonExpenses,
  transformToRecurringExpenses,
} from './utils/reports-helpers';

export function Reports() {
  const filters = useUrlFilters({ defaultPage: 1 });

  // Obter período da URL ou usar 6 como padrão
  const selectedPeriod = (parseInt(filters.search) || 6) as 3 | 6 | 12;
  const setSelectedPeriod = (period: 3 | 6 | 12) => filters.setSearch(String(period));

  const { data: summaries, isLoading, error } = useReportsSummary(selectedPeriod);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader actions={<Button variant="outline" size="sm"><Download size={16} className="mr-2" /> Exportar PDF</Button>} />
        <SkeletonReports t={{ bg: { card: '#ffffff', muted: '#f1f5f9' }, border: { default: 'rgba(0,0,0,0.06)', divider: 'rgba(0,0,0,0.04)' }, shadow: { card: '0 8px 24px rgba(0,0,0,0.06)' } }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-danger-600 font-semibold mb-2">Erro ao carregar relatórios</p>
          <p className="text-gray-600 text-sm">Tente novamente mais tarde</p>
        </div>
      </div>
    );
  }

  if (!summaries || summaries.length === 0 || summaries.every((s) => !s)) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-gray-600 font-semibold mb-2">Nenhum dado disponível</p>
          <p className="text-gray-500 text-sm">Comece registrando suas receitas e despesas</p>
        </div>
      </div>
    );
  }

  // Filtrar resumos nulos e usar o último mês (mais recente) para os dados detalhados
  const validSummaries = summaries.filter((s) => !!s);
  const currentSummary = validSummaries[validSummaries.length - 1];

  // Transformar dados
  const monthlyData = transformToMonthlyData(validSummaries);
  const categoryExpenses = transformToCategoryExpenses(currentSummary);
  const personExpenses = transformToPersonExpenses(currentSummary);
  const recurringExpenses = transformToRecurringExpenses(currentSummary);

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" /> Exportar PDF
          </Button>
        }
      />

      {/* Filtro de Período */}
      <Card>
        <div className="flex items-center gap-4">
          <Calendar size={20} className="text-primary-600" />
          <span className="text-sm font-medium text-primary-700">Período de análise:</span>
          <div className="flex gap-2">
            {([3, 6, 12] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-primary-600 text-white'
                    : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                }`}
              >
                {period} meses
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Comparativo Mensal */}
      <MonthlyEvolution data={monthlyData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Despesas por Categoria */}
        <CategoryExpenses data={categoryExpenses} total={currentSummary.totals.expenses} />

        {/* Despesas por Pessoa */}
        <PersonExpenses data={personExpenses} />
      </div>

      {/* Despesas Recorrentes */}
      <RecurringExpensesList data={recurringExpenses} />

      {/* Insights e Recomendações */}
      <InsightsCard summary={currentSummary} />
    </div>
  );
}
