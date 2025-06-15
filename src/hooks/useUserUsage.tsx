
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface UserUsage {
  id: string;
  userId: string;
  freeInterpretationsUsed: number;
  paidInterpretationsRemaining: number;
  lastPaymentDate?: string;
}

export const useUserUsage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: usage, isLoading } = useQuery({
    queryKey: ['user-usage', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // If no usage record exists, create one
      if (!data) {
        const { data: newUsage, error: insertError } = await supabase
          .from('user_usage')
          .insert({
            user_id: user.id,
            free_interpretations_used: 0,
            paid_interpretations_remaining: 0
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return newUsage;
      }

      return data;
    },
    enabled: !!user,
  });

  const incrementUsageMutation = useMutation({
    mutationFn: async () => {
      if (!user || !usage) throw new Error('No user or usage data');

      // Fix: handle nulls and prevent empty updates
      const paidLeft = usage.paid_interpretations_remaining ?? 0;
      const freeUsed = usage.free_interpretations_used ?? 0;
      let updates: any = {};

      if (paidLeft > 0) {
        updates.paid_interpretations_remaining = paidLeft - 1;
        console.log('Decrementing paid_interpretations_remaining:', paidLeft, '->', paidLeft - 1);
      } else if (freeUsed < 5) {
        updates.free_interpretations_used = freeUsed + 1;
        console.log('Incrementing free_interpretations_used:', freeUsed, '->', freeUsed + 1);
      } else {
        // Should never reach here, caller checks canInterpret. But let's block an empty update anyway.
        throw new Error('No remaining interpretation credits.');
      }
      console.log('Updating user_usage with:', updates);

      const { error } = await supabase
        .from('user_usage')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error in usage update:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-usage'] });
    },
    onError: (error) => {
      console.error('Error updating usage:', error);
      toast.error('Failed to update usage');
    },
  });

  const canInterpret = usage ? 
    (usage.free_interpretations_used ?? 0) < 5 || (usage.paid_interpretations_remaining ?? 0) > 0 : 
    true;

  const interpretationsLeft = usage ? 
    Math.max(0, 5 - (usage.free_interpretations_used ?? 0)) + (usage.paid_interpretations_remaining ?? 0) :
    5;

  return {
    usage,
    isLoading,
    canInterpret,
    interpretationsLeft,
    incrementUsage: incrementUsageMutation.mutate,
    isUpdating: incrementUsageMutation.isPending,
  };
};
