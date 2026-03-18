import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api.service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCreditCards, useDeleteCreditCard } from './hooks/useCreditCards';
import { CardVisual } from './components/CardVisual';
import { CreditCardFormModal } from './components/CreditCardFormModal';
import { PurchaseFormModal } from './components/PurchaseFormModal';
import { ConfirmModal } from '@/components/ui/Modal';
import { Plus, Eye, Trash2, CreditCard as CreditCardIcon, ShoppingBag } from 'lucide-react';

export function CreditCardsList() {
  const navigate = useNavigate();
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: families = [] } = useQuery({
    queryKey: ['families'],
    queryFn: async () => { const { data } = await api.get('/finance/families'); return data; },
  });
  const familyId = families[0]?.id;

  const { data: cards = [], isLoading } = useCreditCards(familyId);
  const deleteCard = useDeleteCreditCard();

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cartões de Crédito</h1>
          <p className="text-primary-500 text-sm mt-1">Gerencie seus cartões, faturas e compras</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setPurchaseModalOpen(true)}>
            <ShoppingBag size={16} className="mr-2" /> Nova Compra
          </Button>
          <Button onClick={() => setCardModalOpen(true)}>
            <Plus size={16} className="mr-2" /> Novo Cartão
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 bg-primary-100 rounded-xl animate-pulse" />)}
        </div>
      ) : cards.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <CreditCardIcon size={48} className="mx-auto mb-4 text-primary-300" />
            <h3 className="text-lg font-semibold text-primary-700 mb-2">Nenhum cartão cadastrado</h3>
            <p className="text-primary-500 text-sm mb-6">Adicione seus cartões para controlar faturas e parcelamentos</p>
            <Button onClick={() => setCardModalOpen(true)}>
              <Plus size={16} className="mr-2" /> Adicionar Cartão
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const usedAmount = card.limitAmount - card.availableLimit;
            const usedPercent = card.limitAmount > 0 ? (usedAmount / card.limitAmount) * 100 : 0;

            return (
              <div key={card.id} className="space-y-3">
                <CardVisual card={card} />

                <Card className="!p-0">
                  <div className="px-4 py-3 space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-primary-500">
                        <span>Limite usado</span>
                        <span className="font-medium">{usedPercent.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-primary-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${usedPercent > 80 ? 'bg-danger-500' : usedPercent > 60 ? 'bg-amber-400' : 'bg-success-500'}`}
                          style={{ width: `${usedPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-primary-500">Usado: <span className="font-medium text-primary-700">{fmt(usedAmount)}</span></span>
                        <span className="text-primary-500">Disponível: <span className="font-medium text-success-600">{fmt(card.availableLimit)}</span></span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button size="sm" variant="secondary" className="flex-1" onClick={() => navigate(`/credit-cards/${card.id}`)}>                        <Eye size={14} className="mr-1" /> Detalhes
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setDeleteId(card.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      <CreditCardFormModal isOpen={cardModalOpen} onClose={() => setCardModalOpen(false)} familyId={familyId} />
      <PurchaseFormModal isOpen={purchaseModalOpen} onClose={() => setPurchaseModalOpen(false)} familyId={familyId} />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteCard.mutate(deleteId); setDeleteId(null); } }}
        title="Remover Cartão"
        description="Tem certeza que deseja remover este cartão? As faturas e compras serão mantidas."
      />
    </div>
  );
}
