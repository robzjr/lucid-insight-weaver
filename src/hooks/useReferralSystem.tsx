
import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useReferralSystem = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check for referral code in URL when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('ref') || urlParams.get('referralCode');
    const referrerId = urlParams.get('referrerId');
    const referralCode = codeParam || (referrerId ? referrerId.slice(0, 8) : null);

    if (referralCode && user) {
      processReferral(referralCode);
      // Remove the referral params from the URL so they aren't processed again
      urlParams.delete('ref');
      urlParams.delete('referralCode');
      urlParams.delete('referrerId');
      const newQuery = urlParams.toString();
      const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [user]);

  const processReferralMutation = useMutation({
    mutationFn: async (referralCode: string) => {
      if (!user) throw new Error('User not authenticated');

      // Call edge function to process referral
      const { data, error } = await supabase.functions.invoke('process-referral', {
        body: { referralCode, newUserId: user.id }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Referral bonus applied! You both received 5 free interpretations!');
        queryClient.invalidateQueries({ queryKey: ['user-usage'] });
      }
    },
    onError: (error: any) => {
      console.error('Referral processing failed:', error);
      // Don't show error toast as this might confuse users
    },
  });

  const processReferral = (referralCode: string) => {
    processReferralMutation.mutate(referralCode);
  };

  const generateReferralLink = () => {
    if (!user) return '';
    const baseUrl = window.location.origin;
    const referralCode = user.id.slice(0, 8); // Use first 8 chars of user ID as referral code
    return `${baseUrl}?ref=${referralCode}`;
  };

  return {
    processReferral,
    generateReferralLink,
    isProcessing: processReferralMutation.isPending,
  };
};
