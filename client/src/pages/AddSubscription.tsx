import AddSubscriptionForm from "@/components/AddSubscriptionForm";
import { useLocation } from "wouter";
import type { InsertSubscription } from "@shared/schema";
import { addSubscription } from "@/lib/mockData";

export default function AddSubscription() {
  const [, setLocation] = useLocation();

  const handleSubmit = (data: InsertSubscription) => {
    // TODO: Replace with API call - using mock data for now
    const newSubscription = addSubscription(data);
    console.log("Subscription created:", newSubscription);
    setLocation('/subscription-added');
  };

  return (
    <div className="min-h-screen bg-background">
      <AddSubscriptionForm
        onBack={() => setLocation('/')}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
