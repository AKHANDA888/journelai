import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
}

export function AutoSaveIndicator({ isSaving }: AutoSaveIndicatorProps) {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!isSaving) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving]);

  return (
    <div className="h-6">
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div
            key="saving"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-muted-foreground"
          >
            Saving...
          </motion.div>
        ) : showSaved ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-1 text-sm text-green-500"
          >
            <Check className="h-4 w-4" />
            Saved
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
