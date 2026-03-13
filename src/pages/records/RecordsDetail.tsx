import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button, cn } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import { useState } from 'react';
import { api } from '@/services/api.service';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowLeft,
  Calendar,
  Tag,
  FileText,
  Download,
  Trash2,
  Edit2,
  Loader2,
  User,
} from 'lucide-react';
import { formatMediumDate, formatShortDate } from '@/common/utils/date';

export function RecordsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Buscar o registro tentando em todas as rotas
  const { data: record, isLoading } = useQuery({
    queryKey: ['record-detail', id],
    queryFn: async () => {
      if (!id) return null;

      // Tenta buscar em expenses primeiro
      try {
        const { data } = await api.get(`/finance/expenses/${id}`);
        return { ...data, recordType: 'expense' };
      } catch {
        // Se não encontrou em expenses, tenta incomes
        try {
          const { data } = await api.get(`/finance/incomes/${id}`);
          return { ...data, recordType: 'salary' };
        } catch {
          // Se não encontrou em incomes, tenta extras
          const { data } = await api.get(`/finance/extras/${id}`);
          return { ...data, recordType: 'income' };
        }
      }
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!record) return;

      const route =
        record.recordType === 'expense'
          ? 'expenses'
          : record.recordType === 'salary'
            ? 'incomes'
            : 'extras';

      await api.delete(`/finance/${route}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['extras'] });
      navigate('/record');
    },
  });

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
    setShowDeleteModal(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-primary-500">Nenhum detalhe disponível para este lançamento.</p>
        <Button onClick={() => navigate('/record')}>Voltar para Listagem</Button>
      </div>
    );
  }

  const isIncome = record.recordType === 'salary' || record.recordType === 'income';
  const typeLabel =
    record.recordType === 'expense'
      ? 'Despesa'
      : record.recordType === 'salary'
        ? 'Salário'
        : 'Bônus/Extra';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/record')}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-primary-800">Detalhes do Lançamento</h2>
            <p className="text-primary-500 text-sm">Registro gerado pelo sistema</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate(`/record/edit/${id}`)}>
            <Edit2 size={16} className="mr-2" /> Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 size={16} className="animate-spin mr-2" />
            ) : (
              <Trash2 size={16} className="mr-2" />
            )}
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card
            className={cn('border-l-4', isIncome ? 'border-l-success-500' : 'border-l-danger-500')}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'p-3 rounded-xl',
                    isIncome ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600',
                  )}
                >
                  {isIncome ? <ArrowUpCircle size={32} /> : <ArrowDownCircle size={32} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-800">{record.description}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant={isIncome ? 'success' : 'danger'}>{typeLabel}</Badge>
                    {record.category && <Badge variant="primary">{record.category.name}</Badge>}
                    {record.status && (
                      <Badge
                        variant={
                          record.status === 'PAID'
                            ? 'success'
                            : record.status === 'PENDING'
                              ? 'warning'
                              : 'danger'
                        }
                      >
                        {record.status === 'PAID'
                          ? 'Pago'
                          : record.status === 'PENDING'
                            ? 'Pendente'
                            : 'Atrasado'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-primary-500 uppercase font-bold tracking-wider">
                  Valor do Lançamento
                </p>
                <p
                  className={cn(
                    'text-3xl font-black',
                    isIncome ? 'text-success-600' : 'text-danger-600',
                  )}
                >
                  {formatCurrency(record.value)}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card title="Dados do Registro">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="text-primary-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs text-primary-500 font-medium">Data do Lançamento</p>
                    <p className="text-sm font-semibold text-primary-800">
                      {formatMediumDate(record.date)}
                    </p>
                  </div>
                </div>
                {record.category && (
                  <div className="flex items-start gap-3">
                    <Tag className="text-primary-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-primary-500 font-medium">Categoria</p>
                      <p className="text-sm font-semibold text-primary-800 capitalize">
                        {record.category.name}
                      </p>
                    </div>
                  </div>
                )}
                {record.person && (
                  <div className="flex items-start gap-3">
                    <User className="text-primary-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-primary-500 font-medium">Responsável</p>
                      <p className="text-sm font-semibold text-primary-800">{record.person.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Informações Adicionais">
              <div className="flex items-start gap-3">
                <FileText className="text-primary-400 mt-0.5" size={18} />
                <p className="text-sm text-primary-600 leading-relaxed">
                  {record.recordType === 'expense' && 'Despesa registrada no sistema. '}
                  {record.recordType === 'salary' && 'Salário fixo mensal. '}
                  {record.recordType === 'income' && 'Rendimento extra ou bônus. '}
                  {record.recurringId && 'Este é um lançamento recorrente.'}
                </p>
              </div>
            </Card>
          </div>

          <Card title="Histórico">
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-primary-100">
              <div className="flex gap-6 relative">
                <div className="w-5 h-5 rounded-full bg-white border-4 border-success-500 z-10 flex-shrink-0"></div>
                <div className="pb-2">
                  <p className="text-sm font-bold text-primary-800">Lançamento Efetivado</p>
                  <p className="text-xs text-primary-500">
                    Criado em {formatShortDate(record.createdAt || record.date)}
                  </p>
                </div>
              </div>
              {record.updatedAt && record.updatedAt !== record.createdAt && (
                <div className="flex gap-6 relative">
                  <div className="w-5 h-5 rounded-full bg-white border-4 border-primary-400 z-10 flex-shrink-0"></div>
                  <div className="pb-2">
                    <p className="text-sm font-bold text-primary-800">Última Atualização</p>
                    <p className="text-xs text-primary-500">{formatShortDate(record.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Ações Disponíveis">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled>
                <Download size={16} className="mr-2" /> Baixar Comprovante
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                <FileText size={16} className="mr-2" /> Gerar PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Lançamento"
        description={`Tem certeza que deseja excluir "${record.description}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
