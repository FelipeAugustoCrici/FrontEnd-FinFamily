import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  BarChart3,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Tags,
  Users,
} from 'lucide-react';
import { cn } from './ui/Button';
import { logout } from '@/services/logout';
import { useUserInfo, useUserFamily } from '@/hooks/useUserInfo';
import { formatLongDate } from '@/common/utils/date';

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

export const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const { data: userInfo } = useUserInfo();
  const { data: family } = useUserFamily();

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/record', icon: ListOrdered, label: 'Lançamentos' },
    { to: '/family', icon: Users, label: 'Famílias' },
    { to: '/category', icon: Tags, label: 'Categorias' },
    { to: '/reports', icon: BarChart3, label: 'Relatórios' },
    { to: '/planning', icon: PlusCircle, label: 'Planejamento' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-primary-900 p-6 text-white fixed h-full shadow-2xl z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-success-500 rounded-xl flex items-center justify-center shadow-lg shadow-success-500/20">
            <BarChart3 className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">FinFamily AI</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem key={item.to} {...item} active={location.pathname === item.to} />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-primary-800 space-y-2">
          <SidebarItem
            to="/perfil"
            icon={User}
            label="Meu Perfil"
            active={location.pathname === '/perfil'}
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
              {menuItems.find((item) => item.to === location.pathname)?.label || 'Bem-vindo'}
            </h1>
            <p className="text-xs text-primary-500 hidden sm:block">{formatLongDate(new Date())}</p>
          </div>

          <div className="flex items-center gap-4">
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
              <div className="flex items-center gap-3">
                <BarChart3 className="text-success-500" size={24} />
                <span className="text-xl font-bold">FinanceFlow</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <SidebarItem key={item.to} {...item} active={location.pathname === item.to} />
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
