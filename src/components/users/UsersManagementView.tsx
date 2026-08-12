import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, UserPlus, Shield, KeyRound, Lock, Search, 
  CheckCircle2, XCircle, Edit3, Trash2, Phone, Building, UserCheck, ShieldAlert
} from 'lucide-react';
import { User, UserRole } from '../../types';

export const UsersManagementView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, currentUser, clients, drivers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '123',
    role: 'operador' as UserRole,
    phone: '',
    companyName: 'IBEC FLOW Matriz SP',
    clientId: '',
    driverId: '',
    active: true
  });

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      username: '',
      password: '123',
      role: 'operador',
      phone: '',
      companyName: 'IBEC FLOW Matriz SP',
      clientId: '',
      driverId: '',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password || '123',
      role: user.role,
      phone: user.phone || '',
      companyName: user.companyName || 'IBEC FLOW Matriz SP',
      clientId: user.clientId || '',
      driverId: user.driverId || '',
      active: user.active !== false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim()) return;

    if (editingUser) {
      updateUser(editingUser.id, {
        name: formData.name.trim(),
        role: formData.role,
        phone: formData.phone,
        password: formData.password,
        companyName: formData.companyName,
        clientId: formData.clientId || undefined,
        driverId: formData.driverId || undefined,
        active: formData.active
      });
    } else {
      addUser({
        name: formData.name.trim(),
        username: formData.username.trim().toLowerCase(),
        password: formData.password || '123',
        role: formData.role,
        phone: formData.phone,
        companyName: formData.companyName,
        clientId: formData.clientId || undefined,
        driverId: formData.driverId || undefined,
        active: formData.active
      });
    }
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.companyName && u.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">👑 Administrador</span>;
      case 'operador':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">🎧 Operador OS</span>;
      case 'financeiro':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">💰 Financeiro</span>;
      case 'motorista':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">📱 Motorista</span>;
      case 'supervisor':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">👔 Supervisor</span>;
      case 'cliente':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">🏢 Cliente Portal</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300">{role}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header View */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Gestão de Funcionários & Controle de Acesso
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                Apenas Nome & Senha
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Cadastre e gerencie os perfis dos funcionários que acessam o IBEC FLOW sem necessidade de e-mail.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>Cadastrar Novo Funcionário</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80">
          <p className="text-[10px] font-bold text-zinc-500 uppercase">Total de Funcionários</p>
          <p className="text-2xl font-black text-white mt-1">{users.length}</p>
        </div>
        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80">
          <p className="text-[10px] font-bold text-emerald-500 uppercase">Contas Ativas</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{users.filter(u => u.active !== false).length}</p>
        </div>
        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80">
          <p className="text-[10px] font-bold text-purple-400 uppercase">Administradores</p>
          <p className="text-2xl font-black text-purple-300 mt-1">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80">
          <p className="text-[10px] font-bold text-indigo-400 uppercase">Operadores & Equipe</p>
          <p className="text-2xl font-black text-indigo-300 mt-1">{users.filter(u => u.role === 'operador' || u.role === 'financeiro').length}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome, usuario ou empresa..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-800/80 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['all', 'admin', 'operador', 'financeiro', 'motorista', 'cliente'].map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                selectedRole === role 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {role === 'all' ? 'Todos os Perfis' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 uppercase font-bold text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-4">Funcionário / Nome</th>
                <th className="p-4">Login (Nome de Usuário)</th>
                <th className="p-4">Senha</th>
                <th className="p-4">Perfil / Nível</th>
                <th className="p-4">Telefone</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-zinc-500">
                    Nenhum funcionário encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                    
                    {/* User Name & Company */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-300 font-bold flex items-center justify-center border border-purple-500/30">
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white">{user.name}</p>
                          <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {user.companyName || 'IBEC FLOW'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Username */}
                    <td className="p-4">
                      <span className="font-mono text-purple-300 bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-800/40">
                        {user.username}
                      </span>
                    </td>

                    {/* Password */}
                    <td className="p-4">
                      <span className="font-mono text-zinc-400">
                        {user.password ? '••••••••' : 'Sem senha'}
                      </span>
                    </td>

                    {/* Role Badge */}
                    <td className="p-4">
                      {getRoleBadge(user.role)}
                    </td>

                    {/* Phone */}
                    <td className="p-4 text-zinc-400">
                      {user.phone ? (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-zinc-500" />
                          {user.phone}
                        </span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>

                    {/* Active Status Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => updateUser(user.id, { active: !user.active })}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                          user.active !== false 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {user.active !== false ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Ativo</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            <span>Inativo</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(user)}
                        title="Editar Perfil"
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>

                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => {
                            if (confirm(`Tem certeza que deseja excluir o usuário '${user.username}'?`)) {
                              deleteUser(user.id);
                            }
                          }}
                          title="Excluir Usuário"
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-lg space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-purple-400" />
                {editingUser ? `Editar Funcionário: ${editingUser.name}` : 'Cadastrar Novo Funcionário'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo dos Santos"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Nome de Usuário (Login) *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingUser}
                    placeholder="Ex: carlos.santos"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  />
                  <p className="text-[9px] text-zinc-500 mt-0.5">Sem necessidade de e-mail</p>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Senha de Acesso *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 123456"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Perfil de Acesso (Role) *</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                  >
                    <option value="admin">👑 Administrador (Acesso Total)</option>
                    <option value="operador">🎧 Operador de OS</option>
                    <option value="financeiro">💰 Financeiro & Faturamento</option>
                    <option value="supervisor">👔 Supervisor Operacional</option>
                    <option value="motorista">📱 Motorista (App PWA)</option>
                    <option value="cliente">🏢 Portal do Cliente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(11) 98888-7777"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Empresa / Unidade</label>
                <input
                  type="text"
                  placeholder="IBEC FLOW Matriz SP"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Conditional Link to Driver or Client */}
              {formData.role === 'motorista' && (
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Vincular a Cadastro de Motorista Existente</label>
                  <select
                    value={formData.driverId}
                    onChange={e => setFormData({ ...formData, driverId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">-- Selecionar Motorista (Opcional) --</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.nome} - Placa: {d.placa}</option>
                    ))}
                  </select>
                </div>
              )}

              {formData.role === 'cliente' && (
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Vincular a Cliente Corporativo</label>
                  <select
                    value={formData.clientId}
                    onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">-- Selecionar Cliente --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.razaoSocial} (CNPJ: {c.cnpj})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={formData.active}
                  onChange={e => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-zinc-800 border-zinc-700"
                />
                <label htmlFor="activeCheck" className="text-zinc-300 font-semibold">
                  Conta Ativa (Pode efetuar login no sistema)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  {editingUser ? 'Salvar Alterações' : 'Cadastrar Funcionário'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
