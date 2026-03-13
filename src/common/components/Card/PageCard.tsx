import { Card } from '@/components/ui/Card';
import { cn } from '@/components/ui/Button';

interface PageCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function PageCard({ children, className, title, description }: PageCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)} title={title} description={description}>
      {children}
    </Card>
  );
}
