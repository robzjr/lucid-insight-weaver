import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get('transactionId');
  const paymentUrl = searchParams.get('paymentUrl');
  const [status, setStatus] = useState<string | null>(null);

  // Redirect to Paymob if paymentUrl is present (initial navigation)
  useEffect(() => {
    if (paymentUrl && transactionId) {
      const returnUrl = `${window.location.origin}/payment-status?transactionId=${transactionId}`;
      const url = decodeURIComponent(paymentUrl) + `&return_url=${encodeURIComponent(returnUrl)}`;
      window.location.replace(url);
    }
  }, [paymentUrl, transactionId]);

  // Poll for transaction status when returning from Paymob
  useEffect(() => {
    if (!paymentUrl && transactionId) {
      const interval = setInterval(async () => {
        const { data, error } = await supabase
          .from('payment_transactions')
          .select('status')
          .eq('id', transactionId)
          .single();

        if (error) {
          toast.error('Failed to check payment status');
          clearInterval(interval);
          return;
        }

        if (data?.status) {
          setStatus(data.status);
          if (data.status === 'completed' || data.status === 'failed') {
            clearInterval(interval);
            setTimeout(() => navigate('/'), 3000);
          }
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [paymentUrl, transactionId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === 'completed' && <p className="text-green-600 text-xl">Payment successful! Redirecting...</p>}
      {status === 'failed' && <p className="text-red-600 text-xl">Payment failed. Redirecting...</p>}
      {!status && <p className="text-lg">Checking payment status...</p>}
    </div>
  );
};

export default PaymentStatus;
