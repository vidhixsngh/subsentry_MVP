import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DollarSign, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import SpendingPieChart from "./analytics/SpendingPieChart";
import CategoryBarChart from "./analytics/CategoryBarChart";
import TopSubscriptionsCard from "./analytics/TopSubscriptionsCard";
import LeastUsedCard from "./analytics/LeastUsedCard";
import AIInsightsCard from "./analytics/AIInsightsCard";
import { useAIInsights } from "@/hooks/useAIInsights";
import { useEffect } from "react";

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
  } | null;
  statusBreakdown: Record<string, number>;
  chartData: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
}

interface AnalyticsDashboardProps {
  analytics: AnalyticsData;
}

export default function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  const { insights, isLoading, generateInsights, refreshInsights } = useAIInsights();

  // Generate AI insights on mount
  useEffect(() => {
    if (analytics.totalSubscriptions > 0) {
      generateInsights({
        totalMonthly: analytics.totalMonthly,
        totalSubscriptions: analytics.totalSubscriptions,
        categoryBreakdown: analytics.categoryBreakdown,
        top3: analytics.top3.map(sub => ({
          name: sub.name,
          amount: parseFloat(sub.amount),
          category: sub.category,
          billingCycle: sub.billingCycle,
          lastUsedDate: sub.lastUsedDate,
        })),
        leastUsed: analytics.leastUsed ? {
          name: analytics.leastUsed.name,
          amount: parseFloat(analytics.leastUsed.amount),
          category: '', // Not needed for AI
          billingCycle: analytics.leastUsed.billingCycle,
          lastUsedDate: analytics.leastUsed.lastUsedDate,
        } : null,
      });
    }
  }, [analytics.totalSubscriptions]); // Only regenerate when subscription count changes

  const handleRefreshInsights = () => {
    refreshInsights({
      totalMonthly: analytics.totalMonthly,
      totalSubscriptions: analytics.totalSubscriptions,
      categoryBreakdown: analytics.categoryBreakdown,
      top3: analytics.top3.map(sub => ({
        name: sub.name,
        amount: parseFloat(sub.amount),
        category: sub.category,
        billingCycle: sub.billingCycle,
        lastUsedDate: sub.lastUsedDate,
      })),
      leastUsed: analytics.leastUsed ? {
        name: analytics.leastUsed.name,
        amount: parseFloat(analytics.leastUsed.amount),
        category: '',
        billingCycle: analytics.leastUsed.billingCycle,
        lastUsedDate: analytics.leastUsed.lastUsedDate,
      } : null,
    });
  };

  // Prepare bar chart data
  const barChartData = Object.entries(analytics.categoryBreakdown).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* AI Insights Card - Prominent at top */}
      {analytics.totalSubscriptions > 0 && (
        <AIInsightsCard
          insights={insights}
          isLoading={isLoading}
          onRefresh={handleRefreshInsights}
        />
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              ₹{analytics.totalMonthly.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {analytics.totalSubscriptions} subscription{analytics.totalSubscriptions !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Subscriptions</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {analytics.statusBreakdown.Paid || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Up to date with payments
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {(analytics.statusBreakdown.Pending || 0) + (analytics.statusBreakdown.Overdue || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.statusBreakdown.Overdue || 0} overdue, {analytics.statusBreakdown.Pending || 0} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Alert */}
      <Alert className="border-emerald-200 bg-emerald-50">
        <TrendingUp className="h-4 w-4 text-emerald-600" />
        <AlertTitle className="text-emerald-900">Monthly Spending Summary</AlertTitle>
        <AlertDescription className="text-emerald-800">
          This month you spent <strong>₹{analytics.totalMonthly.toFixed(2)}</strong> across{' '}
          <strong>{analytics.totalSubscriptions}</strong> subscription{analytics.totalSubscriptions !== 1 ? 's' : ''}.
          {analytics.chartData.length > 0 && (
            <> Your largest category is <strong>{analytics.chartData[0].name}</strong> at{' '}
            <strong>₹{analytics.chartData[0].value.toFixed(2)}/month</strong>.</>
          )}
        </AlertDescription>
      </Alert>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Monthly Spend Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">Distribution by category</p>
          </CardHeader>
          <CardContent>
            <SpendingPieChart data={analytics.chartData} />
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Category Comparison</CardTitle>
            <p className="text-sm text-muted-foreground">Compare spending across categories</p>
          </CardHeader>
          <CardContent>
            <CategoryBarChart data={barChartData} />
          </CardContent>
        </Card>
      </div>

      {/* Top 3 and Least Used Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopSubscriptionsCard subscriptions={analytics.top3} />
        <LeastUsedCard subscription={analytics.leastUsed} />
      </div>
    </div>
  );
}
