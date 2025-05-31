import React, { useState } from 'react';
import { Book, User, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import AuthScreen from '@/components/AuthScreen';
import DreamInput from '@/components/DreamInput';
import InterpretationDisplay from '@/components/InterpretationDisplay';
import DreamHistory from '@/components/DreamHistory';
import Settings from '@/components/Settings';
import Navigation from '@/components/Navigation';

interface UserData {
  email: string;
  name: string;
}

interface SavedDream {
  id: string;
  dreamText: string;
  date: string;
  interpretations: {
    islamic: string;
    spiritual: string;
    psychological: string;
  };
}

interface UserPreferences {
  showIslamic: boolean;
  showSpiritual: boolean;
  showPsychological: boolean;
}

const Index = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'interpretation' | 'history' | 'settings'>('home');
  const [currentDream, setCurrentDream] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedDreams, setSavedDreams] = useState<SavedDream[]>([]);
  const [viewingDream, setViewingDream] = useState<SavedDream | null>(null);
  
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    showIslamic: true,
    showSpiritual: true,
    showPsychological: true,
  });

  // Mock AI interpretations
  const mockInterpretations = [
    {
      type: 'islamic' as const,
      title: 'Islamic',
      content: 'In Islamic tradition, this dream may represent spiritual purification and guidance. The symbols in your dream often relate to your spiritual journey and connection with Allah. Consider reflecting on your prayers and seeking clarity in your faith.',
      icon: <Book className="h-4 w-4" />,
      color: 'bg-green-600'
    },
    {
      type: 'spiritual' as const,
      title: 'Spiritual',
      content: 'From a spiritual perspective, your dream appears to be guiding you toward inner wisdom and transformation. The imagery suggests you are on a path of personal growth and spiritual awakening. Trust your intuition as you navigate this journey.',
      icon: <User className="h-4 w-4" />,
      color: 'bg-dream-teal'
    },
    {
      type: 'psychological' as const,
      title: 'Psychological',
      content: 'Psychologically, this dream may reflect your subconscious processing of recent experiences or emotions. The symbols could represent aspects of your personality or situations in your waking life that need attention or resolution.',
      icon: <Calendar className="h-4 w-4" />,
      color: 'bg-blue-600'
    }
  ];

  const handleAuth = (userData: UserData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('home');
    setSavedDreams([]);
    setCurrentDream('');
    setViewingDream(null);
  };

  const handleDreamSubmit = async (dreamText: string) => {
    setCurrentDream(dreamText);
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentScreen('interpretation');
    }, 2000);
  };

  const handleSaveDream = () => {
    const newDream: SavedDream = {
      id: Date.now().toString(),
      dreamText: currentDream,
      date: new Date().toLocaleDateString(),
      interpretations: {
        islamic: mockInterpretations[0].content,
        spiritual: mockInterpretations[1].content,
        psychological: mockInterpretations[2].content,
      }
    };
    
    setSavedDreams(prev => [newDream, ...prev]);
    setCurrentScreen('history');
  };

  const handleNewDream = () => {
    setCurrentDream('');
    setViewingDream(null);
    setCurrentScreen('home');
  };

  const handleViewDream = (dream: SavedDream) => {
    setViewingDream(dream);
    setCurrentDream(dream.dreamText);
    setCurrentScreen('interpretation');
  };

  const handleToggleVisibility = (type: string, visible: boolean) => {
    setUserPreferences(prev => ({
      ...prev,
      [`show${type.charAt(0).toUpperCase() + type.slice(1)}`]: visible
    }));
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as 'home' | 'interpretation' | 'history' | 'settings');
    if (screen === 'home') {
      setCurrentDream('');
      setViewingDream(null);
    }
  };

  if (!user) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home': return 'DreamLens';
      case 'interpretation': return 'Neural Analysis';
      case 'history': return 'Dream Archive';
      case 'settings': return 'Interface Config';
      default: return 'DreamLens';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/10 to-slate-950 pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Header 
        title={getScreenTitle()}
        onSettingsClick={() => setCurrentScreen('settings')}
        onProfileClick={() => setCurrentScreen('settings')}
      />
      
      <div className="pt-4 relative z-10">
        {currentScreen === 'home' && (
          <DreamInput
            onSubmit={handleDreamSubmit}
            isAnalyzing={isAnalyzing}
          />
        )}
        
        {currentScreen === 'interpretation' && currentDream && (
          <InterpretationDisplay
            dreamText={currentDream}
            interpretations={mockInterpretations}
            userPreferences={userPreferences}
            onToggleVisibility={handleToggleVisibility}
            onSaveDream={handleSaveDream}
            onNewDream={handleNewDream}
          />
        )}
        
        {currentScreen === 'history' && (
          <DreamHistory
            dreams={savedDreams}
            onViewDream={handleViewDream}
            onNewDream={handleNewDream}
          />
        )}
        
        {currentScreen === 'settings' && (
          <Settings
            userPreferences={userPreferences}
            onUpdatePreferences={setUserPreferences}
            onLogout={handleLogout}
            userEmail={user.email}
          />
        )}
      </div>
      
      <Navigation
        activeScreen={currentScreen}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default Index;
