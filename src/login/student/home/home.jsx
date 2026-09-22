import "./home.css";

function Home() {
  // =========================================================
  // BACKEND CODE - TEMPORARILY DISABLED FOR UI TESTING
  // =========================================================

  // const [user, setUser] = useState(null);
  // const [error, setError] = useState("");

  // useEffect(() => {
  //   async function getUser() {
  //     try {
  //       const token = localStorage.getItem("token");

  //       const response = await api.get("/me", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       console.log("Current user:", response.data);

  //       setUser(response.data);
  //     } catch (error) {
  //       console.log("ERROR:", error);
  //       console.log("RESPONSE:", error.response);
  //       console.log("DATA:", error.response?.data);

  //       setError(
  //         error.response?.data?.error ||
  //           "Failed to load user information"
  //       );
  //     }
  //   }

  //   getUser();
  // }, []);

  // =========================================================
  // MOCK DATA - TEMPORARILY USED FOR UI TESTING
  // =========================================================

  const user = {
    userId: "STU001",
    role: "STUDENT",
  };

  // =========================================================
  // END OF MOCK DATA
  // =========================================================

  return (
    <main className="dashboard-content">

      {/* ================= WELCOME ================= */}

      <section className="welcome-section">

        <div>

          <p className="welcome-small">
            Student Dashboard
          </p>

          <h1>
            Welcome back! 👋
          </h1>

          <p className="welcome-description">
            Here's an overview of your attendance and
            academic activities.
          </p>

        </div>

        <div className="date-box">

          <span>
            Today
          </span>

          <strong>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </strong>

        </div>

      </section>


      {/* =====================================================
          BACKEND ERROR MESSAGE - TEMPORARILY DISABLED
          Will be enabled when Backend is connected.
      ===================================================== */}

      {/*
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      */}


      {/* =====================================================
          USER INFO - USING MOCK DATA FOR UI TESTING
      ===================================================== */}

      {user && (
        <div className="user-info-bar">

          <div>

            <span>
              Student ID
            </span>

            <strong>
              {user.userId}
            </strong>

          </div>

          <div>

            <span>
              Role
            </span>

            <strong>
              {user.role}
            </strong>

          </div>

        </div>
      )}


      {/* ================= STATISTICS ================= */}

      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon blue">
            %
          </div>

          <div className="stat-content">

            <span>
              Attendance Rate
            </span>

            <strong>
              92%
            </strong>

            <small>
              Overall attendance
            </small>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon green">
            ✓
          </div>

          <div className="stat-content">

            <span>
              Present
            </span>

            <strong>
              24
            </strong>

            <small>
              Classes attended
            </small>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon red">
            !
          </div>

          <div className="stat-content">

            <span>
              Absent
            </span>

            <strong>
              2
            </strong>

            <small>
              Classes missed
            </small>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon orange">
            ⏱
          </div>

          <div className="stat-content">

            <span>
              Corrections
            </span>

            <strong>
              3
            </strong>

            <small>
              Pending requests
            </small>

          </div>

        </div>

      </section>


      {/* ================= MAIN GRID ================= */}

      <section className="dashboard-grid">

        {/* ================= ATTENDANCE OVERVIEW ================= */}

        <div className="dashboard-card attendance-card">

          <div className="card-header">

            <div>

              <h2>
                Attendance Overview
              </h2>

              <p>
                Your attendance performance
              </p>

            </div>

            <select className="period-select">

              <option>
                This Month
              </option>

              <option>
                This Semester
              </option>

            </select>

          </div>


          {/* MOCK ATTENDANCE DATA */}

          <div className="attendance-placeholder">

            <div className="circle-progress">

              <div className="circle-inner">

                <strong>
                  92%
                </strong>

                <span>
                  Attendance
                </span>

              </div>

            </div>


            <div className="attendance-legend">

              <div>

                <span className="legend-dot present"></span>

                Present

                <strong>
                  24
                </strong>

              </div>


              <div>

                <span className="legend-dot absent"></span>

                Absent

                <strong>
                  2
                </strong>

              </div>

            </div>

          </div>

        </div>


        {/* ================= QUICK ACTIONS ================= */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Frequently used actions
              </p>

            </div>

          </div>


          <div className="quick-actions">

            <a
              href="/qrscanner"
              className="quick-action"
            >

              <div className="quick-icon blue">
                ▣
              </div>

              <div>

                <strong>
                  Scan QR
                </strong>

                <span>
                  Mark your attendance
                </span>

              </div>

              <span className="arrow">
                →
              </span>

            </a>


            <a
              href="/timetable"
              className="quick-action"
            >

              <div className="quick-icon purple">
                ▦
              </div>

              <div>

                <strong>
                  View Timetable
                </strong>

                <span>
                  Check your classes
                </span>

              </div>

              <span className="arrow">
                →
              </span>

            </a>


            <a
              href="/correction"
              className="quick-action"
            >

              <div className="quick-icon orange">
                ✎
              </div>

              <div>

                <strong>
                  Request Correction
                </strong>

                <span>
                  Report attendance issue
                </span>

              </div>

              <span className="arrow">
                →
              </span>

            </a>

          </div>

        </div>

      </section>


      {/* ================= BOTTOM GRID ================= */}

      <section className="dashboard-grid">

        {/* ================= TODAY'S CLASSES ================= */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>

              <h2>
                Today's Classes
              </h2>

              <p>
                Your scheduled classes today
              </p>

            </div>

            <a
              href="/timetable"
              className="view-link"
            >
              View All
            </a>

          </div>


          <div className="empty-state">

            <div className="empty-icon">
              ▦
            </div>

            <h3>
              No classes displayed
            </h3>

            <p>
              Your timetable information will appear here.
            </p>

          </div>

        </div>


        {/* ================= RECENT ATTENDANCE ================= */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>

              <h2>
                Recent Attendance
              </h2>

              <p>
                Your latest attendance records
              </p>

            </div>

            <a
              href="/history"
              className="view-link"
            >
              View All
            </a>

          </div>


          <div className="empty-state">

            <div className="empty-icon">
              ◷
            </div>

            <h3>
              No attendance records
            </h3>

            <p>
              Recent attendance records will appear here.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;