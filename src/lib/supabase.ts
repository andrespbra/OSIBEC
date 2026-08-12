/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseUrl.length > 5 && 
    !supabaseUrl.includes('your-project') &&
    supabaseAnonKey && 
    supabaseAnonKey.length > 10 &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to log or handle Supabase sync status
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      message: 'Supabase não está configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no seu ambiente ou no Vercel.'
    };
  }

  try {
    const { data, error } = await supabase.from('clients').select('id').limit(1);
    if (error) {
      return { success: false, message: `Erro de conexão Supabase: ${error.message}` };
    }
    return { success: true, message: 'Conectado com sucesso ao banco PostgreSQL do Supabase!' };
  } catch (err: any) {
    return { success: false, message: `Falha ao conectar ao Supabase: ${err.message || err}` };
  }
}
