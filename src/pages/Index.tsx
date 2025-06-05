import React, { useState, useEffect } from 'react';
import { Book, User, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import AuthPage from '@/components/AuthPage';
import DreamInput from '@/components/DreamInput';
import InterpretationDisplay from '@/components/InterpretationDisplay';
import DreamHistory from '@/components/DreamHistory';
import Settings from '@/components/Settings';
import Navigation from '@/components/Navigation';
import UsageDisplay from '@/components/UsageDisplay';
import PaymentModal from '@/components/PaymentModal';
import { useAuth } from '@/hooks/useAuth';
import { useDreams } from '@/hooks/useDreams';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useUserUsage } from '@/hooks/useUserUsage';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { dreams, interpretDream, saveDream, isInterpreting, interpretationResult, interpretationError } = useDreams();
  const { preferences, updatePreferences } = useUserPreferences();
  const { usage, canInterpret, interpretationsLeft } = useUserUsage();
  
  const [currentScreen, setCurrentScreen] = useState<'home' | 'interpretation' | 'history' | 'settings'>('home');
  const [currentDream, setCurrentDream] = useState<string>('');
  const [viewingDream, setViewingDream] = useState<any>(null);
  const [isDark, setIsDark] = useState(true);
  const [currentInterpretations, setCurrentInterpretations] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Sync theme with preferences
  useEffect(() => {
    if (preferences?.theme) {
      setIsDark(preferences.theme === 'dark');
    }
  }, [preferences?.theme]);

  // Apply theme to body
  useEffect(() => {
    document.body.className = isDark ? 'dark' : 'light';
  }, [isDark]);

  // Handle interpretation result
  useEffect(() => {
    if (interpretationResult) {
      setCurrentInterpretations(interpretationResult);
      setCurrentScreen('interpretation');
    }
  }, [interpretationResult]);

  const handleLogout = async () => {
    await signOut();
    setCurrentScreen('home');
    setCurrentDream('');
    setViewingDream(null);
    setCurrentInterpretations(null);
  };

  const handleThemeToggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    updatePreferences({ theme: newTheme ? 'dark' : 'light' });
  };

  const handleDreamSubmit = async (dreamText: string) => {
    if (!canInterpret) {
      setShowPaymentModal(true);
      return;
    }
    
    setCurrentDream(dreamText);
    try {
      await interpretDream(dreamText);
    } catch (error: any) {
      if (error.message === 'PAYMENT_REQUIRED') {
        setShowPaymentModal(true);
      }
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    // Optionally retry the interpretation
    if (currentDream) {
      interpretDream(currentDream);
    }
  };

  const handleSaveDream = () => {
    if (currentDream && currentInterpretations) {
      saveDream({
        dreamText: currentDream,
        interpretations: currentInterpretations
      });
      setCurrentScreen('history');
    }
  };

  const handleNewDream = () => {
    setCurrentDream('');
    setViewingDream(null);
    setCurrentInterpretations(null);
    setCurrentScreen('home');
  };

  const handleViewDream = (dream: any) => {
    setViewingDream(dream);
    setCurrentDream(dream.dreamText);
    setCurrentInterpretations(dream.interpretations);
    setCurrentScreen('interpretation');
  };

  const handleToggleVisibility = (type: string, visible: boolean) => {
    const key = `show${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof preferences;
    updatePreferences({ [key]: visible });
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as 'home' | 'interpretation' | 'history' | 'settings');
    if (screen === 'home') {
      setCurrentDream('');
      setViewingDream(null);
      setCurrentInterpretations(null);
    }
  };

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center matrix-grid ${
        isDark ? 'bg-slate-950' : 'bg-white'
      }`}>
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin glow-pulse"></div>
      </div>
    );
  }

  // Show auth page if user is not logged in
  if (!user) {
    return <AuthPage isDark={isDark} onThemeToggle={handleThemeToggle} />;
  }

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home': return 'Good to see you, Dreamer';
      case 'interpretation': return 'The Dream Speaks...';
      case 'history': return 'My Dream Archive';
      case 'settings': return 'Profile & Settings';
      default: return 'Ramel';
    }
  };

  // Create mock interpretations for the display component
  const mockInterpretations = currentInterpretations ? [
    {
      type: 'islamic' as const,
      title: 'Islamic',
      content: currentInterpretations.islamic || 'No Islamic interpretation available.',
      icon: <Book className="h-4 w-4" />,
      color: 'bg-green-600'
    },
    {
      type: 'spiritual' as const,
      title: 'Spiritual',
      content: currentInterpretations.spiritual || 'No spiritual interpretation available.',
      icon: <User className="h-4 w-4" />,
      color: 'bg-dream-teal'
    },
    {
      type: 'psychological' as const,
      title: 'Psychological',
      content: currentInterpretations.psychological || 'No psychological interpretation available.',
      icon: <Calendar className="h-4 w-4" />,
      color: 'bg-blue-600'
    }
  ] : [];

  return (
    <div className={`min-h-screen pb-24 relative overflow-hidden transition-all duration-500 matrix-grid ${
      isDark 
        ? 'bg-gradient-to-br from-slate-950 via-purple-950/10 to-slate-950' 
        : 'bg-gradient-to-br from-white via-purple-50/20 to-slate-50'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl floating-element ${
          isDark ? 'bg-purple-500/5' : 'bg-purple-500/10'
        }`}></div>
        <div className={`absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl floating-element delay-1000 ${
          isDark ? 'bg-cyan-500/5' : 'bg-cyan-500/10'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 w-32 h-32 rounded-full blur-2xl floating-element delay-500 ${
          isDark ? 'bg-purple-400/3' : 'bg-purple-400/8'
        }`}></div>
      </div>

      <Header 
        title={getScreenTitle()}
        onSettingsClick={() => setCurrentScreen('settings')}
        onProfileClick={() => setCurrentScreen('settings')}
        isDark={isDark}
      />
      
      <div className="pt-4 relative z-10">
        {currentScreen === 'home' && (
          <>
            <UsageDisplay 
              interpretationsLeft={interpretationsLeft} 
              isDark={isDark} 
            />
            <DreamInput
              onSubmit={handleDreamSubmit}
              isAnalyzing={isInterpreting}
              isDark={isDark}
            />
          </>
        )}
        
        {currentScreen === 'interpretation' && currentDream && (
          <InterpretationDisplay
            dreamText={currentDream}
            interpretations={mockInterpretations}
            userPreferences={preferences}
            onToggleVisibility={handleToggleVisibility}
            onSaveDream={handleSaveDream}
            onNewDream={handleNewDream}
            isDark={isDark}
          />
        )}
        
        {currentScreen === 'history' && (
          <DreamHistory
            dreams={dreams}
            onViewDream={handleViewDream}
            onNewDream={handleNewDream}
            isDark={isDark}
          />
        )}
        
        {currentScreen === 'settings' && (
          <Settings
            userPreferences={preferences}
            onUpdatePreferences={updatePreferences}
            onLogout={handleLogout}
            userEmail={user.email || ''}
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
            onUpgrade={handleUpgrade}
          />
        )}
      </div>
      
      <Navigation
        activeScreen={currentScreen}
        onNavigate={handleNavigate}
        isDark={isDark}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        isDark={isDark}
      />
    </div>
  );
};

export default Index;
