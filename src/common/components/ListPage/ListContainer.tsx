interface ListContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ListContainer({ children, className }: ListContainerProps) {
  return <div className={`space-y-6 ${className || ''}`}>{children}</div>;
}
