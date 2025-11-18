import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, LayoutDashboard, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";

interface AppHeaderProps {
  userName?: string;
  onSettingsClick?: () => void;
}

export default function AppHeader({ userName = "Aarav Kapoor", onSettingsClick }: AppHeaderProps) {
  const [location, setLocation] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">S</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Subsentry</h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              onClick={() => setLocation('/')}
              className="gap-2"
              data-testid="nav-dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
            <Button
              variant={isActive('/analytics') ? 'default' : 'ghost'}
              onClick={() => setLocation('/analytics')}
              className="gap-2"
              data-testid="nav-analytics"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Button>
          </nav>
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
