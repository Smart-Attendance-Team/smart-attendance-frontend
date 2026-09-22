import "./dashboard.css";

function AdminDashboard() {
  // BACKEND:
  // هنجيب الإحصائيات من الـBackend لما نحدد endpoint الخاص بالـdashboard.
  //
  // البيانات المطلوبة:
  // - total attendance
  // - present
  // - late
  // - absent
  // - excused
  // - attendance rate
  // - late rate
  // - missing data count
  // - low attendance warnings

  return (
    <section className="admin-dashboard-content">
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="admin-page-header">
        <div>
          <span className="admin-small-title">
            ADMINISTRATION
          </span>

          <h1>Admin Dashboard</h1>

          <p>
            Welcome Admin. Here's an overview of
            attendance.
          </p>
        </div>
      </div>

      {/* =========================
          ATTENDANCE OVERVIEW
      ========================= */}
      <section className="attendance-overview">
        <div className="dashboard-section-header">
          <div>
            <h2>Attendance Overview</h2>

            <p>
              Overall attendance statistics across
              the system.
            </p>
          </div>
        </div>

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

          <div className="attendance-stat-card">
            <h3>Missing Data</h3>
            <p>--</p>
          </div>
        </div>
      </section>

      {/* =========================
          LOW ATTENDANCE WARNINGS
      ========================= */}
      <section className="dashboard-card">
        <div className="dashboard-section-header">
          <div>
            <h2>Low Attendance Warnings</h2>

            <p>
              Students or sections requiring
              attendance attention.
            </p>
          </div>

          <span className="warning-count">
            --
          </span>
        </div>

        <div className="dashboard-empty-state">
          <span>⚠</span>

          <h3>No warning data available</h3>

          <p>
            Attendance warnings will appear here
            when analytics data is available.
          </p>
        </div>
      </section>
    </section>
  );
}

export default AdminDashboard;