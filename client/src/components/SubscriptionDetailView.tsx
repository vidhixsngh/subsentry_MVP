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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Edit2, Trash2, Calendar, CreditCard, Tag, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type { Subscription } from "@shared/schema";

const subscriptionSchema = z.object({
  name: z.string().min(1, "Please enter a subscription name."),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number"),
  renewalDate: z.string().min(1, "Pick a valid date."),
  billingCycle: z.enum(["Monthly", "Quarterly", "Yearly", "Weekly"], {
    errorMap: () => ({ message: "Please choose a billing cycle." })
  }),
  category: z.enum(["Streaming", "Utilities", "Productivity", "Entertainment", "SaaS", "Other"], {
    errorMap: () => ({ message: "Please choose a category." })
  }),
  status: z.enum(["Pending", "Paid", "Overdue"]).optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().max(250, "Note must be 250 characters or less.").optional(),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionDetailViewProps {
  subscription: Subscription;
  onBack?: () => void;
  onEdit: (data: SubscriptionFormData) => void;
  onDelete: () => void;
}

export default function SubscriptionDetailView({
  subscription,
  onBack,
  onEdit,
  onDelete
}: SubscriptionDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: subscription.name,
      amount: subscription.amount,
      renewalDate: subscription.renewalDate,
      billingCycle: subscription.billingCycle as "Monthly" | "Quarterly" | "Yearly" | "Weekly",
      category: subscription.category as "Streaming" | "Utilities" | "Productivity" | "Entertainment" | "SaaS" | "Other",
      status: subscription.status as "Pending" | "Paid" | "Overdue",
      paymentMethod: subscription.paymentMethod || "",
      notes: subscription.notes || "",
    },
  });

  const handleSubmit = async (data: SubscriptionFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onEdit(data);
    setIsSubmitting(false);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  // Calculate days until renewal
  const getDaysUntilRenewal = () => {
    const today = new Date();
    const renewal = new Date(subscription.renewalDate);
    const diffTime = renewal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilRenewal = getDaysUntilRenewal();

  // Determine alert type
  const getAlertInfo = () => {
    if (subscription.status === "Overdue") {
      return {
        show: true,
        variant: "destructive" as const,
        icon: AlertCircle,
        title: "Payment Overdue",
        description: `This subscription payment is overdue by ${Math.abs(daysUntilRenewal)} days.`,
      };
    }
    if (daysUntilRenewal <= 7 && daysUntilRenewal > 0) {
      return {
        show: true,
        variant: "default" as const,
        icon: Clock,
        title: "Renewal Due Soon",
        description: `This subscription will renew in ${daysUntilRenewal} day${daysUntilRenewal !== 1 ? 's' : ''}.`,
      };
    }
    if (subscription.status === "Paid") {
      return {
        show: true,
        variant: "default" as const,
        icon: CheckCircle2,
        title: "Payment Confirmed",
        description: "This subscription has been paid.",
      };
    }
    return { show: false };
  };

  const alertInfo = getAlertInfo();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "Overdue":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
        data-testid="button-back"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      {alertInfo.show && (
        <Alert variant={alertInfo.variant} className="mb-6">
          {alertInfo.icon && <alertInfo.icon className="h-4 w-4" />}
          <AlertTitle>{alertInfo.title}</AlertTitle>
          <AlertDescription>{alertInfo.description}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl flex items-center gap-3">
                {subscription.name}
                <Badge className={getStatusColor(subscription.status)}>
                  {subscription.status}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-2">
                {isEditing ? "Edit your subscription details" : "View and manage your subscription"}
              </CardDescription>
            </div>
            {!isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  data-testid="button-edit"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  data-testid="button-delete"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount *</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
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
                    name="billingCycle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Cycle *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-billing-cycle">
                              <SelectValue placeholder="Select billing cycle" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                            <SelectItem value="Yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <SelectItem value="Entertainment">Entertainment</SelectItem>
                            <SelectItem value="SaaS">SaaS</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Credit Card, PayPal"
                            {...field}
                            data-testid="input-payment-method"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional details..."
                          className="resize-none"
                          rows={3}
                          {...field}
                          data-testid="input-notes"
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
                    onClick={() => setIsEditing(false)}
                    data-testid="button-cancel-edit"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid="button-save"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Amount
                  </p>
                  <p className="text-2xl font-semibold" data-testid="text-amount">
                    ₹{parseFloat(subscription.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">{subscription.billingCycle}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Next Renewal
                  </p>
                  <p className="text-lg font-medium" data-testid="text-renewal-date">
                    {subscription.renewalDate && !isNaN(new Date(subscription.renewalDate).getTime())
                      ? new Date(subscription.renewalDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Not set'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {daysUntilRenewal > 0
                      ? `In ${daysUntilRenewal} day${daysUntilRenewal !== 1 ? 's' : ''}`
                      : daysUntilRenewal === 0
                      ? "Today"
                      : `${Math.abs(daysUntilRenewal)} day${Math.abs(daysUntilRenewal) !== 1 ? 's' : ''} ago`
                    }
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Category
                  </p>
                  <p className="text-lg font-medium" data-testid="text-category">
                    {subscription.category}
                  </p>
                </div>

                {subscription.paymentMethod && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Payment Method
                    </p>
                    <p className="text-lg font-medium" data-testid="text-payment-method">
                      {subscription.paymentMethod}
                    </p>
                  </div>
                )}
              </div>

              {subscription.notes && (
                <div className="space-y-2 pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="text-sm" data-testid="text-notes">
                    {subscription.notes}
                  </p>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t text-xs text-muted-foreground">
                <p>Created: {subscription.createdAt ? new Date(subscription.createdAt).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                }) : 'N/A'}</p>
                <p>Last updated: {subscription.updatedAt ? new Date(subscription.updatedAt).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                }) : 'N/A'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{subscription.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
