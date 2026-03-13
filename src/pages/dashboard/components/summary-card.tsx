import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { twMerge } from 'tailwind-merge';

type SummaryCardProps = {
  title: string;
  value: number;
  type: 'income' | 'expense' | 'total' | 'balance';
  icon: React.ComponentType<{ size: number }>;
  change?: number;
};

export function SummaryCard({ title, value, type, icon: Icon, change }: SummaryCardProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={twMerge(
            'p-2 rounded-lg',
            'text-primary-500 bg-primary-50',
            type === 'income' && 'text-success-500 bg-success-50',
            type === 'expense' && 'text-danger-500 bg-danger-50',
          )}
        >
          <Icon size={24} />
        </div>

        {change !== undefined && (
          <Badge variant={change >= 0 ? 'success' : 'danger'}>
            {change >= 0 ? '+' : ''}
            {formatCurrency(change)}
          </Badge>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-primary-500">{title}</p>
        <h2
          className={twMerge(
            'text-2xl font-bold mt-1',
            'text-primary-800',
            type === 'income' && 'text-success-600',
            type === 'expense' && 'text-danger-600',
          )}
        >
          {formatCurrency(value)}
        </h2>
      </div>
    </Card>
  );
}
