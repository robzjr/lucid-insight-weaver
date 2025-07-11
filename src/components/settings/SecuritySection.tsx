
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';

interface SecuritySectionProps {
  isDark?: boolean;
}

const SecuritySection = ({ isDark = true }: SecuritySectionProps) => {
  const { user, signOut } = useAuth();
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

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.functions.invoke('delete-account', {
        body: { userId: user.id }
      });
      if (error || !data?.success) {
        throw error || new Error('Deletion failed');
      }
      toast.success('Account deleted');
      await signOut();
      window.location.reload();
    } catch (err: any) {
      console.error('Delete account error:', err);
      toast.error(err.message || 'Failed to delete account');
    }
  };

  return (
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


        {/* Account Deletion */}
        <div className="pt-4 border-t border-slate-700">
          <div className="space-y-2">
            <Label className={`font-medium text-red-500`}>Danger Zone</Label>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={isDark ? 'glass-card border-slate-700' : ''}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently remove your account and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySection;
