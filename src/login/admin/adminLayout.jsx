import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./adminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage =
    location.pathname === "/admin"
      ? "Dashboard"
      : location.pathname === "/admin/management"
      ? "Management"
      : location.pathname === "/admin/timetable"
      ? "Timetable"
      : location.pathname === "/admin/report-approval"
      ? "Report Approval"
      : "Admin";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }

  return (
    <div className="admin-dashboard">
      {/* ================= SIDEBAR ================= */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="admin-logo-icon">A</div>

          <div>
            <h2>Attendance</h2>
            <span>Smart Classroom</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {/* Dashboard */}
          <button
            type="button"
            className={`admin-nav-item ${
              location.pathname === "/admin" ? "active" : ""
            }`}
            onClick={() => navigate("/admin")}
          >
            <span>▣</span>
            <span>Dashboard</span>
          </button>

          {/* Management */}
          <button
            type="button"
            className={`admin-nav-item ${
              location.pathname === "/admin/management" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/management")}
          >
            <span>◉</span>
            <span>Management</span>
          </button>

          {/* Timetable */}
          <button
            type="button"
            className={`admin-nav-item ${
              location.pathname === "/admin/timetable" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/timetable")}
          >
            <span>▦</span>
            <span>Timetable</span>
          </button>

          {/* Report Approval */}
          <button
            type="button"
            className={`admin-nav-item ${
              location.pathname === "/admin/report-approval" ? "active" : ""
            }`}
            onClick={() => navigate("/admin/report-approval")}
          >
            <span>✓</span>
            <span>Report Approval</span>
          </button>
        </nav>

        {/* ================= SIDEBAR BOTTOM ================= */}
        <div className="admin-sidebar-bottom">
          <button
            type="button"
            className="admin-nav-item admin-logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="admin-main">
        {/* ================= TOPBAR ================= */}
        <header className="admin-topbar">
          <div className="admin-breadcrumb">
            <span className="admin-breadcrumb-link">Admin</span>

            <span className="admin-breadcrumb-separator">›</span>

            <span className="admin-breadcrumb-current">
              {currentPage}
            </span>
          </div>

          <div className="admin-topbar-right">
            <button
              type="button"
              className="admin-notification-button"
            >
              🔔
              <span className="admin-notification-dot"></span>
            </button>

            <div className="admin-user-mini">
              <div className="admin-user-avatar">AD</div>

              <div className="admin-user-mini-info">
                <span className="admin-user-name">
                  Admin
                </span>

                <span className="admin-user-role">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;