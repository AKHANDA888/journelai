import { faker } from '@faker-js/faker';
import { JournalPrompt, Insight, Goal, Sentiment, CoachingTip, SentimentValue, StreakInfo } from '@/types';

const API_BASE_URL = 'https://example.com/api';

// Mocked API calls with faker.js
export const getPrompts = async (userId: string): Promise<{ prompts: JournalPrompt[] }> => {
    console.log(`Fetching prompts for userId: ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return {
        prompts: [
            { id: faker.string.uuid(), text: "What was the highlight of your day, and why did it stand out?", category: 'daily' },
            { id: faker.string.uuid(), text: "Reflect on a recent challenge. What did you learn from it?", category: 'history' },
            { id: faker.string.uuid(), text: "Describe a moment today when you felt completely at peace.", category: 'mood' },
        ]
    };
};

export const getSentiment = async (text: string): Promise<Sentiment> => {
    console.log(`Analyzing sentiment for text: ${text}`);
    await new Promise(resolve => setTimeout(resolve, 700));
    const sentiment: SentimentValue = faker.helpers.arrayElement(['happy', 'sad', 'stressed', 'reflective', 'neutral']);
    const colorMap: Record<SentimentValue, string> = {
        happy: 'text-green-500',
        sad: 'text-blue-500',
        stressed: 'text-red-500',
        reflective: 'text-purple-500',
        neutral: 'text-gray-500',
    };
    return {
        sentiment,
        color: colorMap[sentiment],
    };
};

export const getInsights = async (userId: string): Promise<Insight> => {
    console.log(`Fetching insights for userId: ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
        wordCloud: Array.from({ length: 15 }, () => ({
            text: faker.lorem.word(),
            value: faker.number.int({ min: 10, max: 100 }),
        })),
        weeklySummary: {
            chartData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
                day,
                mood: faker.number.int({ min: 1, max: 5 }),
            })),
        },
    };
};

export const getGoals = async (userId: string): Promise<Goal[]> => {
    console.log(`Fetching goals for userId: ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
        { id: faker.string.uuid(), title: 'Sleep 8 hours', type: 'sleep', streak: 5, completed: true, target: 7, progress: 5 },
        { id: faker.string.uuid(), title: 'Morning Jog', type: 'exercise', streak: 12, completed: false, target: 5, progress: 2 },
        { id: faker.string.uuid(), title: 'Gratitude Entry', type: 'gratitude', streak: 2, completed: true, target: 3, progress: 3 },
        { id: faker.string.uuid(), title: 'Read 20 pages', type: 'gratitude', streak: 0, completed: false, target: 10, progress: 0 },
    ];
};

export const updateGoal = async (goalId: string, completed: boolean): Promise<Goal> => {
    console.log(`Updating goal ${goalId} to completed: ${completed}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    // This is a mock, in a real app you'd get the updated goal from the server
    return {
        id: goalId,
        title: 'Updated Goal',
        type: 'exercise',
        streak: completed ? 13 : 12,
        completed,
        target: 5,
        progress: completed ? 3 : 2,
    };
};

export const getCoachingTip = async (userId: string): Promise<CoachingTip> => {
    console.log(`Fetching coaching tip for userId: ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
        id: faker.string.uuid(),
        text: faker.lorem.sentence(),
    };
};

export const getStreakInfo = async (userId: string): Promise<StreakInfo> => {
    console.log(`Fetching streak info for userId: ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 450));
    return {
        longestStreak: 21,
        longestStreakGoal: "Morning Jog",
        currentStreak: 5,
        currentStreakGoal: "Sleep 8 hours"
    };
};
