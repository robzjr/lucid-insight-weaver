
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
      if (!user) {
        console.error('incrementUsage called without user');
        throw new Error('User not authenticated');
      }

      // Fetch current usage data directly to ensure we have the latest data
      const { data: currentUsage, error: fetchError } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching current usage:', fetchError);
        throw fetchError;
      }

      // If no usage record exists, create one first
      if (!currentUsage) {
        console.log('Creating new usage record for user:', user.id);
        const { data: newUsage, error: createError } = await supabase
          .from('user_usage')
          .insert({
            user_id: user.id,
            free_interpretations_used: 1, // Start with 1 since we're using one now
            paid_interpretations_remaining: 0
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating usage record:', createError);
          throw createError;
        }
        
        console.log('Created new usage record:', newUsage);
        return;
      }

      // Determine how to decrement usage
      const paidLeft = currentUsage.paid_interpretations_remaining ?? 0;
      const freeUsed = currentUsage.free_interpretations_used ?? 0;
      
      let updates: any = {};

      if (paidLeft > 0) {
        updates.paid_interpretations_remaining = paidLeft - 1;
        console.log('Decrementing paid interpretations:', paidLeft, '->', paidLeft - 1);
      } else if (freeUsed < 5) {
        updates.free_interpretations_used = freeUsed + 1;
        console.log('Incrementing free interpretations used:', freeUsed, '->', freeUsed + 1);
      } else {
        console.error('No remaining interpretation credits');
        throw new Error('No remaining interpretation credits');
      }

      if (Object.keys(updates).length === 0) {
        console.error('No updates to apply');
        throw new Error('No usage updates to apply');
      }

      updates.updated_at = new Date().toISOString();
      
      console.log('Updating user_usage with:', updates);

      const { error: updateError } = await supabase
        .from('user_usage')
        .update(updates)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating usage:', updateError);
        throw updateError;
      }

      console.log('Successfully updated usage');
    },
    onSuccess: () => {
      console.log('Usage increment successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['user-usage'] });
    },
    onError: (error) => {
      console.error('Error in incrementUsage mutation:', error);
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
