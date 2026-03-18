import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { api } from '@/services/api.service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { creditCardsService } from '@/pages/credit-cards/services/credit-cards.service';
import { CreditCard, AlertCircle, TrendingDown, ArrowRight } from 'lucide-react';
import { formatShortDate } from '@/common/utils/date';

interface Props {
  month: number;
  year: number;
}

export function CreditCardsSummary({ month, year }: Props) {
  const navigate = useNavigate();

  const { data: families = [] } = useQuery({
    queryKey: ['families'],
    queryFn: async () => {
      const { data } = await api.get('/finance/families');
      return data;
    },
  });
  const familyId = families[0]?.id;

  const { data: cards = [] } = useQuery({
    queryKey: ['credit-cards-summary', familyId, month, year],
    queryFn: () => creditCardsService.getSummaryByFamily(familyId, month, year),
    enabled: !!familyId,
  });

  const { data: allInvoices = [] } = useQuery({
    queryKey: ['family-invoices', familyId],
    queryFn: () => creditCardsService.getAllInvoicesByFamily(familyId),
    enabled: !!familyId,
  });

  if (!cards.length) return null;

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const totalLimit = cards.reduce((s, c) => s + c.limitAmount, 0);
  const totalAvailable = cards.reduce((s, c) => s + c.availableLimit, 0);
  const totalUsed = totalLimit - totalAvailable;
  const usedPercent = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;

  const openInvoices = allInvoices.filter((i) => i.status === 'open' || i.status === 'overdue');
  const totalOpen = openInvoices.reduce((s, i) => s + i.totalAmount, 0);

  const nextDue = openInvoices
    .filter((i) => i.dueDate)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  const daysUntilDue = nextDue
    ? moment(nextDue.dueDate).diff(moment().startOf('day'), 'days')
    : null;

  const futureInstallments = allInvoices
    .filter((i) => {
      const isFuture =
        i.referenceYear > year ||
        (i.referenceYear === year && i.referenceMonth > month);
      return isFuture && i.status !== 'paid';
    })
    .reduce((s, i) => s + i.totalAmount, 0);

  const limitBarColor =
    usedPercent > 80 ? 'bg-danger-500' : usedPercent > 60 ? 'bg-amber-400' : 'bg-success-600';

  return (
    <Card
      title="Cartões de Crédito"
      footer={
        <Button
          variant="ghost"
          className="w-full text-primary-600 hover:text-primary-800"
          onClick={() => navigate('/credit-cards')}
        >
          Ver todos os cartões <ArrowRight size={16} className="ml-2" />
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Métricas em grid — mesmo padrão de Previsibilidade de Renda */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Limite usado */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-primary-500 font-medium">Limite Usado</span>
              <span className="text-primary-800 font-bold">{fmt(totalUsed)}</span>
            </div>
            <div className="w-full bg-primary-100 h-2 rounded-full overflow-hidden">
              <div
                className={`${limitBarColor} h-full rounded-full transition-all`}
                style={{ width: `${usedPercent}%` }}
              />
            </div>
            <p className="text-xs text-primary-400">de {fmt(totalLimit)} disponível</p>
          </div>

          {/* Faturas em aberto */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-primary-500 font-medium">Faturas em Aberto</span>
              <span className="text-danger-600 font-bold">{fmt(totalOpen)}</span>
            </div>
            <div className="w-full bg-primary-100 h-2 rounded-full overflow-hidden">
              <div className="bg-danger-400 h-full rounded-full" style={{ width: '100%' }} />
            </div>
            <p className="text-xs text-primary-400">
              {openInvoices.length} fatura{openInvoices.length !== 1 ? 's' : ''} pendente
              {openInvoices.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Parcelamentos futuros */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-primary-500 font-medium">Parcelamentos Futuros</span>
              <span className="text-primary-800 font-bold">{fmt(futureInstallments)}</span>
            </div>
            <div className="w-full bg-primary-100 h-2 rounded-full overflow-hidden">
              <div className="bg-primary-400 h-full rounded-full" style={{ width: '100%' }} />
            </div>
            <p className="text-xs text-primary-400">comprometido nos próximos meses</p>
          </div>
        </div>

        {/* Índice de uso — mesmo padrão do "Índice de Previsibilidade" */}
        <div className="pt-4 border-t border-primary-50">
          <p className="text-xs text-primary-400 uppercase font-bold tracking-wider mb-2">
            Índice de Utilização
          </p>
          <div className="flex items-end gap-2">
            <span
              className={`text-3xl font-bold ${
                usedPercent > 80
                  ? 'text-danger-600'
                  : usedPercent > 60
                    ? 'text-amber-500'
                    : 'text-success-600'
              }`}
            >
              {usedPercent.toFixed(1)}%
            </span>
            <span className="text-sm text-primary-500 pb-1">do limite total utilizado</span>
          </div>
          <p className="text-xs text-primary-400 mt-2">
            O ideal é manter o uso abaixo de 30% do limite para não impactar o score.
          </p>
        </div>

        {/* Alertas inline */}
        {(daysUntilDue !== null || usedPercent > 70 || futureInstallments > 0) && (
          <div className="space-y-2 pt-2 border-t border-primary-50">
            {daysUntilDue !== null && daysUntilDue <= 7 && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>
                  Sua próxima fatura vence{' '}
                  {daysUntilDue === 0
                    ? 'hoje'
                    : `em ${daysUntilDue} dia${daysUntilDue !== 1 ? 's' : ''}`}{' '}
                  — {fmt(nextDue!.totalAmount)} ({formatShortDate(nextDue!.dueDate)})
                </span>
              </div>
            )}
            {usedPercent > 70 && (
              <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg text-sm text-danger-800">
                <CreditCard size={15} className="flex-shrink-0" />
                <span>
                  Você já utilizou {usedPercent.toFixed(0)}% do limite total dos seus cartões
                </span>
              </div>
            )}
            {futureInstallments > 0 && (
              <div className="flex items-center gap-2 p-3 bg-primary-50 border border-primary-200 rounded-lg text-sm text-primary-700">
                <TrendingDown size={15} className="flex-shrink-0" />
                <span>
                  Compras parceladas comprometem {fmt(futureInstallments)} dos próximos meses
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
