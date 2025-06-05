
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Settings as SettingsIcon, LogOut, Crown, Plus, Edit, Share2, Users } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';

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
  const { profile, updateProfile, isUpdating } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: profile?.display_name || '',
    age: profile?.age?.toString() || '',
    relationshipStatus: profile?.relationship_status || '',
    gender: profile?.gender || '',
    preferredStyle: profile?.preferred_style || ''
  });

  const handleToggleChange = (key: string, value: boolean) => {
    onUpdatePreferences({ [key]: value });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm({
        displayName: profile?.display_name || '',
        age: profile?.age?.toString() || '',
        relationshipStatus: profile?.relationship_status || '',
        gender: profile?.gender || '',
        preferredStyle: profile?.preferred_style || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    updateProfile({
      displayName: editForm.displayName,
      age: parseInt(editForm.age) || 0,
      relationshipStatus: editForm.relationshipStatus,
      gender: editForm.gender,
      preferredStyle: editForm.preferredStyle
    });
    setIsEditing(false);
  };

  const handleReferFriend = () => {
    const referralText = `Check out Ramel - the AI-powered dream interpreter! Use my referral to get 5 free dream interpretations. Download it here: ${window.location.origin}`;
    
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
      {/* Profile Section */}
      <Card className={`${
        isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center justify-between ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditToggle}
              className={isDark ? 'text-slate-400' : 'text-slate-600'}
            >
              <Edit className="h-4 w-4" />
            </Button>
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

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  value={editForm.displayName}
                  onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                  className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}
                />
              </div>

              <div>
                <Label htmlFor="age" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}
                />
              </div>

              <div>
                <Label htmlFor="relationshipStatus" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Relationship Status
                </Label>
                <Select value={editForm.relationshipStatus} onValueChange={(value) => setEditForm({ ...editForm, relationshipStatus: value })}>
                  <SelectTrigger className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="in-relationship">In a relationship</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="gender" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Gender
                </Label>
                <Select value={editForm.gender} onValueChange={(value) => setEditForm({ ...editForm, gender: value })}>
                  <SelectTrigger className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="preferredStyle" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Preferred Interpretation Style
                </Label>
                <Select value={editForm.preferredStyle} onValueChange={(value) => setEditForm({ ...editForm, preferredStyle: value })}>
                  <SelectTrigger className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="psychological">Psychological</SelectItem>
                    <SelectItem value="islamic">Islamic</SelectItem>
                    <SelectItem value="spiritual">Spiritual</SelectItem>
                    <SelectItem value="mixed">All styles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isUpdating}
                  className="bg-green-600 text-white"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleEditToggle}
                  className={isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300'}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Display Name
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {profile?.display_name || 'Not set'}
                </p>
              </div>
              <div>
                <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Age
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {profile?.age || 'Not set'}
                </p>
              </div>
              <div>
                <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Relationship Status
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {profile?.relationship_status || 'Not set'}
                </p>
              </div>
              <div>
                <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Gender
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {profile?.gender || 'Not set'}
                </p>
              </div>
            </div>
          )}
          
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
                    isDark ? 'text-slate-400' : 'hover:bg-slate-100'
                  }`}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button
              onClick={onUpgrade}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referral Section */}
      <Card className={`${
        isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
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
              className={`w-full ${
                isDark 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-purple-600 text-white'
              }`}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Refer a Friend
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
