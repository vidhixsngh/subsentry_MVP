import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LayoutDashboard, BarChart3, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

interface AppHeaderProps {
  userName?: string;
  onSettingsClick?: () => void;
}

export default function AppHeader({ userName, onSettingsClick }: AppHeaderProps) {
  const [location, setLocation] = useLocation();
  const { user, signOut } = useAuth();
  
  // Get user info from Google OAuth
  const displayName = userName || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect to login page after successful logout
      setLocation("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path: string) => location === path;

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform hover:scale-110">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                SubSentry
              </h1>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar>
                  {userAvatar ? (
                    <AvatarImage src={userAvatar} alt={displayName} />
                  ) : null}
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{displayName}</p>
                {user?.email && (
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
