import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const steps = [
  {
    title: 'Welcome to Aura',
    description: "Let's personalize your journaling experience. First, tell us a bit about yourself.",
    question: 'What is your current role?',
    options: ['Student', 'Working', 'Freelancer', 'Retired'],
    key: 'role',
  },
  {
    title: 'Your Goals',
    description: 'What do you hope to achieve with journaling?',
    question: 'What are your primary goals?',
    options: ['Clarity', 'Productivity', 'Mindfulness', 'Creativity'],
    key: 'goals',
  },
  {
    title: 'Journaling Style',
    description: 'How do you prefer to journal?',
    question: 'What is your preferred style?',
    options: ['Guided', 'Freestyle', 'Prompts', 'Visual'],
    key: 'style',
  },
];

export function OnboardingPage({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSelect = (key: string, value: string) => {
    setAnswers({ ...answers, [key]: value });
  };

  const step = steps[currentStep];
  const isSelected = !!answers[step.key];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
       <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        className="mb-6"
      >
        <Avatar className="w-24 h-24">
          <AvatarImage src="https://github.com/shadcn.png" alt="Aura Guide" />
          <AvatarFallback><Lightbulb /></AvatarFallback>
        </Avatar>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="w-full max-w-md"
        >
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="font-semibold">{step.question}</p>
              <ToggleGroup
                type="single"
                className="flex-wrap justify-center"
                value={answers[step.key]}
                onValueChange={(value) => {
                  if (value) handleSelect(step.key, value);
                }}
              >
                {step.options.map((option, i) => (
                  <motion.div
                    key={option}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <ToggleGroupItem value={option} className="m-1">
                      {option}
                    </ToggleGroupItem>
                  </motion.div>
                ))}
              </ToggleGroup>
              <Button onClick={handleNext} disabled={!isSelected} className="w-full">
                {currentStep < steps.length - 1 ? 'Next' : 'Finish Setup'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
