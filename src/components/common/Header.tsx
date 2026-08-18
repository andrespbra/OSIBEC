import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Zap, Plus, Sun, Moon, Bell, Search, Shield, UserCheck, 
  Truck, DollarSign, Activity, Users, ChevronDown, CheckCircle2, AlertTriangle, X, LogOut,
  RefreshCw, Wifi, WifiOff
} from 'lucide-react';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { 
    currentUser, setRole, theme, toggleTheme, 
    setIsNewServiceModalOpen, services, drivers, toasts, removeToast, logout,
    isLiveSyncConnected, lastSyncTime, manualRefreshData
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await manualRefreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const rolesList: { role: UserRole; label: string; icon: any; color: string }[] = [
    { role: 'admin', label: 'Administrador (Acesso Total)', icon: Shield, color: 'text-purple-500 bg-purple-500/10' },
    { role: 'operacional', label: 'Operacional (Despacho Fast)', icon: Zap, color: 'text-amber-500 bg-amber-500/10' },
    { role: 'financeiro', label: 'Financeiro (DRE & Contas)', icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10' },
    { role: 'supervisor', label: 'Supervisor (Gestão & Frota)', icon: Activity, color: 'text-blue-500 bg-blue-500/10' },
    { role: 'motorista', label: 'Motorista (App PWA Mobile)', icon: Truck, color: 'text-indigo-500 bg-indigo-500/10' },
    { role: 'cliente', label: 'Cliente (Portal do Cliente)', icon: Users, color: 'text-pink-500 bg-pink-500/10' },
  ];

  const currentRoleObj = rolesList.find(r => r.role === currentUser.role) || rolesList[0];

  const activeServicesCount = services.filter(s => s.status !== 'finalizado' && s.status !== 'cancelado').length;
  const onlineDriversCount = drivers.filter(d => d.status !== 'offline').length;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* Left: Brand & Mobile Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-amber-500 text-white shadow-md shadow-purple-500/20 font-black text-xl tracking-tighter">
            IB
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white dark:border-zinc-950" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-600 via-purple-500 to-amber-500 bg-clip-text text-transparent dark:from-purple-400 dark:via-indigo-300 dark:to-amber-300">
                IBEC FLOW
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-purple-500/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-300 rounded-full border border-purple-500/20">
                SaaS TMS v3.0
              </span>
            </div>
            <p className="hidden md:block text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Sistema Inteligente de Gestão de Transportes
            </p>
          </div>
        </div>

        {/* Center: Search & Quick Status Badges */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Buscar OS, cliente, placa, motorista..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-zinc-800 dark:text-zinc-200"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span>{activeServicesCount} em Andamento</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{onlineDriversCount} Motoristas Online</span>
          </div>

          {/* Real-time Multi-Device Sync Indicator */}
          <div 
            title={`Sincronização Online em Tempo Real ativa. Última atualização: ${lastSyncTime}`}
            className={`flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-all ${
              isLiveSyncConnected 
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300' 
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300'
            }`}
          >
            {isLiveSyncConnected ? (
              <Wifi className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
            ) : (
              <WifiOff className="h-3.5 w-3.5 text-amber-500" />
            )}
            <span className="hidden xl:inline">
              {isLiveSyncConnected ? 'Online (Tempo Real)' : 'Reconectando...'}
            </span>
            <button 
              onClick={handleRefresh}
              title="Forçar sincronização com a nuvem"
              className="p-0.5 rounded hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right Actions: Quick Dispatch Button + Role Switcher + Dark Mode + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Dispatch Button (<20s) */}
          <button
            id="btn-quick-new-service"
            onClick={() => setIsNewServiceModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-95 transition-all duration-200 cursor-pointer"
            title="Cadastrar Serviço em menos de 20 segundos"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">NOVO SERVIÇO</span>
            <span className="hidden xl:inline text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-normal">
              &lt;20s
            </span>
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${currentRoleObj.color} border-current/20 hover:brightness-110`}
            >
              <currentRoleObj.icon className="h-4 w-4" />
              <span className="hidden md:inline capitalize">{currentUser.role}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Simular Perfil de Acesso
                </div>
                {rolesList.map(item => (
                  <button
                    key={item.role}
                    onClick={() => {
                      setRole(item.role);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                      currentUser.role === item.role 
                        ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 font-bold' 
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <item.icon className="h-4 w-4 text-purple-500" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Alternar Tema Claro/Escuro"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-purple-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {toasts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Notificações em Tempo Real</span>
                  <span className="text-[10px] bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">
                    {toasts.length} Novas
                  </span>
                </div>

                {toasts.length === 0 ? (
                  <p className="py-6 text-center text-xs text-zinc-400">Nenhuma notificação pendente.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {toasts.map(t => (
                      <div key={t.id} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{t.title}</p>
                          {t.description && <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{t.description}</p>}
                        </div>
                        <button onClick={() => removeToast(t.id)} className="text-zinc-400 hover:text-zinc-600">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Avatar & Logout */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-300 font-bold flex items-center justify-center border border-purple-500/30 text-xs">
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{currentUser.name}</p>
              <p className="text-[10px] text-zinc-400 uppercase font-semibold">@{currentUser.username || currentUser.role}</p>
            </div>
            <button
              onClick={logout}
              title="Sair do Sistema"
              className="p-1.5 rounded-xl hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors ml-1 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
