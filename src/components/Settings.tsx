
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User, Settings as SettingsIcon, LogOut, Crown, Plus } from 'lucide-react';

interface SettingsProps {
  userPreferences: any;
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
  const handleToggleChange = (key: string, value: boolean) => {
    onUpdatePreferences({ [key]: value });
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl space-y-6">
      {/* Profile Section */}
      <Card className={`${
        isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            <User className="h-5 w-5" />
            <span>Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Email
              </p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {userEmail}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Current Plan
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                >
                  Free Plan
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onUpgrade}
                  className={`h-6 w-6 p-0 ${
                    isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-300' : 'hover:bg-slate-100'
                  }`}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button
              onClick={onUpgrade}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dream Interpretation Preferences */}
      <Card className={`${
        isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            <SettingsIcon className="h-5 w-5" />
            <span>Interpretation Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="islamic" className={`font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Islamic Interpretation
              </Label>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Show interpretations based on Islamic tradition
              </p>
            </div>
            <Switch
              id="islamic"
              checked={userPreferences?.showIslamic ?? true}
              onCheckedChange={(checked) => handleToggleChange('showIslamic', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="spiritual" className={`font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Spiritual Interpretation
              </Label>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Show symbolic and intuitive interpretations
              </p>
            </div>
            <Switch
              id="spiritual"
              checked={userPreferences?.showSpiritual ?? true}
              onCheckedChange={(checked) => handleToggleChange('showSpiritual', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="psychological" className={`font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Psychological Interpretation
              </Label>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Show psychological and analytical interpretations
              </p>
            </div>
            <Switch
              id="psychological"
              checked={userPreferences?.showPsychological ?? true}
              onCheckedChange={(checked) => handleToggleChange('showPsychological', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card className={`${
        isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'
      }`}>
        <CardHeader>
          <CardTitle className={`${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            App Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme" className={`font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Dark Mode
              </Label>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Use dark theme across the app
              </p>
            </div>
            <Switch
              id="theme"
              checked={isDark}
              onCheckedChange={onThemeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className={`${
        isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'
      }`}>
        <CardContent className="pt-6">
          <Button
            onClick={onLogout}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
