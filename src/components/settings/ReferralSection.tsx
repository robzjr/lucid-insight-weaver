
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useReferralSystem } from '@/hooks/useReferralSystem';

interface ReferralSectionProps {
  userEmail: string;
  isDark?: boolean;
}

const ReferralSection = ({ userEmail, isDark = true }: ReferralSectionProps) => {
  const { generateReferralLink } = useReferralSystem();
  const handleReferFriend = () => {
    const referralLink = generateReferralLink();
    const referralText = `Check out Ramel - the AI-powered dream interpreter! Use my referral to get 5 free dream interpretations. Sign up here: ${referralLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Ramel - Dream Interpreter',
        text: referralText
      });
    } else {
      navigator.clipboard.writeText(referralText);
      toast.success('Referral link copied to clipboard!');
    }
  };

  return (
    <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center space-x-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          <Users className="h-5 w-5" />
          <span>Refer Friends</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Share Ramel with friends and you both get 5 free dream interpretations!
          </p>
          <Button 
            onClick={handleReferFriend} 
            className={`w-full ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Refer a Friend
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralSection;
