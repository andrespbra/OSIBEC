import { 
  ServiceOrder, Client, Driver, Vehicle, FinancialRecord, User, AuditLog, AutomationLog 
} from '../types';

export interface DatabaseState {
  services: ServiceOrder[];
  clients: Client[];
  drivers: Driver[];
  vehicles: Vehicle[];
  financial: FinancialRecord[];
  auditLogs: AuditLog[];
  automationLogs: AutomationLog[];
  users: User[];
  lastUpdated?: string;
}

export type LiveSyncEvent = 
  | { type: 'SERVICE_UPSERT'; service: ServiceOrder }
  | { type: 'SERVICE_DELETE'; id: string; osNumber?: string }
  | { type: 'CLIENT_UPSERT'; client: Client }
  | { type: 'DRIVER_UPSERT'; driver: Driver }
  | { type: 'VEHICLE_UPSERT'; vehicle: Vehicle }
  | { type: 'FINANCIAL_UPSERT'; record: FinancialRecord }
  | { type: 'USER_UPSERT'; user: User }
  | { type: 'USER_DELETE'; id: string }
  | { type: 'SYNC_ALL'; data: DatabaseState }
  | { type: 'DATA_RESET'; data: DatabaseState }
  | { type: 'DATA_CLEAR'; data: DatabaseState };

export async function fetchAllOnlineData(): Promise<DatabaseState | null> {
  try {
    const res = await fetch('/api/data', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[Sync] Could not reach server /api/data, using local cache:', err);
    return null;
  }
}

export async function pushServiceOnline(service: ServiceOrder): Promise<boolean> {
  try {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service)
    });
    return res.ok;
  } catch (err) {
    console.warn('[Sync] Error pushing service online:', err);
    return false;
  }
}

