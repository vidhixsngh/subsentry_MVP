import AddSubscriptionForm from '../AddSubscriptionForm';

export default function AddSubscriptionFormExample() {
  return (
    <div className="bg-background min-h-screen">
      <AddSubscriptionForm 
        onBack={() => console.log('Back clicked')}
        onSubmit={(data) => console.log('Form submitted:', data)}
      />
    </div>
  );
}
