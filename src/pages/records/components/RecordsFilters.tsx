import { Calendar, Search } from 'lucide-react';
import _ from 'lodash';
import { RecordStatus } from '../types/record.types';

type RecordsFiltersProps = {
  month: number;
  year: number;
  search: string;
  status: RecordStatus | 'ALL';
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: RecordStatus | 'ALL') => void;
};

export function RecordsFilters({
  month,
  year,
  search,
  status,
  onMonthChange,
  onYearChange,
  onSearchChange,
  onStatusChange,
}: RecordsFiltersProps) {
  const now = new Date();

  return (
    <div className="p-4 border-b border-primary-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-primary-50/30">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
        <input
          type="text"
          placeholder="Buscar por descrição..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-primary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <div className="flex items-center bg-white border border-primary-200 rounded-lg px-3 py-2 gap-2">
          <Calendar size={16} className="text-primary-400" />

          <select
            value={month}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="text-sm focus:outline-none bg-transparent"
          >
            {_.range(12).map((i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="text-sm focus:outline-none bg-transparent"
          >
            {_.range(now.getFullYear() - 1, now.getFullYear() + 3).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as RecordStatus | 'ALL')}
          className="text-sm px-3 py-2 bg-white border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        >
          <option value="ALL">Todos os status</option>
          <option value="PENDING">Pendente</option>
          <option value="PAID">Pago</option>
          <option value="OVERDUE">Atrasado</option>
        </select>
      </div>
    </div>
  );
}
