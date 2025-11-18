import { type User, type InsertUser, type Subscription, type InsertSubscription, type UpdateSubscription } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Subscription methods
  getSubscriptions(userId: string): Promise<Subscription[]>;
  getSubscription(id: string, userId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription & { userId: string }): Promise<Subscription>;
  updateSubscription(id: string, userId: string, subscription: UpdateSubscription): Promise<Subscription | undefined>;
  deleteSubscription(id: string, userId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private subscriptions: Map<string, Subscription>;

  constructor() {
    this.users = new Map();
    this.subscriptions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSubscriptions(userId: string): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      (sub) => sub.userId === userId
    );
  }

  async getSubscription(id: string, userId: string): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (subscription && subscription.userId === userId) {
      return subscription;
    }
    return undefined;
  }

  async createSubscription(insertSubscription: InsertSubscription & { userId: string }): Promise<Subscription> {
    const id = randomUUID();
    const now = new Date();
    const subscription: Subscription = {
      ...insertSubscription,
      id,
      createdAt: now,
      updatedAt: now,
      status: insertSubscription.status || "Pending",
      paymentMethod: insertSubscription.paymentMethod || null,
      notes: insertSubscription.notes || null,
      lastUsedDate: insertSubscription.lastUsedDate || null,
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async updateSubscription(id: string, userId: string, updateData: UpdateSubscription): Promise<Subscription | undefined> {
    const subscription = await this.getSubscription(id, userId);
    if (!subscription) {
      return undefined;
    }

    const updatedSubscription: Subscription = {
      ...subscription,
      ...updateData,
      updatedAt: new Date(),
    };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }

  async deleteSubscription(id: string, userId: string): Promise<boolean> {
    const subscription = await this.getSubscription(id, userId);
    if (!subscription) {
      return false;
    }
    return this.subscriptions.delete(id);
  }
}

export const storage = new MemStorage();
