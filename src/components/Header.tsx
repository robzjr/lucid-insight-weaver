
import React from 'react';
import { User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  showProfile?: boolean;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

const Header = ({ title, showProfile = true, onProfileClick, onSettingsClick }: HeaderProps) => {
  return (
    <div className="bg-dream-navy text-white p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-dream-gold rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full opacity-80"></div>
          </div>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        
        {showProfile && (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-slate-700"
              onClick={onSettingsClick}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-slate-700"
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
