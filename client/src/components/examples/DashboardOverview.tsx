import DashboardOverview from '../DashboardOverview';

export default function DashboardOverviewExample() {
  const mockStats = {
    pending: 3,
    paid: 5,
    overdue: 1,
    totalMonthly: 157.96
  };

  return (
    <div className="p-6 bg-background">
      <DashboardOverview stats={mockStats} />
    </div>
  );
}
