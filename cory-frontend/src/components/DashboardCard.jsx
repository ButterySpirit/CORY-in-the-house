export default function DashboardCard({ title, count, color = "#ffffff" }) {
    return (
      <div className="dashboard-card" style={{ backgroundColor: color }}>
        <h3>{title}</h3>
        <p>{count}</p>
      </div>
    );
  }
  