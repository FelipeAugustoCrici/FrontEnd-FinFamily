import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Loader2 } from 'lucide-react';
import { cn } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
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

      {/* Filters */}
      <CalendarFilters filter={filter} onChange={setFilter} />

      {/* Summary cards */}
      {data?.summary && <MonthlySummaryCards summary={data.summary} />}

      {/* Calendar grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
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

      {/* Day detail modal */}
      <DayDetailModal daySummary={selectedDay} onClose={() => setSelectedDay(null)} />
    </div>
  );
}
