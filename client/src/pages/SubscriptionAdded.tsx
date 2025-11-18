import SuccessScreen from "@/components/SuccessScreen";
import { useLocation } from "wouter";

export default function SubscriptionAdded() {
  const [, setLocation] = useLocation();

  return (
    <SuccessScreen 
      title="You're all caught up — great job!"
      message="Your subscription has been added successfully. Keep tracking your expenses effortlessly."
      primaryAction={{
        label: "Return to Dashboard",
        onClick: () => setLocation('/')
      }}
      secondaryAction={{
        label: "Add Another",
        onClick: () => setLocation('/add-subscription')
      }}
    />
  );
}
