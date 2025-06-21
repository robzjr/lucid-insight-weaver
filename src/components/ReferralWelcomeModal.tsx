import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ReferralWelcomeModalProps {
  isOpen: boolean;
  onStart: () => void;
  onClose: () => void;
  senderName: string;
  isDark?: boolean;
}

const ReferralWelcomeModal = ({
  isOpen,
  onStart,
  onClose,
  senderName,
  isDark = true
}: ReferralWelcomeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
        <DialogHeader>
          <DialogTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            Welcome to Ramel
          </DialogTitle>
        </DialogHeader>
        <p className={`mt-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Your friend {senderName} invited you to try the app! You’ve received 5 free credits to get started 🎉
        </p>
        <DialogFooter className="mt-4">
          <Button onClick={onStart} className="w-full">
            Start My Trial
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralWelcomeModal;
