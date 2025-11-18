import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { ArrowLeft } from "lucide-react";
import { calculateAnalytics } from "@/lib/mockData";

export default function Analytics() {
  const [, setLocation] = useLocation();

  // TODO: Replace with API call - using mock data for now
  const analytics = calculateAnalytics();

  return (
    <div className="min-h-screen bg-background">
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
            <h2 className="text-3xl font-semibold">Analytics</h2>
            <p className="text-muted-foreground mt-1">
              Insights into your subscription spending
            </p>
          </div>
        </div>

        <AnalyticsDashboard analytics={analytics} />
      </main>
    </div>
  );
}
