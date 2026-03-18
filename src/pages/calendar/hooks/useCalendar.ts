import { useQuery } from '@tanstack/react-query';
import { useUserFamily } from '@/hooks/useUserInfo';
import { calendarService } from '../services/calendar.service';
import type { CalendarFilter } from '../types/calendar.types';

export function useCalendar(month: number, year: number, filter?: CalendarFilter) {
  const { data: family } = useUserFamily();
  const familyId = family?.id;

  return useQuery({
    queryKey: [
      'calendar',
      month,
      year,
      familyId,
      filter?.type ?? 'all',
      filter?.status ?? 'all',
      filter?.categoryId ?? '',
      filter?.personId ?? '',
    ],
    queryFn: () => calendarService.getMonthEvents(month, year, familyId!, filter),
    enabled: !!familyId,
    staleTime: 0,
    retry: false,
  });
}

export function useUpcoming7Days() {
  const { data: family } = useUserFamily();
  const familyId = family?.id;

  return useQuery({
    queryKey: ['calendar-upcoming', familyId],
    queryFn: () => calendarService.getUpcoming7Days(familyId!),
    enabled: !!familyId,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
