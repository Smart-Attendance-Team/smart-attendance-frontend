import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "./dashboard.css";

function AdminDashboard() {
  const [report, setReport] = useState(null);
  const [flags, setFlags] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET ADMIN DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    async function getDashboardData() {
      try {
        setLoading(true);
        setError("");

        const [reportResponse, flagsResponse] = await Promise.all([
          api.get("/reports/attendance"),
          api.get("/flags"),
        ]);

        console.log("Attendance report:", reportResponse.data);
        console.log("Flags:", flagsResponse.data);

        setReport(reportResponse.data);
        setFlags(flagsResponse.data?.flags || []);
      } catch (error) {
        console.log("Admin dashboard error:", error);
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
  // REPORT DATA
  // =====================================================

  const summary = report?.summary || {};

  const totalAttendance = summary.total ?? 0;
  const presentCount = summary.present ?? 0;
  const lateCount = summary.late ?? 0;
  const absentCount = summary.absent ?? 0;
  const excusedCount = summary.excused ?? 0;
  const attendanceRate = summary.attendance_rate_percent ?? 0;
  const lateRate = summary.late_rate_percent ?? 0;

  // =====================================================
  // FLAGS
  // =====================================================

  const lowAttendanceFlags = flags.filter((flag) => flag.type === "low_attendance");

  return (
    <section className="admin-dashboard-content">

      <div className="admin-page-header">
        <div>
          <span className="admin-small-title">ADMINISTRATION</span>
          <h1>Admin Dashboard</h1>
          <p>Welcome Admin. Here's an overview of attendance.</p>
        </div>
      </div>

      {error && (
        <div className="admin-dashboard-error">{error}</div>
      )}

      {loading ? (
        <div className="dashboard-card">
          <div className="dashboard-empty-state">
            <span>◷</span>
            <h3>Loading dashboard...</h3>
            <p>Getting the latest attendance and analytics data.</p>
          </div>
        </div>
      ) : (
        <>

          <section className="attendance-overview">
            <div className="dashboard-section-header">
              <div>
                <h2>Attendance Overview</h2>
                <p>Overall attendance statistics across the system.</p>
              </div>
            </div>

            <div className="attendance-stats">
              <div className="attendance-stat-card">
                <h3>Total Attendance</h3>
                <p>{totalAttendance}</p>
              </div>

              <div className="attendance-stat-card">
                <h3>Present</h3>
                <p>{presentCount}</p>
              </div>

              <div className="attendance-stat-card">
                <h3>Late</h3>
                <p>{lateCount}</p>
              </div>

              <div className="attendance-stat-card">
                <h3>Absent</h3>
                <p>{absentCount}</p>
              </div>

              <div className="attendance-stat-card">
                <h3>Excused</h3>
                <p>{excusedCount}</p>
              </div>

              <div className="attendance-stat-card">
                <h3>Attendance Rate</h3>
                <p>{attendanceRate}%</p>
              </div>

              <div className="attendance-stat-card">
                <h3>Late Rate</h3>
                <p>{lateRate}%</p>
              </div>

              <div className="attendance-stat-card">
                <h3>Missing Data</h3>
                <p>--</p>
              </div>
            </div>
          </section>

          <section className="dashboard-card">
            <div className="dashboard-section-header">
              <div>
                <h2>Low Attendance Warnings</h2>
                <p>Students requiring attendance attention.</p>
              </div>
              <span className="warning-count">{lowAttendanceFlags.length}</span>
            </div>

            {lowAttendanceFlags.length > 0 ? (
              <div className="warning-list">
                {lowAttendanceFlags.map((flag, index) => (
                  <div
                    className="warning-item"
                    key={`${flag.student_code}-${flag.course_code}-${index}`}
                  >
                    <div className="warning-icon">
                      ⚠
                    </div>

                    <div className="warning-content">
                      <strong>
                        {flag.student_name}
                      </strong>

                      <span>
                        {flag.student_code}
                        {" • "}
                        {flag.course_code}
                        {" • "}
                        {flag.section_name}
                      </span>

                      <p>
                        {flag.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state">
                <span>✓</span>

                <h3>
                  No low attendance warnings
                </h3>

                <p>
                  There are currently no low attendance warnings.
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}

export default AdminDashboard;