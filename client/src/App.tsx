import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AddSubscription from "@/pages/AddSubscription";
import SubscriptionAdded from "@/pages/SubscriptionAdded";
import SubscriptionDetail from "@/pages/SubscriptionDetail";
import Analytics from "@/pages/Analytics";
import Reminders from "@/pages/Reminders";
import ReminderConfirmed from "@/pages/ReminderConfirmed";
import Settings from "@/pages/Settings";
import { useEffect } from "react";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <Component />;
}

function Router() {
  const { user, loading } = useAuth();
  const [location] = useLocation();

  // Redirect authenticated users away from login page
  useEffect(() => {
    if (!loading && user && location === "/login") {
      window.location.href = "/";
    }
  }, [user, loading, location]);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/add-subscription">
        <ProtectedRoute component={AddSubscription} />
      </Route>
      <Route path="/subscription-added">
        <ProtectedRoute component={SubscriptionAdded} />
      </Route>
      <Route path="/subscription/:id">
        <ProtectedRoute component={SubscriptionDetail} />
      </Route>
      <Route path="/analytics">
        <ProtectedRoute component={Analytics} />
      </Route>
      <Route path="/reminders">
        <ProtectedRoute component={Reminders} />
      </Route>
      <Route path="/reminder-confirmed">
        <ProtectedRoute component={ReminderConfirmed} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
