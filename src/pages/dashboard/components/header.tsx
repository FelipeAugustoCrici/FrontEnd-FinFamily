import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/Button';

type HeaderProps = {
  month: number;
  year: number;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
  setYear: React.Dispatch<React.SetStateAction<number>>;
};

export function Header({ month, year, setMonth, setYear }: HeaderProps) {
  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-soft border border-primary-100">
      <div>
        <h1 className="text-2xl font-bold text-primary-800">Dashboard</h1>
        <p className="text-primary-500">Resumo da saúde financeira da sua família</p>
      </div>

      <div className="flex items-center bg-primary-50 rounded-xl p-1 border border-primary-100">
        <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
          <ChevronLeft size={20} />
        </Button>

        <div className="flex items-center gap-2 px-4 min-w-40 justify-center font-bold text-primary-800">
          <Calendar size={18} className="text-primary-400" />
          <span className="capitalize">
            {new Date(year, month - 1).toLocaleString('pt-BR', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        <Button variant="ghost" size="sm" onClick={handleNextMonth}>
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
}
