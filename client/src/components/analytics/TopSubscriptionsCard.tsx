import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface Subscription {
  id: string;
  name: string;
  amount: string;
  monthlyAmount: number;
  category: string;
}

interface TopSubscriptionsCardProps {
  subscriptions: Subscription[];
}

export default function TopSubscriptionsCard({ subscriptions }: TopSubscriptionsCardProps) {
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <CardTitle>Top Subscriptions</CardTitle>
          </div>
          <CardDescription>Your highest-cost subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No subscriptions yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/50 dark:to-gray-900">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <CardTitle className="dark:text-gray-100">Highest Paid Subscriptions</CardTitle>
        </div>
        <CardDescription className="dark:text-gray-400">Your top 3 subscriptions by monthly cost</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscriptions.map((sub, index) => (
          <div
            key={sub.id}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-900/30 dark:to-gray-800/50 rounded-lg border border-emerald-100 dark:border-emerald-800 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full font-bold text-lg">
                {index + 1}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{sub.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{sub.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                ₹{sub.monthlyAmount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">per month</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
