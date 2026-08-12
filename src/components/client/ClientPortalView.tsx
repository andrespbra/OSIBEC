import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, PackageCheck, MapPin, Download, Plus, Clock, CheckCircle2, FileText, Share2 
} from 'lucide-react';

export const ClientPortalView: React.FC = () => {
  const { clients, services, setIsNewServiceModalOpen } = useApp();
  const currentClient = clients[0]; // TechLog Express demo

  const clientServices = services.filter(s => s.clientId === currentClient.id || s.clientName.includes('TechLog'));
  const totalSpent = clientServices.reduce((sum, s) => sum + s.priceCharged, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-900/40 via-purple-900/40 to-zinc-900 border border-pink-500/20 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-500 text-white uppercase tracking-wider">
              Portal Exclusivo do Cliente
            </span>
          </div>
          <h1 className="text-2xl font-black">{currentClient.nomeFantasia}</h1>
          <p className="text-xs text-zinc-300">CNPJ: {currentClient.cnpj} • Tabela: {currentClient.tabelaPrecos}</p>
        </div>

        <button
          onClick={() => setIsNewServiceModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-pink-500 hover:bg-pink-400 text-white font-extrabold text-xs shadow-lg shadow-pink-500/30 flex items-center gap-2 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>SOLICITAR NOVA COLETA / ENTREGA</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-xs font-semibold text-zinc-400">Total de Entregas</p>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{clientServices.length}</p>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-xs font-semibold text-zinc-400">Em Andamento</p>
          <p className="text-2xl font-black text-amber-500">
            {clientServices.filter(s => s.status !== 'finalizado').length}
          </p>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-xs font-semibold text-zinc-400">Total Faturado</p>
          <p className="text-2xl font-black text-purple-500">R$ {totalSpent.toFixed(2)}</p>
        </div>
      </div>

      {/* Active Deliveries List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
          Acompanhamento das Suas Ordens de Serviço
        </h3>

        <div className="space-y-3">
          {clientServices.map(s => (
            <div key={s.id} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-xs">{s.osNumber}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300">
                    {s.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{s.destination.address}</p>
                <p className="text-[11px] text-zinc-500">Motorista: {s.driverName || 'Em Alocação'}</p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={s.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5"
                >
                  <Share2 className="h-3.5 w-3.5" /> Link Rastreio
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
