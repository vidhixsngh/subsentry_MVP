import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-foreground">S</span>
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-semibold">Welcome to Subsentry</CardTitle>
            <CardDescription className="text-base mt-2">
              Track your subscriptions with ease and never miss a payment
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            data-testid="button-google-login"
          >
            <Mail className="w-5 h-5" />
            {isLoading ? "Signing in..." : "Continue with Google"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Stay on top of your subscriptions and manage your expenses effortlessly
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
