import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Tags, Loader2, Trash2, Tag } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';

import { categorySchema, type CategoryFormData } from './schemas/category.schema';
import { useCategories } from './hooks/useCategories';
import { useCreateCategory } from './hooks/useCreateCategory';
import { useDeleteCategory } from './hooks/useDeleteCategory';
import { Category } from './types/category.types';

export function CategoriesList() {
  const methods = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'expense',
    },
  });

  const { register, handleSubmit, formState, reset } = methods;

  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  function onSubmit(data: CategoryFormData) {
    createCategory.mutate(data, {
      onSuccess: () => reset(),
    });
  }

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory.mutate(categoryToDelete.id, {
        onSuccess: () => {
          setCategoryToDelete(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-800 flex items-center gap-2">
            <Tags size={28} />
            Categorias
          </h2>
          <p className="text-primary-500">Organize seus lançamentos por categorias</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulário de criação */}
        <Card title="Nova Categoria" className="h-fit">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Nome da Categoria"
                placeholder="Ex: Alimentação, Transporte..."
                {...register('name')}
                error={formState.errors.name?.message as string}
              />

              <Select
                label="Tipo"
                {...register('type')}
                options={[
                  { value: 'expense', label: '💸 Despesa' },
                  { value: 'income', label: '💰 Receita' },
                ]}
              />

              <Button type="submit" className="w-full" disabled={createCategory.isPending}>
                {createCategory.isPending ? (
                  <Loader2 className="mr-2 animate-spin" size={18} />
                ) : (
                  <Plus className="mr-2" size={18} />
                )}
                Criar Categoria
              </Button>
            </form>
          </FormProvider>
        </Card>

        {/* Lista de categorias */}
        <div className="md:col-span-2 space-y-6">
          {/* Categorias de Despesa */}
          <Card title="💸 Despesas" className="overflow-hidden">
            {expenseCategories.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {expenseCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 flex items-center justify-between hover:bg-red-50/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <Tag size={18} className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary-800">{cat.name}</p>
                        <p className="text-xs text-primary-500">Categoria de despesa</p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setCategoryToDelete(cat)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Tag size={32} className="mx-auto mb-2 text-gray-400" />
                <p>Nenhuma categoria de despesa</p>
                <p className="text-sm">Crie categorias para organizar suas despesas</p>
              </div>
            )}
          </Card>

          {/* Categorias de Receita */}
          <Card title="💰 Receitas" className="overflow-hidden">
            {incomeCategories.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {incomeCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 flex items-center justify-between hover:bg-green-50/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Tag size={18} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary-800">{cat.name}</p>
                        <p className="text-xs text-primary-500">Categoria de receita</p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setCategoryToDelete(cat)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Tag size={32} className="mx-auto mb-2 text-gray-400" />
                <p>Nenhuma categoria de receita</p>
                <p className="text-sm">Crie categorias para organizar suas receitas</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Categoria"
        description={`Tem certeza que deseja excluir a categoria "${categoryToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        isLoading={deleteCategory.isPending}
      />
    </div>
  );
}
