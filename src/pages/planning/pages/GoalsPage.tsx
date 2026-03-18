import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Target, Plus, Trash2, PlusCircle, Eye, TrendingUp, Calendar, Minus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { GoalFormModal } from '../components/GoalFormModal';
import { GoalContributionModal } from '../components/GoalContributionModal';
import { GoalDetailModal } from '../components/GoalDetailModal';
import { useGoals } from '../hooks/useGoals';
import { useDeleteGoal } from '../hooks/useDeleteGoal';
import {
  fmt, getBadge, getMotivation, getProgressBarColor,
  GOAL_TYPE_META, computeInsights,
} from '../components/goalUtils';
import { api } from '@/services/api.service';
import type { Goal } from '../types/planning.types';

export function GoalsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [contributeGoal, setContributeGoal] = useState<Goal | null>(null);
  const [detailGoal, setDetailGoal] = useState<Goal | null>(null);

  const { data: families = [] } = useQuery({
    queryKey: ['families'],
    queryFn: async () => { const { data } = await api.get('/finance/families'); return data; },
  });
  const familyId = families[0]?.id || '';

  const { data: goals = [], isLoading } = useGoals();
  const deleteGoal = useDeleteGoal();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Metas Financeiras</h1>
          <p className="text-primary-500 text-sm mt-1">Acompanhe e gerencie seus objetivos financeiros</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} className="mr-2" /> Nova Meta
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-56 bg-primary-100 rounded-xl animate-pulse" />)}
        </div>
      ) : goals.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <Target size={48} className="mx-auto mb-4 text-primary-300" />
            <h3 className="text-lg font-semibold text-primary-700 mb-2">Nenhuma meta cadastrada</h3>
            <p className="text-primary-500 text-sm mb-6">Crie sua primeira meta financeira e comece a acompanhar seu progresso</p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus size={16} className="mr-2" /> Criar Meta
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const pct = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
            const badge = getBadge(pct);
            const motivation = getMotivation(pct);
            const barColor = getProgressBarColor(pct);
            const meta = GOAL_TYPE_META[goal.type ?? 'savings'];
            const Icon = meta.icon;
            const completed = goal.status === 'completed' || pct >= 100;
            const insights = computeInsights(
              goal.contributions ?? [],
              goal.targetValue,
              goal.currentValue,
              goal.deadline,
            );

            return (
              <Card key={goal.id} className={completed ? '!border-emerald-200 !bg-emerald-50/40' : ''}>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
                        <Icon size={18} className={meta.color} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{goal.description}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <button onClick={() => setDetailGoal(goal)} className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => setDeleteId(goal.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-slate-800">{pct.toFixed(0)}%</span>
                      <span className="text-xs text-slate-500">{fmt(goal.currentValue)} / {fmt(goal.targetValue)}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${barColor} h-full rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 italic">{motivation}</p>
                  </div>

                  {/* Insights */}
                  {!completed && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-center">
                        <p className="text-xs text-slate-400 mb-0.5 flex items-center justify-center gap-0.5">
                          <Plus size={9} /> Este mês
                        </p>
                        <p className={`text-xs font-bold ${insights.thisMonthTotal > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {insights.thisMonthTotal > 0 ? `+${fmt(insights.thisMonthTotal)}` : '—'}
                        </p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-center">
                        <p className="text-xs text-slate-400 mb-0.5 flex items-center justify-center gap-0.5">
                          <Minus size={9} /> Falta
                        </p>
                        <p className="text-xs font-bold text-rose-500">{fmt(insights.remaining)}</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-center">
                        <p className="text-xs text-slate-400 mb-0.5 flex items-center justify-center gap-0.5">
                          <Calendar size={9} /> Previsão
                        </p>
                        <p className="text-xs font-bold text-amber-600">
                          {insights.estimatedMonths === null ? '—'
                            : insights.estimatedMonths === 0 ? 'Concluída'
                            : `~${insights.estimatedMonths}m`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Avg insight */}
                  {!completed && insights.monthlyAvg !== null && insights.monthlyAvg > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-sky-50 border border-sky-100 rounded-lg">
                      <TrendingUp size={11} className="text-sky-500 shrink-0" />
                      <p className="text-xs text-sky-700">
                        Média {fmt(insights.monthlyAvg)}/mês
                        {insights.estimatedMonths !== null && insights.estimatedMonths > 0 &&
                          ` → conclui em ${insights.estimatedMonths} ${insights.estimatedMonths === 1 ? 'mês' : 'meses'}`}
                      </p>
                    </div>
                  )}

                  {/* Suggested monthly */}
                  {!completed && insights.suggestedMonthly !== null && insights.suggestedMonthly > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-violet-50 border border-violet-100 rounded-lg">
                      <Calendar size={11} className="text-violet-500 shrink-0" />
                      <p className="text-xs text-violet-700">
                        Guardar {fmt(insights.suggestedMonthly)}/mês para bater o prazo
                      </p>
                    </div>
                  )}

                  {/* Action */}
                  {!completed ? (
                    <button
                      onClick={() => setContributeGoal(goal)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-100 transition-colors"
                    >
                      <PlusCircle size={13} /> Adicionar valor
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      🎉 Meta concluída!
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <GoalFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} familyId={familyId} />

      {contributeGoal && (
        <GoalContributionModal goal={contributeGoal} isOpen={!!contributeGoal} onClose={() => setContributeGoal(null)} />
      )}
      {detailGoal && (
        <GoalDetailModal
          goal={detailGoal}
          isOpen={!!detailGoal}
          onClose={() => setDetailGoal(null)}
          onContribute={() => setContributeGoal(detailGoal)}
        />
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Exclusão">
        <p className="text-slate-600 mb-6">Tem certeza que deseja excluir esta meta?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button variant="primary" onClick={() => { if (deleteId) { deleteGoal.mutate(deleteId); setDeleteId(null); } }}>Confirmar</Button>
        </div>
      </Modal>
    </div>
  );
}
