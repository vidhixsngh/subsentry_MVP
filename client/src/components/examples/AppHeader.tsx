import AppHeader from '../AppHeader';

export default function AppHeaderExample() {
  return (
    <div className="bg-background">
      <AppHeader onSettingsClick={() => console.log('Settings clicked')} />
    </div>
  );
}
