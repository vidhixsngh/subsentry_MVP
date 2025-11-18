import type { Subscription } from "@shared/schema";

// Mock subscriptions data
export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    userId: 'mock-user-id',
    name: 'Netflix',
    amount: '799.00',
    renewalDate: '2025-12-15',
    billingCycle: 'Monthly',
    category: 'Streaming',
    status: 'Paid',
    paymentMethod: 'Credit Card',
    notes: 'Premium family plan',
    lastUsedDate: null,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-11-10'),
  },
  {
    id: '2',
    userId: 'mock-user-id',
    name: 'Amazon Prime',
    amount: '1499.00',
    renewalDate: '2026-01-20',
    billingCycle: 'Yearly',
    category: 'Streaming',
    status: 'Paid',
    paymentMethod: 'UPI',
    notes: 'Annual subscription with Prime Video and free shipping',
    lastUsedDate: '2025-11-17',
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-11-17'),
  },
  {
    id: '3',
    userId: 'mock-user-id',
    name: 'Spotify Premium',
    amount: '119.00',
    renewalDate: '2025-11-25',
    billingCycle: 'Monthly',
    category: 'Entertainment',
    status: 'Pending',
    paymentMethod: 'Debit Card',
    notes: 'Individual plan',
    lastUsedDate: '2025-11-18',
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2025-11-18'),
  },
  {
    id: '4',
    userId: 'mock-user-id',
    name: 'Adobe Creative Cloud',
    amount: '1675.00',
    renewalDate: '2025-11-20',
    billingCycle: 'Monthly',
    category: 'Productivity',
    status: 'Overdue',
    paymentMethod: 'Credit Card',
    notes: 'Photography plan with Photoshop and Lightroom',
    lastUsedDate: '2025-11-15',
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2025-11-15'),
  },
  {
    id: '5',
    userId: 'mock-user-id',
    name: 'Microsoft 365',
    amount: '489.00',
    renewalDate: '2025-12-01',
    billingCycle: 'Monthly',
    category: 'Productivity',
    status: 'Paid',
    paymentMethod: 'Credit Card',
    notes: 'Family subscription for 6 users',
    lastUsedDate: '2025-11-18',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2025-11-18'),
  },
  {
    id: '6',
    userId: 'mock-user-id',
    name: 'Electricity Bill',
    amount: '2500.00',
    renewalDate: '2025-12-05',
    billingCycle: 'Monthly',
    category: 'Utilities',
    status: 'Pending',
    paymentMethod: 'Auto-debit',
    notes: 'Average monthly consumption',
    lastUsedDate: null,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2025-11-05'),
  },
  {
    id: '7',
    userId: 'mock-user-id',
    name: 'Internet (Fiber)',
    amount: '999.00',
    renewalDate: '2025-11-28',
    billingCycle: 'Monthly',
    category: 'Utilities',
    status: 'Paid',
    paymentMethod: 'UPI',
    notes: '100 Mbps unlimited plan',
    lastUsedDate: null,
    createdAt: new Date('2023-11-28'),
    updatedAt: new Date('2025-10-28'),
  },
  {
    id: '8',
    userId: 'mock-user-id',
    name: 'GitHub Pro',
    amount: '400.00',
    renewalDate: '2025-12-10',
    billingCycle: 'Monthly',
    category: 'SaaS',
    status: 'Paid',
    paymentMethod: 'Credit Card',
    notes: 'Professional developer account',
    lastUsedDate: '2025-11-18',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2025-11-18'),
  },
  {
    id: '9',
    userId: 'mock-user-id',
    name: 'Gym Membership',
    amount: '1200.00',
    renewalDate: '2026-02-01',
    billingCycle: 'Quarterly',
    category: 'Other',
    status: 'Paid',
    paymentMethod: 'Cash',
    notes: 'Quarterly payment with personal training',
    lastUsedDate: '2025-11-17',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2025-11-01'),
  },
  {
    id: '10',
    userId: 'mock-user-id',
    name: 'Notion Pro',
    amount: '399.00',
    renewalDate: '2025-12-12',
    billingCycle: 'Monthly',
    category: 'Productivity',
    status: 'Pending',
    paymentMethod: 'Credit Card',
    notes: 'Personal Pro plan',
    lastUsedDate: '2025-11-18',
    createdAt: new Date('2024-06-12'),
    updatedAt: new Date('2025-11-18'),
  },
];

// Helper function to get a subscription by ID
export function getSubscriptionById(id: string): Subscription | undefined {
  return mockSubscriptions.find(sub => sub.id === id);
}

// Helper function to get subscriptions by user ID
export function getSubscriptionsByUserId(userId: string): Subscription[] {
  return mockSubscriptions.filter(sub => sub.userId === userId);
}

// Helper function to add a new subscription
export function addSubscription(subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Subscription {
  const newSubscription: Subscription = {
    ...subscription,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockSubscriptions.push(newSubscription);
  return newSubscription;
}

// Helper function to update a subscription
export function updateSubscription(id: string, updates: Partial<Subscription>): Subscription | undefined {
  const index = mockSubscriptions.findIndex(sub => sub.id === id);
  if (index === -1) return undefined;

  mockSubscriptions[index] = {
    ...mockSubscriptions[index],
    ...updates,
    updatedAt: new Date(),
  };
  return mockSubscriptions[index];
}

// Helper function to delete a subscription
export function deleteSubscription(id: string): boolean {
  const index = mockSubscriptions.findIndex(sub => sub.id === id);
  if (index === -1) return false;

  mockSubscriptions.splice(index, 1);
  return true;
}
