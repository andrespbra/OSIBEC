import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Plus, Search, Building2, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';

export const ClientsListView: React.FC = () => {
  const { clients, addClient } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Client Form State
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [telefone, setTelefone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [centroCusto, setCentroCusto] = useState('CC-GERAL-01');

  const filtered = clients.filter(c => 
    c.nomeFantasia.toLowerCase().includes(search.toLowerCase()) ||
    c.razaoSocial.toLowerCase().includes(search.toLowerCase()) ||
    c.cnpj.includes(search)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient({
      razaoSocial: razaoSocial || nomeFantasia,
      nomeFantasia,
      cnpj,
      ie: 'Isento',
      responsavel,
      telefone,
      whatsapp: whatsapp || telefone,
      email,
      endereco,
      cep: '01000-000',
      cidade: 'São Paulo',
      estado: 'SP',
      centroCustoPadrao: centroCusto,
      formaPagamento: 'Faturado 30 dias',
      tabelaPrecos: 'Express Premium'
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
              Cadastro e Gestão de Clientes
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
              {clients.length} Cadastrados
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Centros de custo padrão, tabelas de preços customizadas e regras de faturamento.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>NOVO CLIENTE</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar cliente por nome fantasia, razão social, CNPJ..."
          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* Grid of Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cli => (
          <div key={cli.id} className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-300">
                {cli.tabelaPrecos}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">{cli.centroCustoPadrao}</span>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{cli.nomeFantasia}</h3>
              <p className="text-[11px] text-zinc-500 truncate">{cli.razaoSocial}</p>
              <p className="text-[10px] font-mono text-zinc-400 mt-0.5">CNPJ: {cli.cnpj}</p>
            </div>

            <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-2">
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-purple-500" /> {cli.telefone}</p>
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-purple-500" /> {cli.email}</p>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">{cli.totalServices} Serviços</span>
              <span className="font-extrabold text-purple-600 dark:text-purple-400">R$ {cli.totalSpent.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Client */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white dark:bg-zinc-900 p-6 rounded-3xl space-y-4 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-base font-extrabold">Cadastrar Novo Cliente</h2>
            <div className="space-y-2 text-xs">
              <input type="text" placeholder="Nome Fantasia *" value={nomeFantasia} onChange={e => setNomeFantasia(e.target.value)} required className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
              <input type="text" placeholder="Razão Social" value={razaoSocial} onChange={e => setRazaoSocial(e.target.value)} className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
              <input type="text" placeholder="CNPJ *" value={cnpj} onChange={e => setCnpj(e.target.value)} required className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
              <input type="text" placeholder="Responsável" value={responsavel} onChange={e => setResponsavel(e.target.value)} className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
              <input type="text" placeholder="Telefone / WhatsApp" value={telefone} onChange={e => setTelefone(e.target.value)} className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
              <input type="text" placeholder="Endereço Principal" value={endereco} onChange={e => setEndereco(e.target.value)} className="w-full p-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold">Cancelar</button>
              <button type="submit" className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 text-white">Salvar Cliente</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
