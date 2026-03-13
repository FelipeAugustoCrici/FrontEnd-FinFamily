import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { RecordForm } from './components/RecordForm';
import { useCreateRecord } from './hooks/useCreateRecord';
import { familyService } from '@/pages/families/services/families.service';
import { getCategories } from '@/pages/categories/services/categories.service';

export function RecordsCreate() {
  const navigate = useNavigate();
  const createRecord = useCreateRecord();

  const { data: families = [] } = useQuery({
    queryKey: ['families'],
    queryFn: () => familyService.list(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Pega apenas os membros da primeira família (sistema permite apenas uma família)
  const people = families[0]?.members || [];

  return (
    <RecordForm
      families={families}
      categories={categories}
      people={people}
      onSubmit={(data) =>
        createRecord.mutate(data as any, {
          onSuccess: () => navigate('/record'),
        })
      }
      isLoading={createRecord.isPending}
    />
  );
}
