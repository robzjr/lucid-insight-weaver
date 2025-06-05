
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap } from 'lucide-react';

interface UsageDisplayProps {
  interpretationsLeft: number;
  isDark?: boolean;
}

const UsageDisplay = ({ interpretationsLeft, isDark = true }: UsageDisplayProps) => {
  const isFreeUser = interpretationsLeft <= 5;
  
  return (
    <Card className={`${
      isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'
    } mb-4`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isFreeUser ? (
              <Sparkles className={`h-4 w-4 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
            ) : (
              <Zap className={`h-4 w-4 ${
                isDark ? 'text-purple-400' : 'text-purple-600'
              }`} />
            )}
            <span className={`text-sm font-medium ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {isFreeUser ? 'Free' : 'Premium'} Plan
            </span>
          </div>
          
          <Badge 
            variant={interpretationsLeft > 0 ? 'default' : 'destructive'}
            className={`${
              interpretationsLeft > 0 
                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}
          >
            {interpretationsLeft} left
          </Badge>
        </div>
        
        <div className="mt-2">
          <div className={`w-full bg-slate-700 rounded-full h-2 ${
            isDark ? 'bg-slate-700' : 'bg-slate-200'
          }`}>
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                interpretationsLeft > 2 
                  ? 'bg-green-500' 
                  : interpretationsLeft > 0 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`}
              style={{ 
                width: `${Math.max(0, Math.min(100, (interpretationsLeft / 5) * 100))}%` 
              }}
            ></div>
          </div>
        </div>
        
        <p className={`text-xs mt-2 ${
          isDark ? 'text-slate-500' : 'text-slate-600'
        }`}>
          {interpretationsLeft === 0 
            ? 'Purchase more interpretations to continue'
            : `${interpretationsLeft} interpretation${interpretationsLeft === 1 ? '' : 's'} remaining`
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default UsageDisplay;
