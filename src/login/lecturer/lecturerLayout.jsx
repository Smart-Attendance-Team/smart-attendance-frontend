import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./lecturerLayout.css";

function LecturerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage =
    location.pathname === "/lecturer"
      ? "Open Session"
      : location.pathname === "/lecturer/showqr"
      ? "Show QR"
      : location.pathname === "/lecturer/corrections"
      ? "Pending Corrections"
      : "Lecturer";

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="lecturer-dashboard">
      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">A</div>

          <div>
            <h2>Attendance</h2>
            <span>Smart Classroom</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`nav-item ${
              location.pathname === "/lecturer" ? "active" : ""
            }`}
            onClick={() => navigate("/lecturer")}
          >
            <span>▣</span>
            <span>Open Session</span>
          </button>

          <button
            type="button"
            className={`nav-item ${
              location.pathname === "/lecturer/showqr" ? "active" : ""
            }`}
            onClick={() => navigate("/lecturer/showqr")}
          >
            <span>▦</span>
            <span>Show QR</span>
          </button>

          <button
            type="button"
            className={`nav-item ${
              location.pathname === "/lecturer/corrections" ? "active" : ""
            }`}
            onClick={() => navigate("/lecturer/corrections")}
          >
            <span>✓</span>
            <span>Pending Corrections</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="nav-item logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <main className="dashboard-main">
        {/* ================= TOPBAR ================= */}

        <header className="topbar">
          <div className="breadcrumb">
            <span className="breadcrumb-link">Lecturer</span>

            <span className="breadcrumb-separator">›</span>

            <span className="breadcrumb-current">
              {currentPage}
            </span>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="notification-button"
            >
              🔔
              <span className="notification-dot"></span>
            </button>

            <div className="user-mini">
              <div className="user-avatar">DA</div>

              <div className="user-mini-info">
                <span className="user-name">
                  Dr. Ahmed Hassan
                </span>

                <span className="user-role">
                  Lecturer
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ================= PAGE ================= */}

        <Outlet />
      </main>
    </div>
  );
}

export default LecturerLayout;