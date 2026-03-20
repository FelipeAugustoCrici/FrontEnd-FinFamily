import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTokens } from '@/hooks/useTokens';
import { useCalendar } from './hooks/useCalendar';
import { MonthlySummaryCards } from './components/MonthlySummaryCards';
import { CalendarGrid } from './components/CalendarGrid';
import { CalendarFilters } from './components/CalendarFilters';
import { DayDetailModal } from './components/DayDetailModal';
import type { CalendarFilter, CalendarDaySummary } from './types/calendar.types';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function FinancialCalendar() {
  const now = new Date();
  const t = useTokens();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [filter, setFilter] = useState<CalendarFilter>({ type: 'all', status: 'all' });
  const [selectedDay, setSelectedDay] = useState<CalendarDaySummary | null>(null);

  const { data, isLoading } = useCalendar(month, year, filter);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const goToday = () => {
    setMonth(now.getMonth() + 1);
    setYear(now.getFullYear());
  };

  const handleDayClick = (dateKey: string) => {
    const day = data?.days.find((d) => d.date === dateKey);
    if (day) setSelectedDay(day);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        showPeriod
        month={month}
        year={year}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />

      {}
      <CalendarFilters filter={filter} onChange={setFilter} />

      {}
      {data?.summary && <MonthlySummaryCards summary={data.summary} />}

      {}
      {isLoading ? (
        <div style={{
          background: t.bg.card,
          border: `1px solid ${t.border.default}`,
          borderRadius: 18,
          padding: 16,
          boxShadow: t.shadow.card,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} height={12} borderRadius={4} />
            ))}
          </div>
          {}
          {Array.from({ length: 5 }).map((_, row) => (
            <div key={row} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
              {Array.from({ length: 7 }).map((_, col) => (
                <Skeleton key={col} height={72} borderRadius={10} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-primary-100 p-4 shadow-sm">
          <CalendarGrid
            month={month}
            year={year}
            days={data?.days ?? []}
            onDayClick={handleDayClick}
          />
        </div>
      )}

      {}
      <DayDetailModal daySummary={selectedDay} onClose={() => setSelectedDay(null)} />
    </div>
  );
}
