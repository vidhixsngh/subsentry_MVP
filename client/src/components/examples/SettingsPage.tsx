import SettingsPage from '../SettingsPage';

export default function SettingsPageExample() {
  return (
    <div className="bg-background min-h-screen">
      <SettingsPage onBack={() => console.log('Back clicked')} />
    </div>
  );
}
