import { useState, useRef, useEffect } from 'react';
import { Check, Clock, AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/components/ui/Button';
import { useTokens } from '@/hooks/useTokens';
import { RecordStatus } from '../types/record.types';

interface StatusBadgeProps {
  status: RecordStatus;
  onChange: (status: RecordStatus) => void;
  disabled?: boolean;
}

export function StatusBadge({ status, onChange, disabled }: StatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTokens();

  const statusConfig = {
    PENDING: {
      label: 'Pendente',
      icon: Clock,
      style: {
        background: t.warning.bg,
        color: t.warning.text,
        border: `1px solid ${t.warning.border}`,
      },
    },
    PAID: {
      label: 'Pago',
      icon: Check,
      style: {
        background: 'rgba(34,197,94,0.12)',
        color: '#4ade80',
        border: '1px solid rgba(34,197,94,0.2)',
      },
    },
    OVERDUE: {
      label: 'Atrasado',
      icon: AlertCircle,
      style: {
        background: t.expense.bgIcon,
        color: t.expense.text,
        border: `1px solid ${t.expense.border}`,
      },
    },
  };

  const current = statusConfig[status || 'PENDING'];
  const Icon = current.icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200',
          !disabled && 'cursor-pointer hover:opacity-80',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        style={current.style}
      >
        <Icon size={12} />
        <span>{current.label}</span>
        {!disabled && (
          <ChevronDown size={11} className={cn('transition-transform', isOpen && 'rotate-180')} />
        )}
      </button>

      {isOpen && !disabled && (
        <div
          className="absolute z-50 mt-1.5 w-36 rounded-xl py-1.5 overflow-hidden"
          style={{
            background: t.bg.card,
            border: `1px solid ${t.border.default}`,
            boxShadow: t.shadow.drop,
          }}
        >
          {(Object.keys(statusConfig) as RecordStatus[]).map((key) => {
            const cfg = statusConfig[key];
            const StatusIcon = cfg.icon;
            const isSelected = key === status;
            return (
              <button
                key={key}
                onClick={() => { onChange(key); setIsOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors duration-150"
                style={{
                  color: cfg.style.color,
                  background: isSelected ? cfg.style.background : 'transparent',
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = t.bg.cardHover; }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <StatusIcon size={13} />
                <span>{cfg.label}</span>
                {isSelected && <Check size={11} className="ml-auto" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
