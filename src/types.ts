export type UserRole = 
  | 'admin' 
  | 'operacional' 
  | 'operador'
  | 'financeiro' 
  | 'motorista' 
  | 'cliente' 
  | 'supervisor';

export type ServiceStatus = 
  | 'aguardando'
  | 'agendado'
  | 'despachado'
  | 'aceito'
  | 'em_deslocamento'
  | 'coletado'
  | 'em_transito'
  | 'entregue'
  | 'retorno'
  | 'finalizado'
  | 'cancelado';

export type ServiceType = 
  | 'entrega'
  | 'coleta'
  | 'retirada'
  | 'retorno'
  | 'transferencia'
  | 'multiplas';

export type VehicleType = 
  | 'moto'
  | 'carro'
  | 'utilitario'
  | 'van'
  | 'caminhao';

export type DriverStatus = 
  | 'online'
  | 'offline'
  | 'em_atendimento'
  | 'disponivel';

export type VehicleStatus = 
  | 'ativo'
  | 'manutencao'
  | 'inativo';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  email?: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  companyName?: string;
  clientId?: string;
  driverId?: string;
  active?: boolean;
  createdAt?: string;
}

export interface Client {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  ie: string;
  responsavel: string;
  telefone: string;
  whatsapp: string;
  email: string;
  endereco: string;
  cep: string;
  cidade: string;
  estado: string;
  centroCustoPadrao: string;
  formaPagamento: 'Faturado 15 dias' | 'Faturado 30 dias' | 'À vista' | 'PIX' | 'Cartão';
  tabelaPrecos: 'Padrão 2026' | 'Express Premium' | 'Corporativo VIP' | 'E-commerce Especial';
  observacoes?: string;
  documentosCount?: number;
  totalServices: number;
  totalSpent: number;
  createdAt: string;
}

export interface Driver {
  id: string;
  foto: string;
  nome: string;
  cpf: string;
  cnh: string;
  categoria: string;
  validadeCnh: string;
  telefone: string;
  whatsapp: string;
  pix: string;
  banco: string;
  placa: string;
  modelo: string;
  tipoVeiculo: VehicleType;
  status: DriverStatus;
  rating: number;
  location: {
    lat: number;
    lng: number;
    address: string;
    lastUpdate: string;
  };
  activeServiceId?: string;
  completedToday: number;
  totalKmToday: number;
}

export interface Vehicle {
  id: string;
  tipo: VehicleType;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  combustivel: 'Flex' | 'Diesel' | 'Gasolina' | 'Elétrico';
  capacidade: string;
  renavam: string;
  seguro: string;
  status: VehicleStatus;
  driverName?: string;
}

export interface Waypoint {
  id: string;
  address: string;
  lat?: number;
  lng?: number;
  contactName?: string;
  contactPhone?: string;
  notes?: string;
  isCompleted?: boolean;
}

export interface TimelineEvent {
  id: string;
  serviceId: string;
  status: ServiceStatus;
  description: string;
  updatedBy: string;
  role: string;
  timestamp: string;
  location?: string;
}

export interface ServiceOrder {
  id: string;
  osNumber: string;
  date: string;
  time: string;
  clientId: string;
  clientName: string;
  solicitante: string;
  telefone: string;
  whatsapp: string;
  centroCusto: string;
  serviceType: ServiceType;
  vehicleType: VehicleType;
  driverId?: string;
  driverName?: string;
  driverPhoto?: string;
  driverPhone?: string;
  origin: {
    address: string;
    lat: number;
    lng: number;
    contact?: string;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
    contact?: string;
  };
  stopovers: Waypoint[];
  distanceKm: number;
  estimatedTimeMin: number;
  tollValue: number;
  priceCharged: number;
  driverCost: number;
  commission: number;
  profit: number;
  nossoPedido?: string;
  status: ServiceStatus;
  isScheduled?: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
  proofPhoto?: string;
  signature?: string;
  receivedByName?: string;
  receivedByDoc?: string;
  qrCode: string;
  barcode: string;
  notes?: string;
  attachments?: string[];
  timeline: TimelineEvent[];
  trackingUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialRecord {
  id: string;
  type: 'receita' | 'despesa';
  category: string;
  description: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: 'pago' | 'pendente' | 'atrasado';
  paymentMethod: 'pix' | 'ted' | 'boleto' | 'cartao';
  clientId?: string;
  clientName?: string;
  driverId?: string;
  driverName?: string;
  osNumber?: string;
  centroCusto?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
  browser: string;
}

export interface AutomationLog {
  id: string;
  type: 'whatsapp' | 'email' | 'sms';
  recipient: string;
  event: string;
  status: 'enviado' | 'falha' | 'pendente';
  timestamp: string;
  osNumber?: string;
}
