import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SubscriptionList from "@/components/SubscriptionList";
import AppHeader from "@/components/AppHeader";
import AIInsightsCard from "@/components/analytics/AIInsightsCard";
import { Plus, Calendar, TrendingUp, DollarSign, CreditCard, Check, Sparkles, Bell, BarChart3, Lightbulb, Zap, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAIInsights } from "@/hooks/useAIInsights";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface RenewalItemProps {
  subscription: any;
  onViewDetails: () => void;
}

function RenewalItem({ subscription, onViewDetails }: RenewalItemProps) {
  const { updateSubscription } = useSubscriptions();
  const { toast } = useToast();
  const [isPaid, setIsPaid] = useState(subscription.status === 'Paid');
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handlePayNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Payment Gateway",
      description: "Payment feature coming soon! This is a demo button.",
      duration: 3000,
    });
  };

  const handleTogglePaid = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUpdating(true);

    try {
      const newStatus = !isPaid;
      let updates: any = {
        status: newStatus ? 'Paid' : 'Pending',
      };

      // If marking as paid, calculate next renewal date
      if (newStatus) {
        const currentRenewal = new Date(subscription.renewalDate);
        let nextRenewal = new Date(currentRenewal);

        switch (subscription.billingCycle) {
          case 'Weekly':
            nextRenewal.setDate(nextRenewal.getDate() + 7);
            break;
          case 'Monthly':
            nextRenewal.setMonth(nextRenewal.getMonth() + 1);
            break;
          case 'Quarterly':
            nextRenewal.setMonth(nextRenewal.getMonth() + 3);
            break;
          case 'Yearly':
            nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
            break;
        }

        updates.renewalDate = nextRenewal.toISOString().split('T')[0];
      }

      updateSubscription({
        id: subscription.id,
        updates,
      });

      setIsPaid(newStatus);

      toast({
        title: newStatus ? "✅ Marked as Paid" : "⏳ Marked as Pending",
        description: newStatus
          ? `${subscription.name} payment recorded. Next renewal updated.`
          : `${subscription.name} marked as pending.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${cardStyle}`}
      data-testid={`renewal-${subscription.id}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 cursor-pointer" onClick={onViewDetails}>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{subscription.name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {daysUntil === 0
              ? '🔴 Renews today'
              : daysUntil === 1
              ? '🟡 Renews tomorrow'
              : daysUntil <= 3
              ? `🟡 Renews in ${daysUntil} days`
              : `Renews in ${daysUntil} days`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right mr-2">
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              ₹{parseFloat(subscription.amount).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(subscription.renewalDate).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-[70px] gap-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-400 dark:hover:border-blue-600 transition-all"
            onClick={handlePayNow}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span className="text-xs">Pay</span>
          </Button>
          <Button
            size="sm"
            className={`h-8 w-[70px] gap-1.5 transition-all ${
              isPaid
                ? 'bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600 shadow-sm'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-300 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/40 dark:text-emerald-300 dark:border-emerald-700'
            }`}
            onClick={handleTogglePaid}
            disabled={isUpdating}
          >
            <div className="w-3.5 h-3.5 flex items-center justify-center">
              {isPaid && <Check className="w-3.5 h-3.5 animate-in zoom-in duration-200" />}
            </div>
            <span className="text-xs font-medium">{isUpdating ? '...' : 'Paid'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

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
    totalMonthly: subscriptions.reduce((sum, s) => {
      const amount = parseFloat(s.amount);
      // Convert to monthly equivalent based on billing cycle
      switch (s.billingCycle) {
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
    }, 0),
  };

  const upcomingRenewals = [...subscriptions]
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
    .slice(0, 3);

  // Empty state for new users
  if (subscriptions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
        <AppHeader onSettingsClick={() => setLocation('/settings')} />
        
        <main className="container mx-auto px-6 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Welcome Hero */}
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 rounded-full mb-4 animate-in zoom-in duration-500">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Welcome to SubSentry, {firstName}! 🎉
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your smart subscription manager is ready to help you track, manage, and optimize all your subscriptions in one place.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => setLocation('/add-subscription')}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-lg px-8"
              >
                <Plus className="w-5 h-5" />
                Add Your First Subscription
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/50 dark:to-gray-900 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xl dark:text-gray-100">Smart Reminders</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Never miss a payment again with intelligent renewal notifications
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/50 dark:to-gray-900 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-3">
                  <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl dark:text-gray-100">Analytics Dashboard</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Visualize your spending patterns with beautiful charts and insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/50 dark:to-gray-900 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-3">
                  <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl dark:text-gray-100">AI Insights</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Get personalized recommendations to optimize your subscriptions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/50 dark:to-gray-900 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-xl dark:text-gray-100">Quick Payments</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Mark payments and track renewal dates with one click
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-white dark:from-green-950/50 dark:to-gray-900 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl dark:text-gray-100">Spending Tracking</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Monitor your monthly spending across all billing cycles
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/50 dark:to-gray-900 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-xl dark:text-gray-100">Secure & Private</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Your data is encrypted and protected with enterprise-grade security
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Quick Start Guide */}
          <Card className="max-w-4xl mx-auto border-2 border-emerald-300 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/50 dark:via-gray-900 dark:to-emerald-950/30">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 dark:text-gray-100">
                <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                Getting Started is Easy
              </CardTitle>
              <CardDescription className="text-base dark:text-gray-400">
                Follow these simple steps to take control of your subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Add Your Subscriptions</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click "Add Subscription" and enter details like name, amount, and renewal date
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Set Up Reminders</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configure email reminders so you never miss a renewal date
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Track & Optimize</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View analytics, get AI insights, and optimize your spending
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
                  return (
                    <RenewalItem
                      key={subscription.id}
                      subscription={subscription}
                      onViewDetails={() => setLocation(`/subscription/${subscription.id}`)}
                    />
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
