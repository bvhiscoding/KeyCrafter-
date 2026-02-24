import StatsCard from '@/components/admin/StatsCard';

const Dashboard = () => {
  return (
    <section className="stack-md">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <StatsCard title="Revenue (Month)" value="128,000,000 VND" note="+18%" />
        <StatsCard title="New Orders" value="42" note="Today" />
        <StatsCard title="New Users" value="16" note="This week" />
      </div>
    </section>
  );
};

export default Dashboard;
