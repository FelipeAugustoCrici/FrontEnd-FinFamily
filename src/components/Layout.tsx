import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  ClipboardList,
  ListOrdered,
  LayoutDashboard,
  BarChart3,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Tags,
  Users,
  CreditCard,
  CalendarDays,
  Target,
  PiggyBank,
  ChevronDown,
  Heart,
} from 'lucide-react';
import { cn } from './ui/Button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { logout } from '@/services/logout';
import { useUserInfo, useUserFamily } from '@/hooks/useUserInfo';
import { formatLongDate } from '@/common/utils/date';
import LogoSvg from '@/common/icons/logo.svg';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ to, icon: Icon, label, active }: SidebarItemProps) => (
  <Link
    to={to}
    className={cn(
      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
      active
        ? 'bg-primary-700 text-white shadow-md'
        : 'text-primary-400 hover:bg-primary-800 hover:text-white',
    )}
  >
    <Icon
      size={20}
      className={cn(active ? 'text-white' : 'text-primary-500 group-hover:text-white')}
    />
    <span className="font-medium">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto" />}
  </Link>
);

interface SubItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

interface SidebarAccordionProps {
  icon: React.ElementType;
  label: string;
  items: SubItem[];
  isActive: boolean;
}

const SidebarAccordion = ({ icon: Icon, label, items, isActive }: SidebarAccordionProps) => {
  const [open, setOpen] = React.useState(isActive);
  const location = useLocation();

  React.useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive]);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full group',
          isActive
            ? 'bg-primary-800 text-white'
            : 'text-primary-400 hover:bg-primary-800 hover:text-white',
        )}
      >
        <Icon size={20} className={cn(isActive ? 'text-white' : 'text-primary-500 group-hover:text-white')} />
        <span className="font-medium flex-1 text-left">{label}</span>
        <ChevronDown
          size={16}
          className={cn('transition-transform duration-200', open ? 'rotate-180' : '')}
        />
      </button>

      {open && (
        <div className="ml-4 mt-1 space-y-1 border-l border-primary-700 pl-3">
          {items.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm group',
                  active
                    ? 'bg-primary-700 text-white shadow-md'
                    : 'text-primary-400 hover:bg-primary-800 hover:text-white',
                )}
              >
                <item.icon size={16} className={cn(active ? 'text-white' : 'text-primary-500 group-hover:text-white')} />
                <span className="font-medium">{item.label}</span>
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const planningSubItems: SubItem[] = [
  { to: '/planning/goals', icon: Target, label: 'Metas' },
  { to: '/planning/budgets', icon: PiggyBank, label: 'Orçamentos' },
];

export const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const { data: userInfo } = useUserInfo();
  const { data: family } = useUserFamily();
  const { isDark, toggle } = useTheme();

  const isPlanningActive = location.pathname.startsWith('/planning');

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/record', icon: ListOrdered, label: 'Lançamentos' },
    { to: '/calendar', icon: CalendarDays, label: 'Calendário' },
    { to: '/credit-cards', icon: CreditCard, label: 'Cartões' },
    { to: '/reports', icon: BarChart3, label: 'Relatórios' },
    { to: '/couple-mode', icon: Heart, label: 'Modo Casal' },
    { to: '/category', icon: Tags, label: 'Categorias' },
    { to: '/family', icon: Users, label: 'Famílias' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-primary-900 p-6 text-white fixed h-full shadow-2xl z-20">
        <div className="flex flex-col items-center gap-2 mb-10 px-2">
          <img src={LogoSvg} alt="FinFamily" className="w-16 h-16 invert" />
          <span className="text-xl font-bold tracking-tight">FinFamily AI</span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-700 scrollbar-track-transparent">
          {menuItems.slice(0, 4).map((item) => (
            <SidebarItem key={item.to} {...item} active={location.pathname === item.to} />
          ))}
          <SidebarAccordion
            icon={ClipboardList}
            label="Planejamento"
            items={planningSubItems}
            isActive={isPlanningActive}
          />
          {menuItems.slice(4).map((item) => (
            <SidebarItem key={item.to} {...item} active={location.pathname === item.to} />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-primary-800 space-y-2">
          <SidebarItem
            to="/profile"
            icon={User}
            label="Meu Perfil"
            active={location.pathname === '/profile'}
          />
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-400 hover:bg-danger-500/10 hover:text-danger-500 transition-all w-full text-left"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-primary-100 flex items-center justify-between px-6 sticky top-0 z-10">
          <button
            className="md:hidden p-2 text-primary-600"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-primary-800">
              {isPlanningActive
                ? planningSubItems.find((i) => location.pathname === i.to)?.label ?? 'Planejamento'
                : menuItems.find((item) => location.pathname === item.to || location.pathname.startsWith(item.to + '/'))?.label || 'Bem-vindo'}
            </h1>
            <p className="text-xs text-primary-500 hidden sm:block">{formatLongDate(new Date())}</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-primary-500 hover:bg-primary-100 transition-colors"
              aria-label="Alternar tema"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-primary-800">
                {userInfo?.name || 'Carregando...'}
              </span>
              <span className="text-xs text-primary-600 font-medium">
                {family?.name || 'Sem família'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-200 border-2 border-white shadow-sm flex items-center justify-center text-primary-700 font-bold">
              {userInfo?.initials || '?'}
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-primary-900/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-72 bg-primary-900 h-full p-6 animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-10 px-2 text-white">
              <div className="flex flex-col items-center gap-2">
                <img src={LogoSvg} alt="FinFamily" className="w-12 h-12 invert" />
                <span className="text-xl font-bold">FinFamily AI</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2 overflow-y-auto flex-1">
              {menuItems.slice(0, 4).map((item) => (
                <SidebarItem key={item.to} {...item} active={location.pathname === item.to} />
              ))}
              <SidebarAccordion
                icon={ClipboardList}
                label="Planejamento"
                items={planningSubItems}
                isActive={isPlanningActive}
              />
              {menuItems.slice(4).map((item) => (
                <SidebarItem key={item.to} {...item} active={location.pathname === item.to} />
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
