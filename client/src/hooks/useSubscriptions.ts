import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/lib/supabase';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type InsertSubscription = Database['public']['Tables']['subscriptions']['Insert'];
type UpdateSubscription = Database['public']['Tables']['subscriptions']['Update'];

export function useSubscriptions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all subscriptions
  const { data: subscriptions, isLoading, error } = useQuery({
    queryKey: ['subscriptions', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('renewal_date', { ascending: true });

      if (error) throw error;
      
      // Transform snake_case to camelCase for frontend
      return data.map((sub: any) => ({
        id: sub.id,
        userId: sub.user_id,
        name: sub.name,
        amount: sub.amount,
        category: sub.category,
        renewalDate: sub.renewal_date,
        billingCycle: sub.billing_cycle,
        status: sub.status,
        paymentMethod: sub.payment_method,
        notes: sub.notes,
        lastUsedDate: sub.last_used_date,
        createdAt: new Date(sub.created_at),
        updatedAt: new Date(sub.updated_at),
      }));
    },
    enabled: !!user,
  });

  // Create subscription
  const createMutation = useMutation({
    mutationFn: async (newSubscription: any) => {
      if (!user) throw new Error('User not authenticated');

      // Transform camelCase to snake_case for Supabase
      const dbSubscription = {
        user_id: user.id,
        name: newSubscription.name,
        amount: newSubscription.amount,
        category: newSubscription.category,
        renewal_date: newSubscription.renewalDate,
        billing_cycle: newSubscription.billingCycle,
        status: newSubscription.status || 'Pending',
        payment_method: newSubscription.paymentMethod || null,
        notes: newSubscription.notes || null,
        last_used_date: newSubscription.lastUsedDate || null,
      };

      console.log('Sending to Supabase:', dbSubscription);

      const { data, error } = await supabase
        .from('subscriptions')
        .insert(dbSubscription)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Success! Created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });

  // Update subscription
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      // Transform camelCase to snake_case for Supabase
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.renewalDate !== undefined) dbUpdates.renewal_date = updates.renewalDate;
      if (updates.billingCycle !== undefined) dbUpdates.billing_cycle = updates.billingCycle;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.paymentMethod !== undefined) dbUpdates.payment_method = updates.paymentMethod;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.lastUsedDate !== undefined) dbUpdates.last_used_date = updates.lastUsedDate;

      const { data, error } = await supabase
        .from('subscriptions')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });

  // Delete subscription
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });

  return {
    subscriptions: subscriptions || [],
    isLoading,
    error,
    createSubscription: createMutation.mutate,
    updateSubscription: updateMutation.mutate,
    deleteSubscription: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// Hook for single subscription
export function useSubscription(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subscription', id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      // Transform snake_case to camelCase for frontend
      return {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        amount: data.amount,
        category: data.category,
        renewalDate: data.renewal_date,
        billingCycle: data.billing_cycle,
        status: data.status,
        paymentMethod: data.payment_method,
        notes: data.notes,
        lastUsedDate: data.last_used_date,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    },
    enabled: !!user && !!id,
  });
}
