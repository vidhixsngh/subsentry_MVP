import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle2, Crown } from "lucide-react";

interface AnalyticsData {
  totalMonthly: string;
  totalSubscriptions: number;
  categoryBreakdown: Record<string, number>;
  top3: Array<{
    id: string;
    name: string;
    amount: string;
    category: string;
    billingCycle: string;
    monthlyAmount: number;
  }>;
  leastUsed: {
    id: string;
    name: string;
    amount: string;
    category: string;
    billingCycle: string;
    score: number;
  } | null;
  statusBreakdown: Record<string, number>;
}

interface AnalyticsDashboardProps {
  analytics: AnalyticsData;
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

const categoryColors: Record<string, string> = {
  Streaming: '#3b82f6',
  Utilities: '#f59e0b',
  Productivity: '#8b5cf6',
  Entertainment: '#ec4899',
  SaaS: '#14b8a6',
  Other: '#6b7280',
};

export default function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  // Prepare category data for charts
  const categoryData = Object.entries(analytics.categoryBreakdown).map(([category, amount]) => ({
    name: category,
    value: parseFloat(amount.toFixed(2)),
    amount: amount,
  }));

  // Prepare bar chart data
  const barChartData = categoryData.map(item => ({
    category: item.name,
    spending: item.value,
  }));

  // Get suggestion for least used app
  const getLeastUsedSuggestion = () => {
    if (!analytics.leastUsed) return null;

    const { name, billingCycle } = analytics.leastUsed;
    const frequencyMapping: Record<string, string> = {
      "Yearly": "You're billed once a year",
      "Quarterly": "You're billed every 3 months",
      "Monthly": "You're billed monthly",
      "Weekly": "You're billed weekly",
    };

    return {
      name,
      frequency: frequencyMapping[billingCycle] || billingCycle,
      suggestion: billingCycle === "Yearly" || billingCycle === "Quarterly"
        ? "Consider if you're getting enough value from this less-frequent subscription."
        : "This subscription has a lower billing frequency. Review if it's still needed.",
    };
  };

  const leastUsedInfo = getLeastUsedSuggestion();

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{parseFloat(analytics.totalMonthly).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {analytics.totalSubscriptions} subscription{analytics.totalSubscriptions !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Subscriptions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.statusBreakdown.Paid || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Up to date with payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analytics.statusBreakdown.Pending || 0) + (analytics.statusBreakdown.Overdue || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.statusBreakdown.Overdue || 0} overdue, {analytics.statusBreakdown.Pending || 0} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Alert */}
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertTitle>Monthly Spending Summary</AlertTitle>
        <AlertDescription>
          This month you spent ₹{parseFloat(analytics.totalMonthly).toFixed(2)} across {analytics.totalSubscriptions} subscription{analytics.totalSubscriptions !== 1 ? 's' : ''}.
          {categoryData.length > 0 && (
            <> Your largest category is <strong>{categoryData[0].name}</strong> at ₹{categoryData[0].value.toFixed(2)}/month.</>
          )}
        </AlertDescription>
      </Alert>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Monthly Spend Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spend by Category</CardTitle>
            <CardDescription>Compare your spending across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Spending']}
                  contentStyle={{ borderRadius: '8px' }}
                />
                <Bar dataKey="spending" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Breakdown of spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `₹${value.toFixed(2)}`}
                  contentStyle={{ borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColors[item.name] || COLORS[index % COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 Highest Cost Subscriptions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <CardTitle>Top 3 Highest-Cost Subscriptions</CardTitle>
          </div>
          <CardDescription>Your most expensive subscriptions (monthly equivalent)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.top3.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No subscriptions to display
              </p>
            ) : (
              analytics.top3.map((sub, index) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover-elevate transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{sub.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {sub.category} • Billed {sub.billingCycle.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">₹{sub.monthlyAmount.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">/month</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Least Used App Suggestion */}
      {leastUsedInfo && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <CardTitle className="text-amber-900 dark:text-amber-100">
                Subscription to Review
              </CardTitle>
            </div>
            <CardDescription className="text-amber-700 dark:text-amber-300">
              Based on billing frequency analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-amber-900 dark:text-amber-100">
                    {leastUsedInfo.name}
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {leastUsedInfo.frequency}
                  </p>
                </div>
                <Badge variant="outline" className="bg-white dark:bg-amber-900">
                  {analytics.leastUsed?.billingCycle}
                </Badge>
              </div>
              <Alert className="bg-white dark:bg-amber-900 border-amber-300 dark:border-amber-700">
                <AlertDescription className="text-amber-900 dark:text-amber-100">
                  💡 <strong>Suggestion:</strong> {leastUsedInfo.suggestion}
                </AlertDescription>
              </Alert>
              <div className="flex gap-2 pt-2">
                <button className="text-sm font-medium text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors">
                  Continue subscription
                </button>
                <span className="text-amber-400">•</span>
                <button className="text-sm font-medium text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors">
                  Consider discontinuing
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
