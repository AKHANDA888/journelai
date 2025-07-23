import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { getInsights } from '@/lib/api';
import { Insight } from '@/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { motion } from 'framer-motion';

export function InsightsPage() {
  const [insights, setInsights] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const data = await getInsights('user-123');
      setInsights(data);
      setLoading(false);
    };
    fetchInsights();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Your Insights</h2>
      
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <Card>
              <CardHeader>
                <CardTitle>Weekly Mood Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : (
                  <ChartContainer config={{}} className="min-h-[250px] w-full">
                    <BarChart accessibilityLayer data={insights?.weeklySummary.chartData}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="mood" fill="var(--color-primary)" radius={8} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            <Card>
              <CardHeader>
                <CardTitle>Common Themes</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 min-h-[314px] items-center justify-center">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-8 w-20 rounded-full" />)
                ) : (
                  insights?.wordCloud.slice(0, 10).map((word, i) => (
                    <motion.div 
                      key={word.text} 
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      {word.text}
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
