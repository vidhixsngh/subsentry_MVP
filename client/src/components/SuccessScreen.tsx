import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface SuccessScreenProps {
  title: string;
  message: string;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export default function SuccessScreen({ 
  title, 
  message, 
  primaryAction, 
  secondaryAction 
}: SuccessScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center py-12 px-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          
          <h2 className="text-2xl font-semibold mb-2" data-testid="text-success-title">
            {title}
          </h2>
          
          <p className="text-muted-foreground mb-8" data-testid="text-success-message">
            {message}
          </p>

          <div className="flex flex-col w-full gap-3">
            <Button 
              onClick={primaryAction.onClick}
              size="lg"
              className="w-full"
              data-testid="button-primary-action"
            >
              {primaryAction.label}
            </Button>
            
            {secondaryAction && (
              <Button 
                onClick={secondaryAction.onClick}
                variant="outline"
                size="lg"
                className="w-full"
                data-testid="button-secondary-action"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
