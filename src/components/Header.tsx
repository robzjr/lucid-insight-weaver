
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  onSettingsClick: () => void;
  onProfileClick: () => void;
  isDark?: boolean;
}

const Header = ({ title, onSettingsClick, onProfileClick, isDark = true }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl matrix-grid slide-up">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <div className="relative floating-element">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center glow-pulse">
              <span className="text-white text-sm font-bold">R</span>
            </div>
          </div>
          <h1 className="text-lg font-bold hologram-text fade-in-scale">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onProfileClick}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300 hover:neon-glow"
          >
            <User className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300 hover:neon-glow"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
