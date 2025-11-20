import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SubscriptionList from "@/components/SubscriptionList";
import AppHeader from "@/components/AppHeader";
import AIInsightsCard from "@/components/analytics/AIInsightsCard";
import { Plus, Calendar, TrendingUp, DollarSign } from "lucide-react";
import { useLocation } from "wouter";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAIInsights } from "@/hooks/useAIInsights";
import { useEffect } from "react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { subscriptions, isLoading } = useSubscriptions();
  const { user } = useAuth();
  const { analytics } = useAnalytics();
  const { insights, isLoading: aiLoading, generateInsights, refreshInsights } = useAIInsights();

  // Get user's first name
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 
                    user?.user_metadata?.name?.split(' ')[0] || 
                    user?.email?.split('@')[0] || 
                    'there';

  // Generate AI insights only when explicitly requested (optimized - no auto-generation)
  // User can click refresh button to generate insights

  const handleRefreshInsights = () => {
    if (analytics) {
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
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader onSettingsClick={() => setLocation('/settings')} />
        <main className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading subscriptions...</div>
          </div>
        </main>
      </div>
    );
  }

  // Calculate stats from subscriptions
  const stats = {
    pending: subscriptions.filter(s => s.status === 'Pending').length,
    paid: subscriptions.filter(s => s.status === 'Paid').length,
    overdue: subscriptions.filter(s => s.status === 'Overdue').length,
    totalMonthly: subscriptions.reduce((sum, s) => sum + parseFloat(s.amount), 0),
  };

  const upcomingRenewals = [...subscriptions]
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <AppHeader onSettingsClick={() => setLocation('/settings')} />

      <main className="container mx-auto px-6 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header with Stats Summary */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Hey {firstName}! 👋</h2>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{subscriptions.length}</span> subscriptions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">₹{stats.totalMonthly.toFixed(2)}</span>/month
                </span>
              </div>
              {stats.overdue > 0 && (
                <div className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded-full">
                  {stats.overdue} overdue
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setLocation('/reminders')}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              data-testid="button-setup-reminders"
            >
              <Calendar className="w-4 h-4" />
              Set Reminders
            </Button>
            <Button
              onClick={() => setLocation('/add-subscription')}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              data-testid="button-add-subscription"
            >
              <Plus className="w-4 h-4" />
              Add Subscription
            </Button>
          </div>        </div>

        {/* Upcoming Renewals - Compact */}
        {upcomingRenewals.length > 0 && (
          <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/50 dark:to-gray-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <CardTitle className="text-lg">Upcoming Renewals</CardTitle>
                </div>
                <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                  Next {upcomingRenewals.length}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingRenewals.map((subscription) => {
                  const daysUntil = Math.ceil(
                    (new Date(subscription.renewalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  
                  // Color coding: Red for today, Yellow for <=3 days, White for >3 days
                  let cardStyle = '';
                  if (daysUntil === 0) {
                    cardStyle = 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/50 hover:border-red-500 dark:hover:border-red-500';
                  } else if (daysUntil > 0 && daysUntil <= 3) {
                    cardStyle = 'border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 hover:border-yellow-500 dark:hover:border-yellow-500';
                  } else {
                    cardStyle = 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600';
                  }
                  
                  return (
                    <div
                      key={subscription.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${cardStyle}`}
                      onClick={() => setLocation(`/subscription/${subscription.id}`)}
                      data-testid={`renewal-${subscription.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{subscription.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {daysUntil === 0 ? '🔴 Renews today' : daysUntil === 1 ? '🟡 Renews tomorrow' : daysUntil <= 3 ? `🟡 Renews in ${daysUntil} days` : `Renews in ${daysUntil} days`}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{parseFloat(subscription.amount).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(subscription.renewalDate).toLocaleDateString('en-IN', { 
                              month: 'short', 
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Your Subscriptions and AI Insights Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Your Subscriptions */}
          <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/50 dark:via-gray-900 dark:to-blue-950/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl text-blue-900 dark:text-blue-100">Your Subscriptions</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Manage and track all your active subscriptions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SubscriptionList
                subscriptions={subscriptions}
                onSubscriptionClick={(sub) => setLocation(`/subscription/${sub.id}`)}
              />
            </CardContent>
          </Card>

          {/* AI Insights */}
          {subscriptions.length > 0 && (
            <AIInsightsCard
              insights={insights}
              isLoading={aiLoading}
              onRefresh={handleRefreshInsights}
            />
          )}
        </div>
      </main>
    </div>
  );
}
