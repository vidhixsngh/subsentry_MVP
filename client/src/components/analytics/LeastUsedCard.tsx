import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calendar } from 'lucide-react';
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
            <AlertCircle className="w-5 h-5 text-gray-400" />
            <CardTitle>Least Used Subscription</CardTitle>
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
  const annualSavings = monthlyAmount * 12;

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <CardTitle className="text-amber-900">Least Used Subscription</CardTitle>
        </div>
        <CardDescription>Consider reviewing this subscription</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-white rounded-lg border border-amber-200">
          <h4 className="font-semibold text-lg text-gray-900 mb-2">{subscription.name}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Calendar className="w-4 h-4" />
            <span>Last used: {lastUsedText}</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-600">Current cost:</span>
            <span className="text-lg font-bold text-gray-900">
              ₹{monthlyAmount.toFixed(2)}/{subscription.billingCycle}
            </span>
          </div>
        </div>

        <div className="p-4 bg-amber-100 rounded-lg">
          <p className="text-sm font-medium text-amber-900 mb-2">💡 Suggestion</p>
          <p className="text-sm text-amber-800">
            If you're not using this regularly, canceling could save you{' '}
            <span className="font-semibold">₹{annualSavings.toFixed(2)}/year</span>.
            Consider if this subscription still adds value to your life.
          </p>
        </div>

        <div className="flex gap-2 text-xs text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded">Review usage</span>
          <span className="px-2 py-1 bg-gray-100 rounded">Consider alternatives</span>
        </div>
      </CardContent>
    </Card>
  );
}
