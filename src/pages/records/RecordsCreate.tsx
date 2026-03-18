import { useNavigate } from 'react-router-dom';
import { RecordForm } from './components/RecordForm';
import { useCreateRecord } from './hooks/useCreateRecord';
import { familyService } from '@/pages/families/services/families.service';
import { useCategories } from '@/pages/categories/hooks/useCategories';
import { useQuery } from '@tanstack/react-query';

export function RecordsCreate() {
  const navigate = useNavigate();
  const createRecord = useCreateRecord();

  const { data: families = [] } = useQuery({
    queryKey: ['families'],
    queryFn: () => familyService.list(),
  });

  const { data: categories = [] } = useCategories();

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
