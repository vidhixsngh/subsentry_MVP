import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

const subscriptionSchema = z.object({
  name: z.string().min(1, "Please enter a subscription name."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  renewalDate: z.string().min(1, "Pick a valid, future date."),
  category: z.enum(["Streaming", "Utilities", "Productivity", "Other"], {
    errorMap: () => ({ message: "Please choose a category." })
  }),
  note: z.string().max(120, "Note must be 120 characters or less.").optional(),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface AddSubscriptionFormProps {
  onBack?: () => void;
  onSubmit: (data: SubscriptionFormData) => void;
}

export default function AddSubscriptionForm({ onBack, onSubmit }: AddSubscriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      amount: 0,
      renewalDate: "",
      category: undefined,
      note: "",
    },
  });

  const handleSubmit = async (data: SubscriptionFormData) => {
    setIsSubmitting(true);
    console.log("Subscription data:", data);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSubmit(data);
    setIsSubmitting(false);
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
          <CardTitle className="text-2xl">Add Subscription</CardTitle>
          <CardDescription>Track a new subscription to stay on top of your expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Netflix, Spotify" 
                        {...field}
                        data-testid="input-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        min="0"
                        placeholder="0.00" 
                        {...field}
                        data-testid="input-amount"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="renewalDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Renewal Date *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        data-testid="input-renewal-date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Streaming">Streaming</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Productivity">Productivity</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any additional details..."
                        className="resize-none"
                        rows={3}
                        {...field}
                        data-testid="input-note"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onBack}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  data-testid="button-submit"
                >
                  {isSubmitting ? "Adding..." : "Add Subscription"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
