import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./adminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <div className="admin-layout">

      {/* ================= SIDEBAR ================= */}
      <aside className="admin-sidebar">

        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>

        <nav className="admin-nav">

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "admin-nav-link active" : "admin-nav-link"
            }
          >
            <span>▣</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/management"
            className={({ isActive }) =>
              isActive ? "admin-nav-link active" : "admin-nav-link"
            }
          >
            <span>☷</span>
            Management
          </NavLink>

          <NavLink
            to="/admin/timetable"
            className={({ isActive }) =>
              isActive ? "admin-nav-link active" : "admin-nav-link"
            }
          >
            <span>◷</span>
            Timetable
          </NavLink>

          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              isActive ? "admin-nav-link active" : "admin-nav-link"
            }
          >
            <span>▤</span>
            Reports
          </NavLink>

        </nav>

        {/* ================= LOGOUT ================= */}
        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </aside>


      {/* ================= MAIN CONTENT ================= */}
      <div className="admin-main">

        {/* ================= TOPBAR ================= */}
        <header className="admin-topbar">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Attendance Management System</p>
          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}
        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;