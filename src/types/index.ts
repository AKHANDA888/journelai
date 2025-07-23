export interface JournalPrompt {
    id: string;
    text: string;
    category: 'daily' | 'mood' | 'history';
}

export type SentimentValue = 'happy' | 'sad' | 'stressed' | 'reflective' | 'neutral';

export interface Sentiment {
    sentiment: SentimentValue;
    color: string;
}

export interface Insight {
    wordCloud: { text: string; value: number }[];
    weeklySummary: {
        chartData: { day: string; mood: number }[];
    };
}

export interface Goal {
    id: string;
    title: string;
    type: 'sleep' | 'exercise' | 'gratitude';
    streak: number;
    completed: boolean;
    target: number;
    progress: number;
}

export interface CoachingTip {
    id: string;
    text: string;
}

export interface StreakInfo {
    longestStreak: number;
    longestStreakGoal: string;
    currentStreak: number;
    currentStreakGoal: string;
}
