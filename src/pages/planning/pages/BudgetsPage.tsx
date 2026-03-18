import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PiggyBank, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import { BudgetFormModal } from '../components/BudgetFormModal';
import { useBudgets } from '../hooks/useBudgets';
import { useDeleteBudget } from '../hooks/useDeleteBudget';
import { api } from '@/services/api.service';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export function BudgetsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { data: families = [] } = useQuery({
    queryKey: ['families'],
    queryFn: async () => { const { data } = await api.get('/finance/families'); return data; },
  });
  const familyId = families[0]?.id || '';

  const { data: budgets = [], isLoading } = useBudgets(currentMonth, currentYear);
  const deleteBudget = useDeleteBudget();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orçamentos</h1>
          <p className="text-primary-500 text-sm mt-1">Defina limites de gastos por categoria</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} className="mr-2" /> Novo Orçamento
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-36 bg-primary-100 rounded-xl animate-pulse" />)}
        </div>
      ) : budgets.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <PiggyBank size={48} className="mx-auto mb-4 text-primary-300" />
            <h3 className="text-lg font-semibold text-primary-700 mb-2">Nenhum orçamento definido</h3>
            <p className="text-primary-500 text-sm mb-6">Defina limites para suas categorias e controle melhor seus gastos</p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus size={16} className="mr-2" /> Criar Orçamento
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <Card key={budget.id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                        <PiggyBank size={18} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {budget.category?.name || budget.categoryName}
                        </p>
                        <p className="text-xs text-primary-400">{budget.month}/{budget.year}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteId(budget.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Limite mensal</p>
                    <p className="text-2xl font-bold text-slate-800">{fmt(budget.limitValue)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <AlertCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-800">
              Os orçamentos ajudam a controlar gastos por categoria. Configure alertas quando atingir o limite!
            </p>
          </div>
        </>
      )}

      <BudgetFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} familyId={familyId} />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteBudget.mutate(deleteId); setDeleteId(null); } }}
        title="Remover Orçamento"
        description="Tem certeza que deseja excluir este orçamento?"
      />
    </div>
  );
}
