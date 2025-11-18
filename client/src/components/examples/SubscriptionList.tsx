import SubscriptionList, { Subscription } from '../SubscriptionList';

export default function SubscriptionListExample() {
  const mockSubscriptions: Subscription[] = [
    { 
      id: '1',
      name: 'Netflix', 
      amount: 12.99, 
      renewalDate: '2024-07-10', 
      category: 'Streaming', 
      status: 'Pending' 
    },
    { 
      id: '2',
      name: 'Dropbox', 
      amount: 9.99, 
      renewalDate: '2024-07-03', 
      category: 'Productivity', 
      status: 'Paid' 
    },
    { 
      id: '3',
      name: 'Electricity', 
      amount: 60.00, 
      renewalDate: '2024-07-15', 
      category: 'Utilities', 
      status: 'Overdue' 
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
