import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, ArrowUpRight, ArrowDownRight, Plus, FileText, CheckCircle2 } from 'lucide-react';

export const FinancialView: React.FC = () => {
  const { financial, addFinancialRecord } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'receita' | 'despesa'>('all');

  const totalReceitas = financial.filter(f => f.type === 'receita').reduce((sum, f) => sum + f.amount, 0);
  const totalDespesas = financial.filter(f => f.type === 'despesa').reduce((sum, f) => sum + f.amount, 0);
  const lucroLiquido = totalReceitas - totalDespesas;

  const filtered = financial.filter(f => filterType === 'all' || f.type === filterType);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Módulo Financeiro & DRE
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Fluxo Consolidado
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Contas a receber, contas a pagar, repasses de motoristas e apuração de DRE.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Total Receitas</span>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-500">R$ {totalReceitas.toFixed(2)}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Total Despesas / Repasses</span>
            <ArrowDownRight className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-500">R$ {totalDespesas.toFixed(2)}</p>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-900/10 to-emerald-900/10 dark:from-purple-950/40 dark:to-emerald-950/40 border border-emerald-500/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">DRE Lucro Líquido</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-zinc-950">Consolidado</span>
          </div>
          <p className="text-2xl font-black text-emerald-500">R$ {lucroLiquido.toFixed(2)}</p>
        </div>
      </div>

      {/* Financial Table */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Lançamentos Financeiros (Extrato)
          </h3>

          <div className="flex gap-2">
            <button onClick={() => setFilterType('all')} className={`px-3 py-1 text-xs font-bold rounded-xl ${filterType === 'all' ? 'bg-purple-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>Todos</button>
            <button onClick={() => setFilterType('receita')} className={`px-3 py-1 text-xs font-bold rounded-xl ${filterType === 'receita' ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>Receitas</button>
            <button onClick={() => setFilterType('despesa')} className={`px-3 py-1 text-xs font-bold rounded-xl ${filterType === 'despesa' ? 'bg-amber-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>Despesas</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-[11px] font-bold text-zinc-500 uppercase">
                <th className="p-4">Tipo</th>
                <th className="p-4">Descrição / Categoria</th>
                <th className="p-4">OS / Cliente</th>
                <th className="p-4">Vencimento</th>
                <th className="p-4">Forma Pagto</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
              {filtered.map(f => (
                <tr key={f.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${f.type === 'receita' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {f.type}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                    {f.description}
                    <span className="block text-[10px] text-zinc-400">{f.category}</span>
                  </td>
                  <td className="p-4 font-mono text-purple-600 dark:text-purple-400">
                    {f.osNumber || 'Geral'}
                  </td>
                  <td className="p-4 text-zinc-500">{f.dueDate}</td>
                  <td className="p-4 uppercase font-bold text-[10px] text-zinc-400">{f.paymentMethod}</td>
                  <td className={`p-4 font-extrabold ${f.type === 'receita' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    R$ {f.amount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {f.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
