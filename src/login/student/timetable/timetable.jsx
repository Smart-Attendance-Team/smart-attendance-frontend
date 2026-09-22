import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "./timetable.css";

function Timetable() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET STUDENT TIMETABLE
  // =====================================================

  useEffect(() => {
    async function getTimetable() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/students/my-timetable"
        );

        console.table(
          response.data.map((item) => ({
            slot_id: item.slot_id,
            day: item.day_of_week,
            course: item.course_name,
            course_code: item.course_code,
            section: item.section_name,
            room: item.room_name,
            building: item.building,
            start: item.start_time,
            end: item.end_time,
          }))
        );

        setClasses(response.data);
      } catch (error) {
        console.log("Timetable error:", error);
        console.log("Response:", error.response);
        console.log("Data:", error.response?.data);

        setError(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Failed to load timetable."
        );
      } finally {
        setLoading(false);
      }
    }

    getTimetable();
  }, []);

  // =====================================================
  // FORMAT TIME
  // =====================================================

  function formatTime(time) {
    if (!time) {
      return "-";
    }

    const [hours, minutes] = time
      .split(":")
      .map(Number);

    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // =====================================================
  // GET CLASS TYPE
  // =====================================================

  function getClassType() {
    // Backend does not currently return
    // Lecture / Lab type.
    return "-";
  }

  return (
    <main className="dashboard-content">

      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">

        <div>
          <p className="page-small-title">
            Academic Schedule
          </p>

          <h1>Timetable</h1>

          <p className="page-description">
            View your weekly classes and lecture schedule.
          </p>
        </div>

        <div className="week-box">
          <span>Current Week</span>

          <strong>
            September 21 - 27, 2026
          </strong>
        </div>

      </div>

      {/* ================= SUMMARY ================= */}

      <div className="timetable-summary">

        <div className="summary-card">

          <div className="summary-icon blue">
            ▣
          </div>

          <div>
            <span>Total Classes</span>

            <strong>
              {classes.length}
            </strong>
          </div>

        </div>

        <div className="summary-card">

          <div className="summary-icon green">
            ✓
          </div>

          <div>
            <span>Lectures</span>

            <strong>
              -
            </strong>
          </div>

        </div>

        <div className="summary-card">

          <div className="summary-icon orange">
            ⌘
          </div>

          <div>
            <span>Labs</span>

            <strong>
              -
            </strong>
          </div>

        </div>

      </div>

      {/* ================= TABLE ================= */}

      <div className="timetable-card">

        <div className="table-header">

          <div>
            <h2>Weekly Schedule</h2>

            <p>
              Your classes for this week
            </p>
          </div>

          <select className="week-select">
            <option>This Week</option>
            <option>Next Week</option>
          </select>

        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="history-empty">

            <div className="empty-spinner"></div>

            <p>
              Loading timetable...
            </p>

          </div>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <div className="history-error">

            <span>!</span>

            <p>
              {error}
            </p>

          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!loading &&
          !error &&
          classes.length === 0 && (
            <div className="history-empty">

              <div className="empty-history-icon">
                ◷
              </div>

              <h3>
                No Timetable Records
              </h3>

              <p>
                No classes were found in your timetable.
              </p>

            </div>
          )}

        {/* ================= TABLE ================= */}

        {!loading &&
          !error &&
          classes.length > 0 && (

            <div className="table-wrapper">

              <table className="timetable-table">

                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Course</th>
                    <th>Section</th>
                    <th>Room</th>
                    <th>Time</th>
                    <th>Type</th>
                  </tr>
                </thead>

                <tbody>

                  {classes.map((item) => (

                    <tr key={item.slot_id}>

                      <td>
                        <span className="day-badge">
                          {item.day_of_week}
                        </span>
                      </td>

                      <td>
                        <strong className="course-name">
                          {item.course_name}
                        </strong>

                        <span className="lecturer-name">
                          {item.course_code}
                        </span>
                      </td>

                      <td>
                        <span className="room-badge">
                          {item.section_name}
                        </span>
                      </td>

                      <td>
                        <span className="room-badge">
                          {item.room_name}

                          {item.building
                            ? ` - ${item.building}`
                            : ""}
                        </span>
                      </td>

                      <td>
                        <span className="time-text">
                          {formatTime(item.start_time)}
                          {" - "}
                          {formatTime(item.end_time)}
                        </span>
                      </td>

                      <td>
                        <span className="type-badge lecture">
                          {getClassType()}
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

export default Timetable;