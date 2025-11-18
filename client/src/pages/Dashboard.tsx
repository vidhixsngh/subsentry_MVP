import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardOverview from "@/components/DashboardOverview";
import SubscriptionList from "@/components/SubscriptionList";
import AppHeader from "@/components/AppHeader";
import { Plus, Calendar, BarChart3, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useSubscriptions } from "@/hooks/useSubscriptions";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { subscriptions, isLoading } = useSubscriptions();

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
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onSettingsClick={() => setLocation('/settings')} />

      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="text-muted-foreground mt-1">Track your subscriptions and manage expenses</p>
          </div>
          <Button
            onClick={() => setLocation('/add-subscription')}
            className="gap-2"
            data-testid="button-add-subscription"
          >
            <Plus className="w-4 h-4" />
            Add Subscription
          </Button>
        </div>

        <DashboardOverview stats={stats} />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Subscriptions</CardTitle>
                <CardDescription>All your tracked subscriptions in one place</CardDescription>
              </CardHeader>
              <CardContent>
                <SubscriptionList
                  subscriptions={subscriptions}
                  onSubscriptionClick={(sub) => setLocation(`/subscription/${sub.id}`)}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <CardTitle>Upcoming Renewals</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingRenewals.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="flex items-center justify-between p-3 rounded-md hover-elevate cursor-pointer"
                    onClick={() => setLocation(`/subscription/${subscription.id}`)}
                    data-testid={`renewal-${subscription.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{subscription.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(subscription.renewalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <span className="font-semibold text-sm">₹{parseFloat(subscription.amount).toFixed(2)}</span>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setLocation('/reminders')}
                  data-testid="button-setup-reminders"
                >
                  Setup Reminders
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground hover-elevate cursor-pointer transition-all" onClick={() => setLocation('/analytics')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary-foreground/10">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold">View Analytics</p>
                </div>
                <p className="text-sm opacity-90 mb-4">
                  Get detailed insights into your spending patterns, top subscriptions, and money-saving suggestions.
                </p>
                <Button
                  variant="secondary"
                  className="w-full gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation('/analytics');
                  }}
                  data-testid="button-view-analytics"
                >
                  <TrendingUp className="w-4 h-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
