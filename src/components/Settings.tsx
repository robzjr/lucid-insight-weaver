
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Crown } from 'lucide-react';
import { useUserUsage } from '@/hooks/useUserUsage';

interface SettingsProps {
  userPreferences: {
    showIslamic: boolean;
    showSpiritual: boolean;
    showPsychological: boolean;
  };
  onUpdatePreferences: (preferences: any) => void;
  onLogout: () => void;
  userEmail: string;
  isDark?: boolean;
  onThemeToggle: () => void;
  onUpgrade: () => void;
}

const Settings = ({
  userPreferences,
  onUpdatePreferences,
  onLogout,
  userEmail,
  isDark = true,
  onThemeToggle,
  onUpgrade
}: SettingsProps) => {
  const { usage, interpretationsLeft } = useUserUsage();
  
  const handlePreferenceChange = (key: string, value: boolean) => {
    onUpdatePreferences({
      ...userPreferences,
      [key]: value
    });
  };

  const isPremiumUser = usage?.paid_interpretations_remaining > 0;
  const planType = isPremiumUser ? 'Premium' : 'Free';

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Card className={isDark ? 'glass-card' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>My Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Email</Label>
            <p className={isDark ? 'text-white' : 'text-slate-900'}>{userEmail}</p>
          </div>
        </CardContent>
      </Card>

      <Card className={isDark ? 'glass-card' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isPremiumUser ? (
                <Crown className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              ) : (
                <Sparkles className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              )}
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {planType} Plan
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {interpretationsLeft} interpretations remaining
                </p>
              </div>
            </div>
            <Badge 
              variant={isPremiumUser ? 'default' : 'secondary'}
              className={isPremiumUser 
                ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
              }
            >
              {planType}
            </Badge>
          </div>
          
          {!isPremiumUser && (
            <>
              <Separator />
              <div className="text-center">
                <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Upgrade to Premium for unlimited interpretations and enhanced features
                </p>
                <Button 
                  onClick={onUpgrade}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-semibold py-2 rounded-xl transition-all duration-300"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className={isDark ? 'glass-card' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Theme & Aesthetics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Dark Mode</Label>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Switch between light and dark themes</p>
            </div>
            <Switch 
              checked={isDark} 
              onCheckedChange={onThemeToggle} 
            />
          </div>
        </CardContent>
      </Card>

      <Card className={isDark ? 'glass-card' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Dream Interpretation Preferences</CardTitle>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Choose which perspectives Ramel shows you by default
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="default-islamic" className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Islamic Perspective</Label>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Traditional Islamic dream interpretation</p>
            </div>
            <Switch 
              id="default-islamic" 
              checked={userPreferences.showIslamic} 
              onCheckedChange={checked => handlePreferenceChange('showIslamic', checked)} 
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="default-spiritual" className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Spiritual Perspective</Label>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Universal spiritual and symbolic meanings</p>
            </div>
            <Switch 
              id="default-spiritual" 
              checked={userPreferences.showSpiritual} 
              onCheckedChange={checked => handlePreferenceChange('showSpiritual', checked)} 
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="default-psychological" className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Psychological Perspective</Label>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Modern psychological analysis</p>
            </div>
            <Switch 
              id="default-psychological" 
              checked={userPreferences.showPsychological} 
              onCheckedChange={checked => handlePreferenceChange('showPsychological', checked)} 
            />
          </div>
        </CardContent>
      </Card>

      <Card className={isDark ? 'glass-card' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>About Ramel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Ramel helps you understand your dreams through thoughtful interpretations from multiple perspectives. 
            Your dreams are private and analyzed with respect for different cultural and spiritual viewpoints.
            Everything you share stays between you and Ramel. We protect your secrets like they're sacred.
          </p>
        </CardContent>
      </Card>

      <Button 
        onClick={onLogout} 
        variant="outline" 
        className="w-full border-red-500 text-red-500 hover:bg-red-50"
      >
        Sign Out
      </Button>
    </div>
  );
};

export default Settings;
