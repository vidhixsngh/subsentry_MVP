import ReminderSetup from "@/components/ReminderSetup";
import { useLocation } from "wouter";
import { useReminderSettings } from "@/hooks/useReminderSettings";
import { useToast } from "@/hooks/use-toast";

export default function Reminders() {
  const [, setLocation] = useLocation();
  const { saveSettings, isSaving } = useReminderSettings();
  const { toast } = useToast();

  const handleSave = async (frequency: string, daysBefore: string) => {
    try {
      await saveSettings({
        frequency: frequency as 'daily' | 'weekly',
        days_before: parseInt(daysBefore),
        notifications_enabled: true,
      });
      
      toast({
        title: "Reminder settings saved",
        description: "You'll receive email reminders based on your preferences.",
      });
      
      setLocation('/reminder-confirmed');
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again.",
        variant: "destructive",
      });
    }
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
