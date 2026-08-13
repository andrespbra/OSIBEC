import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ServiceListView } from './components/service/ServiceListView';
import { FleetMapView } from './components/map/FleetMapView';
import { DriverAppView } from './components/driver/DriverAppView';
import { ClientPortalView } from './components/client/ClientPortalView';
import { ClientsListView } from './components/clients/ClientsListView';
import { DriversListView } from './components/drivers/DriversListView';
import { VehiclesListView } from './components/vehicles/VehiclesListView';
import { FinancialView } from './components/financial/FinancialView';
import { ReportsView } from './components/reports/ReportsView';
import { AutomationsView } from './components/automations/AutomationsView';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { UsersManagementView } from './components/users/UsersManagementView';
import { PermissionsView } from './components/settings/PermissionsView';
import { SupabaseVercelConfigView } from './components/settings/SupabaseVercelConfigView';
import { NewServiceModal } from './components/service/NewServiceModal';
import { LoginView } from './components/auth/LoginView';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, isNewServiceModalOpen, editingService, currentUser, toasts, removeToast } = useApp();

  if (!currentUser) {
    return <LoginView />;
  }

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'services':
        return <ServiceListView />;
      case 'map':
        return <FleetMapView />;
      case 'driver-app':
      case 'driver_pwa':
        return <DriverAppView />;
      case 'client-portal':
      case 'client_portal':
        return <ClientPortalView />;
      case 'clients':
        return <ClientsListView />;
      case 'drivers':
        return <DriversListView />;
      case 'vehicles':
        return <VehiclesListView />;
      case 'financial':
        return <FinancialView />;
      case 'reports':
        return <ReportsView />;
      case 'automations':
        return <AutomationsView />;
      case 'users':
        return <UsersManagementView />;
      case 'audit':
        return <AuditLogsView />;
      case 'permissions':
        return <PermissionsView />;
      case 'supabase-vercel':
        return <SupabaseVercelConfigView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased transition-colors duration-200">
      
      {/* Header */}
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-7xl mx-auto">
            {renderCurrentTab()}
          </div>
        </main>
      </div>

      {/* Global Toast Notifications Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl border max-w-md animate-in slide-in-from-right duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/40'
                : toast.type === 'warning'
                ? 'bg-amber-950/90 text-amber-100 border-amber-500/40'
                : toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-100 border-rose-500/40'
                : 'bg-zinc-900/90 text-white border-zinc-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />}
            {toast.type === 'info' && <Info className="h-5 w-5 text-purple-400 shrink-0" />}
            
            <div className="flex-1">
              <h4 className="text-xs font-black">{toast.title}</h4>
              <p className="text-[11px] opacity-90 mt-0.5">{toast.description}</p>
            </div>

            <button onClick={() => removeToast(toast.id)} className="p-1 hover:opacity-75">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* New Service / Edit Service Quick Dispatch Modal */}
      {(isNewServiceModalOpen || Boolean(editingService)) && <NewServiceModal />}

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
