-- =======================================================
-- IBEC FLOW - SCHEMAS DO SUPABASE (BANCO DE DADOS POSTGRES)
-- Execute este script no SQL Editor do seu projeto Supabase
-- =======================================================

-- 1. Tabela de Clientes
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  ie TEXT,
  responsavel TEXT NOT NULL,
  telefone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT NOT NULL,
  endereco TEXT NOT NULL,
  cep TEXT,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  centro_custo_padrao TEXT,
  forma_pagamento TEXT,
  tabela_precos TEXT,
  observacoes TEXT,
  documentos_count INT DEFAULT 0,
  total_services INT DEFAULT 0,
  total_spent NUMERIC(12,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Motoristas
CREATE TABLE IF NOT EXISTS public.drivers (
  id TEXT PRIMARY KEY,
  foto TEXT,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL,
  cnh TEXT NOT NULL,
  categoria TEXT NOT NULL,
  validade_cnh TEXT,
  telefone TEXT NOT NULL,
  whatsapp TEXT,
  pix TEXT,
  banco TEXT,
  placa TEXT NOT NULL,
  modelo TEXT NOT NULL,
  tipo_veiculo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'disponivel',
  rating NUMERIC(3,2) DEFAULT 5.0,
  location JSONB,
  active_service_id TEXT,
  completed_today INT DEFAULT 0,
  total_km_today NUMERIC(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Veículos
CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  tipo TEXT NOT NULL,
  placa TEXT NOT NULL,
  modelo TEXT NOT NULL,
  marca TEXT NOT NULL,
  ano INT NOT NULL,
  combustivel TEXT NOT NULL,
  capacidade TEXT NOT NULL,
  renavam TEXT,
  seguro TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  driver_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Ordens de Serviço (OS)
CREATE TABLE IF NOT EXISTS public.service_orders (
  id TEXT PRIMARY KEY,
  os_number TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  client_id TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  solicitante TEXT NOT NULL,
  telefone TEXT NOT NULL,
  whatsapp TEXT,
  centro_custo TEXT,
  service_type TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  driver_id TEXT REFERENCES public.drivers(id) ON DELETE SET NULL,
  driver_name TEXT,
  driver_photo TEXT,
  driver_phone TEXT,
  origin JSONB NOT NULL,
  destination JSONB NOT NULL,
  stopovers JSONB DEFAULT '[]'::jsonb,
  distance_km NUMERIC(10,2) NOT NULL,
  estimated_time_min INT NOT NULL,
  toll_value NUMERIC(10,2) DEFAULT 0.00,
  price_charged NUMERIC(10,2) NOT NULL,
  driver_cost NUMERIC(10,2) NOT NULL,
  commission NUMERIC(10,2) NOT NULL,
  profit NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'aguardando',
  proof_photo TEXT,
  signature TEXT,
  received_by_name TEXT,
  received_by_doc TEXT,
  qr_code TEXT,
  barcode TEXT,
  notes TEXT,
  tracking_url TEXT,
  timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de Registros Financeiros
CREATE TABLE IF NOT EXISTS public.financial_records (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'receita' ou 'despesa'
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT NOT NULL DEFAULT 'pendente', -- 'pago', 'pendente', 'atrasado'
  payment_method TEXT NOT NULL,
  client_id TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
  client_name TEXT,
  driver_id TEXT REFERENCES public.drivers(id) ON DELETE SET NULL,
  driver_name TEXT,
  os_number TEXT,
  centro_custo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabela de Logs de Auditoria
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip TEXT,
  browser TEXT
);

-- 7. Tabela de Logs de Automação
CREATE TABLE IF NOT EXISTS public.automation_logs (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  event TEXT NOT NULL,
  status TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  os_number TEXT
);

-- 8. Tabela de Usuários / Funcionários
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'operador',
  phone TEXT,
  email TEXT,
  company_name TEXT,
  client_id TEXT,
  driver_id TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================
-- REGRAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- Habilita acesso de leitura e escrita pública/autenticada
-- =======================================================
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso Total Clientes" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Motoristas" ON public.drivers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Veiculos" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total OS" ON public.service_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Financeiro" ON public.financial_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Auditoria" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Automacao" ON public.automation_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Usuarios" ON public.users FOR ALL USING (true) WITH CHECK (true);
