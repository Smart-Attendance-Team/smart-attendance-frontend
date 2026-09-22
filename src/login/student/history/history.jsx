import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "./history.css";

function History() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // =====================================================
  // GET ATTENDANCE FROM BACKEND
  // =====================================================

  useEffect(() => {
    async function getAttendance() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/attendance/me");

        console.log("Attendance:", response.data);

        setAttendance(response.data);
      } catch (error) {
        console.log("Attendance error:", error);
        console.log("Response:", error.response);
        console.log("Data:", error.response?.data);

        setError(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Failed to load attendance history."
        );
      } finally {
        setLoading(false);
      }
    }

    getAttendance();
  }, []);

  // =====================================================
  // FILTER ATTENDANCE
  // =====================================================

  const filteredAttendance = attendance.filter((item) => {
    const matchesStatus =
      statusFilter === "All" ||
      item.attendance_status.toLowerCase() ===
        statusFilter.toLowerCase();

    const matchesDate =
      !dateFilter ||
      item.session_date === dateFilter;

    return matchesStatus && matchesDate;
  });

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalClasses = attendance.length;

  const presentCount = attendance.filter(
    (item) => item.attendance_status.toLowerCase() === "present"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.attendance_status.toLowerCase() === "absent"
  ).length;

  const lateCount = attendance.filter(
    (item) => item.attendance_status.toLowerCase() === "late"
  ).length;

  const attendanceRate =
    totalClasses > 0
      ? Math.round(
          ((presentCount + lateCount) / totalClasses) * 100
        )
      : 0;

  // =====================================================
  // STATUS DISPLAY
  // =====================================================

  function getStatusLabel(status) {
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
  // FORMAT ATTENDANCE TIME
  // =====================================================

  function formatAttendanceTime(timestamp) {
    if (!timestamp) {
      return "-";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="dashboard-content">
      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">
        <div>
          <p className="page-small-title">Attendance</p>

          <h1>Attendance History</h1>

          <p className="page-description">
            Track your attendance records and monitor
            your attendance status.
          </p>
        </div>
      </div>

      {/* ================= STATISTICS ================= */}

      <div className="history-stats">
        <div className="history-stat-card">
          <div className="history-stat-icon blue">%</div>

          <div>
            <span>Attendance Rate</span>
            <strong>{attendanceRate}%</strong>
          </div>
        </div>

        <div className="history-stat-card">
          <div className="history-stat-icon green">✓</div>

          <div>
            <span>Present</span>
            <strong>{presentCount}</strong>
          </div>
        </div>

        <div className="history-stat-card">
          <div className="history-stat-icon orange">◷</div>

          <div>
            <span>Late</span>
            <strong>{lateCount}</strong>
          </div>
        </div>

        <div className="history-stat-card">
          <div className="history-stat-icon red">!</div>

          <div>
            <span>Absent</span>
            <strong>{absentCount}</strong>
          </div>
        </div>
      </div>

      {/* ================= HISTORY CARD ================= */}

      <div className="history-card">
        <div className="history-card-header">
          <div>
            <h2>Attendance Records</h2>

            <p>
              View your attendance for all sessions.
            </p>
          </div>

          {/* FILTERS */}

          <div className="history-filters">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="history-filter"
            >
              <option value="All">All Status</option>

              <option value="present">Present</option>

              <option value="late">Late</option>

              <option value="absent">Absent</option>

              <option value="excused">Excused</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value)
              }
              className="history-date"
            />
          </div>
        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="history-empty">
            <div className="empty-spinner"></div>

            <p>
              Loading attendance history...
            </p>
          </div>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <div className="history-error">
            <span>!</span>

            <p>{error}</p>
          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!loading &&
          !error &&
          filteredAttendance.length === 0 && (
            <div className="history-empty">
              <div className="empty-history-icon">
                ◷
              </div>

              <h3>
                No Attendance Records
              </h3>

              <p>
                There are no attendance records
                matching your filters.
              </p>
            </div>
          )}

        {/* ================= TABLE ================= */}

        {!loading &&
          !error &&
          filteredAttendance.length > 0 && (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Minutes Late</th>
                    <th>Attendance Time</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAttendance.map((item) => (
                    <tr key={item.attendance_id}>
                      <td>
                        <div className="course-cell">
                          <div className="course-icon">
                            ▣
                          </div>

                          <div>
                            <strong>
                              {item.course_name}
                            </strong>

                            <span>
                              {item.course_code}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="date-text">
                          {item.session_date}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${item.attendance_status.toLowerCase()}`}
                        >
                          <span className="status-dot"></span>

                          {getStatusLabel(
                            item.attendance_status
                          )}
                        </span>
                      </td>

                      <td>
                        <span className="late-text">
                          {item.minutes_late > 0
                            ? `${item.minutes_late} min`
                            : "-"}
                        </span>
                      </td>

                      <td>
                        <span className="time-text">
                          {formatAttendanceTime(
                            item.attendance_timestamp
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </main>
  );
}

export default History;