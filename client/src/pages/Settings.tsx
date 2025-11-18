import SettingsPage from "@/components/SettingsPage";
import { useLocation } from "wouter";

export default function Settings() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <SettingsPage onBack={() => setLocation('/')} />
    </div>
  );
}
