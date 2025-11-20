import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptions } from './useSubscriptions';

interface AnalyticsData {
  totalMonthly: number;
  totalSubscriptions: number;
  categoryBreakdown: Record<string, number>;
  top3: Array<{
    id: string;
    name: string;
    amount: string;
    monthlyAmount: number;
    category: string;
    billingCycle: string;
    lastUsedDate?: string | null;
  }>;
  leastUsed: {
    id: string;
    name: string;
    amount: string;
    billingCycle: string;
    lastUsedDate?: string | null;
    score?: number;
  } | null;
  statusBreakdown: Record<string, number>;
  chartData: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
}

export function useAnalytics() {
  const { user } = useAuth();
  const { subscriptions, isLoading: subsLoading } = useSubscriptions();

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['analytics', user?.id, subscriptions],
    queryFn: async (): Promise<AnalyticsData> => {
      if (!subscriptions || subscriptions.length === 0) {
        return {
          totalMonthly: 0,
          totalSubscriptions: 0,
          categoryBreakdown: {},
          top3: [],
          leastUsed: null,
          statusBreakdown: {},
          chartData: [],
        };
      }

      // Calculate total monthly spending
      const totalMonthly = subscriptions.reduce((sum, sub) => {
        const amount = parseFloat(sub.amount);
        switch (sub.billingCycle) {
          case 'Weekly':
            return sum + amount * 4;
          case 'Monthly':
            return sum + amount;
          case 'Quarterly':
            return sum + amount / 3;
          case 'Yearly':
            return sum + amount / 12;
          default:
            return sum + amount;
        }
      }, 0);

      // Category breakdown
      const categoryBreakdown = subscriptions.reduce((acc, sub) => {
        const amount = parseFloat(sub.amount);
        let monthlyAmount = amount;

        switch (sub.billingCycle) {
          case 'Weekly':
            monthlyAmount = amount * 4;
            break;
          case 'Quarterly':
            monthlyAmount = amount / 3;
            break;
          case 'Yearly':
            monthlyAmount = amount / 12;
            break;
        }

        acc[sub.category] = (acc[sub.category] || 0) + monthlyAmount;
        return acc;
      }, {} as Record<string, number>);

      // Top 3 highest cost (monthly equivalent)
      const top3 = [...subscriptions]
        .map((sub) => {
          const amount = parseFloat(sub.amount);
          let monthlyAmount = amount;

          switch (sub.billingCycle) {
            case 'Weekly':
              monthlyAmount = amount * 4;
              break;
            case 'Quarterly':
              monthlyAmount = amount / 3;
              break;
            case 'Yearly':
              monthlyAmount = amount / 12;
              break;
          }

          return { ...sub, monthlyAmount };
        })
        .sort((a, b) => b.monthlyAmount - a.monthlyAmount)
        .slice(0, 3);

      // Least used (based on last_used_date and billing frequency)
      const leastUsed = [...subscriptions]
        .map((sub) => {
          let score = 0;
          
          // Score based on last used date (older = higher score = less used)
          if (sub.lastUsedDate) {
            const daysSinceUsed = Math.floor(
              (new Date().getTime() - new Date(sub.lastUsedDate).getTime()) / (1000 * 60 * 60 * 24)
            );
            score += daysSinceUsed;
          } else {
            score += 365; // No usage data = assume not used
          }
          
          // Additional score based on billing cycle (yearly = less essential)
          const frequencyScore: Record<string, number> = {
            Yearly: 100,
            Quarterly: 50,
            Monthly: 20,
            Weekly: 0,
          };
          score += frequencyScore[sub.billingCycle] || 0;
          
          return { ...sub, score };
        })
        .sort((a, b) => b.score - a.score)[0] || null;

      // Status breakdown
      const statusBreakdown = subscriptions.reduce((acc, sub) => {
        acc[sub.status] = (acc[sub.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Chart data for pie chart
      const chartData = Object.entries(categoryBreakdown).map(([name, value]) => ({
        name,
        value: Math.round(value),
        percentage: Math.round((value / totalMonthly) * 100),
      }));

      return {
        totalMonthly,
        totalSubscriptions: subscriptions.length,
        categoryBreakdown,
        top3,
        leastUsed,
        statusBreakdown,
        chartData,
      };
    },
    enabled: !!user && !subsLoading,
  });

  return {
    analytics,
    isLoading: isLoading || subsLoading,
    error,
  };
}