export async function updateServiceOnline(id: string, updatedData: Partial<ServiceOrder>): Promise<boolean> {
  try {
    const res = await fetch(`/api/services/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    return res.ok;
  } catch (err) {
    console.warn('[Sync] Error updating service online:', err);
    return false;
  }
}

export async function deleteServiceOnline(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/services/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.warn('[Sync] Error deleting service online:', err);
    return false;
  }
}

export async function pushClientOnline(client: Client): Promise<boolean> {
  try {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    });
    return res.ok;
  } catch (err) {
    console.warn('[Sync] Error pushing client online:', err);
    return false;
  }
}

export async function pushDriverOnline(driver: Driver): Promise<boolean> {
  try {
    const res = await fetch('/api/drivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driver)
    });
    return res.ok;
  } catch (err) {
    console.warn('[Sync] Error pushing driver online:', err);
    return false;
  }
}

export async function pushVehicleOnline(vehicle: Vehicle): Promise<boolean> {
  try {
    const res = await fetch('/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle)
    });
    return res.ok;
  } catch (err) {
    console.warn('[Sync] Error pushing vehicle online:', err);
    return false;
  }
}

export async function pushFinancialOnline(record: FinancialRecord): Promise<boolean> {
  try {
    const res = await fetch('/api/financial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    return res.ok;
  } catch (err) {
    console.warn('[Sync] Error pushing financial online:', err);
    return false;
  }
}

export async function pushUserOnline(user: User): Promise<boolean> {
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    return res.ok;
  } catch (err) {
    console.warn('[Sync] Error pushing user online:', err);
    return false;
  }
}

export async function deleteUserOnline(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/users/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.warn('[Sync] Error deleting user online:', err);
    return false;
  }
}

export async function resetOnlineData(): Promise<boolean> {
  try {
    const res = await fetch('/api/reset', { method: 'POST' });
    return res.ok;
  } catch (err) {
    console.warn('[Sync] Error resetting online data:', err);
    return false;
  }
}

export async function clearOnlineData(): Promise<boolean> {
  try {
    const res = await fetch('/api/clear', { method: 'POST' });
    return res.ok;
  } catch (err) {
    console.warn('[Sync] Error clearing online data:', err);
    return false;
  }
}

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health', { cache: 'no-store' });
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function fetchServerVersion(): Promise<{ status: string; lastUpdated: string; servicesCount: number } | null> {
  try {
    const res = await fetch('/api/version', { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

/**
 * Resilient real-time synchronization manager with dual-channel (SSE + smart delta polling)
 */
export function subscribeToLiveSync(
  onEvent: (event: LiveSyncEvent) => void,
  onStatusChange?: (isConnected: boolean) => void
): () => void {
  let eventSource: EventSource | null = null;
  let pollInterval: any = null;
  let isClosed = false;
  let lastKnownUpdated: string = '';

  // 1. Initial health verification
  checkServerHealth().then((isHealthy) => {
    if (!isClosed) {
      onStatusChange?.(isHealthy);
    }
  });

  // 2. EventSource connection setup
  const connectSSE = () => {
    if (isClosed) return;

    try {
      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSource('/api/events');

      eventSource.onopen = () => {
        if (!isClosed) onStatusChange?.(true);
      };

      eventSource.onmessage = (e) => {
        if (!isClosed) onStatusChange?.(true);
        try {
          const payload = JSON.parse(e.data);
          if (payload && payload.type) {
            onEvent(payload as LiveSyncEvent);
          }
        } catch (err) {
          // ignore keepalive comments
        }
      };

      eventSource.addEventListener('connected', () => {
        if (!isClosed) onStatusChange?.(true);
      });

      eventSource.addEventListener('SERVICE_UPSERT', (e) => {
        try {
          const service = JSON.parse(e.data);
          onEvent({ type: 'SERVICE_UPSERT', service });
        } catch (err) {
          console.error('[LiveSync] Parse error:', err);
        }
      });

      eventSource.addEventListener('SERVICE_DELETE', (e) => {
        try {
          const data = JSON.parse(e.data);
          onEvent({ type: 'SERVICE_DELETE', id: data.id, osNumber: data.osNumber });
        } catch (err) {
          console.error('[LiveSync] Parse error:', err);
        }
      });

      eventSource.addEventListener('CLIENT_UPSERT', (e) => {
        try {
          const client = JSON.parse(e.data);
          onEvent({ type: 'CLIENT_UPSERT', client });
        } catch (err) {
          console.error('[LiveSync] Parse error:', err);
        }
      });

      eventSource.addEventListener('DRIVER_UPSERT', (e) => {
        try {
          const driver = JSON.parse(e.data);
          onEvent({ type: 'DRIVER_UPSERT', driver });
        } catch (err) {
          console.error('[LiveSync] Parse error:', err);
        }
      });

      eventSource.addEventListener('VEHICLE_UPSERT', (e) => {
        try {
          const vehicle = JSON.parse(e.data);
          onEvent({ type: 'VEHICLE_UPSERT', vehicle });
        } catch (err) {
          console.error('[LiveSync] Parse error:', err);
        }
      });

      eventSource.addEventListener('FINANCIAL_UPSERT', (e) => {
        try {
          const record = JSON.parse(e.data);
          onEvent({ type: 'FINANCIAL_UPSERT', record });
        } catch (err) {
          console.error('[LiveSync] Parse error:', err);
        }
      });

      eventSource.addEventListener('USER_UPSERT', (e) => {
        try {
          const user = JSON.parse(e.data);
          onEvent({ type: 'USER_UPSERT', user });
        } catch (err) {
          console.error('[LiveSync] Parse error:', err);
        }
      });

      eventSource.addEventListener('USER_DELETE', (e) => {
        try {
          const data = JSON.parse(e.data);
          onEvent({ type: 'USER_DELETE', id: data.id });
        } catch (err) {
          console.error('[LiveSync] Parse error:', err);
        }
      });

      eventSource.addEventListener('SYNC_ALL', (e) => {
        try {
          const data = JSON.parse(e.data);
          onEvent({ type: 'SYNC_ALL', data });
        } catch (err) {
          console.error('[LiveSync] Parse error:', err);
        }
      });

      eventSource.addEventListener('DATA_RESET', (e) => {
        try {
          const data = JSON.parse(e.data);
          onEvent({ type: 'DATA_RESET', data });
        } catch (err) {
          console.error('[LiveSync] Parse error:', err);
        }
      });

      eventSource.addEventListener('DATA_CLEAR', (e) => {
        try {
          const data = JSON.parse(e.data);
          onEvent({ type: 'DATA_CLEAR', data });
        } catch (err) {
          console.error('[LiveSync] Parse error:', err);
        }
      });

      eventSource.onerror = () => {
        // When SSE drops, verify HTTP health before marking as offline
        checkServerHealth().then((isHealthy) => {
          if (!isClosed) {
            onStatusChange?.(isHealthy);
          }
        });
      };
    } catch (err) {
      checkServerHealth().then((isHealthy) => {
        if (!isClosed) onStatusChange?.(isHealthy);
      });
    }
  };

  connectSSE();

  // 3. Fallback Smart Delta Poller (every 4 seconds)
  pollInterval = setInterval(async () => {
    if (isClosed) return;
    try {
      const ver = await fetchServerVersion();
      if (ver) {
        onStatusChange?.(true);
        if (lastKnownUpdated && ver.lastUpdated && ver.lastUpdated !== lastKnownUpdated) {
          // New data detected on another device, fetch delta
          const freshData = await fetchAllOnlineData();
          if (freshData) {
            onEvent({ type: 'SYNC_ALL', data: freshData });
          }
        }
        if (ver.lastUpdated) {
          lastKnownUpdated = ver.lastUpdated;
        }
      } else {
        const isHealthy = await checkServerHealth();
        onStatusChange?.(isHealthy);
      }
    } catch (err) {
      onStatusChange?.(false);
    }
  }, 4000);

  return () => {
    isClosed = true;
    if (pollInterval) clearInterval(pollInterval);
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
}
