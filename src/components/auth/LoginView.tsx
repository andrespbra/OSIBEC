import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, Shield, Lock, User, ArrowRight, Zap } from 'lucide-react';
import { UserRole } from '../../types';

export const LoginView: React.FC = () => {
  const { setCurrentUser } = useApp();
  const [email, setEmail] = useState('admin@ibecflow.com.br');
  const [password, setPassword] = useState('••••••••');

  const handleQuickLogin = (role: UserRole) => {
    let name = 'Carlos Eduardo';
    if (role === 'operador') name = 'Fernanda Lima';
    if (role === 'financeiro') name = 'Roberto Souza';
    if (role === 'motorista') name = 'Marcos Vinicius';
    if (role === 'cliente') name = 'TechLog Express';

    setCurrentUser({
      id: `usr_${role}`,
      nome: name,
      email: `${role}@ibecflow.com.br`,
      role: role
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuickLogin('admin');
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
          <h1 className="text-2xl font-black text-white tracking-tight">IBEC FLOW</h1>
          <p className="text-xs text-zinc-400">Sistema Inteligente de Gestão de Transportes Premium</p>
        </div>

        {/* Quick Demo Access Role Buttons */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-center">
            Acesso Rápido para Demonstração (Escolha um Perfil):
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('admin')}
              className="p-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/40 text-purple-300 font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              👑 Administrador
            </button>
            <button
              onClick={() => handleQuickLogin('operador')}
              className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              🎧 Operador OS
            </button>
            <button
              onClick={() => handleQuickLogin('financeiro')}
              className="p-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              💰 Financeiro
            </button>
            <button
              onClick={() => handleQuickLogin('motorista')}
              className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              📱 Motorista (PWA)
            </button>
          </div>

          <button
            onClick={() => handleQuickLogin('cliente')}
            className="w-full p-2.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/40 border border-pink-500/40 text-pink-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            🏢 Portal do Cliente Exclusivo
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-zinc-800" />
          <span className="flex-shrink mx-4 text-[10px] text-zinc-500 font-bold uppercase">Ou com credenciais</span>
          <div className="flex-grow border-t border-zinc-800" />
        </div>

        {/* Form Login */}
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1 font-semibold">E-mail Corporativo</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-semibold">Senha Secreta</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:brightness-110 font-black text-white text-xs shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>ENTRAR NO IBEC FLOW</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-[10px] text-zinc-500 text-center font-mono">
          IBEC FLOW v3.5 Enterprise • Criptografia de Ponta a Ponta
        </p>

      </div>

    </div>
  );
};
