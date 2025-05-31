
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sparkles, Brain } from 'lucide-react';

interface DreamInputProps {
  onSubmit: (dream: string) => void;
  isAnalyzing: boolean;
}

const DreamInput = ({ onSubmit, isAnalyzing }: DreamInputProps) => {
  const [dreamText, setDreamText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dreamText.trim()) {
      onSubmit(dreamText.trim());
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="glass-card border-slate-800/50 cyber-border">
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
          <p className="text-slate-400 text-sm">
            Describe your dream and unlock its hidden meanings through AI consciousness
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="dream" className="text-slate-300 font-medium">Dream Sequence</Label>
              <Textarea
                id="dream"
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder="I found myself in a digital landscape where thoughts became visible as flowing streams of light..."
                className="mt-2 min-h-36 resize-none bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
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
          
          <div className="mt-6 text-xs text-slate-500 text-center border-t border-slate-800 pt-4">
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
