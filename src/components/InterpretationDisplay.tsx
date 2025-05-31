import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Book, User, Calendar } from 'lucide-react';
interface Interpretation {
  type: 'islamic' | 'spiritual' | 'psychological';
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
}
interface InterpretationDisplayProps {
  dreamText: string;
  interpretations: Interpretation[];
  userPreferences: {
    showIslamic: boolean;
    showSpiritual: boolean;
    showPsychological: boolean;
  };
  onToggleVisibility: (type: string, visible: boolean) => void;
  onSaveDream: () => void;
  onNewDream: () => void;
}
const InterpretationDisplay = ({
  dreamText,
  interpretations,
  userPreferences,
  onToggleVisibility,
  onSaveDream,
  onNewDream
}: InterpretationDisplayProps) => {
  const [activeTab, setActiveTab] = useState<string>('islamic');
  const visibleInterpretations = interpretations.filter(interp => {
    switch (interp.type) {
      case 'islamic':
        return userPreferences.showIslamic;
      case 'spiritual':
        return userPreferences.showSpiritual;
      case 'psychological':
        return userPreferences.showPsychological;
      default:
        return true;
    }
  });
  return <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Dream Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-dream-gray font-bold text-slate-50">Your Dream</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-dream-navy text-slate-50">{dreamText}</p>
        </CardContent>
      </Card>

      {/* Visibility Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-dream-gray">Show Interpretations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="islamic-toggle" className="text-sm">Islamic Perspective</Label>
            <Switch id="islamic-toggle" checked={userPreferences.showIslamic} onCheckedChange={checked => onToggleVisibility('islamic', checked)} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="spiritual-toggle" className="text-sm">Spiritual Perspective</Label>
            <Switch id="spiritual-toggle" checked={userPreferences.showSpiritual} onCheckedChange={checked => onToggleVisibility('spiritual', checked)} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="psychological-toggle" className="text-sm">Psychological Perspective</Label>
            <Switch id="psychological-toggle" checked={userPreferences.showPsychological} onCheckedChange={checked => onToggleVisibility('psychological', checked)} />
          </div>
        </CardContent>
      </Card>

      {/* Interpretation Tabs */}
      {visibleInterpretations.length > 0 && <>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {visibleInterpretations.map(interp => <button key={interp.type} onClick={() => setActiveTab(interp.type)} className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${activeTab === interp.type ? `${interp.color} text-white` : 'text-gray-600 hover:bg-gray-200'}`}>
                <div className="flex items-center justify-center space-x-1">
                  {interp.icon}
                  <span>{interp.title}</span>
                </div>
              </button>)}
          </div>

          {/* Active Interpretation */}
          {visibleInterpretations.map(interp => activeTab === interp.type && <Card key={interp.type} className="border-l-4" style={{
        borderLeftColor: interp.color.replace('bg-', '#')
      }}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    {interp.icon}
                    <CardTitle className="text-lg">{interp.title} Perspective</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-dream-navy leading-relaxed">{interp.content}</p>
                </CardContent>
              </Card>)}
        </>}

      {visibleInterpretations.length === 0 && <Card>
          <CardContent className="text-center py-8">
            <p className="text-dream-gray">No interpretations are currently visible. Enable at least one perspective above to see your dream analysis.</p>
          </CardContent>
        </Card>}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button onClick={onSaveDream} className="flex-1 bg-dream-navy hover:bg-slate-700">
          Save to Journal
        </Button>
        <Button onClick={onNewDream} variant="outline" className="flex-1 border-dream-navy text-dream-navy">
          New Dream
        </Button>
      </div>
    </div>;
};
export default InterpretationDisplay;