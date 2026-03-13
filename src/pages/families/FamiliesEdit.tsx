import { useNavigate, useParams } from 'react-router-dom';
import { FamilyForm } from './components/FamilyForm';
import { useUpdateFamily } from './hooks/useUpdateFamily';
import { useFamily } from './hooks/useFamily';

export function FamiliesEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const updateFamily = useUpdateFamily();

  const { data: item, isLoading } = useFamily(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <p className="text-primary-500">Família não encontrada</p>
      </div>
    );
  }

  return (
    <FamilyForm
      initialData={item}
      onSubmit={(data) =>
        updateFamily.mutate(
          { id: id!, data },
          {
            onSuccess: () => navigate('/family'),
          },
        )
      }
      isLoading={updateFamily.isPending}
    />
  );
}
