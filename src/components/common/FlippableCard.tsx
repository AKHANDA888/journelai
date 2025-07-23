import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FlippableCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

export function FlippableCard({ front, back, className }: FlippableCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className={cn("perspective-1000", className)} onClick={handleFlip}>
      <motion.div
        className="relative w-full h-full transform-style-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute w-full h-full backface-hidden">
          {front}
        </div>
        <div className="absolute w-full h-full backface-hidden transform rotate-y-180">
          {back}
        </div>
      </motion.div>
    </div>
  );
}
