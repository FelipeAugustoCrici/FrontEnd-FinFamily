interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function TableRow({ children, onClick }: TableRowProps) {
  return (
    <tr
      className={`hover:bg-primary-50/50 transition-colors group ${onClick ? 'cursor-pointer' : ''}`.trim()}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}
