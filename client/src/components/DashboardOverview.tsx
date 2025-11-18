import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";

interface OverviewStats {
  pending: number;
  paid: number;
  overdue: number;
  totalMonthly: number;
}

interface DashboardOverviewProps {
  stats: OverviewStats;
}

export default function DashboardOverview({ stats }: DashboardOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          <Clock className="w-4 h-4 text-status-pending" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold" data-testid="text-pending-count">{stats.pending}</div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
          <CheckCircle2 className="w-4 h-4 text-status-paid" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold" data-testid="text-paid-count">{stats.paid}</div>
          <p className="text-xs text-muted-foreground mt-1">All caught up!</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          <AlertCircle className="w-4 h-4 text-status-overdue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold text-status-overdue" data-testid="text-overdue-count">{stats.overdue}</div>
          <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
        </CardContent>
      </Card>

      <Card className="bg-primary text-primary-foreground">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
          <TrendingUp className="w-4 h-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold" data-testid="text-monthly-total">₹{stats.totalMonthly.toFixed(2)}</div>
          <p className="text-xs opacity-90 mt-1">Expected this month</p>
        </CardContent>
      </Card>
    </div>
  );
}
