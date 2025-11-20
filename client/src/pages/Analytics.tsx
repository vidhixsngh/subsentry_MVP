import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { ArrowLeft } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function Analytics() {
  const [, setLocation] = useLocation();
  const { analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader onSettingsClick={() => setLocation('/settings')} />
        <main className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading analytics...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <AppHeader onSettingsClick={() => setLocation('/settings')} />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Analytics</h2>
            <p className="text-muted-foreground mt-1 dark:text-gray-400">
              Insights into your subscription spending
            </p>
          </div>
        </div>

        <AnalyticsDashboard analytics={analytics} />
      </main>
    </div>
  );
}
