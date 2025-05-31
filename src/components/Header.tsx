
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, User, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  title: string;
  onSettingsClick: () => void;
  onProfileClick: () => void;
  isDark?: boolean;
  onThemeToggle?: () => void;
}

const Header = ({ title, onSettingsClick, onProfileClick, isDark = true, onThemeToggle }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {onThemeToggle && (
            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onProfileClick}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <User className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
