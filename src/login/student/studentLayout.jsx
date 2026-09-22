import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./studentLayout.css";

function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage =
    location.pathname === "/home"
      ? "Dashboard"
      : location.pathname === "/timetable"
      ? "Timetable"
      : location.pathname === "/qrscanner"
      ? "Scan QR"
      : location.pathname === "/history"
      ? "Attendance History"
      : location.pathname === "/correction"
      ? "Request Correction"
      : location.pathname === "/corrections"
      ? "My Corrections"
      : "Student";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }

  return (
    <div className="student-dashboard">

      {/* ================= SIDEBAR ================= */}

      <aside className="student-sidebar">

        <div className="student-sidebar-logo">
          <div className="student-logo-icon">
            SA
          </div>

          <div>
            <h2>Smart Attendance</h2>
            <span>Smart Classroom</span>
          </div>
        </div>

        <nav className="student-sidebar-nav">

          <button
            type="button"
            className={`student-nav-item ${
              location.pathname === "/home"
                ? "active"
                : ""
            }`}
            onClick={() => navigate("/home")}
          >
            <span>⌂</span>
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`student-nav-item ${
              location.pathname === "/timetable"
                ? "active"
                : ""
            }`}
            onClick={() => navigate("/timetable")}
          >
            <span>▦</span>
            <span>Timetable</span>
          </button>

          <button
            type="button"
            className={`student-nav-item ${
              location.pathname === "/qrscanner"
                ? "active"
                : ""
            }`}
            onClick={() => navigate("/qrscanner")}
          >
            <span>▣</span>
            <span>Scan QR</span>
          </button>

          <button
            type="button"
            className={`student-nav-item ${
              location.pathname === "/history"
                ? "active"
                : ""
            }`}
            onClick={() => navigate("/history")}
          >
            <span>◷</span>
            <span>Attendance History</span>
          </button>

          <button
            type="button"
            className={`student-nav-item ${
              location.pathname === "/correction"
                ? "active"
                : ""
            }`}
            onClick={() => navigate("/correction")}
          >
            <span>✎</span>
            <span>Request Correction</span>
          </button>

          <button
            type="button"
            className={`student-nav-item ${
              location.pathname === "/corrections"
                ? "active"
                : ""
            }`}
            onClick={() => navigate("/corrections")}
          >
            <span>✓</span>
            <span>My Corrections</span>
          </button>

        </nav>

        {/* ================= SIDEBAR BOTTOM ================= */}

        <div className="student-sidebar-bottom">

          <button
            type="button"
            className="student-nav-item"
          >
            <span>⚙</span>
            <span>Settings</span>
          </button>

          <button
            type="button"
            className="student-nav-item student-logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="student-main">

        {/* ================= TOPBAR ================= */}

        <header className="student-topbar">

          <div className="student-breadcrumb">

            <span className="student-breadcrumb-link">
              Student
            </span>

            <span className="student-breadcrumb-separator">
              ›
            </span>

            <span className="student-breadcrumb-current">
              {currentPage}
            </span>

          </div>

          <div className="student-topbar-right">

            <button
              type="button"
              className="student-notification-button"
            >
              🔔
              <span className="student-notification-dot"></span>
            </button>

            <div className="student-user-mini">

              <div className="student-user-avatar">
                S
              </div>

              <div className="student-user-mini-info">

                <span className="student-user-name">
                  Student
                </span>

                <span className="student-user-role">
                  Student
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

export default StudentLayout;