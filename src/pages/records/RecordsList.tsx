import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { cn } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import { api } from '@/services/api.service';
import { ArrowUpCircle, ArrowDownCircle, Edit2, Trash2, Loader2, Eye } from 'lucide-react';

import { RecordsHeader } from './components/RecordsHeader';
import { RecordsFilters } from './components/RecordsFilters';
import { StatusBadge } from './components/StatusBadge';
import { IncomeSummaryCards } from './components/IncomeSummaryCards';
import { useRecordFilters } from './hooks/useRecordFilters';
import { useRecords } from './hooks/useRecords';
import { useDeleteRecord } from './hooks/useDeleteRecord';
import { useUpdateRecordStatus } from './hooks/useUpdateRecordStatus';
import { formatCurrency } from './utils/formatters';
import { UnifiedRecord, RecordStatus } from './types/record.types';
import { familyService } from '@/pages/families/services/families.service';
import { formatShortDate } from '@/common/utils/date';

export function RecordsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const filters = useRecordFilters();
  const deleteRecord = useDeleteRecord();
  const updateStatus = useUpdateRecordStatus();

  const [recordToDelete, setRecordToDelete] = useState<UnifiedRecord | null>(null);
  const itemsPerPage = 10;

  // Busca a família para obter o familyId
  const { data: families = [] } = useQuery({
    queryKey: ['families'],
    queryFn: () => familyService.list(),
  });

  const familyId = families[0]?.id;

  const { records, isLoading, pagination } = useRecords(
    filters.month,
    filters.year,
    familyId,
    filters.status,
    filters.page,
    itemsPerPage,
  );

  const people = families.flatMap((f) => f.members || []);

  const filteredRecords = _.orderBy(
    records.filter((item) => {
      const matchesSearch = item.description?.toLowerCase().includes(filters.search.toLowerCase());
      return matchesSearch;
    }),
    [(t) => new Date(t.date).getTime()],
    ['desc'],
  );

  // Usar paginação da API se não houver filtro de busca
  const shouldUseFrontendPagination = filters.search.length > 0;

  let paginatedRecords = filteredRecords;
  let totalItems = pagination?.total || 0;
  let totalPages = pagination?.totalPages || 1;

  if (shouldUseFrontendPagination) {
    // Paginação no frontend quando há busca
    totalItems = filteredRecords.length;
    totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (filters.page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    paginatedRecords = filteredRecords.slice(startIndex, endIndex);
  } else {
    // Usar dados já paginados da API
    paginatedRecords = filteredRecords;
  }

  // Atualizar página quando filtros mudarem
  useEffect(() => {
    filters.setPage(1);
  }, [filters.month, filters.year, filters.status, filters.search]);

  const getPersonName = (personId: string) => {
    for (const family of families) {
      const person = _.find(family.members, { id: personId });
      if (person) return person.name;
    }
    return 'Não identificado';
  };

  const handleDeleteClick = (item: UnifiedRecord) => {
    setRecordToDelete(item);
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      deleteRecord.mutate(recordToDelete.id, {
        onSuccess: () => {
          setRecordToDelete(null);
        },
      });
    }
  };

  const handleStatusChange = (recordId: string, newStatus: RecordStatus) => {
    updateStatus.mutate({ id: recordId, status: newStatus });
  };

  const handleDeleteIncome = async (id: string, type: 'income' | 'extra') => {
    try {
      // Usar a rota correta baseada no tipo
      const route = type === 'income' ? 'incomes' : 'extras';
      await api.delete(`/finance/${route}/${id}`);

      // Invalidar queries para atualizar os cards
      queryClient.invalidateQueries({ queryKey: ['incomes-summary'] });
      queryClient.invalidateQueries({ queryKey: ['extras-summary'] });
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  return (
    <div className="space-y-6">
      <RecordsHeader onCreate={() => navigate('/record/create')} />

      {/* Cards de resumo de rendimentos por pessoa */}
      <IncomeSummaryCards
        month={filters.month}
        year={filters.year}
        familyId={familyId}
        people={people}
        onDelete={handleDeleteIncome}
      />

      <Card className="overflow-hidden">
        <RecordsFilters
          search={filters.search}
          onSearchChange={filters.setSearch}
          month={filters.month}
          year={filters.year}
          status={filters.status}
          onMonthChange={filters.setMonth}
          onYearChange={filters.setYear}
          onStatusChange={filters.setStatus}
        />

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-primary-600 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-primary-600 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-primary-600 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-primary-600 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-primary-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-primary-600 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-primary-600 uppercase tracking-wider">
                    Responsável
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-primary-600 uppercase tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-50">
                {paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-primary-500 italic">
                      Nenhum lançamento encontrado para este período.
                    </td>
                  </tr>
                ) : (
                  _.map(paginatedRecords, (tx, idx) => (
                    <tr key={idx} className="hover:bg-primary-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'p-2 rounded-lg',
                              tx.type === 'income'
                                ? 'bg-success-50 text-success-600'
                                : 'bg-danger-50 text-danger-600',
                            )}
                          >
                            {tx.type === 'income' ? (
                              <ArrowUpCircle size={18} />
                            ) : (
                              <ArrowDownCircle size={18} />
                            )}
                          </div>
                          <button
                            onClick={() => navigate(`/record/detail/${tx.id}`)}
                            className="text-sm font-semibold text-primary-800 hover:text-primary-600 transition-colors text-left"
                          >
                            {tx.description}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={tx.type === 'income' ? 'success' : 'primary'}>
                          {tx.category?.name || tx.categoryName || 'Geral'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-primary-500">
                        {formatShortDate(tx.date)}
                      </td>
                      <td className="px-6 py-4">
                        {tx.type === 'expense' ? (
                          <Badge variant={tx.recurringId ? 'primary' : 'info'}>
                            {tx.recurringId ? 'Fixo' : 'Variável'}
                          </Badge>
                        ) : tx.sourceId ? (
                          <Badge variant="success">Fixo</Badge>
                        ) : (
                          <span className="text-xs text-primary-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={tx.status || 'PENDING'}
                          onChange={(newStatus) => handleStatusChange(tx.id, newStatus)}
                          disabled={updateStatus.isPending}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'text-sm font-bold',
                            tx.type === 'income' ? 'text-success-600' : 'text-danger-600',
                          )}
                        >
                          {tx.type === 'expense' ? '- ' : '+ '} {formatCurrency(tx.value)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-primary-600 font-medium">
                            {getPersonName(tx.personId)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/record/detail/${tx.id}`)}
                            className="p-1.5 text-primary-400 hover:text-primary-700 hover:bg-primary-100 rounded-md transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/record/edit/${tx.id}`)}
                            className="p-1.5 text-primary-400 hover:text-primary-700 hover:bg-primary-100 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(tx)}
                            disabled={deleteRecord.isPending}
                            className="p-1.5 text-primary-400 hover:text-danger-600 hover:bg-danger-50 rounded-md transition-colors disabled:opacity-50"
                            title="Excluir"
                          >
                            {deleteRecord.isPending ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginação */}
        {!isLoading && filteredRecords.length > 0 && (
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={filters.setPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        )}
      </Card>

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Lançamento"
        description={`Tem certeza que deseja excluir o lançamento "${recordToDelete?.description}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        isLoading={deleteRecord.isPending}
      />
    </div>
  );
}
