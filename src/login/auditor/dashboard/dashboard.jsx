import "./dashboard.css";

function AuditorDashboard() {
  return (
    <section className="auditor-dashboard-content">
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="auditor-page-header">
        <div>
          <span className="auditor-small-title">
            AUDIT
          </span>

          <h1>Auditor Dashboard</h1>

          <p>
            Welcome Auditor. Review and monitor system
            activity.
          </p>
        </div>
      </div>

      {/* =========================
          OVERVIEW
      ========================= */}
      <section className="auditor-overview-card">
        <div className="auditor-overview-header">
          <div>
            <h2>Audit Overview</h2>

            <p>
              Monitor recorded system activity and
              review audit history.
            </p>
          </div>
        </div>

        <div className="auditor-action-card">
          <div className="auditor-action-icon">
            ▤
          </div>

          <div className="auditor-action-info">
            <h3>Audit History</h3>

            <p>
              View all recorded actions and changes in
              the system.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              window.location.href = "/auditor/history"
            }
          >
            View History
          </button>
        </div>
      </section>
    </section>
  );
}

export default AuditorDashboard;