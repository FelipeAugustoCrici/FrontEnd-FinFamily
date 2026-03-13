import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCreateCreditCard } from '../hooks/useCreateCreditCard';
import { DollarSign, CreditCard, Calendar } from 'lucide-react';

const creditCardSchema = z.object({
  name: z.string().min(1, 'Nome do cartão é obrigatório'),
  limit: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Valor inválido'),
  closingDay: z.string().refine((v) => {
    const num = Number(v);
    return !isNaN(num) && num >= 1 && num <= 31;
  }, 'Dia inválido (1-31)'),
  dueDay: z.string().refine((v) => {
    const num = Number(v);
    return !isNaN(num) && num >= 1 && num <= 31;
  }, 'Dia inválido (1-31)'),
  familyId: z.string().min(1, 'Família é obrigatória'),
});

type CreditCardFormData = z.infer<typeof creditCardSchema>;

interface CreditCardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyId: string;
}

export function CreditCardFormModal({ isOpen, onClose, familyId }: CreditCardFormModalProps) {
  const createCard = useCreateCreditCard();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      name: '',
      limit: '',
      closingDay: '1',
      dueDay: '10',
      familyId,
    },
  });

  const onSubmit = (data: CreditCardFormData) => {
    createCard.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Cartão de Crédito">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nome do Cartão"
          placeholder="Ex: Nubank, Itaú, etc."
          {...register('name')}
          error={errors.name?.message}
          icon={<CreditCard size={18} className="text-primary-400" />}
        />

        <Input
          label="Limite Total (R$)"
          type="text"
          placeholder="0,00"
          {...register('limit')}
          error={errors.limit?.message}
          icon={<DollarSign size={18} className="text-primary-400" />}
          onInput={(e) => {
            let value = e.currentTarget.value.replace(/[^\d.,]/g, '');
            value = value.replace(',', '.');
            const parts = value.split('.');
            if (parts.length > 2) {
              value = parts[0] + '.' + parts.slice(1).join('');
            }
            e.currentTarget.value = value;
          }}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Dia de Fechamento"
            type="number"
            min="1"
            max="31"
            {...register('closingDay')}
            error={errors.closingDay?.message}
            icon={<Calendar size={18} className="text-primary-400" />}
          />

          <Input
            label="Dia de Vencimento"
            type="number"
            min="1"
            max="31"
            {...register('dueDay')}
            error={errors.dueDay?.message}
            icon={<Calendar size={18} className="text-primary-400" />}
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={createCard.isPending}>
            {createCard.isPending ? 'Criando...' : 'Criar Cartão'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
