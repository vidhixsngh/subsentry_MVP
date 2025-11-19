import { useState, useCallback } from 'react';
import { generateAIInsights, type AnalyticsData } from '@/lib/gemini';

export function useAIInsights() {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = useCallback(async (analyticsData: AnalyticsData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateAIInsights(analyticsData);
      setInsights(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate insights');
      setInsights('');
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
