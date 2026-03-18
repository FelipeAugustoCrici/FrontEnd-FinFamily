import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Settings2, Heart, TrendingUp, TrendingDown, Minus, CheckCircle2, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { api } from '@/services/api.service'
import { useCoupleModeConfig, useCoupleModeResult, useDeleteAdjustment } from './hooks/useCoupleMode'
import { CoupleModeConfigModal } from './components/CoupleModeConfigModal'
import { AdjustmentModal } from './components/AdjustmentModal'
import { AdjustmentSuggestion } from './types/couple-mode.types'
import { FamilyMember } from '@/pages/families/types/family.types'

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const PERSON_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6']

export function CoupleModeList() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [configOpen, setConfigOpen] = useState(false)
  const [adjustmentSuggestion, setAdjustmentSuggestion] = useState<AdjustmentSuggestion | null>(null)

  const { data: families = [] } = useQuery({
    queryKey: ['families'],
    queryFn: async () => { const { data } = await api.get('/finance/families'); return data },
  })
  const family = families[0]
  const familyId = family?.id ?? ''
  const members: FamilyMember[] = family?.members ?? []

  const { data: config } = useCoupleModeConfig(familyId)
  const { data: rawResult, isLoading } = useCoupleModeResult(familyId, month, year)
  const deleteAdjustment = useDeleteAdjustment()

  const result = rawResult?.period?.month === month && rawResult?.period?.year === year ? rawResult : undefined

  const getMemberName = (id: string) => members.find((m) => m.id === id)?.name ?? id

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  const monthLabel = new Date(year, month - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
  const hasData = result && result.totalShared > 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Heart size={22} className="text-rose-400" /> Modo Casal
          </h1>
          <p className="text-primary-500 text-sm mt-1">Divisão transparente e sem conflitos</p>
        </div>
        <Button variant="secondary" onClick={() => setConfigOpen(true)}>
          <Settings2 size={16} className="mr-2" /> Configurar
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={prevMonth} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-slate-700 capitalize min-w-36 text-center">{monthLabel}</span>
        <button onClick={nextMonth} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {!config?.isActive && (
        <Card>
          <div className="text-center py-16">
            <Heart size={48} className="mx-auto mb-4 text-primary-300" />
            <h3 className="text-lg font-semibold text-primary-700 mb-2">Modo Casal não configurado</h3>
            <p className="text-primary-500 text-sm mb-6">Configure os participantes e a regra de divisão para começar</p>
            <Button onClick={() => setConfigOpen(true)}>
              <Settings2 size={16} className="mr-2" /> Configurar agora
            </Button>
          </div>
        </Card>
      )}

      {config?.isActive && (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => <div key={i} className="h-48 bg-primary-100 rounded-xl animate-pulse" />)}
            </div>
          ) : !result ? (
            <Card>
              <div className="text-center py-10 text-primary-400 text-sm">
                Nenhum dado encontrado para este período.
              </div>
            </Card>
          ) : (
            <>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Total compartilhado no período</p>
                    <p className="text-3xl font-bold text-slate-800">{fmt(result.totalShared)}</p>
                  </div>
                  <div className="text-xs text-slate-400 text-right">
                    <p>Regra: <span className="font-semibold text-slate-600 capitalize">
                      {result.splitType === 'equal' ? 'Igual' : result.splitType === 'proportional' ? 'Proporcional' : 'Personalizada'}
                    </span></p>
                    {hasData && result.splitType === 'proportional' && result.totalFamilyIncome > 0 && (
                      <p className="mt-1">Renda total informada: <span className="font-semibold text-slate-600">{fmt(result.totalFamilyIncome)}</span></p>
                    )}
                  </div>
                </div>
                {hasData && result.splitType === 'proportional' && (
                  <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
                    Divisão baseada na renda informada do mês
                  </p>
                )}
              </Card>

              {!hasData && (
                <Card>
                  <div className="text-center py-10 text-slate-400 text-sm">
                    Nenhuma despesa compartilhada neste período.
                  </div>
                </Card>
              )}

              {hasData && result.incomeRequired && (
                <Card>
                  <div className="flex flex-col items-center gap-3 py-8 text-center">
                    <span className="text-3xl">⚠️</span>
                    <p className="text-sm font-semibold text-amber-700">Renda não informada</p>
                    <p className="text-xs text-slate-500 max-w-xs">
                      Para usar a divisão proporcional, informe a renda mensal de cada participante na configuração.
                    </p>
                    <Button size="sm" variant="secondary" onClick={() => setConfigOpen(true)}>
                      <Settings2 size={14} className="mr-1" /> Preencher renda
                    </Button>
                  </div>
                </Card>
              )}

              {hasData && !result.incomeRequired && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.participants.map((p, idx) => {
                      const color = PERSON_COLORS[idx % PERSON_COLORS.length]
                      const effectivePaid = p.amountPaid + p.adjustmentAmount
                      const pct = result.totalShared > 0 ? (effectivePaid / result.totalShared) * 100 : 0
                      const idealPct = p.proportion
                      const isOver = p.balance > 0.01
                      const isUnder = p.balance < -0.01

                      return (
                        <Card key={p.personId}>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: color }}>
                                {getMemberName(p.personId).charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">{getMemberName(p.personId)}</p>
                                <p className="text-xs text-slate-400">{p.proportion.toFixed(0)}% do total</p>
                              </div>
                              {isOver && <TrendingUp size={16} className="ml-auto text-emerald-500" />}
                              {isUnder && <TrendingDown size={16} className="ml-auto text-amber-500" />}
                              {!isOver && !isUnder && <Minus size={16} className="ml-auto text-slate-400" />}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-xs text-slate-400 mb-1">Pagou</p>
                                <p className="text-base font-bold text-slate-800">{fmt(effectivePaid)}</p>
                                {p.adjustmentAmount !== 0 && (
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    {fmt(p.amountPaid)} + {fmt(Math.abs(p.adjustmentAmount))} ajuste
                                  </p>
                                )}
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-xs text-slate-400 mb-1">Ideal</p>
                                <p className="text-base font-bold text-slate-800">{fmt(p.amountShouldPay)}</p>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-slate-400">
                                <span>Participação real</span>
                                <span>{pct.toFixed(0)}% / ideal {idealPct.toFixed(0)}%</span>
                              </div>
                              <div className="relative w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
                                <div className="absolute top-0 h-full w-0.5 bg-slate-400" style={{ left: `${Math.min(idealPct, 100)}%` }} />
                              </div>
                            </div>

                            {result.splitType === 'proportional' && p.configuredIncome > 0 && (
                              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg">
                                <span className="text-xs text-slate-500">Renda informada</span>
                                <span className="text-xs font-semibold text-slate-700">
                                  {fmt(p.configuredIncome)} ({p.proportion.toFixed(0)}%)
                                </span>
                              </div>
                            )}

                            {isOver && (
                              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                                <TrendingUp size={13} className="text-emerald-500 shrink-0" />
                                <p className="text-xs text-emerald-700">
                                  Contribuiu {fmt(p.balance)} a mais neste período
                                </p>
                              </div>
                            )}
                            {isUnder && (
                              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                                <TrendingDown size={13} className="text-amber-500 shrink-0" />
                                <p className="text-xs text-amber-700">
                                  Contribuiu {fmt(Math.abs(p.balance))} a menos neste período
                                </p>
                              </div>
                            )}
                          </div>
                        </Card>
                      )
                    })}
                  </div>

                  {result.suggestions.filter((s) =>
                    !result.adjustments.some(
                      (a) => a.fromPersonId === s.fromPersonId && a.toPersonId === s.toPersonId
                    )
                  ).length > 0 && (
                    <Card title="Sugestão de equilíbrio">
                      <div className="space-y-3">
                        {result.suggestions
                          .filter((s) =>
                            !result.adjustments.some(
                              (a) => a.fromPersonId === s.fromPersonId && a.toPersonId === s.toPersonId
                            )
                          )
                          .map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-sky-50 border border-sky-100 rounded-xl">
                              <p className="text-sm text-sky-800">
                                Para equilibrar, {getMemberName(s.fromPersonId)} pode contribuir com {fmt(s.amount)} para {getMemberName(s.toPersonId)}
                              </p>
                              <Button size="sm" variant="secondary" onClick={() => setAdjustmentSuggestion(s)}>
                                Registrar
                              </Button>
                            </div>
                          ))}
                      </div>
                    </Card>
                  )}

                  {result.adjustments.length > 0 && (
                    <Card title="Ajustes registrados">
                      <div className="space-y-2">
                        {result.adjustments.map((a) => (
                          <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={15} className="text-emerald-500" />
                              <div>
                                <p className="text-sm font-medium text-slate-700">{a.description}</p>
                                <p className="text-xs text-slate-400">
                                  {getMemberName(a.fromPersonId)} → {getMemberName(a.toPersonId)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-emerald-600">{fmt(a.amount)}</span>
                              <button
                                onClick={() => deleteAdjustment.mutate(a.id)}
                                disabled={deleteAdjustment.isPending}
                                className="p-1.5 text-slate-400 hover:text-danger-600 hover:bg-danger-50 rounded-md transition-colors disabled:opacity-50"
                                title="Excluir ajuste"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {configOpen && (
        <CoupleModeConfigModal
          isOpen={configOpen}
          onClose={() => setConfigOpen(false)}
          familyId={familyId}
          members={members}
          config={config}
          month={month}
          year={year}
        />
      )}

      {adjustmentSuggestion && (
        <AdjustmentModal
          isOpen={!!adjustmentSuggestion}
          onClose={() => setAdjustmentSuggestion(null)}
          familyId={familyId}
          month={month}
          year={year}
          suggestion={adjustmentSuggestion}
          members={members}
        />
      )}
    </div>
  )
}
