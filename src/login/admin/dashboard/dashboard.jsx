import "./dashboard.css";

function AdminDashboard() {
  return (
    <section className="admin-dashboard-content">
      <div className="admin-page-header">
        <div>
          <span className="admin-small-title">
            ADMINISTRATION
          </span>

          <h1>Admin Dashboard</h1>

          <p>
            Welcome Admin. Here's an overview of attendance.
          </p>
        </div>
      </div>

      <div className="attendance-overview">
        <h2>Attendance Overview</h2>

        <div className="attendance-stats">
          <div className="attendance-stat-card">
            <h3>Total Attendance</h3>
            <p>--</p>
          </div>

          <div className="attendance-stat-card">
            <h3>Present</h3>
            <p>--</p>
          </div>

          <div className="attendance-stat-card">
            <h3>Late</h3>
            <p>--</p>
          </div>

          <div className="attendance-stat-card">
            <h3>Absent</h3>
            <p>--</p>
          </div>

          <div className="attendance-stat-card">
            <h3>Excused</h3>
            <p>--</p>
          </div>

          <div className="attendance-stat-card">
            <h3>Attendance Rate</h3>
            <p>--%</p>
          </div>

          <div className="attendance-stat-card">
            <h3>Late Rate</h3>
            <p>--%</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;