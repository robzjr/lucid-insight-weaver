
import React from 'react';
import { User, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  showProfile?: boolean;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

const Header = ({ title, showProfile = true, onProfileClick, onSettingsClick }: HeaderProps) => {
  return (
    <div className="glass-card border-b border-slate-800/50 p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-xl flex items-center justify-center neon-glow">
            <Zap className="w-5 h-5 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-xl opacity-20 animate-pulse"></div>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        
        {showProfile && (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-purple-400 hover:bg-slate-800/50 border border-slate-800/50 hover:border-purple-500/50 transition-all duration-300"
              onClick={onSettingsClick}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 border border-slate-800/50 hover:border-cyan-500/50 transition-all duration-300"
              onClick={onProfileClick}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
