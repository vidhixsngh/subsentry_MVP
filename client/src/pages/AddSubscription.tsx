import AddSubscriptionForm from "@/components/AddSubscriptionForm";
import { useLocation } from "wouter";

export default function AddSubscription() {
  const [, setLocation] = useLocation();

  const handleSubmit = (data: any) => {
    console.log("New subscription:", data);
    // TODO: Send data to backend API
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
