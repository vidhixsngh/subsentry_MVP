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
  }>;
  leastUsed: {
    id: string;
    name: string;
    amount: string;
    billing_cycle: string;
  } | null;
  statusBreakdown: Record<string, number>;
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
        };
      }

      // Calculate total monthly spending
      const totalMonthly = subscriptions.reduce((sum, sub) => {
        const amount = parseFloat(sub.amount);
        switch (sub.billing_cycle) {
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

        switch (sub.billing_cycle) {
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

          switch (sub.billing_cycle) {
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

      // Least used (based on billing frequency - yearly = least essential)
      const frequencyScore: Record<string, number> = {
        Yearly: 1,
        Quarterly: 2,
        Monthly: 3,
        Weekly: 4,
      };

      const leastUsed = [...subscriptions]
        .map((sub) => ({
          ...sub,
          score: frequencyScore[sub.billing_cycle] || 0,
        }))
        .sort((a, b) => a.score - b.score)[0] || null;

      // Status breakdown
      const statusBreakdown = subscriptions.reduce((acc, sub) => {
        acc[sub.status] = (acc[sub.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalMonthly,
        totalSubscriptions: subscriptions.length,
        categoryBreakdown,
        top3,
        leastUsed,
        statusBreakdown,
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
