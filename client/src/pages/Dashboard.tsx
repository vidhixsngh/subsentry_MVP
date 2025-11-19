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

  // Generate AI insights when analytics data is available
  useEffect(() => {
    if (analytics && analytics.totalSubscriptions > 0 && !insights) {
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
          category: '',
          billingCycle: analytics.leastUsed.billingCycle,
          lastUsedDate: analytics.leastUsed.lastUsedDate,
        } : null,
      });
    }
  }, [analytics?.totalSubscriptions]);

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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white">
      <AppHeader onSettingsClick={() => setLocation('/settings')} />

      <main className="container mx-auto px-6 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header with Stats Summary */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Hey {firstName}! 👋</h2>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">{subscriptions.length}</span> subscriptions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">₹{stats.totalMonthly.toFixed(2)}</span>/month
                </span>
              </div>
              {stats.overdue > 0 && (
                <div className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  {stats.overdue} overdue
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setLocation('/reminders')}
              variant="outline"
              className="gap-2"
              data-testid="button-setup-reminders"
            >
              <Calendar className="w-4 h-4" />
              Reminders
            </Button>
            <Button
              onClick={() => setLocation('/add-subscription')}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              data-testid="button-add-subscription"
            >
              <Plus className="w-4 h-4" />
              Add Subscription
            </Button>
          </div>
        </div>

        {/* Upcoming Renewals - Compact */}
        {upcomingRenewals.length > 0 && (
          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-lg">Upcoming Renewals</CardTitle>
                </div>
                <span className="text-sm text-emerald-700 font-medium">
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
                  const isUrgent = daysUntil <= 3;
                  
                  return (
                    <div
                      key={subscription.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        isUrgent
                          ? 'border-amber-300 bg-amber-50'
                          : 'border-gray-200 bg-white'
                      }`}
                      onClick={() => setLocation(`/subscription/${subscription.id}`)}
                      data-testid={`renewal-${subscription.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{subscription.name}</h4>
                          <p className="text-sm text-gray-600">
                            {daysUntil === 0 ? 'Renews today' : daysUntil === 1 ? 'Renews tomorrow' : `Renews in ${daysUntil} days`}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-emerald-600">
                            ₹{parseFloat(subscription.amount).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Your Subscriptions</CardTitle>
              <CardDescription>
                Manage and track all your active subscriptions
              </CardDescription>
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
