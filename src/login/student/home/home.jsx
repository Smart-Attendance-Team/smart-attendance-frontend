import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import "./home.css";

function Home() {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [corrections, setCorrections] = useState([]);
  const [timetable, setTimetable] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET STUDENT DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    async function getDashboardData() {
      try {
        setLoading(true);
        setError("");

        const [
          userResponse,
          attendanceResponse,
          correctionsResponse,
          timetableResponse,
        ] = await Promise.all([
          api.get("/students/me"),
          api.get("/attendance/me"),
          api.get("/corrections/mine"),
          api.get("/students/my-timetable"),
        ]);

        console.log("Student profile:", userResponse.data);
        console.log("Attendance:", attendanceResponse.data);
        console.log("Corrections:", correctionsResponse.data);
        console.log("Timetable:", timetableResponse.data);

        setUser(userResponse.data);
        setAttendance(attendanceResponse.data);
        setCorrections(correctionsResponse.data);
        setTimetable(timetableResponse.data);
      } catch (error) {
        console.log("Dashboard error:", error);
        console.log("Response:", error.response);
        console.log("Data:", error.response?.data);

        setError(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    getDashboardData();
  }, []);

  // =====================================================
  // ATTENDANCE STATISTICS
  // =====================================================

  const totalClasses = attendance.length;

  const presentCount = attendance.filter(
    (item) =>
      item.attendance_status?.toLowerCase() === "present"
  ).length;

  const absentCount = attendance.filter(
    (item) =>
      item.attendance_status?.toLowerCase() === "absent"
  ).length;

  const lateCount = attendance.filter(
    (item) =>
      item.attendance_status?.toLowerCase() === "late"
  ).length;

  const attendanceRate =
    totalClasses > 0
      ? Math.round(
          ((presentCount + lateCount) / totalClasses) * 100
        )
      : 0;

  const pendingCorrections = corrections.filter(
    (item) =>
      item.status?.toLowerCase() === "pending"
  ).length;

  // =====================================================
  // TODAY'S CLASSES
  // =====================================================

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const todaysClasses = timetable.filter(
    (item) =>
      item.day_of_week?.toLowerCase() === today.toLowerCase()
  );

  // =====================================================
  // RECENT ATTENDANCE
  // =====================================================

  const recentAttendance = attendance.slice(0, 5);

  // =====================================================
  // FORMAT STATUS
  // =====================================================

  function getStatusLabel(status) {
    if (!status) {
      return "";
    }

    switch (status.toLowerCase()) {
      case "present":
        return "Present";

      case "absent":
        return "Absent";

      case "late":
        return "Late";

      case "excused":
        return "Excused";

      default:
        return status;
    }
  }

  // =====================================================
  // FORMAT TIME
  // =====================================================

  function formatTime(time) {
    if (!time) {
      return "-";
    }

    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="dashboard-content">

      {/* ================= WELCOME ================= */}

      <section className="welcome-section">

        <div>

          <p className="welcome-small">
            Student Dashboard
          </p>

          <h1>
            Welcome back
            {user?.student_name
              ? `, ${user.student_name}!`
              : "!"}
            👋
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

      {/* ================= ERROR ================= */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* ================= USER INFO ================= */}

      {user && (
        <div className="user-info-bar">

          <div>

            <span>
              Student ID
            </span>

            <strong>
              {user.student_code}
            </strong>

          </div>

          <div>

            <span>
              Name
            </span>

            <strong>
              {user.student_name}
            </strong>

          </div>

          <div>

            <span>
              Level
            </span>

            <strong>
              {user.level}
            </strong>

          </div>

          <div>

            <span>
              Department
            </span>

            <strong>
              {user.department_name}
            </strong>

          </div>

        </div>
      )}

      {/* ================= LOADING ================= */}

      {loading ? (
        <div className="empty-state">

          <div className="empty-icon">
            ◷
          </div>

          <h3>
            Loading dashboard...
          </h3>

          <p>
            Getting your latest attendance information.
          </p>

        </div>
      ) : (
        <>

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
                  {attendanceRate}%
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
                  {presentCount}
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
                  {absentCount}
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
                  {pendingCorrections}
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
                    All Records
                  </option>

                </select>

              </div>


              <div className="attendance-placeholder">

                <div className="circle-progress">

                  <div className="circle-inner">

                    <strong>
                      {attendanceRate}%
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
                      {presentCount}
                    </strong>

                  </div>


                  <div>

                    <span className="legend-dot absent"></span>

                    Absent

                    <strong>
                      {absentCount}
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

                <Link
                  to="/qrscanner"
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

                </Link>


                <Link
                  to="/timetable"
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

                </Link>


                <Link
                  to="/correction"
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

                </Link>

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

                <Link
                  to="/timetable"
                  className="view-link"
                >
                  View All
                </Link>

              </div>


              {todaysClasses.length > 0 ? (
                <div className="quick-actions">

                  {todaysClasses.map((item) => (

                    <div
                      className="quick-action"
                      key={item.slot_id}
                    >

                      <div className="quick-icon purple">
                        ▦
                      </div>

                      <div>

                        <strong>
                          {item.course_name}
                        </strong>

                        <span>
                          {item.section_name} •{" "}
                          {item.room_name}
                        </span>

                        <span>
                          {formatTime(item.start_time)}
                          {" - "}
                          {formatTime(item.end_time)}
                        </span>

                      </div>

                    </div>

                  ))}

                </div>
              ) : (
                <div className="empty-state">

                  <div className="empty-icon">
                    ▦
                  </div>

                  <h3>
                    No classes today
                  </h3>

                  <p>
                    You have no scheduled classes today.
                  </p>

                </div>
              )}

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

                <Link
                  to="/history"
                  className="view-link"
                >
                  View All
                </Link>

              </div>


              {recentAttendance.length > 0 ? (
                <div className="quick-actions">

                  {recentAttendance.map((item) => (

                    <div
                      className="quick-action"
                      key={item.attendance_id}
                    >

                      <div className="quick-icon blue">
                        ◷
                      </div>

                      <div>

                        <strong>
                          {item.course_name}
                        </strong>

                        <span>
                          {item.session_date}
                        </span>

                      </div>

                      <span
                        className={`status-badge ${
                          item.attendance_status?.toLowerCase()
                        }`}
                      >
                        {getStatusLabel(
                          item.attendance_status
                        )}
                      </span>

                    </div>

                  ))}

                </div>
              ) : (
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
              )}

            </div>

          </section>

        </>
      )}

    </main>
  );
}

export default Home;