import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import {
  INITIAL_CLIENTS, INITIAL_DRIVERS, INITIAL_VEHICLES,
  INITIAL_SERVICES, INITIAL_FINANCIAL, INITIAL_AUDIT, INITIAL_AUTOMATIONS,
  INITIAL_USERS
} from './src/data/initialData.js';

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json({ limit: '10mb' }));

// Persistent File Storage Path
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'ibec_database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseStore {
  services: any[];
  clients: any[];
  drivers: any[];
  vehicles: any[];
  financial: any[];
  auditLogs: any[];
  automationLogs: any[];
  users: any[];
  lastUpdated: string;
}

function loadStore(): DatabaseStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.services)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading database store:', err);
  }

  const defaultStore: DatabaseStore = {
    services: INITIAL_SERVICES,
    clients: INITIAL_CLIENTS,
    drivers: INITIAL_DRIVERS,
    vehicles: INITIAL_VEHICLES,
    financial: INITIAL_FINANCIAL,
    auditLogs: INITIAL_AUDIT,
    automationLogs: INITIAL_AUTOMATIONS,
    users: INITIAL_USERS,
    lastUpdated: new Date().toISOString()
  };

  saveStore(defaultStore);
  return defaultStore;
}

let store: DatabaseStore = loadStore();

function saveStore(newStore: DatabaseStore) {
  try {
    newStore.lastUpdated = new Date().toISOString();
    store = newStore;
    fs.writeFileSync(DATA_FILE, JSON.stringify(newStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database store:', err);
  }
}

// Optional Supabase Mirror Sync
const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xjiuiazligncwtncrehy.supabase.co';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXVpYXpsaWduY3d0bmNyZWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MTUxMjEsImV4cCI6MjEwMjA5MTEyMX0.CWwU_81JnfP-pRSzBEIkMOQOecnfxh1Vd_ailds-lT0';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

async function mirrorToSupabase(table: string, payload: any, action: 'upsert' | 'delete' = 'upsert') {
  if (!supabase) return;
  try {
    if (table === 'service_orders') {
      if (action === 'delete') {
        await supabase.from('service_orders').delete().eq('id', payload.id);
      } else {
        await supabase.from('service_orders').upsert({
          id: payload.id,
          os_number: payload.osNumber,
          date: payload.date || payload.serviceDate || new Date().toISOString().split('T')[0],
          time: payload.time || payload.serviceTime || '12:00',
          client_name: payload.clientName || 'Cliente',
          service_type: payload.serviceType || 'entrega',
          vehicle_type: payload.vehicleType || 'moto',
          status: payload.status || 'aguardando',
          price_charged: payload.priceCharged || 0
        });
      }
    }
  } catch (err) {
    // Ignore schema cache warnings in mirror sync
  }
}

// Connected SSE Clients for Live Real-Time Multi-Device Sync
const sseClients: Response[] = [];

function broadcast(eventType: string, data: any) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    try {
      sseClients[i].write(message);
    } catch (e) {
      sseClients.splice(i, 1);
    }
  }
}

// -------------------------------------------------------------
// API ENDPOINTS FOR MULTI-COMPUTER LIVE SYNCHRONIZATION
// -------------------------------------------------------------

// Real-Time SSE Stream Endpoint
app.get('/api/events', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': '*'
  });

  // Send initial connection handshake immediately
  res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', time: new Date().toISOString() })}\n\n`);
  res.write(`data: ${JSON.stringify({ type: 'connected', time: new Date().toISOString() })}\n\n`);

  sseClients.push(res);

  const keepAliveInterval = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch (err) {
      clearInterval(keepAliveInterval);
    }
  }, 10000);

  req.on('close', () => {
    clearInterval(keepAliveInterval);
    const index = sseClients.indexOf(res);
    if (index !== -1) {
      sseClients.splice(index, 1);
    }
  });
});

// Version & Last Updated timestamp endpoint for fast delta checking
app.get('/api/version', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    lastUpdated: store.lastUpdated,
    servicesCount: (store.services || []).length
  });
});

// Full Data Fetch Endpoint
app.get('/api/data', (_req: Request, res: Response) => {
  res.json({
    services: store.services || [],
    clients: store.clients || [],
    drivers: store.drivers || [],
    vehicles: store.vehicles || [],
    financial: store.financial || [],
    auditLogs: store.auditLogs || [],
    automationLogs: store.automationLogs || [],
    users: store.users || [],
    lastUpdated: store.lastUpdated
  });
});

// Services CRUD
app.get('/api/services', (_req: Request, res: Response) => {
  res.json(store.services || []);
});

app.post('/api/services', (req: Request, res: Response) => {
  const service = req.body;
  if (!service || !service.id) {
    return res.status(400).json({ error: 'Invalid service payload' });
  }

  const existingIndex = store.services.findIndex(s => s.id === service.id);
  let updatedList = [...store.services];

  if (existingIndex >= 0) {
    updatedList[existingIndex] = { ...updatedList[existingIndex], ...service, updatedAt: new Date().toISOString() };
  } else {
    updatedList = [service, ...updatedList];
  }

  saveStore({ ...store, services: updatedList });
  mirrorToSupabase('service_orders', service, 'upsert');
  broadcast('SERVICE_UPSERT', service);

  res.json({ success: true, service });
});

