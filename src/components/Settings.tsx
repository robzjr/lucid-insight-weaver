
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SettingsProps {
  userPreferences: {
    showIslamic: boolean;
    showSpiritual: boolean;
    showPsychological: boolean;
  };
  onUpdatePreferences: (preferences: any) => void;
  onLogout: () => void;
  userEmail: string;
}

const Settings = ({ userPreferences, onUpdatePreferences, onLogout, userEmail }: SettingsProps) => {
  const handlePreferenceChange = (key: string, value: boolean) => {
    onUpdatePreferences({
      ...userPreferences,
      [key]: value
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-dream-navy">Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-sm text-dream-gray">Email</Label>
            <p className="text-dream-navy">{userEmail}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-dream-navy">Default Interpretation Preferences</CardTitle>
          <p className="text-sm text-dream-gray">
            Choose which perspectives are shown by default for all your dreams
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="default-islamic" className="font-medium">Islamic Perspective</Label>
              <p className="text-sm text-dream-gray">Traditional Islamic dream interpretation</p>
            </div>
            <Switch
              id="default-islamic"
              checked={userPreferences.showIslamic}
              onCheckedChange={(checked) => handlePreferenceChange('showIslamic', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="default-spiritual" className="font-medium">Spiritual Perspective</Label>
              <p className="text-sm text-dream-gray">Universal spiritual and symbolic meanings</p>
            </div>
            <Switch
              id="default-spiritual"
              checked={userPreferences.showSpiritual}
              onCheckedChange={(checked) => handlePreferenceChange('showSpiritual', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="default-psychological" className="font-medium">Psychological Perspective</Label>
              <p className="text-sm text-dream-gray">Modern psychological analysis</p>
            </div>
            <Switch
              id="default-psychological"
              checked={userPreferences.showPsychological}
              onCheckedChange={(checked) => handlePreferenceChange('showPsychological', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-dream-navy">About DreamLens</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-dream-gray">
            DreamLens uses advanced AI to provide thoughtful dream interpretations from multiple perspectives. 
            Your dreams are private and analyzed with respect for different cultural and spiritual viewpoints.
          </p>
        </CardContent>
      </Card>

      <Button onClick={onLogout} variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-50">
        Sign Out
      </Button>
    </div>
  );
};

export default Settings;
