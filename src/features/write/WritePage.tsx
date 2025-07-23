import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Mic, Image, Type, Sparkles } from 'lucide-react';
import { getSentiment } from '@/lib/api';
import { Sentiment, SentimentValue } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { AutoSaveIndicator } from '@/components/common/AutoSaveIndicator';
import { useDebounce } from '@/hooks/use-debounce';

const sentimentColorMap: Record<SentimentValue, string> = {
  happy: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300',
  sad: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300',
  stressed: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-300',
  reflective: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-300',
  neutral: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-300',
};

export function WritePage() {
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [inputMode, setInputMode] = useState('text');

  const debouncedText = useDebounce(text, 1500);

  useEffect(() => {
    if (debouncedText) {
      setIsSaving(true);
      // Simulate saving
      setTimeout(() => setIsSaving(false), 1000);
    }
  }, [debouncedText]);

  const handleAnalyze = async () => {
    if (!text) return;
    setLoading(true);
    setSentiment(null);
    const result = await getSentiment(text);
    setSentiment(result);
    setLoading(false);
  };

  const perspective = 800;
  const rotate = 10;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">New Entry</h2>
      <Card>
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-start">
            <motion.div
              initial={false}
              animate={{ rotateY: inputMode === 'text' ? 0 : -180 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
            >
              <ToggleGroup 
                type="single" 
                value={inputMode} 
                onValueChange={(value) => value && setInputMode(value)} 
                className="justify-start"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div style={{ backfaceVisibility: 'hidden' }}>
                  <ToggleGroupItem value="text" aria-label="Toggle text"><Type className="h-4 w-4" /></ToggleGroupItem>
                </motion.div>
                <motion.div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute' }}>
                  <ToggleGroupItem value="voice" aria-label="Toggle voice" disabled><Mic className="h-4 w-4" /></ToggleGroupItem>
                </motion.div>
                 <motion.div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', marginLeft: '40px' }}>
                  <ToggleGroupItem value="photo" aria-label="Toggle photo" disabled><Image className="h-4 w-4" /></ToggleGroupItem>
                </motion.div>
              </ToggleGroup>
            </motion.div>
            <AutoSaveIndicator isSaving={isSaving} />
          </div>
          <Textarea 
            placeholder="Start writing your thoughts... The more you write, the better the sentiment analysis." 
            rows={10} 
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <div className="h-8">
              <AnimatePresence>
                {loading && <Skeleton className="h-8 w-24 rounded-md" />}
                {sentiment && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Badge variant="outline" className={`capitalize text-sm py-1 px-3 ${sentimentColorMap[sentiment.sentiment]}`}>
                      {sentiment.sentiment}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button onClick={handleAnalyze} disabled={loading || !text}>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze Sentiment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
