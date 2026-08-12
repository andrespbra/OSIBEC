import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, MessageSquare, Mail, Smartphone, CheckCircle2, Zap } from 'lucide-react';

export const AutomationsView: React.FC = () => {
  const { automationLogs } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Motor de Automações & Notificações
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              WhatsApp & Email Engine
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Envio automático de links de rastreamento, avisos de motorista a caminho e comprovantes.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-xs font-bold uppercase text-zinc-900 dark:text-zinc-100">
            Log de Disparos em Tempo Real
          </h3>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
          {automationLogs.map(log => (
            <div key={log.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                  {log.type === 'whatsapp' ? <MessageSquare className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{log.event}</p>
                  <p className="text-[11px] text-zinc-500">Para: {log.recipient} • OS: {log.osNumber || 'Geral'}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500">
                  {log.status.toUpperCase()}
                </span>
                <span className="block text-[10px] font-mono text-zinc-400 mt-1">{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
