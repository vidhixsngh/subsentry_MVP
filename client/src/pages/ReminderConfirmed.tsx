import SuccessScreen from "@/components/SuccessScreen";
import { useLocation } from "wouter";

export default function ReminderConfirmed() {
  const [, setLocation] = useLocation();

  return (
    <SuccessScreen 
      title="Reminders are all set!"
      message="You'll receive timely notifications before your subscriptions renew. Stay on top of your expenses with ease."
      primaryAction={{
        label: "Back to Dashboard",
        onClick: () => setLocation('/')
      }}
    />
  );
}
