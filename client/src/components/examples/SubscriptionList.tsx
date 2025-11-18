import SubscriptionList from '../SubscriptionList';
import type { Subscription } from '@shared/schema';

export default function SubscriptionListExample() {
  const mockSubscriptions: Subscription[] = [
    {
      id: '1',
      userId: 'mock-user-id',
      name: 'Netflix',
      amount: '12.99',
      renewalDate: '2024-07-10',
      billingCycle: 'Monthly',
      category: 'Streaming',
      status: 'Pending',
      paymentMethod: null,
      notes: null,
      lastUsedDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      userId: 'mock-user-id',
      name: 'Dropbox',
      amount: '9.99',
      renewalDate: '2024-07-03',
      billingCycle: 'Monthly',
      category: 'Productivity',
      status: 'Paid',
      paymentMethod: null,
      notes: null,
      lastUsedDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      userId: 'mock-user-id',
      name: 'Electricity',
      amount: '60.00',
      renewalDate: '2024-07-15',
      billingCycle: 'Monthly',
      category: 'Utilities',
      status: 'Overdue',
      paymentMethod: null,
      notes: null,
      lastUsedDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  return (
    <div className="p-6 bg-background max-w-2xl">
      <SubscriptionList
        subscriptions={mockSubscriptions}
        onSubscriptionClick={(sub) => console.log('Clicked:', sub.name)}
      />
    </div>
  );
}
