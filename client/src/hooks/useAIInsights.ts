import { useState, useCallback, useEffect } from 'react';
import { generateAIInsights, type AnalyticsData } from '@/lib/gemini';

const INSIGHTS_STORAGE_KEY = 'subsentry_ai_insights';

export function useAIInsights() {
  // Load cached insights from localStorage on mount
  const [insights, setInsights] = useState<string>(() => {
    try {
      return localStorage.getItem(INSIGHTS_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save insights to localStorage whenever they change
  useEffect(() => {
    if (insights) {
      try {
        localStorage.setItem(INSIGHTS_STORAGE_KEY, insights);
      } catch (err) {
        console.error('Failed to save insights to localStorage:', err);
      }
    }
  }, [insights]);

  const generateInsights = useCallback(async (analyticsData: AnalyticsData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateAIInsights(analyticsData);
      setInsights(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate insights');
      // Don't clear existing insights on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshInsights = useCallback(async (analyticsData: AnalyticsData) => {
    await generateInsights(analyticsData);
  }, [generateInsights]);

  return {
    insights,
    isLoading,
    error,
    generateInsights,
    refreshInsights,
  };
}
