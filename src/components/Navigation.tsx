
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Book, Settings, User } from 'lucide-react';

interface NavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

const Navigation = ({ activeScreen, onNavigate }: NavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'Journal', icon: Book },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeScreen === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                  isActive 
                    ? 'text-dream-navy bg-dream-light' 
                    : 'text-dream-gray hover:text-dream-navy'
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <IconComponent className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
