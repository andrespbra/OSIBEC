import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  User, UserRole, Client, Driver, Vehicle, ServiceOrder, FinancialRecord, 
  AuditLog, AutomationLog, ServiceStatus, ServiceType, VehicleType 
} from '../types';
import { 
  INITIAL_CLIENTS, INITIAL_DRIVERS, INITIAL_VEHICLES, 
  INITIAL_SERVICES, INITIAL_FINANCIAL, INITIAL_AUDIT, INITIAL_AUTOMATIONS,
  INITIAL_USERS
} from '../data/initialData';

import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  fetchAllOnlineData,
  pushServiceOnline,
  updateServiceOnline,
  deleteServiceOnline,
  pushClientOnline,
  pushDriverOnline,
  pushVehicleOnline,
  pushFinancialOnline,
  pushUserOnline,
  deleteUserOnline,
  resetOnlineData,
  clearOnlineData,
  subscribeToLiveSync,
  DatabaseState
} from '../lib/api';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  loginWithUsername: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (userId: string, updatedFields: Partial<User>) => void;
  deleteUser: (userId: string) => void;

  setRole: (role: UserRole) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isNewServiceModalOpen: boolean;
  setIsNewServiceModalOpen: (open: boolean) => void;
  selectedServiceForDetail: ServiceOrder | null;
  setSelectedServiceForDetail: (service: ServiceOrder | null) => void;
  editingService: ServiceOrder | null;
  setEditingService: (service: ServiceOrder | null) => void;
  
  clients: Client[];
  drivers: Driver[];
  vehicles: Vehicle[];
  services: ServiceOrder[];
  financial: FinancialRecord[];
  auditLogs: AuditLog[];
  automationLogs: AutomationLog[];
  toasts: Toast[];
  isSupabaseActive: boolean;
  isLiveSyncConnected: boolean;
  lastSyncTime: string;
  manualRefreshData: () => Promise<void>;

  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  createService: (newServiceData: Omit<ServiceOrder, 'id' | 'osNumber' | 'createdAt' | 'updatedAt' | 'timeline' | 'qrCode' | 'barcode' | 'trackingUrl'>) => ServiceOrder;
  updateService: (serviceId: string, updatedData: Partial<ServiceOrder>) => void;
  updateServiceStatus: (serviceId: string, status: ServiceStatus, notes?: string, proofPhoto?: string, signature?: string, receivedByName?: string, receivedByDoc?: string) => void;
  deleteService: (serviceId: string) => void;
  addClient: (client: Omit<Client, 'id' | 'totalServices' | 'totalSpent' | 'createdAt'>) => void;
  addDriver: (driver: Omit<Driver, 'id' | 'completedToday' | 'totalKmToday'>) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>) => void;
  updateDriverStatus: (driverId: string, status: Driver['status']) => void;
  resetToDefaults: () => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<ServiceOrder | null>(null);
  const [editingService, setEditingService] = useState<ServiceOrder | null>(null);
  const [isLiveSyncConnected, setIsLiveSyncConnected] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());

  const handleSetEditingService = (service: ServiceOrder | null) => {
    setEditingService(service);
    if (service) {
      setIsNewServiceModalOpen(true);
    }
  };

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ibec_system_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ibec_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persistent storage state with initial fallbacks
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('ibec_clients');
    return saved ? JSON.parse(saved) : [];
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('ibec_drivers');
    return saved ? JSON.parse(saved) : [];
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('ibec_vehicles');
    return saved ? JSON.parse(saved) : [];
  });

  const [services, setServices] = useState<ServiceOrder[]>(() => {
    const saved = localStorage.getItem('ibec_services');
    return saved ? JSON.parse(saved) : [];
  });

  const [financial, setFinancial] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem('ibec_financial');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('ibec_audit');
    return saved ? JSON.parse(saved) : [];
  });

  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(() => {
    const saved = localStorage.getItem('ibec_automations');
    return saved ? JSON.parse(saved) : [];
  });

  // Keep a ref to current selectedServiceForDetail for real-time detail syncing
  const selectedServiceRef = useRef<ServiceOrder | null>(selectedServiceForDetail);
  selectedServiceRef.current = selectedServiceForDetail;

  // -------------------------------------------------------------
  // MULTI-DEVICE ONLINE SYNCHRONIZATION ENGINE
  // -------------------------------------------------------------

  const applyRemoteState = (data: DatabaseState) => {
    if (data.services) setServices(data.services);
    if (data.clients) setClients(data.clients);
    if (data.drivers) setDrivers(data.drivers);
    if (data.vehicles) setVehicles(data.vehicles);
    if (data.financial) setFinancial(data.financial);
    if (data.auditLogs) setAuditLogs(data.auditLogs);
    if (data.automationLogs) setAutomationLogs(data.automationLogs);
    if (data.users && data.users.length > 0) setUsers(data.users);
    setLastSyncTime(new Date().toLocaleTimeString());
  };

  const manualRefreshData = async () => {
    const online = await fetchAllOnlineData();
    if (online) {
      applyRemoteState(online);
    }
  };

  // Initial load from server + real-time subscriptions
  useEffect(() => {
    // 1. Initial full fetch
    fetchAllOnlineData().then(onlineData => {
      if (onlineData) {
        applyRemoteState(onlineData);
      }
    });

    // 2. Real-time SSE listener
    const unsubscribe = subscribeToLiveSync(
      (event) => {
        setLastSyncTime(new Date().toLocaleTimeString());
        
        switch (event.type) {
          case 'SERVICE_UPSERT':
            setServices(prev => {
              const idx = prev.findIndex(s => s.id === event.service.id);
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = event.service;
                return updated;
              }
              return [event.service, ...prev];
            });
            if (selectedServiceRef.current && selectedServiceRef.current.id === event.service.id) {
              setSelectedServiceForDetail(event.service);
            }
            break;

          case 'SERVICE_DELETE':
            setServices(prev => prev.filter(s => s.id !== event.id));
            if (selectedServiceRef.current && selectedServiceRef.current.id === event.id) {
              setSelectedServiceForDetail(null);
            }
            break;

          case 'CLIENT_UPSERT':
            setClients(prev => {
              const idx = prev.findIndex(c => c.id === event.client.id);
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = event.client;
                return updated;
              }
              return [event.client, ...prev];
            });
            break;

          case 'DRIVER_UPSERT':
            setDrivers(prev => {
              const idx = prev.findIndex(d => d.id === event.driver.id);
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = event.driver;
                return updated;
              }
              return [event.driver, ...prev];
            });
            break;

          case 'VEHICLE_UPSERT':
            setVehicles(prev => {
              const idx = prev.findIndex(v => v.id === event.vehicle.id);
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = event.vehicle;
                return updated;
              }
              return [event.vehicle, ...prev];
            });
            break;

          case 'FINANCIAL_UPSERT':
            setFinancial(prev => {
              const idx = prev.findIndex(f => f.id === event.record.id);
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = event.record;
                return updated;
              }
              return [event.record, ...prev];
            });
            break;

          case 'USER_UPSERT':
            setUsers(prev => {
              const idx = prev.findIndex(u => u.id === event.user.id);
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = event.user;
                return updated;
              }
              return [...prev, event.user];
            });
            break;

          case 'USER_DELETE':
            setUsers(prev => prev.filter(u => u.id !== event.id));
            break;

          case 'SYNC_ALL':
          case 'DATA_RESET':
          case 'DATA_CLEAR':
            if (event.data) applyRemoteState(event.data);
            break;
        }
      },
      (isConnected) => {
        setIsLiveSyncConnected(isConnected);
      }
    );

    // 3. Auto-sync on window focus (guarantees fresh data when user switches tabs or returns)
    const handleFocus = () => {
      manualRefreshData();
    };
    window.addEventListener('focus', handleFocus);

    // 4. Periodic heartbeat refresh every 15 seconds
    const interval = setInterval(() => {
      manualRefreshData();
    }, 15000);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  // Sync users & currentUser to local storage
  useEffect(() => {
    localStorage.setItem('ibec_system_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ibec_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ibec_current_user');
    }
  }, [currentUser]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('ibec_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('ibec_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('ibec_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('ibec_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('ibec_financial', JSON.stringify(financial));
  }, [financial]);

  useEffect(() => {
    localStorage.setItem('ibec_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('ibec_automations', JSON.stringify(automationLogs));
  }, [automationLogs]);

  // Dark / Light body class toggler
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setRole = (role: UserRole) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    }
    addToast({
      title: `Modo alterado para ${role.toUpperCase()}`,
      description: `Visualização e permissões adaptadas para o perfil de ${role}.`,
      type: 'info'
    });
    // Auto switch active tab based on role if needed
    if (role === 'motorista') {
      setActiveTab('driver-app');
    } else if (role === 'cliente') {
      setActiveTab('client-portal');
    } else if (activeTab === 'driver-app' || activeTab === 'client-portal') {
      setActiveTab('dashboard');
    }
  };

  const logAudit = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Sistema',
      userRole: currentUser?.role || 'admin',
      action,
      details,
      timestamp: new Date().toISOString(),
      ip: '189.120.45.' + Math.floor(Math.random() * 200 + 10),
      browser: 'IBEC Web App (Cloud Platform)'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const loginWithUsername = (usernameInput: string, passwordInput: string): boolean => {
    const cleanUsername = usernameInput.trim().toLowerCase();
    const foundUser = users.find(
      u => u.username.toLowerCase() === cleanUsername && u.password === passwordInput
    );

    if (foundUser) {
      if (foundUser.active === false) {
        addToast({ title: 'Acesso Negado', description: 'Este usuário está desativado pelo Administrador.', type: 'error' });
        return false;
      }
      setCurrentUser(foundUser);
      logAudit('USER_LOGIN', `Usuário '${foundUser.username}' (${foundUser.name}) realizou login.`);
      addToast({ title: `Bem-vindo, ${foundUser.name}!`, description: `Perfil ativo: ${foundUser.role.toUpperCase()}`, type: 'success' });
      return true;
    }

    addToast({ title: 'Falha no Login', description: 'Nome de usuário ou senha incorretos.', type: 'error' });
    return false;
  };

  const logout = () => {
    if (currentUser) {
      logAudit('USER_LOGOUT', `Usuário '${currentUser.username}' encerrou a sessão.`);
    }
    setCurrentUser(null);
    addToast({ title: 'Sessão Encerrada', description: 'Você saiu do sistema com segurança.', type: 'info' });
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const cleanUsername = userData.username.trim();
    const exists = users.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase());
    if (exists) {
      addToast({ title: 'Usuário Existente', description: `O nome de usuário '${cleanUsername}' já está em uso. Escolha outro.`, type: 'warning' });
      return;
    }

    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      username: cleanUsername,
      password: userData.password || '123',
      createdAt: new Date().toISOString(),
      active: userData.active !== undefined ? userData.active : true
    };

    setUsers(prev => [newUser, ...prev]);
    pushUserOnline(newUser);

    if (supabase) {
      supabase.from('users').insert([{
        id: newUser.id,
        username: newUser.username,
        password: newUser.password,
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
        email: newUser.email,
        company_name: newUser.companyName,
        client_id: newUser.clientId,
        driver_id: newUser.driverId,
        active: newUser.active,
        created_at: newUser.createdAt
      }]).then(({ error }) => {
        if (error) console.log('Supabase sync user insert error:', error.message);
      });
    }

    logAudit('USER_CREATE', `Novo funcionário '${newUser.username}' (${newUser.name}) cadastrado pelo admin.`);
    addToast({ title: 'Funcionário Cadastrado', description: `Usuário '${newUser.username}' criado com sucesso para ${newUser.name}!`, type: 'success' });
  };

  const updateUser = (userId: string, updatedFields: Partial<User>) => {
    let updatedObj: User | null = null;
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, ...updatedFields };
        updatedObj = updated;
        return updated;
      }
      return u;
    }));

    if (updatedObj) {
      pushUserOnline(updatedObj);
    }

    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updatedFields } : null);
    }

    if (supabase) {
      supabase.from('users').update({
        name: updatedFields.name,
        role: updatedFields.role,
        phone: updatedFields.phone,
        password: updatedFields.password,
        active: updatedFields.active,
        company_name: updatedFields.companyName
      }).eq('id', userId).then(({ error }) => {
        if (error) console.log('Supabase user update error:', error.message);
      });
    }

    logAudit('USER_UPDATE', `Dados do usuário ID ${userId} atualizados pelo admin.`);
    addToast({ title: 'Usuário Atualizado', description: 'Perfil e permissões do usuário salvos com sucesso.', type: 'info' });
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    deleteUserOnline(userId);

    if (supabase) {
      supabase.from('users').delete().eq('id', userId).then(({ error }) => {
        if (error) console.log('Supabase user delete error:', error.message);
      });
    }

    logAudit('USER_DELETE', `Usuário ID ${userId} removido pelo admin.`);
    addToast({ title: 'Usuário Removido', description: 'O funcionário foi excluído do cadastro.', type: 'warning' });
  };

  const triggerAutomations = (osNumber: string, event: string, clientPhone?: string, driverPhone?: string) => {
    const logs: AutomationLog[] = [];
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (clientPhone) {
      logs.push({
        id: `aut-${Date.now()}-1`,
        type: 'whatsapp',
        recipient: clientPhone,
        event: `[WhatsApp] ${event} - Link Rastreio`,
        status: 'enviado',
        timestamp: now,
        osNumber
      });
    }

    if (driverPhone) {
      logs.push({
        id: `aut-${Date.now()}-2`,
        type: 'whatsapp',
        recipient: driverPhone,
        event: `[WhatsApp] Notificação OS ${osNumber}`,
        status: 'enviado',
        timestamp: now,
        osNumber
      });
    }

    logs.push({
      id: `aut-${Date.now()}-3`,
      type: 'email',
      recipient: 'notificacoes@ibecflow.com',
      event: `[Email] Status OS ${osNumber} alterado para ${event}`,
      status: 'enviado',
      timestamp: now,
      osNumber
    });

    setAutomationLogs(prev => [...logs, ...prev]);
  };

  const createService = (newServiceData: Omit<ServiceOrder, 'id' | 'osNumber' | 'createdAt' | 'updatedAt' | 'timeline' | 'qrCode' | 'barcode' | 'trackingUrl'>): ServiceOrder => {
    const nextNum = 1000 + services.length + 1;
    const osNumber = `OS-2026-${nextNum}`;
    const nowISO = new Date().toISOString();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newService: ServiceOrder = {
      ...newServiceData,
      id: `os-${nextNum}`,
      osNumber,
      qrCode: `IBEC-${osNumber}-QR-CODE-2026`,
      barcode: `789123456${nextNum}`,
      trackingUrl: `https://ibecflow.com/track/${osNumber}`,
      createdAt: nowISO,
      updatedAt: nowISO,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          serviceId: `os-${nextNum}`,
          status: newServiceData.status || 'aguardando',
          description: `Serviço cadastrado por ${currentUser.name} (${currentUser.role})`,
          updatedBy: currentUser.name,
          role: currentUser.role,
          timestamp: timeNow,
          location: newServiceData.origin.address
        }
      ]
    };

    setServices(prev => [newService, ...prev]);

    // Push new service to online backend server for real-time multi-computer sync
    pushServiceOnline(newService);

    // Update client stats
    setClients(prev => prev.map(c => {
      if (c.id === newService.clientId) {
        const updatedClient = {
          ...c,
          totalServices: c.totalServices + 1,
          totalSpent: c.totalSpent + newService.priceCharged
        };
        pushClientOnline(updatedClient);
        return updatedClient;
      }
      return c;
    }));

    // If driver assigned, update driver active service
    if (newService.driverId) {
      setDrivers(prev => prev.map(d => {
        if (d.id === newService.driverId) {
          const updatedDriver = {
            ...d,
            status: 'em_atendimento' as const,
            activeServiceId: newService.id
          };
          pushDriverOnline(updatedDriver);
          return updatedDriver;
        }
        return d;
      }));
    }

    // Generate financial receivable record
    const newFin: FinancialRecord = {
      id: `fin-${Date.now()}`,
      type: 'receita',
      category: 'Serviço de Transporte',
      description: `Faturamento ${osNumber} - ${newService.clientName}`,
      amount: newService.priceCharged,
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'pendente',
      paymentMethod: 'pix',
      clientId: newService.clientId,
      clientName: newService.clientName,
      osNumber: osNumber,
      centroCusto: newService.centroCusto
    };
    setFinancial(prev => [newFin, ...prev]);
    pushFinancialOnline(newFin);

    logAudit('SERVICE_CREATE', `Novo serviço ${osNumber} registrado para o cliente ${newService.clientName}`);
    triggerAutomations(osNumber, 'Novo Serviço Registrado', newService.whatsapp, newService.driverPhone);

    addToast({
      title: `⚡ OS ${osNumber} criada!`,
      description: `Serviço despachado para ${newService.driverName || 'fila de motoristas'} em tempo recorde.`,
      type: 'success'
    });

    return newService;
  };

  const updateServiceStatus = (
    serviceId: string, 
    status: ServiceStatus, 
    notes?: string, 
    proofPhoto?: string, 
    signature?: string, 
    receivedByName?: string, 
    receivedByDoc?: string
  ) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let updatedService: ServiceOrder | null = null;

    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        const newTimelineEvent = {
          id: `tl-${Date.now()}`,
          serviceId: s.id,
          status,
          description: `Status alterado para ${status.replace('_', ' ').toUpperCase()}${notes ? `: ${notes}` : ''}`,
          updatedBy: currentUser.name,
          role: currentUser.role,
          timestamp: timeNow,
          location: s.destination.address
        };

        const updated: ServiceOrder = {
          ...s,
          status,
          notes: notes || s.notes,
          proofPhoto: proofPhoto || s.proofPhoto,
          signature: signature || s.signature,
          receivedByName: receivedByName || s.receivedByName,
          receivedByDoc: receivedByDoc || s.receivedByDoc,
          updatedAt: new Date().toISOString(),
          timeline: [...s.timeline, newTimelineEvent]
        };

        updatedService = updated;
        return updated;
      }
      return s;
    }));

    if (updatedService) {
      const target: ServiceOrder = updatedService;

      // Push updated status to online server
      updateServiceOnline(serviceId, target);

      // If completed or finalized, release driver and update financial driver payout
      if (status === 'entregue' || status === 'finalizado') {
        if (target.driverId) {
          setDrivers(prev => prev.map(d => {
            if (d.id === target.driverId) {
              const updatedDrv = {
                ...d,
                status: 'disponivel' as const,
                activeServiceId: undefined,
                completedToday: d.completedToday + 1,
                totalKmToday: d.totalKmToday + target.distanceKm
              };
              pushDriverOnline(updatedDrv);
              return updatedDrv;
            }
            return d;
          }));

          // Driver cost payout record
          const driverFin: FinancialRecord = {
            id: `fin-drv-${Date.now()}`,
            type: 'despesa',
            category: 'Pagamento Motorista',
            description: `Repasse Motorista ${target.osNumber} - ${target.driverName}`,
            amount: target.driverCost,
            dueDate: new Date().toISOString().split('T')[0],
            paymentDate: new Date().toISOString().split('T')[0],
            status: 'pago',
            paymentMethod: 'pix',
            driverId: target.driverId,
            driverName: target.driverName,
            osNumber: target.osNumber
          };
          setFinancial(prev => [driverFin, ...prev]);
          pushFinancialOnline(driverFin);
        }
      }

      logAudit('SERVICE_STATUS_UPDATE', `OS ${target.osNumber} alterada para status ${status}`);
      triggerAutomations(target.osNumber, status.toUpperCase(), target.whatsapp, target.driverPhone);

      addToast({
        title: `Status OS ${target.osNumber} Atualizado`,
        description: `Novo status: ${status.replace('_', ' ').toUpperCase()}`,
        type: 'info'
      });
    }
  };

  const updateService = (serviceId: string, updatedData: Partial<ServiceOrder>) => {
    let updatedObj: ServiceOrder | null = null;

    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        const updated: ServiceOrder = {
          ...s,
          ...updatedData,
          updatedAt: new Date().toISOString()
        };
        updatedObj = updated;
        return updated;
      }
      return s;
    }));

    if (updatedObj) {
      const target: ServiceOrder = updatedObj;

      if (selectedServiceForDetail?.id === serviceId) {
        setSelectedServiceForDetail(target);
      }

      setFinancial(prev => prev.map(f => {
        if (f.osNumber === target.osNumber) {
          const updatedFin = {
            ...f,
            clientName: target.clientName,
            driverName: target.driverName,
            amount: target.priceCharged,
            netProfit: target.profit
          };
          pushFinancialOnline(updatedFin);
          return updatedFin;
        }
        return f;
      }));

      // Push update to backend server for online multi-device broadcast
      updateServiceOnline(serviceId, target);

      if (supabase) {
        supabase.from('service_orders').update({
          client_name: target.clientName,
          service_type: target.serviceType,
          vehicle_type: target.vehicleType,
          status: target.status,
          price_charged: target.priceCharged
        }).eq('id', serviceId).then(({ error }) => {
          if (error) console.log('Supabase service update error:', error.message);
        });
      }

      logAudit('SERVICE_UPDATE', `Ordem de Serviço ${target.osNumber} alterada com sucesso.`);
      addToast({
        title: `OS ${target.osNumber} Alterada`,
        description: 'Dados da Ordem de Serviço atualizados.',
        type: 'success'
      });
    }
  };

  const deleteService = (serviceId: string) => {
    const targetService = services.find(s => s.id === serviceId);
    const osNum = targetService ? targetService.osNumber : serviceId;

    setServices(prev => prev.filter(s => s.id !== serviceId));
    setFinancial(prev => prev.filter(f => f.osNumber !== osNum));

    if (selectedServiceForDetail?.id === serviceId) {
      setSelectedServiceForDetail(null);
    }

    deleteServiceOnline(serviceId);

    if (supabase) {
      supabase.from('service_orders').delete().eq('id', serviceId).then(({ error }) => {
        if (error) console.log('Supabase service delete error:', error.message);
      });
    }

    logAudit('SERVICE_DELETE', `Ordem de Serviço ${osNum} excluída do sistema.`);
    addToast({
      title: `Ordem de Serviço ${osNum} Excluída`,
      description: 'A OS foi removida permanentemente do sistema.',
      type: 'warning'
    });
  };

  const addClient = (clientData: Omit<Client, 'id' | 'totalServices' | 'totalSpent' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      totalServices: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString()
    };
    setClients(prev => [newClient, ...prev]);
    pushClientOnline(newClient);
    logAudit('CLIENT_CREATE', `Cliente ${newClient.nomeFantasia} cadastrado.`);
    addToast({ title: 'Cliente Cadastrado', description: newClient.nomeFantasia, type: 'success' });
  };

  const addDriver = (driverData: Omit<Driver, 'id' | 'completedToday' | 'totalKmToday'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: `drv-${Date.now()}`,
      completedToday: 0,
      totalKmToday: 0
    };
    setDrivers(prev => [newDriver, ...prev]);
    pushDriverOnline(newDriver);
    logAudit('DRIVER_CREATE', `Motorista ${newDriver.nome} cadastrado.`);
    addToast({ title: 'Motorista Cadastrado', description: newDriver.nome, type: 'success' });
  };

  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`
    };
    setVehicles(prev => [newVehicle, ...prev]);
    pushVehicleOnline(newVehicle);
    logAudit('VEHICLE_CREATE', `Veículo ${newVehicle.modelo} (${newVehicle.placa}) cadastrado.`);
    addToast({ title: 'Veículo Cadastrado', description: `${newVehicle.modelo} - ${newVehicle.placa}`, type: 'success' });
  };

  const addFinancialRecord = (recordData: Omit<FinancialRecord, 'id'>) => {
    const newRec: FinancialRecord = {
      ...recordData,
      id: `fin-${Date.now()}`
    };
    setFinancial(prev => [newRec, ...prev]);
    pushFinancialOnline(newRec);
    logAudit('FINANCIAL_CREATE', `Lançamento financeiro ${newRec.description} de R$ ${newRec.amount.toFixed(2)}`);
    addToast({ title: 'Lançamento Financeiro Criado', description: newRec.description, type: 'success' });
  };

  const updateDriverStatus = (driverId: string, status: Driver['status']) => {
    setDrivers(prev => prev.map(d => {
      if (d.id === driverId) {
        const updated = { ...d, status };
        pushDriverOnline(updated);
        return updated;
      }
      return d;
    }));
    logAudit('DRIVER_STATUS_CHANGE', `Motorista ID ${driverId} alterou status para ${status}`);
  };

  const clearAllData = () => {
    localStorage.removeItem('ibec_clients');
    localStorage.removeItem('ibec_drivers');
    localStorage.removeItem('ibec_vehicles');
    localStorage.removeItem('ibec_services');
    localStorage.removeItem('ibec_financial');
    localStorage.removeItem('ibec_audit');
    localStorage.removeItem('ibec_automations');
    localStorage.removeItem('ibec_system_users');
    setClients([]);
    setDrivers([]);
    setVehicles([]);
    setServices([]);
    setFinancial([]);
    setAuditLogs([]);
    setAutomationLogs([]);
    setUsers(INITIAL_USERS);
    clearOnlineData();
    addToast({ title: 'Dados Zerados', description: 'Todos os dados de demonstração foram limpos. Seu banco está pronto para novos cadastros realistas!', type: 'warning' });
  };

  const resetToDefaults = () => {
    localStorage.removeItem('ibec_clients');
    localStorage.removeItem('ibec_drivers');
    localStorage.removeItem('ibec_vehicles');
    localStorage.removeItem('ibec_services');
    localStorage.removeItem('ibec_financial');
    localStorage.removeItem('ibec_audit');
    localStorage.removeItem('ibec_automations');
    localStorage.removeItem('ibec_system_users');
    setClients(INITIAL_CLIENTS);
    setDrivers(INITIAL_DRIVERS);
    setVehicles(INITIAL_VEHICLES);
    setServices(INITIAL_SERVICES);
    setFinancial(INITIAL_FINANCIAL);
    setAuditLogs(INITIAL_AUDIT);
    setAutomationLogs(INITIAL_AUTOMATIONS);
    setUsers(INITIAL_USERS);
    resetOnlineData();
    addToast({ title: 'Dados Demo Restaurados', description: 'O banco de dados de teste foi restaurado com sucesso.', type: 'info' });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        loginWithUsername,
        logout,
        addUser,
        updateUser,
        deleteUser,
        setRole,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        isNewServiceModalOpen,
        setIsNewServiceModalOpen,
        selectedServiceForDetail,
        setSelectedServiceForDetail,
        editingService,
        setEditingService: handleSetEditingService,
        clients,
        drivers,
        vehicles,
        services,
        financial,
        auditLogs,
        automationLogs,
        toasts,
        isSupabaseActive: isSupabaseConfigured(),
        isLiveSyncConnected,
        lastSyncTime,
        manualRefreshData,
        addToast,
        removeToast,
        createService,
        updateService,
        updateServiceStatus,
        deleteService,
        addClient,
        addDriver,
        addVehicle,
        addFinancialRecord,
        updateDriverStatus,
        resetToDefaults,
        clearAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
