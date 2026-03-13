import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Users, Trash2, Edit, UserPlus, Loader2, AlertTriangle } from 'lucide-react';
import { useFamilies } from './hooks/useFamilies';
import { useCreateFamily } from './hooks/useCreateFamily';
import { useDeleteFamily } from './hooks/useDeleteFamily';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import { familyService } from './services/families.service';

export function FamiliesList() {
  const navigate = useNavigate();
  const { data: families = [], isLoading } = useFamilies();
  const createFamily = useCreateFamily();
  const deleteFamily = useDeleteFamily();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [newFamilyName, setNewFamilyName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteMemberModalOpen, setDeleteMemberModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const family = families[0]; // Apenas uma família
  const hasFamily = families.length > 0;

  const createMember = useMutation({
    mutationFn: ({ familyId, name }: { familyId: string; name: string }) =>
      familyService.createMember(familyId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      setNewMemberName('');
      setIsAddingMember(false);
      showToast({
        title: 'Sucesso',
        description: 'Membro adicionado com sucesso!',
        variant: 'success',
      });
    },
    onError: () => {
      showToast({
        title: 'Erro',
        description: 'Erro ao adicionar membro',
        variant: 'error',
      });
    },
  });

  const deleteMember = useMutation({
    mutationFn: (memberId: string) => familyService.deleteMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      showToast({
        title: 'Sucesso',
        description: 'Membro removido com sucesso!',
        variant: 'success',
      });
    },
    onError: () => {
      showToast({
        title: 'Erro',
        description: 'Erro ao remover membro',
        variant: 'error',
      });
    },
  });

  const handleCreateFamily = () => {
    if (!newFamilyName.trim()) return;
    createFamily.mutate(
      { name: newFamilyName },
      {
        onSuccess: () => setNewFamilyName(''),
      },
    );
  };

  const handleAddMember = () => {
    if (!newMemberName.trim() || !family) return;
    createMember.mutate({ familyId: family.id, name: newMemberName });
  };

  const handleDeleteFamily = () => {
    if (!family) return;
    deleteFamily.mutate(family.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        // Invalidar cache do header também
        queryClient.invalidateQueries({ queryKey: ['user-family'] });
      },
    });
  };

  const handleDeleteMember = () => {
    if (!selectedMemberId) return;

    deleteMember.mutate(selectedMemberId, {
      onSuccess: () => {
        setDeleteMemberModalOpen(false);
        setSelectedMemberId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  // Se não tem família, mostra formulário de criação
  if (!hasFamily) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <Users size={48} className="mx-auto text-primary-400 mb-4" />
          <h2 className="text-2xl font-bold text-primary-800">Configure sua Família</h2>
          <p className="text-primary-500 mt-2">
            Crie sua família para começar a gerenciar os lançamentos
          </p>
        </div>

        <Card title="Nova Família">
          <div className="space-y-4">
            <Input
              label="Nome da Família"
              placeholder="Ex: Família Silva"
              value={newFamilyName}
              onChange={(e) => setNewFamilyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFamily()}
            />

            <Button
              onClick={handleCreateFamily}
              disabled={!newFamilyName.trim() || createFamily.isPending}
              className="w-full"
            >
              {createFamily.isPending ? (
                <Loader2 className="mr-2 animate-spin" size={18} />
              ) : (
                <Plus className="mr-2" size={18} />
              )}
              Criar Família
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Mostra a família com seus membros
  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary-800 flex items-center gap-2">
              <Users size={28} />
              {family.name}
            </h2>
            <p className="text-primary-500">Gerencie os membros da sua família</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate(`/family/edit/${family.id}`)}>
              <Edit size={18} className="mr-2" />
              Editar Família
            </Button>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(true)}>
              <Trash2 size={18} className="mr-2 text-red-500" />
              <span className="text-red-500">Excluir</span>
            </Button>
          </div>
        </div>

        {/* Lista de Membros */}
        <Card title="Membros da Família" className="overflow-hidden">
          <div className="divide-y divide-gray-100">
            {family.members && family.members.length > 0 ? (
              family.members.map((member) => (
                <div
                  key={member.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary-800">{member.name}</p>
                      <p className="text-xs text-primary-500">Membro da família</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedMemberId(member.id);
                      setDeleteMemberModalOpen(true);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <UserPlus size={32} className="mx-auto mb-2 text-gray-400" />
                <p>Nenhum membro cadastrado ainda</p>
                <p className="text-sm">Adicione membros para começar</p>
              </div>
            )}
          </div>

          {/* Formulário de adicionar membro */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            {isAddingMember ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do membro"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                  autoFocus
                />
                <Button
                  onClick={handleAddMember}
                  disabled={!newMemberName.trim() || createMember.isPending}
                >
                  {createMember.isPending ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsAddingMember(false);
                    setNewMemberName('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsAddingMember(true)} className="w-full">
                <UserPlus size={18} className="mr-2" />
                Adicionar Membro
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Modal de confirmação de exclusão da família */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800 mb-1">Atenção!</p>
              <p className="text-sm text-red-700">
                Ao excluir a família, todos os lançamentos, membros e dados relacionados serão
                permanentemente removidos. Esta ação não pode ser desfeita.
              </p>
            </div>
          </div>

          <p className="text-gray-600">
            Tem certeza que deseja excluir a família <strong>{family?.name}</strong>?
          </p>

          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteFamily}
              disabled={deleteFamily.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteFamily.isPending ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={18} />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2" size={18} />
                  Confirmar Exclusão
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de confirmação de exclusão de membro */}
      <Modal
        isOpen={deleteMemberModalOpen}
        onClose={() => {
          setDeleteMemberModalOpen(false);
          setSelectedMemberId(null);
        }}
        title="Remover Membro"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Tem certeza que deseja remover este membro da família?</p>

          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteMemberModalOpen(false);
                setSelectedMemberId(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteMember}
              disabled={deleteMember.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMember.isPending ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={18} />
                  Removendo...
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
