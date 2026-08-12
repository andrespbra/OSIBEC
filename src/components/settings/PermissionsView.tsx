import React from 'react';
import { Shield, Lock, CheckCircle2, XCircle } from 'lucide-react';
import { UserRole } from '../../types';

export const PermissionsView: React.FC = () => {
  const roles: { id: UserRole; name: string; desc: string }[] = [
    { id: 'admin', name: 'Administrador / CEO', desc: 'Acesso total irrestrito a todas as funções, relatórios e permissões' },
    { id: 'operador', name: 'Operador / Despachante', desc: 'Criação rápida de OS, alocação de motoristas e mapa ao vivo' },
    { id: 'financeiro', name: 'Gerente Financeiro', desc: 'Acesso ao módulo financeiro, DRE, faturamento e extrato' },
    { id: 'motorista', name: 'Motorista (App PWA)', desc: 'Visualização apenas das corridas atreladas ao seu perfil' },
    { id: 'cliente', name: 'Cliente (Portal)', desc: 'Visualização dos seus próprios serviços, links de rastreio e comprovantes' },
  ];

  const permissions = [
    { name: 'Criar Ordem de Serviço (OS <20s)', admin: true, operador: true, financeiro: false, motorista: false, cliente: true },
    { name: 'Acessar Mapa de Rastreamento ao Vivo', admin: true, operador: true, financeiro: false, motorista: true, cliente: true },
    { name: 'Acessar Extrato Financeiro e DRE', admin: true, operador: false, financeiro: true, motorista: false, cliente: false },
    { name: 'Acessar Relatórios BI e Exportação', admin: true, operador: true, financeiro: true, motorista: false, cliente: false },
    { name: 'Cadastrar/Editar Motoristas e Veículos', admin: true, operador: true, financeiro: false, motorista: false, cliente: false },
    { name: 'Visualizar Trilha de Auditoria', admin: true, operador: false, financeiro: false, motorista: false, cliente: false },
    { name: 'Disparar Notificações WhatsApp', admin: true, operador: true, financeiro: false, motorista: false, cliente: false },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Matriz de Permissões & Perfis de Acesso (RBAC)
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
              Controle por Perfil
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Configuração de acessos por papel (Admin, Operador, Financeiro, Motorista, Cliente).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map(r => (
          <div key={r.id} className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500" />
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{r.name}</h3>
            </div>
            <p className="text-xs text-zinc-500">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Matrix Table */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-[11px] font-bold text-zinc-500 uppercase">
                <th className="p-4">Funcionalidade / Módulo</th>
                <th className="p-4 text-center">Admin</th>
                <th className="p-4 text-center">Operador</th>
                <th className="p-4 text-center">Financeiro</th>
                <th className="p-4 text-center">Motorista</th>
                <th className="p-4 text-center">Cliente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="p-4 font-bold text-zinc-900 dark:text-zinc-100">{p.name}</td>
                  <td className="p-4 text-center">{p.admin ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /> : <XCircle className="h-4 w-4 text-zinc-300 mx-auto" />}</td>
                  <td className="p-4 text-center">{p.operador ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /> : <XCircle className="h-4 w-4 text-zinc-300 mx-auto" />}</td>
                  <td className="p-4 text-center">{p.financeiro ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /> : <XCircle className="h-4 w-4 text-zinc-300 mx-auto" />}</td>
                  <td className="p-4 text-center">{p.motorista ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /> : <XCircle className="h-4 w-4 text-zinc-300 mx-auto" />}</td>
                  <td className="p-4 text-center">{p.cliente ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /> : <XCircle className="h-4 w-4 text-zinc-300 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
