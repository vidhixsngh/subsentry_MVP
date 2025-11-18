import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Bell } from "lucide-react";

interface ReminderSetupProps {
  onBack?: () => void;
  onSave: (frequency: string, daysBefore: string) => void;
}

export default function ReminderSetup({ onBack, onSave }: ReminderSetupProps) {
  const [frequency, setFrequency] = useState("weekly");
  const [daysBefore, setDaysBefore] = useState("3");

  const handleSave = () => {
    console.log("Reminder settings:", { frequency, daysBefore });
    onSave(frequency, daysBefore);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4"
        data-testid="button-back"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Reminder Setup</CardTitle>
              <CardDescription>Configure when you'd like to be reminded about upcoming renewals</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Reminder Frequency</Label>
            <RadioGroup value={frequency} onValueChange={setFrequency}>
              <div className="flex items-center space-x-3 p-3 rounded-md hover-elevate cursor-pointer">
                <RadioGroupItem value="daily" id="daily" data-testid="radio-daily" />
                <Label htmlFor="daily" className="cursor-pointer flex-1">
                  <div className="font-medium">Daily</div>
                  <div className="text-sm text-muted-foreground">Get reminders every day</div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-md hover-elevate cursor-pointer">
                <RadioGroupItem value="weekly" id="weekly" data-testid="radio-weekly" />
                <Label htmlFor="weekly" className="cursor-pointer flex-1">
                  <div className="font-medium">Weekly</div>
                  <div className="text-sm text-muted-foreground">Get reminders once a week</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="daysBefore" className="text-base font-medium">Remind me before</Label>
            <Select value={daysBefore} onValueChange={setDaysBefore}>
              <SelectTrigger id="daysBefore" data-testid="select-days-before">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day before</SelectItem>
                <SelectItem value="3">3 days before</SelectItem>
                <SelectItem value="7">7 days before</SelectItem>
                <SelectItem value="14">14 days before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm font-medium mb-1">Preview</p>
            <p className="text-sm text-muted-foreground">
              You'll receive {frequency} reminders {daysBefore} {daysBefore === "1" ? "day" : "days"} before each renewal
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              data-testid="button-save"
            >
              Save Reminder Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
