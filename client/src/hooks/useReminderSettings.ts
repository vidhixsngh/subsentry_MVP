import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/lib/supabase';

type ReminderSettings = Database['public']['Tables']['user_reminder_settings']['Row'];
type InsertReminderSettings = Database['public']['Tables']['user_reminder_settings']['Insert'];
type UpdateReminderSettings = Database['public']['Tables']['user_reminder_settings']['Update'];

export function useReminderSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch reminder settings
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['reminderSettings', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_reminder_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data as ReminderSettings | null;
    },
    enabled: !!user,
  });

  // Create or update reminder settings
  const saveMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_reminder_settings')
        .upsert({
          user_id: user.id,
          email: user.email || '',
          frequency: newSettings.frequency,
          days_before: newSettings.days_before,
          notifications_enabled: newSettings.notifications_enabled ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminderSettings'] });
    },
  });

  // Toggle notifications
  const toggleMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_reminder_settings')
        .update({ notifications_enabled: enabled })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminderSettings'] });
    },
  });

  return {
    settings,
    isLoading,
    error,
    saveSettings: saveMutation.mutate,
    toggleNotifications: toggleMutation.mutate,
    isSaving: saveMutation.isPending,
    isToggling: toggleMutation.isPending,
  };
}

// Hook for reminder logs
export function useReminderLogs(limit = 50) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['reminderLogs', user?.id, limit],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('reminder_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
