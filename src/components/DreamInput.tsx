
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sparkles, Brain } from 'lucide-react';

interface DreamInputProps {
  onSubmit: (dream: string) => void;
  isAnalyzing: boolean;
  isDark?: boolean;
}

const DreamInput = ({ onSubmit, isAnalyzing, isDark = true }: DreamInputProps) => {
  const [dreamText, setDreamText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dreamText.trim()) {
      onSubmit(dreamText.trim());
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className={`cyber-border ${
        isDark 
          ? 'glass-card border-slate-800/50' 
          : 'bg-white/90 backdrop-blur-xl border-slate-200/50'
      }`}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Brain className="w-8 h-8 text-purple-400" />
              <Sparkles className="w-4 h-4 text-cyan-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <CardTitle className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent text-xl">
            Neural Dream Analysis
          </CardTitle>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Describe your dream and unlock its hidden meanings through AI consciousness
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="dream" className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Dream Sequence</Label>
              <Textarea
                id="dream"
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder="I found myself in a digital landscape where thoughts became visible as flowing streams of light..."
                className={`mt-2 min-h-36 resize-none transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20' 
                    : 'bg-white/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20'
                }`}
                disabled={isAnalyzing}
              />
            </div>
            
            <Button
              type="submit"
              className={`w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 ${
                isAnalyzing ? 'pulse-glow' : 'hover:neon-glow'
              }`}
              disabled={!dreamText.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing Neural Patterns...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>Initiate Analysis</span>
                </div>
              )}
            </Button>
          </form>
          
          <div className={`mt-6 text-xs text-center border-t pt-4 ${
            isDark 
              ? 'text-slate-500 border-slate-800' 
              : 'text-slate-400 border-slate-200'
          }`}>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Secure neural processing • Multi-dimensional analysis • Privacy protected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DreamInput;
