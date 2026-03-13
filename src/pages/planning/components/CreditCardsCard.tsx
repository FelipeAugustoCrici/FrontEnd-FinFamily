import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreditCard as CreditCardIcon, Trash2, Calendar } from 'lucide-react';
import { useCreditCards } from '../hooks/useCreditCards';
import { useDeleteCreditCard } from '../hooks/useDeleteCreditCard';
import { Modal } from '@/components/ui/Modal';

export function CreditCardsCard({ onCreateNew }: { onCreateNew: () => void }) {
  const { data: cards = [], isLoading } = useCreditCards();
  const deleteCard = useDeleteCreditCard();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setSelectedCardId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCardId) {
      deleteCard.mutate(selectedCardId);
      setDeleteModalOpen(false);
      setSelectedCardId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card title="Cartões de Crédito">
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      </Card>
    );
  }

  return (
    <>
      <Card title="Cartões de Crédito">
        <div className="space-y-4">
          <Button onClick={onCreateNew} className="w-full" variant="ghost">
            <CreditCardIcon size={18} className="mr-2" />
            Novo Cartão
          </Button>

          {cards.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCardIcon size={48} className="mx-auto mb-3 opacity-30" />
              <p>Nenhum cartão cadastrado</p>
              <p className="text-sm mt-1">Adicione seus cartões de crédito!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg text-white shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{card.name}</h4>
                      <p className="text-primary-100 text-sm mt-1">
                        Limite: {formatCurrency(card.limit)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="text-white/80 hover:text-white p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Fecha dia {card.closingDay}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Vence dia {card.dueDay}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <p className="text-gray-600 mb-6">Tem certeza que deseja excluir este cartão?</p>
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
