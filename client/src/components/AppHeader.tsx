import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings } from "lucide-react";

interface AppHeaderProps {
  userName?: string;
  onSettingsClick?: () => void;
}

export default function AppHeader({ userName = "Aarav Kapoor", onSettingsClick }: AppHeaderProps) {
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">S</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Subsentry</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onSettingsClick}
            data-testid="button-settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Avatar>
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
