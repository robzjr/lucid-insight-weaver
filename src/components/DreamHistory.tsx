
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Book, User } from 'lucide-react';

interface Dream {
  id: string;
  dreamText: string;
  createdAt: string;
  interpretations?: {
    islamic: string;
    spiritual: string;
    psychological: string;
  };
}

interface DreamHistoryProps {
  dreams: Dream[];
  onViewDream: (dream: Dream) => void;
  onNewDream: () => void;
  isDark?: boolean;
}

const DreamHistory = ({ dreams, onViewDream, onNewDream, isDark = true }: DreamHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Only show dreams that have been saved (have interpretations)
  const savedDreams = dreams.filter(dream => dream.interpretations);
  
  const filteredDreams = savedDreams.filter(dream =>
    dream.dreamText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Card className={isDark ? 'glass-card' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>My Dream Archive</CardTitle>
          <Input
            placeholder="Search for a symbol... e.g., 'snake', 'mirror', 'falling'"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`mt-2 ${
              isDark 
                ? 'bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500' 
                : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </CardHeader>
      </Card>

      {filteredDreams.length === 0 ? (
        <Card className={isDark ? 'glass-card' : 'bg-white border-slate-200'}>
          <CardContent className="text-center py-8">
            <Calendar className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {savedDreams.length === 0 
                ? "No dreams saved yet. Time to start listening to your sleeping self with Ramel." 
                : "No dreams match your search"
              }
            </p>
            <Button 
              onClick={onNewDream} 
              className={`${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              Start Dream Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredDreams.map((dream) => (
            <Card 
              key={dream.id} 
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                isDark ? 'glass-card hover:bg-slate-800/30' : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CardContent className="p-4" onClick={() => onViewDream(dream)}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className={`text-sm line-clamp-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {dream.dreamText}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-1">
                    {dream.interpretations?.islamic && (
                      <Badge variant="secondary" className="text-xs">
                        <Book className="h-3 w-3 mr-1" />
                        Islamic
                      </Badge>
                    )}
                    {dream.interpretations?.spiritual && (
                      <Badge variant="secondary" className="text-xs">
                        <User className="h-3 w-3 mr-1" />
                        Spiritual
                      </Badge>
                    )}
                    {dream.interpretations?.psychological && (
                      <Badge variant="secondary" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        Psychology
                      </Badge>
                    )}
                  </div>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{dream.createdAt}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button 
        onClick={onNewDream} 
        className={`w-full ${
          isDark 
            ? 'bg-slate-800 hover:bg-slate-700 text-white' 
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        Analyze New Dream
      </Button>
    </div>
  );
};

export default DreamHistory;
