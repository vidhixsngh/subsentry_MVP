import ReminderSetup from "@/components/ReminderSetup";
import { useLocation } from "wouter";

export default function Reminders() {
  const [, setLocation] = useLocation();

  const handleSave = (frequency: string, daysBefore: string) => {
    console.log("Reminder settings saved:", { frequency, daysBefore });
    // TODO: Save to backend API
    setLocation('/reminder-confirmed');
  };

  return (
    <div className="min-h-screen bg-background">
      <ReminderSetup 
        onBack={() => setLocation('/')}
        onSave={handleSave}
      />
    </div>
  );
}
