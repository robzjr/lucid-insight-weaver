
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Book, User } from 'lucide-react';

interface SavedDream {
  id: string;
  dreamText: string;
  date: string;
  interpretations: {
    islamic: string;
    spiritual: string;
    psychological: string;
  };
}

interface DreamHistoryProps {
  dreams: SavedDream[];
  onViewDream: (dream: SavedDream) => void;
  onNewDream: () => void;
}

const DreamHistory = ({ dreams, onViewDream, onNewDream }: DreamHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDreams = dreams.filter(dream =>
    dream.dreamText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-dream-navy">Dream Journal</CardTitle>
          <Input
            placeholder="Search your dreams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-2"
          />
        </CardHeader>
      </Card>

      {filteredDreams.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 text-dream-gray mx-auto mb-4" />
            <p className="text-dream-gray mb-4">
              {dreams.length === 0 ? "No dreams recorded yet" : "No dreams match your search"}
            </p>
            <Button onClick={onNewDream} className="bg-dream-navy hover:bg-slate-700">
              Record Your First Dream
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredDreams.map((dream) => (
            <Card key={dream.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4" onClick={() => onViewDream(dream)}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-dream-navy line-clamp-3">
                      {dream.dreamText}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-1">
                    <Badge variant="secondary" className="text-xs">
                      <Book className="h-3 w-3 mr-1" />
                      Islamic
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <User className="h-3 w-3 mr-1" />
                      Spiritual
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      Psychology
                    </Badge>
                  </div>
                  <span className="text-xs text-dream-gray">{dream.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button onClick={onNewDream} className="w-full bg-dream-navy hover:bg-slate-700">
        Analyze New Dream
      </Button>
    </div>
  );
};

export default DreamHistory;
