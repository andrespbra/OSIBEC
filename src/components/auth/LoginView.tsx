import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, Shield, Lock, User as UserIcon, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';

export const LoginView: React.FC = () => {
  const { loginWithUsername, users, setCurrentUser } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleQuickLogin = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role) || users[0];
    if (targetUser) {
      setUsername(targetUser.username);
      setPassword(targetUser.password || '123');
      loginWithUsername(targetUser.username, targetUser.password || '123');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginWithUsername(username, password);
    if (!success) {
      setErrorMsg('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Logo Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-0.5 mx-auto shadow-lg shadow-purple-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
              <Truck className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">GRUPO IBEC</h1>
          <p className="text-xs text-zinc-400">Autenticação Simplificada por Nome de Usuário e Senha</p>
        </div>

        {/* Quick Demo Access Role Buttons */}
        /*<div className="space-y-2">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-center">
            Acesso Rápido para Demonstração:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="p-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/40 text-purple-300 font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              👑 Admin (admin)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('operador')}
              className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              🎧 Operador
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('financeiro')}
              className="p-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              💰 Financeiro
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('motorista')}
              className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              📱 Motorista (PWA)
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleQuickLogin('cliente')}
            className="w-full p-2.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/40 border border-pink-500/40 text-pink-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            🏢 Portal do Cliente Exclusivo
          </button>
        </div>
*/
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-zinc-800" />
          <span className="flex-shrink mx-4 text-[10px] text-zinc-500 font-bold uppercase">Ou Login com Usuário & Senha</span>
          <div className="flex-grow border-t border-zinc-800" />
        </div>

        {/* Form Login */}
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium text-xs text-center">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-zinc-400 mb-1 font-semibold flex items-center gap-1.5">
              <UserIcon className="h-3.5 w-3.5 text-purple-400" />
              Nome de Usuário (Username)
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ex: admin, operador, carlos.santos"
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
            /*<p className="text-[10px] text-zinc-500 mt-1">Exemplo admin padrão: <code className="text-purple-400 font-mono">admin</code></p>*/
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-semibold flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-purple-400" />
              Senha de Acesso
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Sua senha secreta"
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
           /* <p className="text-[10px] text-zinc-500 mt-1">Senha padrão demo: <code className="text-purple-400 font-mono">123</code></p>*/
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:brightness-110 font-black text-white text-xs shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>ENTRAR COM USUÁRIO E SENHA</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-[10px] text-zinc-500 text-center font-mono">
          IBEC FLOW • Login sem necessidade de e-mail
        </p>

      </div>

    </div>
  );
};
