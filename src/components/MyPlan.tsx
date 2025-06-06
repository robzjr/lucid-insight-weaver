
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, ArrowRight, Sparkles, Users } from 'lucide-react';
import { useUserUsage } from '@/hooks/useUserUsage';
import { useReferralSystem } from '@/hooks/useReferralSystem';
import { toast } from 'sonner';

interface MyPlanProps {
  onUpgrade: () => void;
  isDark?: boolean;
}

const MyPlan = ({ onUpgrade, isDark = true }: MyPlanProps) => {
  const { usage, interpretationsLeft } = useUserUsage();
  const { generateReferralLink } = useReferralSystem();
  
  const isFreeUser = interpretationsLeft <= 5;

  const handleReferFriend = () => {
    const referralLink = generateReferralLink();
    const referralText = `Check out Ramel - the AI-powered dream interpreter! Use my referral to get 5 free dream interpretations. Sign up here: ${referralLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Ramel - Dream Interpreter',
        text: referralText,
      });
    } else {
      navigator.clipboard.writeText(referralText);
      toast.success('Referral link copied to clipboard!');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl space-y-6">
      <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className={`text-lg flex items-center space-x-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {isFreeUser ? <Sparkles className="h-5 w-5 text-blue-400" /> : <Crown className="h-5 w-5 text-purple-400" />}
              <span>My Plan</span>
            </CardTitle>
            <Badge variant={isFreeUser ? 'secondary' : 'default'} className={isFreeUser ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}>
              {isFreeUser ? 'Basic Plan' : 'Premium Plan'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {isFreeUser ? 'Free Interpretations' : 'Premium Benefits'}
              </span>
              <span className={`text-lg font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {isFreeUser ? `${interpretationsLeft} left` : 'Unlimited'}
              </span>
            </div>
            
            {isFreeUser && (
              <>
                <div className={`w-full rounded-full h-3 mb-3 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      interpretationsLeft > 2 ? 'bg-green-500' : 
                      interpretationsLeft > 0 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${Math.max(0, Math.min(100, interpretationsLeft / 5 * 100))}%` }}
                  ></div>
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {interpretationsLeft === 0 ? 'No free interpretations remaining' : 
                   interpretationsLeft === 1 ? '1 interpretation remaining' : 
                   `${interpretationsLeft} interpretations remaining`}
                </p>
              </>
            )}
          </div>

          {isFreeUser && (
            <div className="space-y-3">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Ready to unlock unlimited interpretations and advanced features?
              </p>
              
              <div className="space-y-2">
                <Button 
                  onClick={onUpgrade} 
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
                
                <div className={`text-center py-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span className="text-sm">Don't want to pay now? No problem!</span>
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleReferFriend}
                  className={`w-full ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-50'}`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Refer a Friend & Get 5 Credits
                </Button>
                
                <p className={`text-xs text-center ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  Both you and your friend will receive 5 free interpretations!
                </p>
              </div>
            </div>
          )}

          {!isFreeUser && (
            <div className={`p-3 rounded-lg border ${isDark ? 'border-purple-500/30 bg-purple-950/20' : 'border-purple-300 bg-purple-50'}`}>
              <div className="flex items-center justify-center space-x-2">
                <Crown className="h-5 w-5 text-purple-500" />
                <span className={`font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                  Enjoying Premium Benefits
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyPlan;
