import { api } from '@/services/api.service';
import type { Category } from '../types/category.types';
import type { CategoryFormData } from '../schemas/category.schema';

export const categoryService = {
  async list(familyId?: string): Promise<Category[]> {
    const params = familyId ? `?familyId=${familyId}` : '';
    const { data } = await api.get(`/finance/categories${params}`);
    return data;
  },

  async getById(id: string): Promise<Category> {
    const { data } = await api.get(`/finance/categories/${id}`);
    return data;
  },

  async create(payload: CategoryFormData): Promise<Category> {
    const { data } = await api.post('/finance/categories', payload);
    return data;
  },

  async update(id: string, payload: CategoryFormData): Promise<Category> {
    const { data } = await api.put(`/finance/categories/${id}`, payload);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/finance/categories/${id}`);
  },
};

// Mantém exports antigos para compatibilidade
export const getCategories = categoryService.list;
export const createCategory = categoryService.create;
