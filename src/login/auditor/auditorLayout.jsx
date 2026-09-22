import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./auditorLayout.css";

function AuditorLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage =
    location.pathname === "/auditor"
      ? "Dashboard"
      : location.pathname === "/auditor/history"
      ? "Audit History"
      : "Auditor";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }

  return (
    <div className="auditor-dashboard">
      {/* =========================
          SIDEBAR
      ========================= */}
      <aside className="auditor-sidebar">
        <div className="auditor-sidebar-logo">
          <div className="auditor-logo-icon">A</div>

          <div>
            <h2>Attendance</h2>
            <span>Smart Classroom</span>
          </div>
        </div>

        <nav className="auditor-sidebar-nav">
          <button
            type="button"
            className={`auditor-nav-item ${
              location.pathname === "/auditor" ? "active" : ""
            }`}
            onClick={() => navigate("/auditor")}
          >
            <span>▣</span>
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`auditor-nav-item ${
              location.pathname === "/auditor/history"
                ? "active"
                : ""
            }`}
            onClick={() => navigate("/auditor/history")}
          >
            <span>▤</span>
            <span>Audit History</span>
          </button>
        </nav>

        <div className="auditor-sidebar-bottom">
          <button
            type="button"
            className="auditor-nav-item auditor-logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =========================
          MAIN
      ========================= */}
      <main className="auditor-main">
        {/* TOPBAR */}
        <header className="auditor-topbar">
          <div className="auditor-breadcrumb">
            <span className="auditor-breadcrumb-link">
              Auditor
            </span>

            <span className="auditor-breadcrumb-separator">
              ›
            </span>

            <span className="auditor-breadcrumb-current">
              {currentPage}
            </span>
          </div>

          <div className="auditor-topbar-right">
            <button
              type="button"
              className="auditor-notification-button"
            >
              🔔
              <span className="auditor-notification-dot"></span>
            </button>

            <div className="auditor-user-mini">
              <div className="auditor-user-avatar">
                AU
              </div>

              <div className="auditor-user-mini-info">
                <span className="auditor-user-name">
                  Auditor
                </span>

                <span className="auditor-user-role">
                  Auditor
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <Outlet />
      </main>
    </div>
  );
}

export default AuditorLayout;