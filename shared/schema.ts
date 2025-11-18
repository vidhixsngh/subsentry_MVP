import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  renewalDate: date("renewal_date").notNull(),
  billingCycle: varchar("billing_cycle", { length: 20 }).notNull(), // Monthly, Quarterly, Yearly, Weekly
  status: varchar("status", { length: 20 }).notNull().default("Pending"), // Pending, Paid, Overdue
  paymentMethod: text("payment_method"),
  notes: text("notes"),
  lastUsedDate: date("last_used_date"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions, {
  name: z.string().min(1, "Subscription name is required"),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number"),
  category: z.enum(["Streaming", "Utilities", "Productivity", "Entertainment", "SaaS", "Other"]),
  renewalDate: z.string().min(1, "Renewal date is required"),
  billingCycle: z.enum(["Monthly", "Quarterly", "Yearly", "Weekly"]),
  status: z.enum(["Pending", "Paid", "Overdue"]).optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
  lastUsedDate: z.string().optional(),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateSubscriptionSchema = insertSubscriptionSchema.partial();

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type UpdateSubscription = z.infer<typeof updateSubscriptionSchema>;

// User Reminder Settings Table
export const userReminderSettings = pgTable("user_reminder_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  email: varchar("email").notNull(),
  frequency: varchar("frequency", { length: 20 }).notNull(), // 'daily' or 'weekly'
  daysBefore: varchar("days_before").notNull().default("3"),
  notificationsEnabled: varchar("notifications_enabled").notNull().default("true"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertReminderSettingsSchema = createInsertSchema(userReminderSettings, {
  email: z.string().email("Valid email is required"),
  frequency: z.enum(["daily", "weekly"]),
  daysBefore: z.string(),
  notificationsEnabled: z.string(),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateReminderSettingsSchema = insertReminderSettingsSchema.partial();

export type ReminderSettings = typeof userReminderSettings.$inferSelect;
export type InsertReminderSettings = z.infer<typeof insertReminderSettingsSchema>;
export type UpdateReminderSettings = z.infer<typeof updateReminderSettingsSchema>;

// Reminder Logs Table
export const reminderLogs = pgTable("reminder_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subscriptionId: varchar("subscription_id").references(() => subscriptions.id, { onDelete: "cascade" }),
  emailSentTo: varchar("email_sent_to").notNull(),
  sentAt: timestamp("sent_at").notNull().default(sql`now()`),
  status: varchar("status", { length: 20 }).notNull().default("sent"),
  errorMessage: text("error_message"),
});

export type ReminderLog = typeof reminderLogs.$inferSelect;