app.put('/api/services/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const existingIndex = store.services.findIndex(s => s.id === id);
  if (existingIndex === -1) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const merged = { ...store.services[existingIndex], ...updateData, updatedAt: new Date().toISOString() };
  const updatedList = [...store.services];
  updatedList[existingIndex] = merged;

  saveStore({ ...store, services: updatedList });
  mirrorToSupabase('service_orders', merged, 'upsert');
  broadcast('SERVICE_UPSERT', merged);

  res.json({ success: true, service: merged });
});

app.delete('/api/services/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const target = store.services.find(s => s.id === id);
  const updatedList = store.services.filter(s => s.id !== id);

  saveStore({ ...store, services: updatedList });
  mirrorToSupabase('service_orders', { id }, 'delete');
  broadcast('SERVICE_DELETE', { id, osNumber: target?.osNumber });

  res.json({ success: true });
});

// Clients CRUD
app.post('/api/clients', (req: Request, res: Response) => {
  const client = req.body;
  const existingIdx = store.clients.findIndex(c => c.id === client.id);
  let updatedList = [...store.clients];

  if (existingIdx >= 0) {
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...client };
  } else {
    updatedList = [client, ...updatedList];
  }

  saveStore({ ...store, clients: updatedList });
  broadcast('CLIENT_UPSERT', client);
  res.json({ success: true, client });
});

// Drivers CRUD
app.post('/api/drivers', (req: Request, res: Response) => {
  const driver = req.body;
  const existingIdx = store.drivers.findIndex(d => d.id === driver.id);
  let updatedList = [...store.drivers];

  if (existingIdx >= 0) {
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...driver };
  } else {
    updatedList = [driver, ...updatedList];
  }

  saveStore({ ...store, drivers: updatedList });
  broadcast('DRIVER_UPSERT', driver);
  res.json({ success: true, driver });
});

// Vehicles CRUD
app.post('/api/vehicles', (req: Request, res: Response) => {
  const vehicle = req.body;
  const existingIdx = store.vehicles.findIndex(v => v.id === vehicle.id);
  let updatedList = [...store.vehicles];

  if (existingIdx >= 0) {
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...vehicle };
  } else {
    updatedList = [vehicle, ...updatedList];
  }

  saveStore({ ...store, vehicles: updatedList });
  broadcast('VEHICLE_UPSERT', vehicle);
  res.json({ success: true, vehicle });
});

// Financial CRUD
app.post('/api/financial', (req: Request, res: Response) => {
  const record = req.body;
  const existingIdx = store.financial.findIndex(f => f.id === record.id);
  let updatedList = [...store.financial];

  if (existingIdx >= 0) {
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...record };
  } else {
    updatedList = [record, ...updatedList];
  }

  saveStore({ ...store, financial: updatedList });
  broadcast('FINANCIAL_UPSERT', record);
  res.json({ success: true, record });
});

// Users CRUD
app.post('/api/users', (req: Request, res: Response) => {
  const user = req.body;
  const existingIdx = store.users.findIndex(u => u.id === user.id);
  let updatedList = [...store.users];

  if (existingIdx >= 0) {
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...user };
  } else {
    updatedList = [user, ...updatedList];
  }

  saveStore({ ...store, users: updatedList });
  broadcast('USER_UPSERT', user);
  res.json({ success: true, user });
});

app.delete('/api/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedList = store.users.filter(u => u.id !== id);
  saveStore({ ...store, users: updatedList });
  broadcast('USER_DELETE', { id });
  res.json({ success: true });
});

// Full Sync / Reset / Clear Endpoints
app.post('/api/sync-all', (req: Request, res: Response) => {
  const incoming = req.body;
  if (!incoming) return res.status(400).json({ error: 'No data provided' });

  const mergedStore: DatabaseStore = {
    services: incoming.services || store.services,
    clients: incoming.clients || store.clients,
    drivers: incoming.drivers || store.drivers,
    vehicles: incoming.vehicles || store.vehicles,
    financial: incoming.financial || store.financial,
    auditLogs: incoming.auditLogs || store.auditLogs,
    automationLogs: incoming.automationLogs || store.automationLogs,
    users: incoming.users || store.users,
    lastUpdated: new Date().toISOString()
  };

  saveStore(mergedStore);
  broadcast('SYNC_ALL', mergedStore);
  res.json({ success: true, lastUpdated: mergedStore.lastUpdated });
});

app.post('/api/reset', (_req: Request, res: Response) => {
  const resetStore: DatabaseStore = {
    services: INITIAL_SERVICES,
    clients: INITIAL_CLIENTS,
    drivers: INITIAL_DRIVERS,
    vehicles: INITIAL_VEHICLES,
    financial: INITIAL_FINANCIAL,
    auditLogs: INITIAL_AUDIT,
    automationLogs: INITIAL_AUTOMATIONS,
    users: INITIAL_USERS,
    lastUpdated: new Date().toISOString()
  };

  saveStore(resetStore);
  broadcast('DATA_RESET', resetStore);
  res.json({ success: true });
});

app.post('/api/clear', (_req: Request, res: Response) => {
  const clearedStore: DatabaseStore = {
    services: [],
    clients: [],
    drivers: [],
    vehicles: [],
    financial: [],
    auditLogs: [],
    automationLogs: [],
    users: INITIAL_USERS,
    lastUpdated: new Date().toISOString()
  };

  saveStore(clearedStore);
  broadcast('DATA_CLEAR', clearedStore);
  res.json({ success: true });
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString(), servicesCount: store.services.length });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVER CONFIGURATION
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 IBEC FLOW Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
