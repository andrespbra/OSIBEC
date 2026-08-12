import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Car, Plus, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const VehiclesListView: React.FC = () => {
  const { vehicles, addVehicle } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [tipo, setTipo] = useState<'moto' | 'carro' | 'utilitario' | 'van' | 'caminhao'>('carro');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle({
      tipo,
      placa: placa.toUpperCase(),
      modelo,
      marca,
      ano: 2025,
      combustivel: 'Flex',
      capacidade: '800 kg',
      renavam: '00112233445',
      seguro: 'Seguro Frota Total',
      status: 'ativo'
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Gestão da Frota de Veículos
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
              {vehicles.length} Veículos Cadastrados
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Capacidade de carga, tipo de veículo, manutenção e apólice de seguro.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>NOVO VEÍCULO</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map(v => (
          <div key={v.id} className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-300">
                {v.tipo}
              </span>
              <span className="font-mono font-extrabold text-xs text-purple-600 dark:text-purple-400">{v.placa}</span>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{v.marca} {v.modelo}</h3>
              <p className="text-xs text-zinc-500">Ano {v.ano} • Combustível: {v.combustivel}</p>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-xs space-y-1">
              <p className="text-zinc-600 dark:text-zinc-400">Capacidade: <span className="font-bold text-zinc-900 dark:text-zinc-100">{v.capacidade}</span></p>
              <p className="text-zinc-600 dark:text-zinc-400 truncate">Seguro: <span className="font-medium text-emerald-500">{v.seguro}</span></p>
            </div>

            <p className="text-xs text-zinc-500">Motorista: <span className="font-bold text-zinc-800 dark:text-zinc-200">{v.driverName || 'Não alocado'}</span></p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white dark:bg-zinc-900 p-6 rounded-3xl space-y-4 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-base font-extrabold">Cadastrar Veículo</h2>
            <div className="space-y-2 text-xs">
              <input type="text" placeholder="Marca *" value={marca} onChange={e => setMarca(e.target.value)} required className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
              <input type="text" placeholder="Modelo *" value={modelo} onChange={e => setModelo(e.target.value)} required className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
              <input type="text" placeholder="Placa *" value={placa} onChange={e => setPlaca(e.target.value)} required className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800 uppercase" />
              <select value={tipo} onChange={e => setTipo(e.target.value as any)} className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800 font-bold">
                <option value="moto">Moto</option>
                <option value="carro">Carro</option>
                <option value="utilitario">Utilitário</option>
                <option value="van">Van</option>
                <option value="caminhao">Caminhão</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold">Cancelar</button>
              <button type="submit" className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 text-white">Salvar Veículo</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
