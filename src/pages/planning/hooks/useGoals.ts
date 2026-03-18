import { useQuery } from '@tanstack/react-query';
import { planningService } from '../services/planning.service';
import { useUserFamily } from '@/hooks/useUserInfo';

export function useGoals() {
  const { data: family } = useUserFamily();
  const familyId = family?.id;

  return useQuery({
    queryKey: ['goals', familyId],
    queryFn: () => planningService.getGoals(familyId),
    enabled: !!familyId,
  });
}
