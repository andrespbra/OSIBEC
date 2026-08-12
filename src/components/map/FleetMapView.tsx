import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Truck, Navigation, Phone, MessageSquare, MapPin, 
  CheckCircle2, Clock, Zap, Search, Shield
} from 'lucide-react';
import { Driver } from '../../types';

export const FleetMapView: React.FC = () => {
  const { drivers, services } = useApp();
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(drivers[0] || null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDrivers = drivers.filter(d => statusFilter === 'all' || d.status === statusFilter);

  const activeOS = selectedDriver?.activeServiceId 
    ? services.find(s => s.id === selectedDriver.activeServiceId) 
    : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Mapa Rastreamento ao Vivo
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {drivers.filter(d => d.status !== 'offline').length} Ativos
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Localização em tempo real de motoristas, entregas e rotas em andamento.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
          >
            <option value="all">Todos os Status...</option>
            <option value="em_atendimento">Em Atendimento</option>
            <option value="disponivel">Disponível</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Interactive Simulated Leaflet/OSM Radar Map + Driver Sidebar Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        
        {/* Interactive Map Visualizer Canvas */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-xl flex flex-col">
          
          {/* Simulated Dark Map Canvas Background with Grid & Markers */}
          <div className="relative w-full h-full bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] bg-slate-950 flex items-center justify-center p-6">
            
            {/* Map Decorative Grid Lines */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Map Header Overlay Badge */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white backdrop-blur-md flex items-center gap-2 text-xs font-bold">
              <Navigation className="h-4 w-4 text-purple-400 animate-spin" />
              <span>Região Metropolitana de São Paulo - Radar Ativo</span>
            </div>

            {/* Interactive Driver Pins rendered on Simulated Map Stage */}
            <div className="relative w-full h-full max-w-xl max-h-96 border border-purple-500/20 rounded-3xl bg-zinc-900/40 p-6 flex flex-wrap items-center justify-around gap-6">
              {filteredDrivers.map((drv, idx) => {
                const isSelected = selectedDriver?.id === drv.id;
                
                return (
                  <button
                    key={drv.id}
                    onClick={() => setSelectedDriver(drv)}
                    className={`group relative flex flex-col items-center transition-all duration-300 ${
                      isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                    }`}
                  >
                    {/* Animated Ping Wave */}
                    <span className={`absolute -top-1 w-10 h-10 rounded-full animate-ping opacity-30 ${
                      drv.status === 'em_atendimento' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />

                    {/* Custom Driver Avatar Pin */}
                    <div className={`relative w-12 h-12 rounded-2xl p-0.5 border-2 shadow-2xl transition-all ${
                      isSelected ? 'border-purple-500 ring-4 ring-purple-500/40' : 'border-zinc-700'
                    } bg-zinc-900`}>
                      <img src={drv.foto} alt={drv.nome} className="w-full h-full rounded-xl object-cover" />
                      <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-950 flex items-center justify-center text-[8px] font-bold text-white ${
                        drv.status === 'em_atendimento' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}>
                        ✓
                      </span>
                    </div>

                    {/* Floating Pin Tooltip */}
                    <div className="mt-1 px-2 py-0.5 rounded-lg bg-zinc-900/90 border border-zinc-700 text-[10px] font-bold text-white whitespace-nowrap shadow-lg">
                      {drv.nome.split(' ')[0]} ({drv.modelo.split(' ')[0]})
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Route Polyline Simulation */}
            {activeOS && (
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-purple-950/80 border border-purple-500/40 backdrop-blur-md text-white text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-zinc-950 font-mono font-bold">
                    {activeOS.osNumber}
                  </span>
                  <span className="font-semibold">{activeOS.origin.address.split(',')[0]} ➔ {activeOS.destination.address.split(',')[0]}</span>
                </div>
                <span className="font-bold text-emerald-400">{activeOS.distanceKm} km ({activeOS.estimatedTimeMin} min)</span>
              </div>
            )}

          </div>

        </div>

        {/* Selected Driver Detailed Sidebar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4 overflow-y-auto">
          {selectedDriver ? (
            <div className="space-y-4">
              
              {/* Driver Profile Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <img src={selectedDriver.foto} alt={selectedDriver.nome} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/30" />
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">{selectedDriver.nome}</h3>
                  <p className="text-xs text-zinc-500 font-medium">{selectedDriver.modelo} ({selectedDriver.placa})</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                    selectedDriver.status === 'em_atendimento' 
                      ? 'bg-amber-500/10 text-amber-500' 
                      : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {selectedDriver.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Location & Battery */}
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-xs space-y-2">
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-semibold">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  <span>{selectedDriver.location.address}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-200/50 dark:border-zinc-700/50">
                  <span>Última atualização: {selectedDriver.location.lastUpdate}</span>
                  <span className="font-bold text-emerald-500">GPS Sinal Forte</span>
                </div>
              </div>

              {/* Active Service Card */}
              {activeOS ? (
                <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-300">Serviço em Andamento</span>
                    <span className="text-xs font-mono font-bold text-amber-500">{activeOS.osNumber}</span>
                  </div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{activeOS.clientName}</p>
                  <p className="text-[11px] text-zinc-500 truncate">Destino: {activeOS.destination.address}</p>
                </div>
              ) : (
                <p className="text-xs text-zinc-400 text-center py-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl">
                  Nenhum serviço atrelado no momento. Motorista disponível.
                </p>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={`tel:${selectedDriver.telefone}`}
                  className="py-2 px-3 text-xs font-bold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" /> Chamar
                </a>
                <a
                  href={`https://api.whatsapp.com/send?phone=${selectedDriver.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </div>

            </div>
          ) : (
            <p className="text-xs text-zinc-400 text-center py-12">Selecione um motorista no mapa.</p>
          )}
        </div>

      </div>

    </div>
  );
};
