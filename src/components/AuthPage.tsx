
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthPageProps {
  isDark?: boolean;
  onThemeToggle: () => void;
}

const AuthPage = ({ isDark = true, onThemeToggle }: AuthPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (type: 'signin' | 'signup') => {
    setLoading(true);
    try {
      const { error } = type === 'signin' 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;

      if (type === 'signup') {
        toast({
          title: "Welcome to Ramel",
          description: "Check your email to verify your account",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-950 via-purple-950/10 to-slate-950' 
        : 'bg-gradient-to-br from-white via-purple-50/20 to-slate-50'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          isDark ? 'bg-purple-500/5' : 'bg-purple-500/10'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse delay-1000 ${
          isDark ? 'bg-cyan-500/5' : 'bg-cyan-500/10'
        }`}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="theme-toggle" className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isDark ? 'Dark' : 'Light'}
            </Label>
            <Switch 
              id="theme-toggle"
              checked={isDark} 
              onCheckedChange={onThemeToggle} 
            />
          </div>
        </div>

        <Card className={`cyber-border ${
          isDark 
            ? 'glass-card border-slate-800/50' 
            : 'bg-white/90 backdrop-blur-xl border-slate-200/50'
        }`}>
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">R</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Step Back Into the Dreamworld
              </CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Take a deep breath... and recall your last dream. Ready to uncover its meaning?
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className={`grid w-full grid-cols-2 ${
                isDark ? 'bg-slate-800/50' : 'bg-gray-100'
              }`}>
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email... the bridge from reality"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={isDark 
                      ? 'bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Secret key to the dream gate"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={isDark 
                      ? 'bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    }
                  />
                </div>

                <Button
                  onClick={() => handleAuth('signin')}
                  disabled={loading || !email || !password}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:neon-glow"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Unlocking...</span>
                    </div>
                  ) : (
                    'Unlock the Portal'
                  )}
                </Button>

                <div className="text-center">
                  <Button variant="link" className={`text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-500'}`}>
                    Forgot it? Don't worry, dreams never forget you.
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email... the bridge from reality"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={isDark 
                      ? 'bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Secret key to the dream gate"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={isDark 
                      ? 'bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    }
                  />
                </div>

                <Button
                  onClick={() => handleAuth('signup')}
                  disabled={loading || !email || !password}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:neon-glow"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Start your journey into the unseen'
                  )}
                </Button>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />
            
            <div className={`text-xs text-center ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Your dreams, your space • Everything stays between you and Ramel</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
