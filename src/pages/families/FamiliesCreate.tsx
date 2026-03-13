import { useNavigate } from 'react-router-dom';
import { FamilyForm } from './components/FamilyForm';
import { useCreateFamily } from './hooks/useCreateFamily';

export function FamiliesCreate() {
  const navigate = useNavigate();
  const createFamily = useCreateFamily();

  return (
    <FamilyForm
      onSubmit={(data) =>
        createFamily.mutate(data, {
          onSuccess: () => navigate('/family'),
        })
      }
      isLoading={createFamily.isPending}
    />
  );
}
