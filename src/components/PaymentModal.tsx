
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles, Zap, Star } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  isDark?: boolean;
}

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, isDark = true }: PaymentModalProps) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentPackages = [
    {
      id: 'basic',
      name: 'Basic Pack',
      interpretations: 10,
      price: 49.99,
      currency: 'EGP',
      icon: <Sparkles className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      interpretations: 25,
      price: 99.99,
      currency: 'EGP',
      icon: <Zap className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      id: 'unlimited',
      name: 'Ultimate Pack',
      interpretations: 100,
      price: 199.99,
      currency: 'EGP',
      icon: <Star className="h-6 w-6" />,
      color: 'from-orange-500 to-red-500',
      popular: false
    }
  ];

  const handlePayment = async (packageData: typeof paymentPackages[0]) => {
    if (!user) {
      toast.error('Please log in to continue');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: user.id,
          amount_cents: Math.round(packageData.price * 100),
          currency: packageData.currency,
          interpretations_granted: packageData.interpretations,
          status: 'pending'
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Call edge function to create Paymob payment
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          transactionId: transaction.id,
          amount: packageData.price,
          currency: packageData.currency,
          packageName: packageData.name,
          interpretations: packageData.interpretations
        }
      });

      if (error) throw error;

      // Redirect to Paymob payment page
      if (data?.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
        toast.success('Redirecting to payment...');
        onClose();
      } else {
        throw new Error('No payment URL received');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <DialogHeader>
          <DialogTitle className={`text-center text-2xl hologram-text ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Unlock More Dream Interpretations
          </DialogTitle>
          <p className={`text-center ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Choose a package to continue your dream journey with Ramel
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {paymentPackages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative transition-all duration-300 hover:scale-105 ${
                pkg.popular 
                  ? 'ring-2 ring-purple-500 ring-opacity-50' 
                  : ''
              } ${
                isDark 
                  ? 'glass-card border-slate-700' 
                  : 'bg-white border-slate-200'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center text-white`}>
                  {pkg.icon}
                </div>
                <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {pkg.name}
                </CardTitle>
                <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  {pkg.price} {pkg.currency}
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {pkg.interpretations} interpretations
                </p>
              </CardHeader>
              
              <CardContent>
                <Button
                  onClick={() => handlePayment(pkg)}
                  disabled={isProcessing}
                  className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105`}
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Choose Package'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className={`mt-6 p-4 rounded-lg border ${
          isDark 
            ? 'bg-slate-800/50 border-slate-700' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className={`text-sm font-medium ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Secure Payment by Paymob
            </span>
          </div>
          <p className={`text-xs ${
            isDark ? 'text-slate-500' : 'text-slate-600'
          }`}>
            Your payment is processed securely through Paymob. You'll be redirected to complete your purchase.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
