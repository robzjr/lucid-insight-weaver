
import { supabase } from '@/integrations/supabase/client';

export const verifyRecaptcha = async (token: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('verify-recaptcha', {
      body: { token },
    });

    if (error) {
      console.error('reCAPTCHA verification error:', error);
      return false;
    }

    return data?.success || false;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
};
