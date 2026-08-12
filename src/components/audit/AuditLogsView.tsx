import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, User, Globe, Laptop, Clock } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Trilha de Auditoria & Segurança
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
              Logs Imutáveis
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Registro de logins, alterações em serviços, exclusões, endereço IP e user agent.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-[11px] font-bold text-zinc-500 uppercase">
                <th className="p-4">Data / Hora</th>
                <th className="p-4">Usuário</th>
                <th className="p-4">Perfil</th>
                <th className="p-4">Ação</th>
                <th className="p-4">Detalhes</th>
                <th className="p-4">Endereço IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="p-4 text-zinc-500 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-zinc-900 dark:text-zinc-100">
                    {log.userName}
                  </td>
                  <td className="p-4 uppercase font-bold text-[10px] text-purple-600 dark:text-purple-400">
                    {log.userRole}
                  </td>
                  <td className="p-4 font-mono text-amber-500 font-bold">{log.action}</td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-300">{log.details}</td>
                  <td className="p-4 font-mono text-[11px] text-zinc-400">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
