import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AddButtonProps {
  onClick: () => void;
  text?: string;
}

export function AddButton({ onClick, text = 'Novo' }: AddButtonProps) {
  return (
    <Button onClick={onClick}>
      <Plus className="w-4 h-4 mr-2" />
      {text}
    </Button>
  );
}
