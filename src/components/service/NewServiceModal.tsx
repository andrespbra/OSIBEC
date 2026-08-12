import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Zap, Building2, MapPin, Truck, DollarSign, Calculator, 
  Plus, Trash2, ArrowRight, UserCheck, ShieldCheck, CheckCircle2, Navigation, AlertCircle
} from 'lucide-react';
import { ServiceType, VehicleType, Waypoint } from '../../types';

export const NewServiceModal: React.FC = () => {
  const { 
    isNewServiceModalOpen, setIsNewServiceModalOpen, 
    clients, drivers, createService, addToast 
  } = useApp();

  // Form State
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [solicitante, setSolicitante] = useState('');
  const [telefone, setTelefone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [centroCusto, setCentroCusto] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('entrega');
  const [vehicleType, setVehicleType] = useState<VehicleType>('moto');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');

  // Origin & Destination
  const [originAddress, setOriginAddress] = useState('');
  const [originContact, setOriginContact] = useState('');
  const [originLat, setOriginLat] = useState(-23.5615);
  const [originLng, setOriginLng] = useState(-46.6559);

  const [destAddress, setDestAddress] = useState('');
  const [destContact, setDestContact] = useState('');
  const [destLat, setDestLat] = useState(-23.5874);
  const [destLng, setDestLng] = useState(-46.6789);

  // Unlimited Waypoints
  const [stopovers, setStopovers] = useState<Waypoint[]>([]);
  const [newStopAddress, setNewStopAddress] = useState('');

  // Financial Auto-Calculation
  const [distanceKm, setDistanceKm] = useState(12.5);
  const [estimatedTimeMin, setEstimatedTimeMin] = useState(25);
  const [tollValue, setTollValue] = useState(0.00);
  const [priceCharged, setPriceCharged] = useState(150.00);
  const [driverCost, setDriverCost] = useState(98.00);
  const [notes, setNotes] = useState('');

  // Pre-fill automatically when client is selected!
  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find(c => c.id === selectedClientId);
      if (client) {
        setSolicitante(client.responsavel);
        setTelefone(client.telefone);
        setWhatsapp(client.whatsapp);
        setCentroCusto(client.centroCustoPadrao);
        setOriginAddress(client.endereco);
        setOriginContact(`${client.responsavel} - ${client.nomeFantasia}`);

        // Recalculate price based on client pricing tier
        recalculatePricing(distanceKm, vehicleType, client.tabelaPrecos);
      }
    }
  }, [selectedClientId]);

  // Recalculate financial breakdown whenever distance or vehicle type changes
  const recalculatePricing = (dist: number, veh: VehicleType, tableTier: string = 'Express Premium') => {
    let baseRate = 25.0;
    let kmRate = 3.5;

    if (veh === 'utilitario') { baseRate = 60.0; kmRate = 6.0; }
    else if (veh === 'van') { baseRate = 90.0; kmRate = 8.5; }
    else if (veh === 'caminhao') { baseRate = 250.0; kmRate = 14.0; }
    else if (veh === 'carro') { baseRate = 35.0; kmRate = 4.5; }

    if (tableTier === 'Corporativo VIP') { baseRate *= 1.25; }
    else if (tableTier === 'E-commerce Especial') { baseRate *= 0.9; }

    const calculatedPrice = Math.round(baseRate + (dist * kmRate) + (stopovers.length * 15.0));
    const calculatedDriverCost = Math.round(calculatedPrice * 0.68);
    const estTime = Math.round((dist / 30) * 60) + (stopovers.length * 10) + 10;

    setPriceCharged(calculatedPrice);
    setDriverCost(calculatedDriverCost);
    setEstimatedTimeMin(estTime);
  };

  const handleDistanceChange = (val: number) => {
    setDistanceKm(val);
    const client = clients.find(c => c.id === selectedClientId);
    recalculatePricing(val, vehicleType, client?.tabelaPrecos);
  };

  const handleVehicleTypeChange = (veh: VehicleType) => {
    setVehicleType(veh);
    const client = clients.find(c => c.id === selectedClientId);
    recalculatePricing(distanceKm, veh, client?.tabelaPrecos);
  };

  const handleAddStopover = () => {
    if (!newStopAddress.trim()) return;
    const newStop: Waypoint = {
      id: `stop-${Date.now()}`,
      address: newStopAddress,
      isCompleted: false
    };
    setStopovers(prev => [...prev, newStop]);
    setNewStopAddress('');
    recalculatePricing(distanceKm + 3.0, vehicleType);
  };

  const handleRemoveStopover = (id: string) => {
    setStopovers(prev => prev.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      addToast({ title: 'Atenção', description: 'Selecione um cliente para prosseguir.', type: 'warning' });
      return;
    }

    const client = clients.find(c => c.id === selectedClientId);
    const driver = drivers.find(d => d.id === selectedDriverId);

    const commission = Math.round(priceCharged * 0.10);
    const profit = priceCharged - driverCost - tollValue;

    createService({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clientId: selectedClientId,
      clientName: client ? client.nomeFantasia : 'Cliente Não Informado',
      solicitante: solicitante || (client?.responsavel || 'Operador'),
      telefone: telefone || (client?.telefone || ''),
      whatsapp: whatsapp || (client?.whatsapp || ''),
      centroCusto: centroCusto || 'CC-GERAL',
      serviceType,
      vehicleType,
      driverId: driver?.id,
      driverName: driver?.nome,
      driverPhoto: driver?.foto,
      driverPhone: driver?.telefone,
      origin: {
        address: originAddress || 'Origem Padrão Central',
        lat: originLat,
        lng: originLng,
        contact: originContact
      },
      destination: {
        address: destAddress || 'Av. Faria Lima, 2200, São Paulo - SP',
        lat: destLat,
        lng: destLng,
        contact: destContact
      },
      stopovers,
      distanceKm,
      estimatedTimeMin,
      tollValue,
      priceCharged,
      driverCost,
      commission,
      profit,
      status: driver ? 'despachado' : 'aguardando',
      notes
    });

    setIsNewServiceModalOpen(false);
  };

  if (!isNewServiceModalOpen) return null;

  const commission = Math.round(priceCharged * 0.10);
  const profit = priceCharged - driverCost - tollValue;
  const profitMarginPercent = priceCharged > 0 ? Math.round((profit / priceCharged) * 100) : 0;

  // Filter available drivers matching vehicle type
  const matchingDrivers = drivers.filter(d => d.tipoVeiculo === vehicleType || d.status === 'disponivel');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-amber-900/10 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <Zap className="h-5 w-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  NOVO SERVIÇO DE TRANSPORTE
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/20">
                  Turbo &lt; 20s
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Selecione o cliente para autopreencher tabela, centro de custo e contatos.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsNewServiceModalOpen(false)}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: CLIENT SELECTION & AUTO-FILL */}
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="h-4 w-4" /> 1. Cliente & Solicitante (Autopreenchimento)
              </span>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                Selecione para preencher tudo em 1 clique
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Cliente Cadastrado *
                </label>
                <select
                  id="select-client"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Selecione um Cliente...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nomeFantasia} ({c.cnpj})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Solicitante
                </label>
                <input
                  type="text"
                  value={solicitante}
                  onChange={e => setSolicitante(e.target.value)}
                  placeholder="Nome do solicitante"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Centro de Custo
                </label>
                <input
                  type="text"
                  value={centroCusto}
                  onChange={e => setCentroCusto(e.target.value)}
                  placeholder="Ex: CC-PAULISTA-01"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Telefone Contato
                </label>
                <input
                  type="text"
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                  placeholder="(11) 3456-7890"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  WhatsApp (Rastreamento Automático)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* STEP 2: SERVICE TYPE & VEHICLE SELECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">
                Tipo de Serviço
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: 'entrega', label: 'Entrega' },
                  { type: 'coleta', label: 'Coleta' },
                  { type: 'retirada', label: 'Retirada' },
                  { type: 'retorno', label: 'Retorno' },
                  { type: 'transferencia', label: 'Transferência' },
                  { type: 'multiplas', label: 'Múltiplas' },
                ].map(item => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setServiceType(item.type as ServiceType)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                      serviceType === item.type
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md font-bold'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">
                Tipo do Veículo Necessário
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { type: 'moto', label: 'Moto' },
                  { type: 'carro', label: 'Carro' },
                  { type: 'utilitario', label: 'Utilitário' },
                  { type: 'van', label: 'Van' },
                  { type: 'caminhao', label: 'Caminhão' },
                ].map(item => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleVehicleTypeChange(item.type as VehicleType)}
                    className={`py-2 px-1 text-[11px] font-semibold rounded-xl border transition-all text-center ${
                      vehicleType === item.type
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-md font-bold'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 3: ROUTE & WAYPOINTS (PARADAS INTERMEDIÁRIAS ILIMITADAS) */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-purple-500" /> 2. Rota & Paradas Intermediárias
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
              {/* Origin */}
              <div>
                <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Origem (Coleta)
                </label>
                <input
                  type="text"
                  value={originAddress}
                  onChange={e => setOriginAddress(e.target.value)}
                  placeholder="Endereço de Origem..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium"
                />
                <input
                  type="text"
                  value={originContact}
                  onChange={e => setOriginContact(e.target.value)}
                  placeholder="Contato / Instruções da Origem"
                  className="w-full mt-1.5 px-3 py-1.5 text-[11px] rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xs font-bold text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Destino (Entrega Final)
                </label>
                <input
                  type="text"
                  value={destAddress}
                  onChange={e => setDestAddress(e.target.value)}
                  placeholder="Endereço de Destino..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium"
                />
                <input
                  type="text"
                  value={destContact}
                  onChange={e => setDestContact(e.target.value)}
                  placeholder="Contato / Instruções do Destino"
                  className="w-full mt-1.5 px-3 py-1.5 text-[11px] rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                />
              </div>
            </div>

            {/* Unlimited Stopovers / Waypoints List */}
            <div className="pl-2 border-l-2 border-dashed border-purple-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                <span>Paradas Intermediárias ({stopovers.length})</span>
              </div>

              {stopovers.map((st, idx) => (
                <div key={st.id} className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-zinc-800 dark:text-zinc-200 font-medium">{st.address}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveStopover(st.id)}
                    className="text-red-500 hover:text-red-600 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newStopAddress}
                  onChange={e => setNewStopAddress(e.target.value)}
                  placeholder="Adicionar endereço de parada intermediária..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
                <button
                  type="button"
                  onClick={handleAddStopover}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center gap-1 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" /> Parada
                </button>
              </div>
            </div>
          </div>

          {/* STEP 4: DISTANCE, TIME & AUTOMATIC PRICING BREAKDOWN */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="h-4 w-4" /> 3. Cálculo Automático & Margem de Lucro
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                Sugestão baseada em tabela + km + paradas
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Distância (Km)</label>
                <input
                  type="number"
                  step="0.1"
                  value={distanceKm}
                  onChange={e => handleDistanceChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg bg-zinc-800 border border-zinc-700 text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Tempo Est. (min)</label>
                <input
                  type="number"
                  value={estimatedTimeMin}
                  onChange={e => setEstimatedTimeMin(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg bg-zinc-800 border border-zinc-700 text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Pedágio Estimado (R$)</label>
                <input
                  type="number"
                  step="0.50"
                  value={tollValue}
                  onChange={e => setTollValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg bg-zinc-800 border border-zinc-700 text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Valor Cobrado Cliente (R$)</label>
                <input
                  type="number"
                  value={priceCharged}
                  onChange={e => setPriceCharged(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-xs font-extrabold rounded-lg bg-purple-950 border border-purple-600 text-amber-300"
                />
              </div>
            </div>

            {/* Profit Margin Visualizer */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/60 text-center">
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-medium">Repasse Motorista</p>
                <p className="text-sm font-bold text-amber-400">R$ {driverCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-medium">Comissão Sistema</p>
                <p className="text-sm font-bold text-indigo-400">R$ {commission.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-medium">Lucro Líquido ({profitMarginPercent}%)</p>
                <p className="text-sm font-extrabold text-emerald-400">R$ {profit.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* STEP 5: DRIVER DISPATCH ASSIGNMENT */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-indigo-500" /> 4. Seleção e Alocação de Motorista
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Motorista Alocado
                </label>
                <select
                  value={selectedDriverId}
                  onChange={e => setSelectedDriverId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="">Aguardando Aceite Automático (Fila de Espera)...</option>
                  {matchingDrivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.nome} - {d.modelo} ({d.placa}) [{d.status.toUpperCase()}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Observações & Instruções Especiais
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ex: Exigir nota fiscal e protocolo físico assinado."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Gera OS, QR Code e Link de WhatsApp em segundos.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsNewServiceModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/30 flex items-center gap-2 active:scale-95 transition-all"
              >
                <Zap className="h-4 w-4 text-amber-300" />
                <span>CONFIRMAR & DESPACHAR</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
