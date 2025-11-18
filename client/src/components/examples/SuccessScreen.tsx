import SuccessScreen from '../SuccessScreen';

export default function SuccessScreenExample() {
  return (
    <SuccessScreen 
      title="You're all caught up — great job!"
      message="Your subscription has been added successfully. Keep tracking your expenses effortlessly."
      primaryAction={{
        label: "Return to Dashboard",
        onClick: () => console.log('Return to dashboard')
      }}
      secondaryAction={{
        label: "Add Another",
        onClick: () => console.log('Add another subscription')
      }}
    />
  );
}
