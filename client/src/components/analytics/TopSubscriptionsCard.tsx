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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <CardTitle>Highest Paid Subscriptions</CardTitle>
        </div>
        <CardDescription>Your top 3 subscriptions by monthly cost</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscriptions.map((sub, index) => (
          <div
            key={sub.id}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-white rounded-lg border border-emerald-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-full font-bold text-lg">
                {index + 1}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{sub.name}</h4>
                <p className="text-sm text-gray-600">{sub.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-emerald-600">
                ₹{sub.monthlyAmount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">per month</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
