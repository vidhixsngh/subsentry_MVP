import { useLocation, useRoute } from "wouter";
import SubscriptionDetailView from "@/components/SubscriptionDetailView";
import { useSubscription, useSubscriptions } from "@/hooks/useSubscriptions";
import { useToast } from "@/hooks/use-toast";

export default function SubscriptionDetail() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/subscription/:id");
  const { toast } = useToast();
  
  const { data: subscription, isLoading } = useSubscription(params?.id || '');
  const { updateSubscription, deleteSubscription: deleteSubscriptionMutation } = useSubscriptions();

  const handleEdit = async (data: any) => {
    if (!params?.id) return;

    try {
      await updateSubscription({ id: params.id, updates: data });
      toast({
        title: "Subscription updated",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error updating subscription",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!params?.id) return;

    try {
      await deleteSubscriptionMutation(params.id);
      toast({
        title: "Subscription deleted",
        description: "The subscription has been removed.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error deleting subscription",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setLocation("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading subscription...</div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Subscription Not Found</h2>
          <p className="text-muted-foreground mb-4">The subscription you're looking for doesn't exist.</p>
          <button
            onClick={handleBack}
            className="text-primary hover:underline"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  // Transform Supabase data to match component expectations
  const transformedSubscription = subscription ? {
    ...subscription,
    userId: subscription.user_id,
    renewalDate: subscription.renewal_date,
    billingCycle: subscription.billing_cycle,
    paymentMethod: subscription.payment_method,
    lastUsedDate: subscription.last_used_date,
    createdAt: subscription.created_at,
    updatedAt: subscription.updated_at,
  } : null;

  return (
    <SubscriptionDetailView
      subscription={transformedSubscription as any}
      onBack={handleBack}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
