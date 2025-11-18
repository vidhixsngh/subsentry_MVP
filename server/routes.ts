import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { insertSubscriptionSchema, updateSubscriptionSchema } from "@shared/schema";
import {
  mockSubscriptions,
  getSubscriptionById,
  getSubscriptionsByUserId,
  addSubscription,
  updateSubscription as updateMockSubscription,
  deleteSubscription as deleteMockSubscription,
} from "./mockData";

// Temporary auth middleware - replace with proper auth later
// For MVP, we'll use a mock user ID
const getMockUserId = (req: Request): string => {
  // In production, this would get the userId from the session/JWT
  return "mock-user-id";
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all subscriptions for the current user
  app.get("/api/subscriptions", async (req: Request, res: Response) => {
    try {
      const userId = getMockUserId(req);
      const subscriptions = getSubscriptionsByUserId(userId);
      res.json(subscriptions);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch subscriptions" });
    }
  });

  // Get analytics data (must be before /:id route)
  app.get("/api/analytics", async (req: Request, res: Response) => {
    try {
      const userId = getMockUserId(req);
      const subscriptions = getSubscriptionsByUserId(userId);

      // Calculate analytics
      const totalMonthly = subscriptions.reduce((sum, sub) => {
        const amount = parseFloat(sub.amount);
        // Convert to monthly equivalent
        switch (sub.billingCycle) {
          case "Weekly":
            return sum + (amount * 4);
          case "Monthly":
            return sum + amount;
          case "Quarterly":
            return sum + (amount / 3);
          case "Yearly":
            return sum + (amount / 12);
          default:
            return sum + amount;
        }
      }, 0);

      // Category breakdown
      const categoryBreakdown = subscriptions.reduce((acc, sub) => {
        const amount = parseFloat(sub.amount);
        let monthlyAmount = amount;

        // Convert to monthly
        switch (sub.billingCycle) {
          case "Weekly":
            monthlyAmount = amount * 4;
            break;
          case "Quarterly":
            monthlyAmount = amount / 3;
            break;
          case "Yearly":
            monthlyAmount = amount / 12;
            break;
        }

        acc[sub.category] = (acc[sub.category] || 0) + monthlyAmount;
        return acc;
      }, {} as Record<string, number>);

      // Top 3 highest cost (monthly equivalent)
      const top3 = [...subscriptions]
        .map(sub => {
          const amount = parseFloat(sub.amount);
          let monthlyAmount = amount;

          switch (sub.billingCycle) {
            case "Weekly":
              monthlyAmount = amount * 4;
              break;
            case "Quarterly":
              monthlyAmount = amount / 3;
              break;
            case "Yearly":
              monthlyAmount = amount / 12;
              break;
          }

          return { ...sub, monthlyAmount };
        })
        .sort((a, b) => b.monthlyAmount - a.monthlyAmount)
        .slice(0, 3);

      // Least used app (based on billing frequency - yearly = least essential)
      const frequencyScore = { "Yearly": 1, "Quarterly": 2, "Monthly": 3, "Weekly": 4 };
      const leastUsed = [...subscriptions]
        .map(sub => ({
          ...sub,
          score: frequencyScore[sub.billingCycle as keyof typeof frequencyScore] || 0,
        }))
        .sort((a, b) => a.score - b.score)[0];

      // Status breakdown
      const statusBreakdown = subscriptions.reduce((acc, sub) => {
        acc[sub.status] = (acc[sub.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      res.json({
        totalMonthly: totalMonthly.toFixed(2),
        totalSubscriptions: subscriptions.length,
        categoryBreakdown,
        top3,
        leastUsed: leastUsed || null,
        statusBreakdown,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch analytics" });
    }
  });

  // Get a specific subscription by ID
  app.get("/api/subscriptions/:id", async (req: Request, res: Response) => {
    try {
      const userId = getMockUserId(req);
      const { id } = req.params;
      const subscription = getSubscriptionById(id);

      if (!subscription || subscription.userId !== userId) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      res.json(subscription);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch subscription" });
    }
  });

  // Create a new subscription
  app.post("/api/subscriptions", async (req: Request, res: Response) => {
    try {
      const userId = getMockUserId(req);
      const validatedData = insertSubscriptionSchema.parse(req.body);
      const subscription = addSubscription({
        ...validatedData,
        userId,
        status: validatedData.status || "Pending",
        paymentMethod: validatedData.paymentMethod || null,
        notes: validatedData.notes || null,
        lastUsedDate: validatedData.lastUsedDate || null,
      });
      res.status(201).json(subscription);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      }
      res.status(500).json({ message: error.message || "Failed to create subscription" });
    }
  });

  // Update a subscription
  app.patch("/api/subscriptions/:id", async (req: Request, res: Response) => {
    try {
      const userId = getMockUserId(req);
      const { id } = req.params;
      const validatedData = updateSubscriptionSchema.parse(req.body);

      // Check if subscription exists and belongs to user
      const existingSub = getSubscriptionById(id);
      if (!existingSub || existingSub.userId !== userId) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      const subscription = updateMockSubscription(id, validatedData);

      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      res.json(subscription);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      }
      res.status(500).json({ message: error.message || "Failed to update subscription" });
    }
  });

  // Delete a subscription
  app.delete("/api/subscriptions/:id", async (req: Request, res: Response) => {
    try {
      const userId = getMockUserId(req);
      const { id } = req.params;

      // Check if subscription exists and belongs to user
      const existingSub = getSubscriptionById(id);
      if (!existingSub || existingSub.userId !== userId) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      const deleted = deleteMockSubscription(id);

      if (!deleted) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      res.status(200).json({ message: "Subscription deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete subscription" });
    }
  });

  // ============================================
  // REMINDER SETTINGS ROUTES
  // ============================================

  // Get user's reminder settings
  app.get("/api/reminder-settings", async (req: Request, res: Response) => {
    try {
      const userId = getMockUserId(req);
      
      // Mock data for now - replace with actual DB query
      const mockSettings = {
        id: "mock-settings-id",
        userId,
        email: "user@example.com",
        frequency: "weekly",
        daysBefore: "3",
        notificationsEnabled: "true",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      res.json(mockSettings);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch reminder settings" });
    }
  });

  // Create or update reminder settings
  app.post("/api/reminder-settings", async (req: Request, res: Response) => {
    try {
      const userId = getMockUserId(req);
      const { frequency, daysBefore, email, notificationsEnabled } = req.body;

      // Validate input
      if (!frequency || !daysBefore) {
        return res.status(400).json({ message: "Frequency and daysBefore are required" });
      }

      if (!["daily", "weekly"].includes(frequency)) {
        return res.status(400).json({ message: "Frequency must be 'daily' or 'weekly'" });
      }

      // Mock response - replace with actual DB upsert
      const settings = {
        id: "mock-settings-id",
        userId,
        email: email || "user@example.com",
        frequency,
        daysBefore,
        notificationsEnabled: notificationsEnabled !== undefined ? String(notificationsEnabled) : "true",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      res.status(201).json(settings);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to save reminder settings" });
    }
  });

  // Update notification toggle
  app.patch("/api/reminder-settings/toggle", async (req: Request, res: Response) => {
    try {
      const userId = getMockUserId(req);
      const { notificationsEnabled } = req.body;

      if (notificationsEnabled === undefined) {
        return res.status(400).json({ message: "notificationsEnabled is required" });
      }

      // Mock response - replace with actual DB update
      const settings = {
        id: "mock-settings-id",
        userId,
        email: "user@example.com",
        frequency: "weekly",
        daysBefore: "3",
        notificationsEnabled: String(notificationsEnabled),
        updatedAt: new Date().toISOString(),
      };

      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update notification settings" });
    }
  });

  // Get reminder logs (history)
  app.get("/api/reminder-logs", async (req: Request, res: Response) => {
    try {
      const userId = getMockUserId(req);
      const limit = parseInt(req.query.limit as string) || 50;

      // Mock data - replace with actual DB query
      const mockLogs = [
        {
          id: "log-1",
          userId,
          subscriptionId: "sub-1",
          emailSentTo: "user@example.com",
          sentAt: new Date().toISOString(),
          status: "sent",
          errorMessage: null,
        },
      ];

      res.json(mockLogs);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch reminder logs" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
