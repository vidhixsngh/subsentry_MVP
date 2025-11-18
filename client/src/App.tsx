import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Dashboard} />
      <Route path="/add-subscription" component={AddSubscription} />
      <Route path="/subscription-added" component={SubscriptionAdded} />
      <Route path="/subscription/:id" component={SubscriptionDetail} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/reminders" component={Reminders} />
      <Route path="/reminder-confirmed" component={ReminderConfirmed} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
