import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, PackageCheck, Map, Users, Truck, Car, 
  DollarSign, BarChart3, Bot, ShieldCheck, KeyRound, Smartphone, 
  Building2, RefreshCw, ChevronRight, Zap, Database
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, resetToDefaults, setIsNewServiceModalOpen } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'operacional', 'financeiro', 'supervisor'] },
    { id: 'services', label: 'Serviços & OS', icon: PackageCheck, roles: ['admin', 'operacional', 'financeiro', 'supervisor'], badge: 'Novo' },
    { id: 'map', label: 'Mapa em Tempo Real', icon: Map, roles: ['admin', 'operacional', 'supervisor'] },
    { id: 'clients', label: 'Clientes', icon: Users, roles: ['admin', 'operacional', 'financeiro', 'supervisor'] },
    { id: 'drivers', label: 'Motoristas', icon: Truck, roles: ['admin', 'operacional', 'supervisor'] },
    { id: 'vehicles', label: 'Veículos & Frota', icon: Car, roles: ['admin', 'operacional', 'supervisor'] },
    { id: 'financial', label: 'Financeiro & DRE', icon: DollarSign, roles: ['admin', 'financeiro'] },
    { id: 'reports', label: 'Relatórios & BI', icon: BarChart3, roles: ['admin', 'financeiro', 'supervisor'] },
    { id: 'automations', label: 'Automações & WhatsApp', icon: Bot, roles: ['admin', 'operacional'] },
    { id: 'users', label: 'Funcionários & Perfis', icon: Users, roles: ['admin'] },
    { id: 'audit', label: 'Auditoria & Logs', icon: ShieldCheck, roles: ['admin'] },
    { id: 'permissions', label: 'Permissões', icon: KeyRound, roles: ['admin'] },
    { id: 'supabase-vercel', label: 'Supabase & Vercel', icon: Database, roles: ['admin'] },
  ];

  const appModeItems = [
    { id: 'driver-app', label: 'Painel Motorista (PWA)', icon: Smartphone, highlight: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    { id: 'client-portal', label: 'Portal do Cliente', icon: Building2, highlight: 'bg-pink-500/10 text-pink-400 border-pink-500/20' }
  ];

  // Filter items based on current role
  const visibleNav = navItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 min-h-[calc(100vh-4rem)] p-4 transition-colors">
      
      {/* Quick Fast-Action Header Card */}
      <div className="mb-4 p-3 rounded-2xl bg-gradient-to-br from-purple-900/10 via-indigo-900/10 to-amber-900/10 dark:from-purple-900/30 dark:to-zinc-900 border border-purple-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-500" /> Dispatch Turbo
          </span>
          <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
            &lt; 20s
          </span>
        </div>
        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mb-3">
          Cadastre serviços rapidamente com autopreenchimento inteligente.
        </p>
        <button
          onClick={() => setIsNewServiceModalOpen(true)}
          className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-98"
        >
          <span>Cadastrar Serviço</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Menu Operacional
        </div>

        {visibleNav.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-purple-500/80 dark:text-purple-400/80'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && !isActive && (
                <span className="text-[10px] bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 font-bold px-1.5 py-0.5 rounded-md">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Portals & Apps Section */}
        <div className="pt-4 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Modos de Experiência
        </div>

        {appModeItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-bold border-transparent'
                  : `${item.highlight} hover:brightness-125`
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer System Status & Reset Demo */}
      <div className="pt-4 mt-auto border-t border-zinc-200 dark:border-zinc-800 space-y-2">
        <div className="flex items-center justify-between px-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Servidor Online
          </span>
          <span className="font-mono text-[10px] text-zinc-400">Cloud Run</span>
        </div>

        <button
          onClick={resetToDefaults}
          className="w-full flex items-center justify-center gap-2 py-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-xl transition-colors border border-dashed border-zinc-200 dark:border-zinc-800"
          title="Restaurar dados iniciais de demonstração"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Restaurar Dados Demo</span>
        </button>
      </div>

    </aside>
  );
};
