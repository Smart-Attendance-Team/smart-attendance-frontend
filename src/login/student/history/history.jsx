import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "./history.css";

function History() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // =====================================================
  // TEMPORARY MOCK DATA
  // سيتم استبدالها بالـBackend عندما يتم توصيله
  // =====================================================

  const mockAttendance = [
    {
      attendance_id: 1,
      course_name: "Database",
      course_code: "CS301",
      session_date: "2026-09-21",
      attendance_status: "PRESENT",
      minutes_late: 0,
      attendance_timestamp: "10:03 AM",
    },
    {
      attendance_id: 2,
      course_name: "Web Development",
      course_code: "CS302",
      session_date: "2026-09-20",
      attendance_status: "PRESENT",
      minutes_late: 2,
      attendance_timestamp: "12:02 PM",
    },
    {
      attendance_id: 3,
      course_name: "Artificial Intelligence",
      course_code: "AI301",
      session_date: "2026-09-19",
      attendance_status: "LATE",
      minutes_late: 12,
      attendance_timestamp: "02:12 PM",
    },
    {
      attendance_id: 4,
      course_name: "Data Structures",
      course_code: "CS201",
      session_date: "2026-09-18",
      attendance_status: "ABSENT",
      minutes_late: 0,
      attendance_timestamp: "-",
    },
    {
      attendance_id: 5,
      course_name: "Machine Learning",
      course_code: "AI302",
      session_date: "2026-09-17",
      attendance_status: "PRESENT",
      minutes_late: 0,
      attendance_timestamp: "11:01 AM",
    },
    {
      attendance_id: 6,
      course_name: "Database",
      course_code: "CS301",
      session_date: "2026-09-16",
      attendance_status: "LATE",
      minutes_late: 7,
      attendance_timestamp: "10:07 AM",
    },
  ];

  // =====================================================
  // GET ATTENDANCE FROM BACKEND
  // =====================================================

  useEffect(() => {
    async function getAttendance() {
      /*
        TEMPORARY:
        Backend is currently not connected.
        We use mock data so the UI can be tested.

        Later:
        Remove the mock data and uncomment the API request.
      */

      setAttendance(mockAttendance);
      setLoading(false);

      /*
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/attendance/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Attendance:", response.data);

        setAttendance(response.data);
      } catch (error) {
        console.log("ERROR:", error);
        console.log("RESPONSE:", error.response);
        console.log("DATA:", error.response?.data);

        setError(
          error.response?.data?.error ||
            "Failed to load attendance history"
        );
      } finally {
        setLoading(false);
      }
      */
    }

    getAttendance();
  }, []);

  // =====================================================
  // FILTER ATTENDANCE
  // =====================================================

  const filteredAttendance = attendance.filter((item) => {
    const matchesStatus =
      statusFilter === "All" ||
      item.attendance_status === statusFilter;

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
    (item) => item.attendance_status === "PRESENT"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.attendance_status === "ABSENT"
  ).length;

  const lateCount = attendance.filter(
    (item) => item.attendance_status === "LATE"
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
    switch (status) {
      case "PRESENT":
        return "Present";

      case "ABSENT":
        return "Absent";

      case "LATE":
        return "Late";

      default:
        return status;
    }
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

              <option value="PRESENT">Present</option>

              <option value="LATE">Late</option>

              <option value="ABSENT">Absent</option>
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
                          {item.attendance_timestamp}
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