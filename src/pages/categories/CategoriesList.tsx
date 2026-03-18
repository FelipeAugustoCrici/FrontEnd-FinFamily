import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Tags, Loader2, Trash2, Tag } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';

import { categorySchema, type CategoryFormData } from './schemas/category.schema';
import { useCategoriesPaginated } from './hooks/useCategories';
import { useCreateCategory } from './hooks/useCreateCategory';
import { useDeleteCategory } from './hooks/useDeleteCategory';
import { Category } from './types/category.types';
import { useUserFamily } from '@/hooks/useUserInfo';

export function CategoriesList() {
  const { data: family } = useUserFamily();

  const methods = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', type: 'expense' },
  });

  const { register, handleSubmit, formState, reset } = methods;

  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [expensePage, setExpensePage] = useState(1);
  const [incomePage, setIncomePage] = useState(1);

  const { data: expenseData, isLoading: loadingExpenses } = useCategoriesPaginated('expense', expensePage);
  const { data: incomeData, isLoading: loadingIncomes } = useCategoriesPaginated('income', incomePage);

  function onSubmit(data: CategoryFormData) {
    createCategory.mutate({ ...data, familyId: family?.id }, {
      onSuccess: () => reset(),
    });
  }

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory.mutate(categoryToDelete.id, {
        onSuccess: () => setCategoryToDelete(null),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary-800 flex items-center gap-2">
            <Tags size={24} /> Categorias
          </h2>
          <p className="text-primary-500">Organize seus lançamentos por categorias</p>
        </div>
        <Button onClick={() => document.getElementById('category-form-name')?.focus()}>
          <Plus size={18} className="mr-2" /> Nova Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Nova Categoria" className="h-fit">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                id="category-form-name"
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

        <div className="md:col-span-2 space-y-6">
          <Card title="💸 Despesas" className="overflow-hidden">
            {loadingExpenses ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-primary-500" size={24} />
              </div>
            ) : expenseData && expenseData.data.length > 0 ? (
              <>
                <div className="divide-y divide-primary-50">
                  {expenseData.data.map((cat) => (
                    <div
                      key={cat.id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-primary-50/30 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-danger-50 text-danger-600">
                          <Tag size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-primary-800">{cat.name}</p>
                          <p className="text-xs text-primary-500">Categoria de despesa</p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setCategoryToDelete(cat)}
                          className="p-1.5 text-primary-400 hover:text-danger-600 hover:bg-danger-50 rounded-md transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={expensePage}
                  totalPages={expenseData.totalPages}
                  onPageChange={setExpensePage}
                  totalItems={expenseData.total}
                  itemsPerPage={10}
                />
              </>
            ) : (
              <div className="px-6 py-10 text-center text-primary-400">
                <Tag size={32} className="mx-auto mb-2" />
                <p className="font-medium">Nenhuma categoria de despesa</p>
                <p className="text-sm mt-1">Crie categorias para organizar suas despesas</p>
              </div>
            )}
          </Card>

          <Card title="💰 Receitas" className="overflow-hidden">
            {loadingIncomes ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-primary-500" size={24} />
              </div>
            ) : incomeData && incomeData.data.length > 0 ? (
              <>
                <div className="divide-y divide-primary-50">
                  {incomeData.data.map((cat) => (
                    <div
                      key={cat.id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-primary-50/30 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-success-50 text-success-600">
                          <Tag size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-primary-800">{cat.name}</p>
                          <p className="text-xs text-primary-500">Categoria de receita</p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setCategoryToDelete(cat)}
                          className="p-1.5 text-primary-400 hover:text-danger-600 hover:bg-danger-50 rounded-md transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={incomePage}
                  totalPages={incomeData.totalPages}
                  onPageChange={setIncomePage}
                  totalItems={incomeData.total}
                  itemsPerPage={10}
                />
              </>
            ) : (
              <div className="px-6 py-10 text-center text-primary-400">
                <Tag size={32} className="mx-auto mb-2" />
                <p className="font-medium">Nenhuma categoria de receita</p>
                <p className="text-sm mt-1">Crie categorias para organizar suas receitas</p>
              </div>
            )}
          </Card>
        </div>
      </div>

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
