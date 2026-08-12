import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Database, Server, Trash2, RefreshCw, CheckCircle2, 
  AlertTriangle, Copy, ExternalLink, Code, Layers, FileCode2, Terminal
} from 'lucide-react';
import { testSupabaseConnection } from '../../lib/supabase';

export const SupabaseVercelConfigView: React.FC = () => {
  const { clearAllData, resetToDefaults, isSupabaseActive, addToast } = useApp();

  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedVercel, setCopiedVercel] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    const result = await testSupabaseConnection();
    setTesting(false);
    setTestResult(result);
    addToast({
      title: result.success ? 'Supabase Conectado' : 'Aviso do Supabase',
      description: result.message,
      type: result.success ? 'success' : 'warning'
    });
  };

  const sqlSchemaSnippet = `-- Script resumido para Supabase SQL Editor
CREATE TABLE IF NOT EXISTS clients (id TEXT PRIMARY KEY, razao_social TEXT, nome_fantasia TEXT, cnpj TEXT, email TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS drivers (id TEXT PRIMARY KEY, nome TEXT, cpf TEXT, placa TEXT, tipo_veiculo TEXT, status TEXT);
CREATE TABLE IF NOT EXISTS vehicles (id TEXT PRIMARY KEY, placa TEXT, modelo TEXT, marca TEXT, ano INT, status TEXT);
CREATE TABLE IF NOT EXISTS service_orders (id TEXT PRIMARY KEY, os_number TEXT, date DATE, time TEXT, client_name TEXT, service_type TEXT, vehicle_type TEXT, status TEXT, price_charged NUMERIC, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS financial_records (id TEXT PRIMARY KEY, type TEXT, category TEXT, description TEXT, amount NUMERIC, due_date DATE, status TEXT);

-- Veja o arquivo completo 'supabase_schema.sql' na raiz do projeto!`;

  const vercelJsonSnippet = `{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Integração Supabase & Deploy Vercel
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Gerenciamento de dados em nuvem, controle de banco PostgreSQL e publicação na Vercel.
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isSupabaseActive ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" />
              Supabase Ativo & Conectado
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <AlertTriangle className="h-4 w-4" />
              Modo LocalStorage (Demo)
            </span>
          )}
        </div>
      </div>

      {/* Action Block 1: Clear Demo Data / Zerar Dados Demo */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trash2 className="h-5 w-5 text-red-500" />
            <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
              Zerar Dados de Demonstração
            </h2>
          </div>
          <span className="text-xs text-zinc-400">Limpeza de Estado</span>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Esta ação apaga todos os clientes, motoristas, veículos e ordens de serviço fictícias de teste, deixando o banco com 0 registros pronto para a operação real da sua empresa.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja ZERAR todos os dados demo? A lista ficará vazia para novos cadastros.')) {
                clearAllData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            ZERAR TODOS OS DADOS DEMO
          </button>

          <button
            onClick={() => {
              if (window.confirm('Deseja restaurar o conjunto de dados demo originais de teste?')) {
                resetToDefaults();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Restaurar Dados Demo de Exemplo
          </button>
        </div>
      </div>

      {/* Action Block 2: Supabase Credentials Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Database className="h-5 w-5 text-emerald-500" />
            <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
              1. Configurar Supabase (Variáveis de Ambiente)
            </h2>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            Para conectar o sistema ao seu projeto PostgreSQL no Supabase, configure as seguintes variáveis no arquivo <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-purple-500 font-mono">.env</code> local ou no painel do <strong>Vercel</strong>:
          </p>

          <div className="p-3 rounded-2xl bg-zinc-950 font-mono text-[11px] text-emerald-400 space-y-1.5 overflow-x-auto">
            <div>VITE_SUPABASE_URL=https://xjiuiazligncwtncrehy.supabase.co</div>
            <div>VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXVpYXpsaWduY3d0bmNyZWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MTUxMjEsImV4cCI6MjEwMjA5MTEyMX0.CWwU_81JnfP-pRSzBEIkMOQOecnfxh1Vd_ailds-lT0</div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${testing ? 'animate-spin' : ''}`} />
              Testar Conexão com Supabase
            </button>

            {testResult && (
              <div className={`mt-3 p-3 rounded-xl text-xs font-medium ${testResult.success ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                {testResult.message}
              </div>
            )}
          </div>
        </div>

        {/* SQL Schema Copy Box */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileCode2 className="h-5 w-5 text-indigo-500" />
              <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                2. Schema SQL (Supabase Editor)
              </h2>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(sqlSchemaSnippet);
                setCopiedSchema(true);
                setTimeout(() => setCopiedSchema(false), 2000);
              }}
              className="flex items-center gap-1.5 text-xs text-indigo-500 hover:underline font-bold cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedSchema ? 'Copiado!' : 'Copiar SQL'}
            </button>
          </div>

          <p className="text-xs text-zinc-500">
            Copie o DDL do banco para rodar no menu <strong>SQL Editor</strong> do Supabase. O arquivo completo <code className="text-purple-500 font-mono">supabase_schema.sql</code> foi gerado na raiz da aplicação.
          </p>

          <pre className="p-3 rounded-2xl bg-zinc-950 font-mono text-[10px] text-indigo-300 overflow-x-auto max-h-36 leading-relaxed">
            {sqlSchemaSnippet}
          </pre>
        </div>

      </div>

      {/* Deploy Vercel Guide */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server className="h-5 w-5 text-purple-500" />
            <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
              3. Deploy na Vercel
            </h2>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400">
            Pronto para Vercel
          </span>
        </div>

        <p className="text-xs text-zinc-500 leading-relaxed">
          O projeto possui o arquivo <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-purple-500 font-mono">vercel.json</code> já configurado para tratar rotas do React Single Page Application sem erros de HTTP 404 ao recarregar a página.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-purple-500">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500 text-white text-[10px]">1</span>
              Conectar Repositório
            </div>
            <p className="text-[11px] text-zinc-500">
              Importe o repositório GitHub no dashboard da Vercel. O framework Vite será detectado automaticamente.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-purple-500">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500 text-white text-[10px]">2</span>
              Environment Variables
            </div>
            <p className="text-[11px] text-zinc-500">
              Adicione <code className="font-mono text-purple-400">VITE_SUPABASE_URL</code> e <code className="font-mono text-purple-400">VITE_SUPABASE_ANON_KEY</code> nas configurações de projeto da Vercel.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-purple-500">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500 text-white text-[10px]">3</span>
              Deploy Automático
            </div>
            <p className="text-[11px] text-zinc-500">
              Clique em Deploy. A Vercel executará <code className="font-mono text-purple-400">npm run build</code> e disponibilizará sua URL <code className="font-mono text-purple-400">.vercel.app</code> com SSL em segundos.
            </p>
          </div>

        </div>

        <div className="p-3 rounded-2xl bg-zinc-950 font-mono text-[11px] text-purple-300 overflow-x-auto">
          <pre>{vercelJsonSnippet}</pre>
        </div>
      </div>

    </div>
  );
};
