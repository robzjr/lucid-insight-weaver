
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

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
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-dream-navy">Tell us about your dream</CardTitle>
          <p className="text-center text-dream-gray text-sm">
            Describe your dream in as much detail as you remember
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="dream">Your Dream</Label>
              <Textarea
                id="dream"
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder="I was walking through a forest when I saw..."
                className="mt-1 min-h-32 resize-none"
                disabled={isAnalyzing}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-dream-navy hover:bg-slate-700"
              disabled={!dreamText.trim() || isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing Dream...' : 'Analyze Dream'}
            </Button>
          </form>
          
          <div className="mt-4 text-xs text-dream-gray text-center">
            Your dreams are private and analyzed with care using AI to provide Islamic, Spiritual, and Psychological perspectives.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DreamInput;
