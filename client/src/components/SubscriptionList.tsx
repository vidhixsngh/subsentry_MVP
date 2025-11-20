import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Zap, Briefcase, Grid3x3, Layers } from "lucide-react";
import { format } from "date-fns";
import type { Subscription } from "@shared/schema";

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onSubscriptionClick?: (subscription: Subscription) => void;
}

const categoryIcons: Record<string, any> = {
  Streaming: Play,
  Utilities: Zap,
  Productivity: Briefcase,
  Entertainment: Play,
  SaaS: Layers,
  Other: Grid3x3,
};

const statusColors = {
  Paid: "bg-status-paid text-white",
  Pending: "bg-status-pending text-white",
  Overdue: "bg-status-overdue text-white",
};

export default function SubscriptionList({ subscriptions, onSubscriptionClick }: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Grid3x3 className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No bills yet</h3>
          <p className="text-sm text-muted-foreground">Let's add your first one.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {subscriptions.map((subscription) => {
        const Icon = categoryIcons[subscription.category];
        return (
          <Card 
            key={subscription.id} 
            className="hover-elevate cursor-pointer transition-all"
            onClick={() => onSubscriptionClick?.(subscription)}
            data-testid={`card-subscription-${subscription.id}`}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-base" data-testid={`text-subscription-name-${subscription.id}`}>
                  {subscription.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(subscription.renewalDate), "MMM d, yyyy")} • {subscription.category}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Badge className={statusColors[subscription.status as keyof typeof statusColors]} data-testid={`badge-status-${subscription.id}`}>
                  {subscription.status}
                </Badge>
                <div className="text-right">
                  <div className="font-semibold text-base" data-testid={`text-amount-${subscription.id}`}>
                    ₹{parseFloat(subscription.amount).toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
