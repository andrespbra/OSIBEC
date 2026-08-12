import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, Plus, Search, Star, Phone, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';

export const DriversListView: React.FC = () => {
  const { drivers, updateDriverStatus, addDriver } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Driver Form
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnh, setCnh] = useState('');
  const [telefone, setTelefone] = useState('');
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState<'moto' | 'carro' | 'utilitario' | 'van' | 'caminhao'>('moto');

  const filtered = drivers.filter(d => 
    d.nome.toLowerCase().includes(search.toLowerCase()) ||
    d.placa.toLowerCase().includes(search.toLowerCase()) ||
    d.modelo.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDriver({
      foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      nome,
      cpf,
      cnh,
      categoria: 'AB',
      validadeCnh: '2028-12-31',
      telefone,
      whatsapp: telefone,
      pix: cpf,
      banco: 'Banco Itaú',
      placa,
      modelo,
      tipoVeiculo,
      status: 'disponivel',
      rating: 5.0,
      location: {
        lat: -23.5505,
        lng: -46.6333,
        address: 'São Paulo - SP',
        lastUpdate: 'Agora'
      }
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Cadastro e Alocação de Motoristas
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {drivers.length} Motoristas
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Status de disponibilidade, validade de CNH, veículo pareado e PIX de repasse.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>CADASTRAR MOTORISTA</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome do motorista, modelo de veículo, placa..."
          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* Driver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(drv => (
          <div key={drv.id} className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 hover:border-purple-500/50 transition-all">
            <div className="flex items-center gap-3">
              <img src={drv.foto} alt={drv.nome} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/30" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{drv.nome}</h3>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" /> {drv.rating}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">{drv.modelo} ({drv.placa})</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="block text-zinc-400 text-[10px]">CNH Cat: {drv.categoria}</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Val: {drv.validadeCnh}</span>
              </div>
              <div>
                <span className="block text-zinc-400 text-[10px]">Chave PIX</span>
                <span className="font-mono font-semibold truncate block">{drv.pix}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <select
                value={drv.status}
                onChange={e => updateDriverStatus(drv.id, e.target.value as any)}
                className="px-2.5 py-1 text-[11px] font-bold rounded-xl border bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                <option value="disponivel">Disponível</option>
                <option value="online">Online</option>
                <option value="em_atendimento">Em Atendimento</option>
                <option value="offline">Offline</option>
              </select>

              <a
                href={`https://api.whatsapp.com/send?phone=${drv.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Driver */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white dark:bg-zinc-900 p-6 rounded-3xl space-y-4 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-base font-extrabold">Cadastrar Novo Motorista</h2>
            <div className="space-y-2 text-xs">
              <input type="text" placeholder="Nome Completo *" value={nome} onChange={e => setNome(e.target.value)} required className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
              <input type="text" placeholder="CPF *" value={cpf} onChange={e => setCpf(e.target.value)} required className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
              <input type="text" placeholder="Número CNH *" value={cnh} onChange={e => setCnh(e.target.value)} required className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
              <input type="text" placeholder="Telefone / WhatsApp *" value={telefone} onChange={e => setTelefone(e.target.value)} required className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
              <input type="text" placeholder="Modelo do Veículo *" value={modelo} onChange={e => setModelo(e.target.value)} required className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
              <input type="text" placeholder="Placa *" value={placa} onChange={e => setPlaca(e.target.value)} required className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800 uppercase" />
              <select value={tipoVeiculo} onChange={e => setTipoVeiculo(e.target.value as any)} className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800 font-bold">
                <option value="moto">Moto</option>
                <option value="carro">Carro</option>
                <option value="utilitario">Utilitário</option>
                <option value="van">Van</option>
                <option value="caminhao">Caminhão</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold">Cancelar</button>
              <button type="submit" className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white">Salvar Motorista</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
