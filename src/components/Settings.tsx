import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { User, Settings as SettingsIcon, LogOut, Crown, Edit, Share2, Users, HelpCircle, Shield, CreditCard, Globe, Lock, Eye, EyeOff } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';

interface SettingsProps {
  userPreferences: any;
  onUpdatePreferences: (preferences: any) => void;
  onLogout: () => void;
  userEmail: string;
  isDark?: boolean;
  onThemeToggle: () => void;
  onUpgrade: () => void;
  onNavigateToSubscription: () => void;
  onNavigateToHelp: () => void;
}

const Settings = ({
  userPreferences,
  onUpdatePreferences,
  onLogout,
  userEmail,
  isDark = true,
  onThemeToggle,
  onUpgrade,
  onNavigateToSubscription,
  onNavigateToHelp
}: SettingsProps) => {
  const {
    profile,
    updateProfile,
    isUpdating
  } = useUserProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: profile?.display_name || '',
    age: profile?.age?.toString() || '',
    relationshipStatus: profile?.relationship_status || '',
    gender: profile?.gender || '',
    preferredStyle: profile?.preferred_style || ''
  });

  // Security settings state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleToggleChange = (key: string, value: boolean) => {
    onUpdatePreferences({
      [key]: value
    });
  };
  const handleLanguageChange = (language: string) => {
    onUpdatePreferences({
      language: language
    });
    toast.success(`Language changed to ${language === 'ar' ? 'Arabic' : 'English'}`);
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
    const baseUrl = window.location.origin;
    const referralCode = userEmail.split('@')[0]; // Simple referral code
    const referralText = `Check out Ramel - the AI-powered dream interpreter! Use my referral to get 5 free dream interpretations. Sign up here: ${baseUrl}?ref=${referralCode}`;
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

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordSection(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 max-w-2xl space-y-6">
        {/* Profile Section */}
        <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center justify-between ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleEditToggle} className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} h-8 w-8 p-0`}>
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

            {isEditing ? <div className="space-y-4">
                <div>
                  <Label htmlFor="displayName" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Display Name
                  </Label>
                  <Input id="displayName" value={editForm.displayName} onChange={e => setEditForm({
                ...editForm,
                displayName: e.target.value
              })} placeholder="Enter your display name" className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'} />
                </div>

                <div>
                  <Label htmlFor="age" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Age
                  </Label>
                  <Input id="age" type="number" value={editForm.age} onChange={e => setEditForm({
                ...editForm,
                age: e.target.value
              })} placeholder="Enter your age" min="13" max="120" className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'} />
                </div>

                <div>
                  <Label htmlFor="relationshipStatus" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Relationship Status
                  </Label>
                  <Select value={editForm.relationshipStatus} onValueChange={value => setEditForm({
                ...editForm,
                relationshipStatus: value
              })}>
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
                  <Select value={editForm.gender} onValueChange={value => setEditForm({
                ...editForm,
                gender: value
              })}>
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
                  <Select value={editForm.preferredStyle} onValueChange={value => setEditForm({
                ...editForm,
                preferredStyle: value
              })}>
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
                  <Button onClick={handleSaveProfile} disabled={isUpdating} className="bg-green-600 text-white">
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={handleEditToggle} className={isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300'}>
                    Cancel
                  </Button>
                </div>
              </div> : <div className="space-y-3">
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
              </div>}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'}`}>
          <CardHeader>
            <CardTitle className={`${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            
            
            <Button variant="ghost" onClick={onNavigateToHelp} className={`w-full justify-start ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}>
              <HelpCircle className="w-4 h-4 mr-3" />
              Help & Support
            </Button>
            
            <Button variant="ghost" onClick={() => window.open('/privacy-policy', '_blank')} className={`w-full justify-start ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}>
              <Shield className="w-4 h-4 mr-3" />
              Privacy Policy
            </Button>
          </CardContent>
        </Card>

        {/* Referral Section */}
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
              <Button onClick={handleReferFriend} className={`w-full ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                <Share2 className="w-4 h-4 mr-2" />
                Refer a Friend
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Password Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Password
                  </Label>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Change your account password
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                  className={isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300'}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>

              {showPasswordSection && (
                <div className="space-y-4 p-4 border rounded-lg border-slate-700">
                  <div>
                    <Label htmlFor="currentPassword" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200 pr-10' : 'bg-white border-slate-300 pr-10'}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200 pr-10' : 'bg-white border-slate-300 pr-10'}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordForm.newPassword && (
                      <PasswordStrengthMeter password={passwordForm.newPassword} isDark={isDark} />
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200 pr-10' : 'bg-white border-slate-300 pr-10'}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPasswordSection(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className={isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300'}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="twoFactor" className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Two-Factor Authentication
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add an extra layer of security to your account</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                id="twoFactor"
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
                disabled
              />
            </div>
            {twoFactorEnabled && (
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Two-factor authentication is enabled for your account.
              </p>
            )}

            {/* Account Deletion */}
            <div className="pt-4 border-t border-slate-700">
              <div className="space-y-2">
                <Label className={`font-medium text-red-500`}>
                  Danger Zone
                </Label>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => toast.error('Account deletion is not available yet')}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dream Interpretation Preferences */}
        <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              <SettingsIcon className="h-5 w-5" />
              <span>Interpretation Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="islamic" className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Islamic Interpretation
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Based on traditional Islamic dream interpretation methods and teachings</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch id="islamic" checked={userPreferences?.showIslamic ?? true} onCheckedChange={checked => handleToggleChange('showIslamic', checked)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="spiritual" className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Spiritual Interpretation
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Focuses on symbolic meanings, intuitive insights, and spiritual growth</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch id="spiritual" checked={userPreferences?.showSpiritual ?? true} onCheckedChange={checked => handleToggleChange('showSpiritual', checked)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="psychological" className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Psychological Interpretation
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Based on modern psychology, Freudian and Jungian dream analysis</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch id="psychological" checked={userPreferences?.showPsychological ?? true} onCheckedChange={checked => handleToggleChange('showPsychological', checked)} />
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'}`}>
          <CardHeader>
            <CardTitle className={`${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              App Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme" className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Dark Mode
                </Label>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Use dark theme across the app
                </p>
              </div>
              <Switch id="theme" checked={isDark} onCheckedChange={onThemeToggle} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Globe className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                  <Label htmlFor="language" className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Language
                  </Label>
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Choose your preferred language
                </p>
              </div>
              <div className="w-32">
                <Select value={userPreferences?.language || 'en'} onValueChange={handleLanguageChange}>
                  <SelectTrigger className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}>
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'}`}>
          <CardContent className="pt-6">
            <Button onClick={onLogout} variant="destructive" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default Settings;
