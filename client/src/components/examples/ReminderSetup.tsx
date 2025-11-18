import ReminderSetup from '../ReminderSetup';

export default function ReminderSetupExample() {
  return (
    <div className="bg-background min-h-screen">
      <ReminderSetup 
        onBack={() => console.log('Back clicked')}
        onSave={(frequency, daysBefore) => console.log('Saved:', { frequency, daysBefore })}
      />
    </div>
  );
}
