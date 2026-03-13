import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { financeService } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { DollarSign, TrendingUp, User, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/Modal';
import _ from 'lodash';

interface IncomeSummaryCardsProps {
  month: number;
  year: number;
  familyId?: string;
  people: Array<{ id: string; name: string }>;
  onDelete?: (id: string, type: 'income' | 'extra') => void;
}

export function IncomeSummaryCards({
  month,
  year,
  familyId,
  people,
  onDelete,
}: IncomeSummaryCardsProps) {
  const navigate = useNavigate();
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: 'income' | 'extra';
    description: string;
  } | null>(null);

  // Buscar salários (incomes)
  const { data: incomes = [], isLoading: isLoadingIncomes } = useQuery({
    queryKey: ['incomes-summary', month, year, familyId],
    queryFn: () => financeService.getIncomes(month, year, familyId),
    enabled: !!familyId,
  });

  // Buscar bônus/extras
  const { data: extrasData, isLoading: isLoadingExtras } = useQuery({
    queryKey: ['extras-summary', month, year],
    queryFn: async () => {
      const result = await financeService.getExtras(month, year);
      return result;
    },
  });

  // A API de extras retorna { data: [...] }
  const extras = Array.isArray(extrasData) ? extrasData : extrasData?.data || [];

  const isLoading = isLoadingIncomes || isLoadingExtras;

  const toggleCard = (personId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [personId]: !prev[personId],
    }));
  };

  const handleEdit = (id: string, type: 'income' | 'extra') => {
    navigate(`/record/edit/${id}`);
  };

  const handleDeleteClick = (id: string, type: 'income' | 'extra', description: string) => {
    setItemToDelete({ id, type, description });
  };

  const handleConfirmDelete = () => {
    if (itemToDelete && onDelete) {
      onDelete(itemToDelete.id, itemToDelete.type);
      setItemToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg border border-primary-100 p-6 h-32" />
          </div>
        ))}
      </div>
    );
  }

  // Agrupar incomes (salários) por pessoa
  const incomesByPerson = _.groupBy(incomes, 'personId');

  // Agrupar extras (bônus) por pessoa
  const extrasByPerson = _.groupBy(extras, 'personId');

  // Calcular totais por pessoa
  const personSummaries = people
    .map((person) => {
      const personIncomes = incomesByPerson[person.id] || [];
      const personExtras = extrasByPerson[person.id] || [];

      // Salário = soma de todos os incomes
      const salary = _.sumBy(personIncomes, 'value');

      // Bônus = soma de todos os extras
      const bonus = _.sumBy(personExtras, 'value');

      const total = salary + bonus;

      return {
        person,
        salary,
        bonus,
        total,
        incomes: personIncomes,
        extras: personExtras,
      };
    })
    .filter((summary) => summary.total > 0); // Mostrar apenas pessoas com renda

  if (personSummaries.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {personSummaries.map(
          ({ person, salary, bonus, total, incomes: personIncomes, extras: personExtras }) => {
            const isExpanded = expandedCards[person.id];
            const hasItems = personIncomes.length > 0 || personExtras.length > 0;

            return (
              <Card key={person.id} className="overflow-hidden">
                <div className="p-6">
                  {/* Header com nome da pessoa */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <User size={20} className="text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-primary-800">{person.name}</h3>
                        <p className="text-xs text-primary-500">Rendimentos do mês</p>
                      </div>
                    </div>
                    {hasItems && (
                      <button
                        onClick={() => toggleCard(person.id)}
                        className="p-1 hover:bg-primary-50 rounded transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    )}
                  </div>

                  {/* Valores resumidos */}
                  <div className="space-y-3">
                    {/* Salário */}
                    {salary > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-success-600" />
                          <span className="text-xs text-primary-600">Salário</span>
                        </div>
                        <span className="text-sm font-semibold text-success-600">
                          R${' '}
                          {salary.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}

                    {/* Bônus */}
                    {bonus > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp size={16} className="text-blue-600" />
                          <span className="text-xs text-primary-600">Bônus/Extra</span>
                        </div>
                        <span className="text-sm font-semibold text-blue-600">
                          R${' '}
                          {bonus.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}

                    {/* Total */}
                    <div className="pt-3 border-t border-primary-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary-700">Total</span>
                        <span className="text-lg font-bold text-primary-800">
                          R${' '}
                          {total.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lista expandida de itens */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-primary-100 space-y-2">
                      {/* Salários */}
                      {personIncomes.map((income: any) => (
                        <div
                          key={income.id}
                          className="flex items-center justify-between p-2 bg-success-50/30 rounded-lg group"
                        >
                          <div className="flex-1">
                            <p className="text-xs font-medium text-primary-800">
                              {income.description}
                            </p>
                            <p className="text-xs text-success-600 font-semibold">
                              R${' '}
                              {income.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(income.id, 'income')}
                              className="p-1 hover:bg-success-100 rounded text-primary-600"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(income.id, 'income', income.description)
                              }
                              className="p-1 hover:bg-danger-100 rounded text-danger-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Bônus/Extras */}
                      {personExtras.map((extra: any) => (
                        <div
                          key={extra.id}
                          className="flex items-center justify-between p-2 bg-blue-50/30 rounded-lg group"
                        >
                          <div className="flex-1">
                            <p className="text-xs font-medium text-primary-800">
                              {extra.description}
                            </p>
                            <p className="text-xs text-blue-600 font-semibold">
                              R$ {extra.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(extra.id, 'extra')}
                              className="p-1 hover:bg-blue-100 rounded text-primary-600"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(extra.id, 'extra', extra.description)
                              }
                              className="p-1 hover:bg-danger-100 rounded text-danger-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Barra de progresso visual */}
                <div className="h-1 bg-gradient-to-r from-success-500 to-blue-500" />
              </Card>
            );
          },
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`Excluir ${itemToDelete?.type === 'income' ? 'Salário' : 'Bônus'}`}
        description={`Tem certeza que deseja excluir "${itemToDelete?.description}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
}
