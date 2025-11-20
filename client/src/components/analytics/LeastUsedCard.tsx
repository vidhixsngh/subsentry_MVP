import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Calendar, TrendingDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface LeastUsedSubscription {
  id: string;
  name: string;
  amount: string;
  billingCycle: string;
  lastUsedDate?: string | null;
}

interface LeastUsedCardProps {
  subscription: LeastUsedSubscription | null;
}

export default function LeastUsedCard({ subscription }: LeastUsedCardProps) {
  if (!subscription) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-gray-400" />
            <CardTitle>Usage Insights</CardTitle>
          </div>
          <CardDescription>No usage data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Add subscriptions to see usage insights
          </p>
        </CardContent>
      </Card>
    );
  }

  const lastUsedText = subscription.lastUsedDate
    ? formatDistanceToNow(new Date(subscription.lastUsedDate), { addSuffix: true })
    : 'Never tracked';

  const monthlyAmount = parseFloat(subscription.amount);
  const annualCost = monthlyAmount * 12;

  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/50 dark:via-gray-900 dark:to-blue-950/30 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-blue-900 dark:text-blue-100">Usage Insight</CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-400">Worth reviewing</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">{subscription.name}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span>Last used: <span className="font-medium">{lastUsedText}</span></span>
              </div>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <TrendingDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Current cost:</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              ₹{monthlyAmount.toFixed(2)}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/{subscription.billingCycle}</span>
            </span>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-800">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
            <span className="text-base">💡</span> Smart Tip
          </p>
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            This subscription costs <span className="font-semibold">₹{annualCost.toFixed(2)}/year</span>. 
            If you're not using it regularly, consider pausing or downgrading to a lower tier to optimize your spending.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
            Low activity
          </span>
          <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
            Review recommended
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
