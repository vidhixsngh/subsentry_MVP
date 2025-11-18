import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Types for our database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string | null;
          email: string;
          created_at: string;
          updated_at: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: string;
          category: string;
          renewal_date: string;
          billing_cycle: string;
          status: string;
          payment_method: string | null;
          notes: string | null;
          last_used_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          amount: string;
          category: string;
          renewal_date: string;
          billing_cycle: string;
          status?: string;
          payment_method?: string | null;
          notes?: string | null;
          last_used_date?: string | null;
        };
        Update: {
          name?: string;
          amount?: string;
          category?: string;
          renewal_date?: string;
          billing_cycle?: string;
          status?: string;
          payment_method?: string | null;
          notes?: string | null;
          last_used_date?: string | null;
        };
      };
      user_reminder_settings: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          frequency: string;
          days_before: number;
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          email: string;
          frequency: string;
          days_before?: number;
          notifications_enabled?: boolean;
        };
        Update: {
          email?: string;
          frequency?: string;
          days_before?: number;
          notifications_enabled?: boolean;
        };
      };
      reminder_logs: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string | null;
          email_sent_to: string;
          sent_at: string;
          status: string;
          error_message: string | null;
        };
      };
    };
  };
};
