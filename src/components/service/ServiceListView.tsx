import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PackageCheck, Search, Filter, LayoutGrid, List, Plus, 
  Clock, MapPin, Truck, ChevronRight, Eye, CheckCircle2, Zap, Share2 
} from 'lucide-react';
import { ServiceOrder, ServiceStatus, VehicleType } from '../../types';
import { ServiceDetailModal } from './ServiceDetailModal';

export const ServiceListView: React.FC = () => {
  const { services, setIsNewServiceModalOpen, updateServiceStatus } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<string>('all');
  const [detailService, setDetailService] = useState<ServiceOrder | null>(null);

  // Filter services
  const filteredServices = services.filter(s => {
    const matchesSearch = 
      s.osNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.origin.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.destination.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.driverName && s.driverName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatusFilter === 'all' || s.status === selectedStatusFilter;
    const matchesVehicle = selectedVehicleFilter === 'all' || s.vehicleType === selectedVehicleFilter;

    return matchesSearch && matchesStatus && matchesVehicle;
  });

  // Kanban Columns
  const kanbanColumns: { id: ServiceStatus; title: string; color: string }[] = [
    { id: 'aguardando', title: 'Aguardando Aceite', color: 'border-zinc-400 bg-zinc-500/10 text-zinc-400' },
    { id: 'despachado', title: 'Despachado', color: 'border-blue-500 bg-blue-500/10 text-blue-500' },
    { id: 'aceito', title: 'Motorista Aceitou', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-500' },
    { id: 'em_deslocamento', title: 'Em Deslocamento', color: 'border-amber-500 bg-amber-500/10 text-amber-500' },
    { id: 'coletado', title: 'Coletado', color: 'border-yellow-500 bg-yellow-500/10 text-yellow-500' },
    { id: 'em_transito', title: 'Em Trânsito', color: 'border-orange-500 bg-orange-500/10 text-orange-500' },
    { id: 'entregue', title: 'Entregue / Concluído', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-500' },
    { id: 'finalizado', title: 'Finalizado', color: 'border-purple-500 bg-purple-500/10 text-purple-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Gestão de Serviços de Transporte
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              {filteredServices.length} Ordens
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Controle visual Kanban ou Tabela detalhada das ordens de serviço (OS) ativas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle View Mode */}
          <div className="flex items-center p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'kanban' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'table' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Tabela</span>
            </button>
          </div>

          <button
            onClick={() => setIsNewServiceModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:brightness-110 text-white text-xs font-extrabold shadow-lg shadow-purple-500/25 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>NOVO SERVIÇO</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por OS, cliente, destino, motorista..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 text-xs font-semibold rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
          >
            <option value="all">Todos os Status...</option>
            <option value="aguardando">Aguardando Aceite</option>
            <option value="despachado">Despachado</option>
            <option value="em_transito">Em Trânsito</option>
            <option value="entregue">Entregue / Concluído</option>
            <option value="finalizado">Finalizado</option>
          </select>
        </div>

        <div>
          <select
            value={selectedVehicleFilter}
            onChange={e => setSelectedVehicleFilter(e.target.value)}
            className="w-full px-3 py-2.5 text-xs font-semibold rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
          >
            <option value="all">Todos os Veículos...</option>
            <option value="moto">Moto</option>
            <option value="carro">Carro</option>
            <option value="utilitario">Utilitário (HR / Fiorino)</option>
            <option value="van">Van (Sprinter)</option>
            <option value="caminhao">Caminhão</option>
          </select>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-6">
          {kanbanColumns.map(col => {
            const columnServices = filteredServices.filter(s => s.status === col.id);

            return (
              <div key={col.id} className="w-80 flex-shrink-0 flex flex-col rounded-3xl bg-zinc-100/70 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-3 min-h-[500px]">
                
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full border ${col.color}`}>
                      {col.title}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-zinc-500">{columnServices.length}</span>
                </div>

                {/* Column Cards */}
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {columnServices.length === 0 ? (
                    <div className="p-8 text-center text-xs text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                      Nenhum serviço nesta fase
                    </div>
                  ) : (
                    columnServices.map(s => (
                      <div
                        key={s.id}
                        onClick={() => setDetailService(s)}
                        className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-lg hover:border-purple-500/50 transition-all cursor-pointer space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 font-mono">
                            {s.osNumber}
                          </span>
                          <span className="text-[10px] font-bold uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-600 dark:text-zinc-300">
                            {s.vehicleType}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">{s.clientName}</p>
                          <p className="text-[11px] text-zinc-500 truncate mt-0.5">📍 {s.destination.address}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px]">
                          <span className="font-bold text-amber-500">R$ {s.priceCharged.toFixed(2)}</span>
                          <span className="text-zinc-400">{s.driverName || 'Sem motorista'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* TABLE LIST VIEW */}
      {viewMode === 'table' && (
        <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="p-4">OS Número</th>
                  <th className="p-4">Cliente / Solicitante</th>
                  <th className="p-4">Origem & Destino</th>
                  <th className="p-4">Veículo</th>
                  <th className="p-4">Motorista Alocado</th>
                  <th className="p-4">Valor Cobrado</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
                {filteredServices.map(s => (
                  <tr key={s.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-bold font-mono text-purple-600 dark:text-purple-400">
                      {s.osNumber}
                    </td>
                    <td className="p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      {s.clientName}
                      <span className="block text-[10px] text-zinc-500 font-normal">{s.solicitante}</span>
                    </td>
                    <td className="p-4 max-w-xs truncate text-zinc-600 dark:text-zinc-400">
                      <span className="text-emerald-500 font-bold">Origem:</span> {s.origin.address}
                      <span className="block text-purple-500 font-bold truncate">Destino: {s.destination.address}</span>
                    </td>
                    <td className="p-4 uppercase font-bold text-[10px] text-zinc-500">
                      {s.vehicleType}
                    </td>
                    <td className="p-4 font-semibold text-zinc-800 dark:text-zinc-200">
                      {s.driverName || 'Fila de Espera'}
                    </td>
                    <td className="p-4 font-extrabold text-amber-500">
                      R$ {s.priceCharged.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full uppercase bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                        {s.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setDetailService(s)}
                        className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 hover:bg-purple-100 transition-colors"
                        title="Ver Detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {detailService && (
        <ServiceDetailModal
          service={detailService}
          onClose={() => setDetailService(null)}
        />
      )}

    </div>
  );
};
