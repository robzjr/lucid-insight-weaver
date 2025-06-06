
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Calendar, Infinity } from 'lucide-react';
import { useUserUsage } from '@/hooks/useUserUsage';

interface SubscriptionPlanProps {
  isDark?: boolean;
  onUpgrade: () => void;
}

const SubscriptionPlan = ({ isDark = true, onUpgrade }: SubscriptionPlanProps) => {
  const { usage, interpretationsLeft } = useUserUsage();

  const freePlanFeatures = [
    "5 dream interpretations per month",
    "Basic interpretation styles",
    "Save dreams to library",
    "Email support"
  ];

  const premiumPlanFeatures = [
    "Unlimited dream interpretations",
    "Advanced AI analysis",
    "Priority support",
    "Dream pattern insights",
    "Export dream journal",
    "Early access to new features"
  ];

  const getNextResetDate = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Choose Your Plan
        </h1>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Unlock the full potential of your dream journey
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card className={`relative ${
          isDark ? 'glass-card border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className={`text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Free Plan
              </CardTitle>
              <Badge variant="outline" className="border-green-500 text-green-500">
                Current Plan
              </Badge>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                $0
              </span>
              <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                /month
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-3 rounded-lg ${
              isDark ? 'bg-slate-800/50' : 'bg-slate-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Interpretations Used
                </span>
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {usage ? 5 - interpretationsLeft : 0}/5
                </span>
              </div>
              <div className={`w-full bg-slate-600 rounded-full h-2`}>
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${usage ? ((5 - interpretationsLeft) / 5) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Resets on {getNextResetDate()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {freePlanFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              className={`w-full ${
                isDark ? 'border-slate-600 text-slate-300' : 'border-slate-300'
              }`}
              disabled
            >
              Current Plan
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className={`relative border-2 border-purple-500 ${
          isDark ? 'glass-card' : 'bg-white'
        }`}>
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-1">
              <Crown className="h-3 w-3 mr-1" />
              Most Popular
            </Badge>
          </div>
          
          <CardHeader className="pt-8">
            <CardTitle className={`text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Premium Plan
            </CardTitle>
            <div className="flex items-baseline space-x-1">
              <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                $9.99
              </span>
              <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                /month
              </span>
            </div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Or $99.99/year (save 17%)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-3 rounded-lg border border-purple-500/30 ${
              isDark ? 'bg-purple-950/20' : 'bg-purple-50'
            }`}>
              <div className="flex items-center justify-center space-x-2">
                <Infinity className="h-5 w-5 text-purple-500" />
                <span className={`font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                  Unlimited Interpretations
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {premiumPlanFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Button 
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
