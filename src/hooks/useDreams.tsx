
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Dream {
  id: string;
  dreamText: string;
  createdAt: string;
  interpretations?: {
    islamic: string;
    spiritual: string;
    psychological: string;
  };
}

export const useDreams = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: dreams = [], isLoading } = useQuery({
    queryKey: ['dreams', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: dreamsData, error: dreamsError } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (dreamsError) throw dreamsError;

      const dreamsWithInterpretations = await Promise.all(
        dreamsData.map(async (dream) => {
          const { data: interpretations } = await supabase
            .from('interpretations')
            .select('*')
            .eq('dream_id', dream.id);

          const interpretationMap = interpretations?.reduce((acc, interp) => {
            acc[interp.type] = interp.content;
            return acc;
          }, {} as Record<string, string>) || {};

          return {
            id: dream.id,
            dreamText: dream.dream_text,
            createdAt: new Date(dream.created_at).toLocaleDateString(),
            interpretations: interpretationMap.islamic || interpretationMap.spiritual || interpretationMap.psychological
              ? {
                  islamic: interpretationMap.islamic || '',
                  spiritual: interpretationMap.spiritual || '',
                  psychological: interpretationMap.psychological || ''
                }
              : undefined
          };
        })
      );

      return dreamsWithInterpretations;
    },
    enabled: !!user,
  });

  const saveDreamMutation = useMutation({
    mutationFn: async ({ dreamText, interpretations }: { 
      dreamText: string; 
      interpretations: { islamic: string; spiritual: string; psychological: string } 
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: dreamData, error: dreamError } = await supabase
        .from('dreams')
        .insert({
          user_id: user.id,
          dream_text: dreamText,
        })
        .select()
        .single();

      if (dreamError) throw dreamError;

      const interpretationInserts = Object.entries(interpretations).map(([type, content]) => ({
        dream_id: dreamData.id,
        type,
        content,
      }));

      const { error: interpretationsError } = await supabase
        .from('interpretations')
        .insert(interpretationInserts);

      if (interpretationsError) throw interpretationsError;

      return dreamData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dreams'] });
      toast.success('Dream saved to your journal!');
    },
    onError: (error) => {
      console.error('Error saving dream:', error);
      toast.error('Failed to save dream');
    },
  });

  const interpretDreamMutation = useMutation({
    mutationFn: async (dreamText: string) => {
      const { data, error } = await supabase.functions.invoke('interpret-dream', {
        body: { dreamText }
      });

      if (error) throw error;
      return data.interpretations;
    },
    onError: (error) => {
      console.error('Error interpreting dream:', error);
      toast.error('Failed to analyze dream. Please try again.');
    },
  });

  return {
    dreams,
    isLoading,
    saveDream: saveDreamMutation.mutate,
    interpretDream: interpretDreamMutation.mutate,
    isInterpreting: interpretDreamMutation.isPending,
    isSaving: saveDreamMutation.isPending,
    interpretationResult: interpretDreamMutation.data,
    interpretationError: interpretDreamMutation.error,
  };
};
