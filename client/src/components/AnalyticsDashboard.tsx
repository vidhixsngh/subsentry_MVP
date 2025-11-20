import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import SpendingPieChart from "./analytics/SpendingPieChart";
import CategoryBarChart from "./analytics/CategoryBarChart";
import TopSubscriptionsCard from "./analytics/TopSubscriptionsCard";
import LeastUsedCard from "./analytics/LeastUsedCard";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useLocation } from "wouter";

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
  const [, setLocation] = useLocation();
  const { subscriptions } = useSubscriptions();
  const [showPaidDialog, setShowPaidDialog] = useState(false);
  const [showAttentionDialog, setShowAttentionDialog] = useState(false);

  // Filter subscriptions by status
  const paidSubscriptions = subscriptions.filter(s => s.status === 'Paid');
  const attentionSubscriptions = subscriptions.filter(s => s.status === 'Pending' || s.status === 'Overdue');

  // Prepare bar chart data
  const barChartData = Object.entries(analytics.categoryBreakdown).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/50 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">Monthly Total</CardTitle>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              ₹{analytics.totalMonthly.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
              Across {analytics.totalSubscriptions} subscription{analytics.totalSubscriptions !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer hover:border-green-400 dark:hover:border-green-500 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-white dark:from-green-950/50 dark:to-gray-900"
          onClick={() => setShowPaidDialog(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">Paid Subscriptions</CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {analytics.statusBreakdown.Paid || 0}
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
              Click to view list
            </p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer hover:border-amber-400 dark:hover:border-amber-500 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/50 dark:to-gray-900"
          onClick={() => setShowAttentionDialog(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">Needs Attention</CardTitle>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {(analytics.statusBreakdown.Pending || 0) + (analytics.statusBreakdown.Overdue || 0)}
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
              Click to view list
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Paid Subscriptions Dialog */}
      <Dialog open={showPaidDialog} onOpenChange={setShowPaidDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Paid Subscriptions ({paidSubscriptions.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {paidSubscriptions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No paid subscriptions</p>
            ) : (
              paidSubscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setShowPaidDialog(false);
                    setLocation(`/subscription/${sub.id}`);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{sub.name}</h4>
                      <p className="text-sm text-gray-600">{sub.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">₹{parseFloat(sub.amount).toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{sub.billingCycle}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Needs Attention Dialog */}
      <Dialog open={showAttentionDialog} onOpenChange={setShowAttentionDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Needs Attention ({attentionSubscriptions.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {attentionSubscriptions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">All subscriptions are up to date!</p>
            ) : (
              attentionSubscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className={`p-4 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                    sub.status === 'Overdue' ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'
                  }`}
                  onClick={() => {
                    setShowAttentionDialog(false);
                    setLocation(`/subscription/${sub.id}`);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{sub.name}</h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          sub.status === 'Overdue' 
                            ? 'bg-red-200 text-red-800' 
                            : 'bg-amber-200 text-amber-800'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{sub.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">₹{parseFloat(sub.amount).toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{sub.billingCycle}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Summary Alert */}
      <Alert className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
        <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <AlertTitle className="text-emerald-900 dark:text-emerald-100">Monthly Spending Summary</AlertTitle>
        <AlertDescription className="text-emerald-800 dark:text-emerald-300">
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
        <Card className="hover:shadow-lg transition-shadow border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/50 dark:to-gray-900">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Monthly Spend Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Distribution by category</p>
          </CardHeader>
          <CardContent>
            <SpendingPieChart data={analytics.chartData} />
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="hover:shadow-lg transition-shadow border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/50 dark:to-gray-900">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Category Comparison</CardTitle>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Compare spending across categories</p>
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
