import AddSubscriptionForm from "@/components/AddSubscriptionForm";
import { useLocation } from "wouter";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useToast } from "@/hooks/use-toast";

export default function AddSubscription() {
  const [, setLocation] = useLocation();
  const { createSubscription, isCreating } = useSubscriptions();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      await createSubscription(data);
      toast({
        title: "Success! 🎉",
        description: `${data.name} has been added to your subscriptions.`,
      });
      setLocation('/subscription-added');
    } catch (error) {
      toast({
        title: "Error adding subscription",
        description: "Please try again.",
        variant: "destructive",
      });
    }
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
