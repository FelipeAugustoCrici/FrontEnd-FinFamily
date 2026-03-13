import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Target, Trash2, TrendingUp } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import { useDeleteGoal } from '../hooks/useDeleteGoal';
import { Modal } from '@/components/ui/Modal';
import { formatShortDate } from '@/common/utils/date';

export function GoalsCard({ onCreateNew }: { onCreateNew: () => void }) {
  const { data: goals = [], isLoading } = useGoals();
  const deleteGoal = useDeleteGoal();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setSelectedGoalId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedGoalId) {
      deleteGoal.mutate(selectedGoalId);
      setDeleteModalOpen(false);
      setSelectedGoalId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (isLoading) {
    return (
      <Card title="Metas Financeiras">
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      </Card>
    );
  }

  return (
    <>
      <Card title="Metas Financeiras">
        <div className="space-y-4">
          <Button onClick={onCreateNew} className="w-full" variant="primary">
            <Target size={18} className="mr-2" />
            Nova Meta
          </Button>

          {goals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target size={48} className="mx-auto mb-3 opacity-30" />
              <p>Nenhuma meta cadastrada</p>
              <p className="text-sm mt-1">Crie sua primeira meta financeira!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((goal) => {
                const progress = calculateProgress(goal.currentValue, goal.targetValue);
                return (
                  <div key={goal.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{goal.description}</h4>
                        {goal.deadline && (
                          <p className="text-xs text-gray-500 mt-1">
                            Prazo: {formatShortDate(goal.deadline)}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {formatCurrency(goal.currentValue)} de {formatCurrency(goal.targetValue)}
                        </span>
                        <span className="font-semibold text-primary-600">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {progress >= 100 && (
                      <div className="mt-2 flex items-center gap-1 text-green-600 text-sm font-medium">
                        <TrendingUp size={14} />
                        Meta atingida!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <p className="text-gray-600 mb-6">Tem certeza que deseja excluir esta meta?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmDelete}>
            Confirmar
          </Button>
        </div>
      </Modal>
    </>
  );
}
