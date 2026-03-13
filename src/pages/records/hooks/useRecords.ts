import { useQuery } from '@tanstack/react-query';
import { financeService } from '@/services/api';
import { normalizeRecords } from '../utils/normalize-records';

export function useRecords(
  month: number,
  year: number,
  familyId?: string,
  status?: string,
  page: number = 1,
  limit: number = 10,
) {
  const expenses = useQuery({
    queryKey: ['expenses', month, year, familyId, status, page, limit],
    queryFn: () => financeService.getExpenses(month, year, familyId!, status, page, limit),
    enabled: !!familyId,
  });

  // Apenas despesas na listagem
  // Salários e bônus aparecem apenas nos cards de resumo
  const records = normalizeRecords(
    expenses.data?.data || [],
    [], // Não incluir incomes na listagem
    [], // Não incluir extras na listagem
  );

  const isLoading = expenses.isLoading;
  const pagination = expenses.data?.pagination;

  return { records, isLoading, pagination };
}
