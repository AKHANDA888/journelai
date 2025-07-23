import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { getGoals, updateGoal } from '@/lib/api';
import { Goal } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import ConfettiExplosion from 'react-confetti-explosion';
import { Award, Target } from 'lucide-react';

export function TrackerPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [explodingGoalId, setExplodingGoalId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      const data = await getGoals('user-123');
      setGoals(data);
      setLoading(false);
    };
    fetchGoals();
  }, []);

  const handleGoalCheck = async (goalId: string, checked: boolean) => {
    // Optimistically update UI
    const originalGoals = [...goals];
    setGoals(goals.map(g => g.id === goalId ? { ...g, completed: checked } : g));

    if (checked) {
      setExplodingGoalId(goalId);
    }

    try {
      await updateGoal(goalId, checked);
    } catch (error) {
      console.error("Failed to update goal", error);
      // Revert on error
      setGoals(originalGoals);
    }
  };

  const completedGoals = goals.filter(g => g.completed);
  const activeGoals = goals.filter(g => !g.completed);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold tracking-tight">Goal Tracker</h2>
        <p className="text-muted-foreground text-lg">Stay on top of your habits and aspirations.</p>
      </motion.div>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Active Goals</h3>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : activeGoals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence>
              {activeGoals.map((goal, i) => (
                <motion.div key={goal.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                  <Card className="relative">
                    <CardHeader>
                      <CardTitle className="text-base">{goal.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-4">
                        <Checkbox id={`goal-check-${goal.id}`} checked={goal.completed} onCheckedChange={(checked) => handleGoalCheck(goal.id, !!checked)} className="h-6 w-6" />
                        <div className="flex-grow">
                          <Progress value={(goal.progress / goal.target) * 100} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{goal.progress} / {goal.target} completed</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">{goal.streak} day streak 🔥</p>
                      {explodingGoalId === goal.id && <ConfettiExplosion onComplete={() => setExplodingGoalId(null)} />}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-muted-foreground">No active goals. Add some new ones!</p>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2"><Award className="w-5 h-5 text-green-500" /> Completed Goals</h3>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-20 w-full" />
          </div>
        ) : completedGoals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence>
              {completedGoals.map((goal, i) => (
                <motion.div key={goal.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex items-center gap-4">
                      <Checkbox id={`goal-check-${goal.id}`} checked={goal.completed} onCheckedChange={(checked) => handleGoalCheck(goal.id, !!checked)} className="h-6 w-6" />
                      <label htmlFor={`goal-check-${goal.id}`} className="font-medium text-muted-foreground line-through">{goal.title}</label>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-muted-foreground">Complete a goal to see it here.</p>
        )}
      </section>
    </div>
  );
}
