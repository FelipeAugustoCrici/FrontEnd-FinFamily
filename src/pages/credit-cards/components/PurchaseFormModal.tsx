import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { useCreatePurchase, useCreditCards } from '../hooks/useCreditCards';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api.service';
import { useCategories } from '@/pages/categories/hooks/useCategories';

const schema = z.object({
  creditCardId: z.string().min(1, 'Selecione um cartão'),
  description: z.string().min(1, 'Descrição obrigatória'),
  totalAmount: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Valor inválido'),
  purchaseDate: z.string().min(1, 'Data obrigatória'),
  installments: z.string().min(1),
  categoryId: z.string().optional(),
  ownerId: z.string().optional(),
  observation: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  familyId?: string;
  defaultCardId?: string;
}

export function PurchaseFormModal({ isOpen, onClose, familyId, defaultCardId }: Props) {
  const create = useCreatePurchase();
  const { data: cards = [] } = useCreditCards(familyId);
  const { data: categories = [] } = useCategories();

  const { data: families = [] } = useQuery({
    queryKey: ['families'],
    queryFn: async () => { const { data } = await api.get('/finance/families'); return data; },
  });

  const members = families.flatMap((f: any) => f.members || []);

  const { register, handleSubmit, formState: { errors }, reset, watch, control } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      creditCardId: defaultCardId || '',
      description: '',
      totalAmount: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      installments: '1',
    },
  });

  const installments = Number(watch('installments') || 1);
  const totalAmount = Number(watch('totalAmount') || 0);
  const installmentValue = installments > 1 && totalAmount > 0
    ? (totalAmount / installments).toFixed(2)
    : null;

  const onSubmit = (data: FormData) => {
    create.mutate({
      creditCardId: data.creditCardId,
      description: data.description,
      totalAmount: Number(data.totalAmount),
      purchaseDate: data.purchaseDate,
      installments: Number(data.installments),
      categoryId: data.categoryId || undefined,
      ownerId: data.ownerId || undefined,
      observation: data.observation,
      familyId,
    }, {
      onSuccess: () => { reset(); onClose(); },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lançar Compra no Cartão" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Cartão</label>
          <select {...register('creditCardId')} className="w-full border border-primary-200 rounded-lg px-3 py-2 text-sm text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">Selecione um cartão</option>
            {cards.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.creditCardId && <p className="text-xs text-danger-500 mt-1">{errors.creditCardId.message}</p>}
        </div>

        <Input label="Descrição" placeholder="Ex: Supermercado, Netflix..." {...register('description')} error={errors.description?.message} />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="totalAmount"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                label="Valor Total"
                placeholder="0,00"
                value={field.value}
                onChange={field.onChange}
                error={errors.totalAmount?.message}
              />
            )}
          />
          <Input label="Data da Compra" type="date" {...register('purchaseDate')} error={errors.purchaseDate?.message} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Parcelas</label>
            <select {...register('installments')} className="w-full border border-primary-200 rounded-lg px-3 py-2 text-sm text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500">
              {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n === 1 ? 'À vista' : `${n}x`}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Categoria</label>
            <select {...register('categoryId')} className="w-full border border-primary-200 rounded-lg px-3 py-2 text-sm text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Sem categoria</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {members.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Responsável</label>
            <select {...register('ownerId')} className="w-full border border-primary-200 rounded-lg px-3 py-2 text-sm text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Sem responsável</option>
              {members.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        )}

        {installmentValue && (
          <div className="bg-primary-50 rounded-lg p-3 text-sm text-primary-700">
            <span className="font-medium">{installments}x de R$ {installmentValue}</span>
            <span className="text-primary-500 ml-2">— parcelas geradas automaticamente</span>
          </div>
        )}

        <Input label="Observação (opcional)" placeholder="Detalhes adicionais..." {...register('observation')} />

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={create.isPending}>Lançar Compra</Button>
        </div>
      </form>
    </Modal>
  );
}
