export type Category = {
  id: string;
  name: string;
  type: 'expense' | 'income';
  createdAt: string;
};

export type PaginatedCategories = {
  data: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
