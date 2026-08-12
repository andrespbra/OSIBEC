import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PackageCheck, Clock, CheckCircle2, AlertCircle, XCircle, 
  DollarSign, TrendingUp, Truck, Car, Users, Zap, Shield, ChevronRight, Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';

export const DashboardView: React.FC = () => {
  const { services, drivers, vehicles, clients, financial, setActiveTab, setIsNewServiceModalOpen, auditLogs } = useApp();

  // Metrics calculation
  const todayStr = new Date().toISOString().split('T')[0];

  const servicesToday = services.filter(s => s.date === todayStr);
  const inProgress = services.filter(s => s.status === 'em_transito' || s.status === 'coletado' || s.status === 'em_deslocamento' || s.status === 'aceito');
  const completed = services.filter(s => s.status === 'entregue' || s.status === 'finalizado');
  const pending = services.filter(s => s.status === 'aguardando' || s.status === 'despachado');
  const cancelled = services.filter(s => s.status === 'cancelado');

  const faturamentoHoje = servicesToday.reduce((sum, s) => sum + s.priceCharged, 0);
  const faturamentoMensal = services.reduce((sum, s) => sum + s.priceCharged, 0);
  const custoMotoristas = services.reduce((sum, s) => sum + s.driverCost, 0);
  const lucroTotal = services.reduce((sum, s) => sum + s.profit, 0);
  const lucroMargin = faturamentoMensal > 0 ? Math.round((lucroTotal / faturamentoMensal) * 100) : 0;

  const driversOnline = drivers.filter(d => d.status !== 'offline');
  const activeClients = clients.length;
  const activeVehicles = vehicles.filter(v => v.status === 'ativo').length;

  // Chart Data Preparation
  const chartDataFaturamento = [
    { name: '01/Ago', faturamento: 12400, custo: 8100, lucro: 4300 },
    { name: '02/Ago', faturamento: 15800, custo: 10200, lucro: 5600 },
    { name: '03/Ago', faturamento: faturamentoMensal > 0 ? faturamentoMensal : 18500, custo: custoMotoristas > 0 ? custoMotoristas : 11800, lucro: lucroTotal > 0 ? lucroTotal : 6700 },
  ];

  const vehicleDistribution = [
    { name: 'Moto', value: services.filter(s => s.vehicleType === 'moto').length || 4, color: '#a855f7' },
    { name: 'Carro', value: services.filter(s => s.vehicleType === 'carro').length || 2, color: '#3b82f6' },
    { name: 'Utilitário', value: services.filter(s => s.vehicleType === 'utilitario').length || 3, color: '#10b981' },
    { name: 'Van', value: services.filter(s => s.vehicleType === 'van').length || 2, color: '#f59e0b' },
    { name: 'Caminhão', value: services.filter(s => s.vehicleType === 'caminhao').length || 2, color: '#ec4899' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-zinc-900 text-white shadow-xl border border-purple-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-zinc-950 uppercase tracking-wider">
                SaaS TMS Operating System
              </span>
              <span className="text-xs text-purple-200">Painel Geral de Controle</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Visão Operacional IBEC FLOW
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mt-1">
              Monitoramento em tempo real da frota, serviços de transporte, clientes e faturamento consolidado.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewServiceModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-extrabold text-xs shadow-lg shadow-amber-400/20 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>CADASTRAR SERVIÇO (&lt;20s)</span>
            </button>
          </div>
        </div>

        {/* Decorative ambient background blur */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 right-48 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl" />
      </div>

      {/* KPI CARDS GRID (12 Cards as requested) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Card 1: Serviços Hoje */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Serviços Hoje</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <PackageCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">{servicesToday.length}</p>
          <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-1">Lançamentos de hoje</p>
        </div>

        {/* Card 2: Em Andamento */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Em Andamento</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-amber-500">{inProgress.length}</p>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-1">Em trânsito / Coleta</p>
        </div>

        {/* Card 3: Concluídos */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Concluídos</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-emerald-500">{completed.length}</p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Comprovantes entregues</p>
        </div>

        {/* Card 4: Pendentes */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Pendentes</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-indigo-500">{pending.length}</p>
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">Aguardando aceite</p>
        </div>

        {/* Card 5: Cancelados */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Cancelados</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">{cancelled.length}</p>
          <p className="text-[10px] text-zinc-400 font-medium mt-1">Serviços cancelados</p>
        </div>

        {/* Card 6: Motoristas Online */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Motoristas Online</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-emerald-500">{driversOnline.length} / {drivers.length}</p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Conectados no App PWA</p>
        </div>

        {/* Card 7: Faturamento Hoje */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Faturamento Hoje</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">R$ {faturamentoHoje.toFixed(2)}</p>
          <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-1">Faturado no dia</p>
        </div>

        {/* Card 8: Faturamento Mensal */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Faturamento Mensal</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-lg font-extrabold text-indigo-500">R$ {faturamentoMensal.toFixed(2)}</p>
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">Total de serviços</p>
        </div>

        {/* Card 9: Custo Motoristas */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Custo Motoristas</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="text-lg font-extrabold text-amber-500">R$ {custoMotoristas.toFixed(2)}</p>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-1">Repasses & comissões</p>
        </div>

        {/* Card 10: Lucro Bruto */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/10 to-emerald-900/10 dark:from-purple-950/40 dark:to-emerald-950/40 border border-emerald-500/30 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Lucro Operacional</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500 text-zinc-950">
              {lucroMargin}% Margem
            </span>
          </div>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">R$ {lucroTotal.toFixed(2)}</p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Resultado líquido</p>
        </div>

        {/* Card 11: Frota de Veículos */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Veículos Ativos</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Car className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">{activeVehicles} Veículos</p>
          <p className="text-[10px] text-zinc-400 font-medium mt-1">Motos, Vans, Caminhões</p>
        </div>

        {/* Card 12: Clientes Ativos */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Clientes Ativos</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">{activeClients} Empresas</p>
          <p className="text-[10px] text-zinc-400 font-medium mt-1">Tabelas customizadas</p>
        </div>

      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Faturamento vs Custo vs Lucro */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Desempenho Financeiro Consolidado
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Faturamento vs Repasse Motoristas vs Lucro Operacional</p>
            </div>
            <button 
              onClick={() => setActiveTab('financial')}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>Ver Financeiro Completo</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataFaturamento}>
                <defs>
                  <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', borderColor: '#27272a', color: '#fff' }}
                  formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, '']}
                />
                <Area type="monotone" dataKey="faturamento" name="Faturamento" stroke="#a855f7" fillOpacity={1} fill="url(#colorFaturamento)" strokeWidth={2} />
                <Area type="monotone" dataKey="lucro" name="Lucro" stroke="#10b981" fillOpacity={1} fill="url(#colorLucro)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Distribuição por Tipo de Veículo */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Frota por Tipo de Veículo
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Motos, Vans, Utilitários e Caminhões</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vehicleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', borderColor: '#27272a', color: '#fff' }} 
                />
                <Legend formatter={(value) => <span className="text-xs text-zinc-700 dark:text-zinc-300">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* RECENT ACTIVITY & DRIVER STATUS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Driver Fleet Quick Monitor */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <Truck className="h-4 w-4 text-purple-500" /> Motoristas em Destaque Hoje
            </h3>
            <button 
              onClick={() => setActiveTab('drivers')}
              className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Ver Todos ({drivers.length})
            </button>
          </div>

          <div className="space-y-3">
            {drivers.slice(0, 4).map(drv => (
              <div key={drv.id} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <img src={drv.foto} alt={drv.nome} className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20" />
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{drv.nome}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {drv.modelo} ({drv.placa}) • ⭐ {drv.rating}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    drv.status === 'em_atendimento' 
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                      : drv.status === 'disponivel' || drv.status === 'online'
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-zinc-500/10 text-zinc-500'
                  }`}>
                    {drv.status.replace('_', ' ')}
                  </span>
                  <p className="text-[10px] text-zinc-400 mt-1">{drv.completedToday} entregas hoje</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log / Activity Timeline */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-500" /> Últimas Atividades do Sistema
            </h3>
            <button 
              onClick={() => setActiveTab('audit')}
              className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Ver Log Completo
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 4).map(log => (
              <div key={log.id} className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 mt-0.5">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{log.userName}</span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
