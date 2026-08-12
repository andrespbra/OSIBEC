import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Download, FileText, CheckCircle2, TrendingUp, Users, Truck } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { services, clients, drivers, addToast } = useApp();

  const handleExportCSV = (reportName: string) => {
    addToast({ title: 'Relatório Gerado', description: `${reportName} exportado em formato CSV.`, type: 'success' });
  };

  const handleExportPDF = (reportName: string) => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Relatórios & BI Operacional
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
              Exportação CSV / Excel / PDF
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Análise por cliente, motorista, faturamento, custos, margem de lucro e km rodado.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Report 1 */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">Serviços por Cliente</h3>
              <p className="text-xs text-zinc-500">Volume de OS e faturamento por empresa</p>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => handleExportCSV('Serviços por Cliente')} className="flex-1 py-2 text-xs font-bold rounded-xl bg-purple-600 text-white flex items-center justify-center gap-1">
              <Download className="h-3.5 w-3.5" /> CSV / Excel
            </button>
            <button onClick={() => handleExportPDF('Serviços por Cliente')} className="py-2 px-3 text-xs font-bold rounded-xl bg-zinc-200 dark:bg-zinc-800">
              PDF
            </button>
          </div>
        </div>

        {/* Report 2 */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">Desempenho Motoristas</h3>
              <p className="text-xs text-zinc-500">Km rodado, entregas e comissões repassadas</p>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => handleExportCSV('Desempenho Motoristas')} className="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white flex items-center justify-center gap-1">
              <Download className="h-3.5 w-3.5" /> CSV / Excel
            </button>
            <button onClick={() => handleExportPDF('Desempenho Motoristas')} className="py-2 px-3 text-xs font-bold rounded-xl bg-zinc-200 dark:bg-zinc-800">
              PDF
            </button>
          </div>
        </div>

        {/* Report 3 */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">DRE & Margem de Lucro</h3>
              <p className="text-xs text-zinc-500">Apuração de receitas, custos e margem %</p>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => handleExportCSV('DRE & Lucro')} className="flex-1 py-2 text-xs font-bold rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center gap-1">
              <Download className="h-3.5 w-3.5" /> CSV / Excel
            </button>
            <button onClick={() => handleExportPDF('DRE & Lucro')} className="py-2 px-3 text-xs font-bold rounded-xl bg-zinc-200 dark:bg-zinc-800">
              PDF
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
