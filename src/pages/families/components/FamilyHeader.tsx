import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

export function FamilyHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-primary-800">Famílias</h2>
        <p className="text-primary-500">Gerencie todas as suas famílias</p>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => window.print()}>
          <Download size={18} className="mr-2" /> Exportar
        </Button>
        <Button onClick={onCreate}>Nova Família</Button>
      </div>
    </div>
  );
}
