import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPrompts, getGoals, getCoachingTip, getStreakInfo } from '@/lib/api';
import { JournalPrompt, Goal, CoachingTip, StreakInfo } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Lightbulb, PenSquare, Trophy } from 'lucide-react';
import { FlippableCard } from '@/components/common/FlippableCard';
import ConfettiExplosion from 'react-confetti-explosion';
import { Link } from 'react-router-dom';

export function HomePage() {
  const [prompts, setPrompts] = useState<JournalPrompt[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [coachingTip, setCoachingTip] = useState<CoachingTip | null>(null);
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCoach, setShowCoach] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [promptsData, goalsData, streakData] = await Promise.all([
        getPrompts('user-123'),
        getGoals('user-123'),
        getStreakInfo('user-123'),
      ]);
      setPrompts(promptsData.prompts);
      setGoals(goalsData);
      setStreakInfo(streakData);
      
      const coachEnabled = localStorage.getItem("aiCoachEnabled") === "true";
      setShowCoach(coachEnabled);
      if (coachEnabled) {
        const tipData = await getCoachingTip('user-123');
        setCoachingTip(tipData);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  const mainPrompt = prompts[0];
  const otherPrompts = prompts.slice(1);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold tracking-tight">Good Morning, Alex</h2>
        <p className="text-muted-foreground text-lg">Ready to start your day?</p>
      </motion.div>

      {loading ? <Skeleton className="h-48 w-full" /> : mainPrompt && (
        <FlippableCard
          className="h-48"
          front={
            <Card className="h-full flex flex-col justify-center items-center text-center p-6 bg-secondary cursor-pointer">
              <CardTitle className="text-primary mb-2">Daily Prompt</CardTitle>
              <p className="text-lg text-secondary-foreground">{mainPrompt.text}</p>
              <p className="text-xs text-muted-foreground mt-4">Click to flip</p>
            </Card>
          }
          back={
            <Card className="h-full flex flex-col justify-center items-center p-6 bg-card">
              <CardTitle className="mb-4">Start Your Entry</CardTitle>
              <Link to="/write">
                <Button size="lg">
                  <PenSquare className="mr-2 h-5 w-5" />
                  Write Now
                </Button>
              </Link>
            </Card>
          }
        />
      )}
      
      {showCoach && coachingTip && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="bg-secondary/50 border-primary/20">
            <CardHeader className="flex flex-row items-center gap-4">
              <Lightbulb className="w-6 h-6 text-primary"/>
              <CardTitle className="text-primary">AI Coach Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-foreground">{coachingTip.text}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {loading ? <Skeleton className="h-24 w-full" /> : streakInfo && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="bg-accent/20 border-accent/50 relative overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Trophy className="w-10 h-10 text-accent" />
                <div>
                  <p className="font-bold text-accent-foreground">Longest Streak: {streakInfo.longestStreak} days!</p>
                  <p className="text-sm text-muted-foreground">{streakInfo.longestStreakGoal}</p>
                </div>
              </div>
              {streakInfo.longestStreak > 20 && <ConfettiExplosion force={0.6} duration={2500} particleCount={80} width={1000} />}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Today's Goals</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
          ) : (
            goals.filter(g => !g.completed).slice(0, 2).map((goal, i) => (
              <motion.div key={goal.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <Checkbox id={`goal-${goal.id}`} className="h-6 w-6"/>
                    <div className="flex-grow space-y-1">
                      <label htmlFor={`goal-${goal.id}`} className="font-medium">{goal.title}</label>
                      <Progress value={(goal.progress / goal.target) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">{goal.streak} day streak</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">More Prompts</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatePresence>
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader><Skeleton className="h-5 w-2/5" /></CardHeader>
                  <CardContent><Skeleton className="h-4 w-4/5" /></CardContent>
                </Card>
              ))
            ) : (
              otherPrompts.map((prompt, i) => (
                <motion.div key={prompt.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}>
                  <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                    <CardHeader><CardTitle className="capitalize text-primary text-base">{prompt.category} Prompt</CardTitle></CardHeader>
                    <CardContent><p>{prompt.text}</p></CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
