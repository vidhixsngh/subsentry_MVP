import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardOverview from "@/components/DashboardOverview";
import SubscriptionList, { Subscription } from "@/components/SubscriptionList";
import AppHeader from "@/components/AppHeader";
import { Plus, Calendar } from "lucide-react";
import { useLocation } from "wouter";

// TODO: Remove mock data - this will be fetched from API
const mockSubscriptions: Subscription[] = [
  { 
    id: '1',
    name: 'Netflix', 
    amount: 12.99, 
    renewalDate: '2024-07-10', 
    category: 'Streaming', 
    status: 'Pending' 
  },
  { 
    id: '2',
    name: 'Dropbox', 
    amount: 9.99, 
    renewalDate: '2024-07-03', 
    category: 'Productivity', 
    status: 'Paid' 
  },
  { 
    id: '3',
    name: 'Electricity', 
    amount: 60.00, 
    renewalDate: '2024-07-15', 
    category: 'Utilities', 
    status: 'Overdue' 
  },
  { 
    id: '4',
    name: 'Spotify', 
    amount: 9.99, 
    renewalDate: '2024-07-08', 
    category: 'Streaming', 
    status: 'Pending' 
  },
  { 
    id: '5',
    name: 'Adobe Creative Cloud', 
    amount: 54.99, 
    renewalDate: '2024-07-20', 
    category: 'Productivity', 
    status: 'Pending' 
  },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();

  // TODO: Remove mock stats calculation - this will come from API
  const stats = {
    pending: mockSubscriptions.filter(s => s.status === 'Pending').length,
    paid: mockSubscriptions.filter(s => s.status === 'Paid').length,
    overdue: mockSubscriptions.filter(s => s.status === 'Overdue').length,
    totalMonthly: mockSubscriptions.reduce((sum, s) => sum + s.amount, 0),
  };

  const upcomingRenewals = [...mockSubscriptions]
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
                  subscriptions={mockSubscriptions}
                  onSubscriptionClick={(sub) => console.log('Subscription clicked:', sub)}
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
                    data-testid={`renewal-${subscription.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{subscription.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(subscription.renewalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <span className="font-semibold text-sm">${subscription.amount.toFixed(2)}</span>
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

            <Card className="bg-accent text-accent-foreground">
              <CardContent className="pt-6">
                <p className="text-sm font-medium mb-2">💡 Helpful Tip</p>
                <p className="text-sm opacity-90">
                  Set up reminders to get notified before your subscriptions renew. Never miss a payment again!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
