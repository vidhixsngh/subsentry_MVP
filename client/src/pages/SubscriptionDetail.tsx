import { useLocation, useRoute } from "wouter";
import SubscriptionDetailView from "@/components/SubscriptionDetailView";
import { getSubscriptionById, updateSubscription, deleteSubscription } from "@/lib/mockData";

export default function SubscriptionDetail() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/subscription/:id");

  // TODO: Replace with API call - using mock data for now
  const subscription = params?.id ? getSubscriptionById(params.id) : null;

  const handleEdit = (data: any) => {
    if (!params?.id) return;

    // TODO: Replace with API call - using mock data for now
    const updated = updateSubscription(params.id, data);
    if (updated) {
      // Force a re-render by navigating
      window.location.reload();
    } else {
      alert("Failed to update subscription. Please try again.");
    }
  };

  const handleDelete = () => {
    if (!params?.id) return;

    // TODO: Replace with API call - using mock data for now
    const deleted = deleteSubscription(params.id);
    if (deleted) {
      setLocation("/");
    } else {
      alert("Failed to delete subscription. Please try again.");
    }
  };

  const handleBack = () => {
    setLocation("/");
  };

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

  return (
    <SubscriptionDetailView
      subscription={subscription}
      onBack={handleBack}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
