import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function AuditorDashboard() {
  const navigate = useNavigate();

  return (
    <section className="auditor-dashboard-content">
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="auditor-page-header">
        <div>
          <span className="auditor-small-title">AUDIT</span>

          <h1>Auditor Dashboard</h1>

          <p>
            Review and monitor recorded system activity and audit events.
          </p>
        </div>
      </div>

      {/* =========================
          OVERVIEW
      ========================= */}
      <section className="auditor-overview">
        <div className="auditor-overview-header">
          <div>
            <span className="auditor-section-label">
              AUDIT OVERVIEW
            </span>

            <h2>System Activity</h2>

            <p>
              Monitor recorded actions and changes performed across the
              attendance system.
            </p>
          </div>
        </div>

        <div className="auditor-action-card">
          <div className="auditor-action-icon">
            ▤
          </div>

          <div className="auditor-action-info">
            <span className="auditor-action-label">
              AUDIT LOG
            </span>

            <h3>Audit History</h3>

            <p>
              View recorded actions, users, entities, and timestamps from
              the system audit log.
            </p>
          </div>

          <button
            type="button"
            className="auditor-action-button"
            onClick={() => navigate("/auditor/history")}
          >
            View History
            <span>→</span>
          </button>
        </div>
      </section>
    </section>
  );
}

export default AuditorDashboard;