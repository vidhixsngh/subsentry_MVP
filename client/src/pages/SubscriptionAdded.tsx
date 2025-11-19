import SuccessScreen from "@/components/SuccessScreen";
import { useLocation } from "wouter";

export default function SubscriptionAdded() {
  const [, setLocation] = useLocation();

  return (
    <SuccessScreen 
      title="Awesome! You're in control! 🎯"
      message="Your subscription is now being tracked. Stay on top of your spending and never miss a renewal again!"
      primaryAction={{
        label: "View Dashboard",
        onClick: () => setLocation('/')
      }}
      secondaryAction={{
        label: "Add Another Subscription",
        onClick: () => setLocation('/add-subscription')
      }}
    />
  );
}
