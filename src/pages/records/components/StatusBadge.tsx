import { useState, useRef, useEffect } from 'react';
import { Check, Clock, AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/components/ui/Button';
import { RecordStatus } from '../types/record.types';

interface StatusBadgeProps {
  status: RecordStatus;
  onChange: (status: RecordStatus) => void;
  disabled?: boolean;
}

const statusConfig = {
  PENDING: {
    label: 'Pendente',
    icon: Clock,
    bgColor: 'bg-warning-50',
    textColor: 'text-warning-700',
    borderColor: 'border-warning-200',
    hoverBg: 'hover:bg-warning-100',
  },
  PAID: {
    label: 'Pago',
    icon: Check,
    bgColor: 'bg-success-50',
    textColor: 'text-success-700',
    borderColor: 'border-success-200',
    hoverBg: 'hover:bg-success-100',
  },
  OVERDUE: {
    label: 'Atrasado',
    icon: AlertCircle,
    bgColor: 'bg-danger-50',
    textColor: 'text-danger-700',
    borderColor: 'border-danger-200',
    hoverBg: 'hover:bg-danger-100',
  },
};

export function StatusBadge({ status, onChange, disabled }: StatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentStatus = statusConfig[status || 'PENDING'];
  const Icon = currentStatus.icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleStatusChange = (newStatus: RecordStatus) => {
    onChange(newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
          currentStatus.bgColor,
          currentStatus.textColor,
          currentStatus.borderColor,
          !disabled && currentStatus.hoverBg,
          !disabled && 'cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <Icon size={14} />
        <span>{currentStatus.label}</span>
        {!disabled && (
          <ChevronDown size={12} className={cn('transition-transform', isOpen && 'rotate-180')} />
        )}
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-36 bg-white rounded-lg shadow-lg border border-primary-100 py-1">
          {(Object.keys(statusConfig) as RecordStatus[]).map((statusKey) => {
            const config = statusConfig[statusKey];
            const StatusIcon = config.icon;
            const isSelected = statusKey === status;

            return (
              <button
                key={statusKey}
                onClick={() => handleStatusChange(statusKey)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors',
                  config.textColor,
                  config.hoverBg,
                  isSelected && config.bgColor,
                )}
              >
                <StatusIcon size={14} />
                <span>{config.label}</span>
                {isSelected && <Check size={12} className="ml-auto" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
