
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Book, Settings } from 'lucide-react';

interface NavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  isDark?: boolean;
}

const Navigation = ({ activeScreen, onNavigate, isDark = true }: NavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'Library', icon: Book },
    { id: 'settings', label: 'Profile', icon: Settings },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 border-t px-4 py-3 z-50 ${
      isDark 
        ? 'glass-card border-slate-800/50' 
        : 'bg-white/90 backdrop-blur-xl border-slate-200/50'
    }`}>
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeScreen === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`cyber-border flex flex-col items-center space-y-1 h-auto py-3 px-4 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-purple-400 bg-purple-500/20 border border-purple-500/50 neon-glow' 
                    : isDark
                      ? 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30 border border-slate-800/30'
                      : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50 border border-slate-200/30'
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <IconComponent className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
