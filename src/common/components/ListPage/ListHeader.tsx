import { AddButton } from '../Button';

interface ListHeaderProps {
  title: string;
  description?: string;
  addButtonText?: string;
  onAdd?: () => void;
  showAddButton?: boolean;
}

export function ListHeader({
  title,
  description,
  addButtonText = 'Novo',
  onAdd,
  showAddButton = true,
}: ListHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-2xl font-bold text-primary-800">{title}</h2>
        {description && <p className="text-primary-500 mt-1">{description}</p>}
      </div>
      {showAddButton && onAdd && <AddButton onClick={onAdd} text={addButtonText} />}
    </div>
  );
}
