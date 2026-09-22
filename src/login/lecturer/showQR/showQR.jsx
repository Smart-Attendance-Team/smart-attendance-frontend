import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import api from "../../../api/axios";
import "./showQR.css";

function ShowQR() {
  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // SESSION ID
  // =====================================================

  const savedSession = localStorage.getItem(
    "lecturerActiveSession"
  );

  const savedSessionData = savedSession
    ? JSON.parse(savedSession)
    : null;

  const sessionId =
    location.state?.sessionId ||
    savedSessionData?.sessionId ||
    null;

  // =====================================================
  // QR STATE
  // =====================================================

  const [qrToken, setQrToken] = useState("");

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [countdown, setCountdown] = useState(0);

  // =====================================================
  // ROSTER
  // =====================================================

  const [roster, setRoster] = useState([
    {
      attendance_id: 1,
      student_name: "Ahmed Mohamed",
      student_code: "20230101",
      attendance_status: "present",
      minutes_late: 0,
    },
    {
      attendance_id: 2,
      student_name: "Sara Ahmed",
      student_code: "20230115",
      attendance_status: "present",
      minutes_late: 0,
    },
    {
      attendance_id: 3,
      student_name: "Omar Khaled",
      student_code: "20230128",
      attendance_status: "late",
      minutes_late: 8,
    },
    {
      attendance_id: 4,
      student_name: "Mariam Ali",
      student_code: "20230204",
      attendance_status: "absent",
      minutes_late: 0,
    },
    {
      attendance_id: 5,
      student_name: "Youssef Hassan",
      student_code: "20230217",
      attendance_status: "present",
      minutes_late: 0,
    },
  ]);

  // =====================================================
  // EDIT ATTENDANCE
  // =====================================================

  const [editingId, setEditingId] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("");

  const [reason, setReason] = useState("");

  // =====================================================
  // CLOSE SESSION
  // =====================================================

  const [closing, setClosing] = useState(false);

  // =====================================================
  // GET QR TOKEN
  // =====================================================

  async function getQRToken() {
    if (!sessionId) {
      setMessage("No active session was found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/sessions/${sessionId}/qr`
      );

      console.log("QR response:", response.data);

      setQrToken(response.data.token);

      setCountdown(response.data.expires_in_seconds);

      setMessage("");
    } catch (error) {
      console.log("QR error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to generate QR code."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // GET FIRST QR
  // =====================================================

  useEffect(() => {
    getQRToken();
  }, [sessionId]);

  // =====================================================
  // QR COUNTDOWN
  // =====================================================

  useEffect(() => {
    if (!qrToken || countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [qrToken, countdown]);

  // =====================================================
  // REFRESH QR WHEN EXPIRED
  // =====================================================

  useEffect(() => {
    if (countdown !== 0 || !qrToken) {
      return;
    }

    getQRToken();
  }, [countdown, qrToken]);

  // =====================================================
  // MANUAL QR REFRESH
  // =====================================================

  async function refreshQR() {
    await getQRToken();

    setMessage("QR code refreshed successfully.");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  }

  // =====================================================
  // START EDIT
  // =====================================================

  function startEdit(attendanceId, currentStatus) {
    setEditingId(attendanceId);
    setSelectedStatus(currentStatus || "present");
    setReason("");
    setMessage("");
  }

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  function cancelEdit() {
    setEditingId(null);
    setSelectedStatus("");
    setReason("");
  }

  // =====================================================
  // UPDATE ATTENDANCE
  // TEMPORARY MOCK
  // =====================================================

  function updateAttendance(attendanceId) {
    if (!selectedStatus) {
      setMessage("Please select a status.");
      return;
    }

    if (!reason.trim()) {
      setMessage("Reason is required for manual changes.");
      return;
    }

    setRoster((previousRoster) =>
      previousRoster.map((student) =>
        student.attendance_id === attendanceId
          ? {
              ...student,
              attendance_status: selectedStatus,
            }
          : student
      )
    );

    setMessage("Attendance updated successfully.");

    cancelEdit();

    setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  // =====================================================
  // CLOSE SESSION - BACKEND
  // =====================================================

  async function closeSession() {
    const confirmed = window.confirm(
      "Are you sure you want to close this attendance session?"
    );

    if (!confirmed) {
      return;
    }

    if (!sessionId) {
      setMessage("No active session was found.");
      return;
    }

    setClosing(true);
    setMessage("");

    try {
      const response = await api.post(
        `/sessions/${sessionId}/close`
      );

      console.log("Close session response:", response.data);

      // Remove local active session
      localStorage.removeItem("lecturerActiveSession");

      setMessage("Attendance session closed successfully.");

      setTimeout(() => {
        navigate("/lecturer");
      }, 1000);
    } catch (error) {
      console.log("Close session error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to close attendance session."
      );
    } finally {
      setClosing(false);
    }
  }

  // =====================================================
  // ROSTER STATS
  // =====================================================

  const presentCount = roster.filter(
    (student) => student.attendance_status === "present"
  ).length;

  const lateCount = roster.filter(
    (student) => student.attendance_status === "late"
  ).length;

  const absentCount = roster.filter(
    (student) => student.attendance_status === "absent"
  ).length;

  const totalStudents = roster.length;

  // =====================================================
  // STATUS CLASS
  // =====================================================

  function getStatusClass(status) {
    return `status-badge ${status}`;
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="dashboard-content">

      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">

        <div>

          <div className="page-small-title">
            LIVE ATTENDANCE
          </div>

          <h1>
            Attendance Session
          </h1>

          <p>
            Manage the live attendance session and monitor
            student attendance.
          </p>

        </div>

        <div className="session-status">

          <span className="live-dot"></span>

          Session Active

        </div>

      </div>

      {/* ================= MESSAGE ================= */}

      {message && (
        <div className="session-message">
          {message}
        </div>
      )}

      {/* ================= SESSION INFO ================= */}

      <div className="session-info-row">

        <div className="session-detail-card">

          <span>COURSE</span>

          <strong>
            Database
          </strong>

          <small>
            CS301 · Section A
          </small>

        </div>

        <div className="session-detail-card">

          <span>ROOM</span>

          <strong>
            Lab 1
          </strong>

          <small>
            Session ID: {sessionId || "—"}
          </small>

        </div>

        <div className="session-detail-card">

          <span>TIME</span>

          <strong>
            10:00 AM - 12:00 PM
          </strong>

          <small>
            Saturday
          </small>

        </div>

        <div className="session-detail-card">

          <span>STUDENTS</span>

          <strong>
            {totalStudents}
          </strong>

          <small>
            Enrolled students
          </small>

        </div>

      </div>

      {/* ================= QR + STATS ================= */}

      <div className="qr-layout">

        {/* ================= QR CARD ================= */}

        <div className="qr-card">

          <div className="card-header">

            <div>

              <h2>
                Attendance QR Code
              </h2>

              <p>
                Students scan this QR code to record
                their attendance.
              </p>

            </div>

            <span className="qr-live-badge">
              LIVE
            </span>

          </div>

          <div className="qr-container">

            {loading ? (
              <div className="qr-loading">
                Generating QR...
              </div>
            ) : qrToken ? (
              <QRCodeCanvas
                value={qrToken}
                size={270}
                level="H"
              />
            ) : (
              <div className="qr-loading">
                No QR code available.
              </div>
            )}

          </div>

          <div className="qr-countdown">

            <div className="countdown-label">
              QR refreshes in
            </div>

            <div className="countdown-number">
              {countdown}s
            </div>

            <div className="countdown-progress">

              <div
                className="countdown-progress-bar"
                style={{
                  width: `${
                    countdown > 0
                      ? Math.min(
                          (countdown /
                            Math.max(
                              countdown,
                              1
                            )) *
                            100,
                          100
                        )
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>

          <button
            className="refresh-qr-button"
            onClick={refreshQR}
            disabled={loading}
          >
            ↻
            {loading
              ? "Refreshing..."
              : "Refresh QR"}
          </button>

        </div>

        {/* ================= ATTENDANCE OVERVIEW ================= */}

        <div className="attendance-overview">

          <div className="card-header">

            <div>

              <h2>
                Attendance Overview
              </h2>

              <p>
                Current session status
              </p>

            </div>

          </div>

          <div className="attendance-stat present-stat">

            <div className="stat-icon">
              ✓
            </div>

            <div>

              <span>
                Present
              </span>

              <strong>
                {presentCount}
              </strong>

            </div>

          </div>

          <div className="attendance-stat late-stat">

            <div className="stat-icon">
              ◷
            </div>

            <div>

              <span>
                Late
              </span>

              <strong>
                {lateCount}
              </strong>

            </div>

          </div>

          <div className="attendance-stat absent-stat">

            <div className="stat-icon">
              ×
            </div>

            <div>

              <span>
                Absent
              </span>

              <strong>
                {absentCount}
              </strong>

            </div>

          </div>

          <div className="attendance-progress">

            <div className="progress-header">

              <span>
                Attendance Rate
              </span>

              <strong>
                {totalStudents
                  ? Math.round(
                      ((presentCount + lateCount) /
                        totalStudents) *
                        100
                    )
                  : 0}
                %
              </strong>

            </div>

            <div className="progress-bar">

              <div
                style={{
                  width: `${
                    totalStudents
                      ? ((presentCount + lateCount) /
                          totalStudents) *
                        100
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>

      {/* ================= LIVE ROSTER ================= */}

      <div className="roster-card">

        <div className="card-header">

          <div>

            <h2>
              Live Roster
            </h2>

            <p>
              Monitor and manually update attendance.
            </p>

          </div>

          <span className="roster-count">

            {presentCount + lateCount} /{" "}
            {totalStudents} attended

          </span>

        </div>

        <div className="table-wrapper">

          <table className="roster-table">

            <thead>

              <tr>
                <th>Student</th>
                <th>Student Code</th>
                <th>Status</th>
                <th>Minutes Late</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {roster.map((student) => {

                const attendanceId =
                  student.attendance_id;

                const status =
                  student.attendance_status;

                return (
                  <tr key={attendanceId}>

                    <td>

                      <div className="student-cell">

                        <div className="student-avatar">

                          {student.student_name
                            .split(" ")
                            .map(
                              (word) => word[0]
                            )
                            .slice(0, 2)
                            .join("")}

                        </div>

                        <strong>
                          {student.student_name}
                        </strong>

                      </div>

                    </td>

                    <td>

                      <span className="student-code">
                        {student.student_code}
                      </span>

                    </td>

                    <td>

                      <span
                        className={getStatusClass(
                          status
                        )}
                      >
                        {status.charAt(0).toUpperCase() +
                          status.slice(1)}
                      </span>

                    </td>

                    <td>

                      {student.minutes_late > 0
                        ? `${student.minutes_late} min`
                        : "—"}

                    </td>

                    <td>

                      {editingId ===
                      attendanceId ? (

                        <div className="edit-attendance">

                          <select
                            value={
                              selectedStatus
                            }
                            onChange={(e) =>
                              setSelectedStatus(
                                e.target.value
                              )
                            }
                          >

                            <option value="present">
                              Present
                            </option>

                            <option value="absent">
                              Absent
                            </option>

                            <option value="late">
                              Late
                            </option>

                            <option value="excused">
                              Excused
                            </option>

                          </select>

                          <input
                            type="text"
                            placeholder="Reason"
                            value={reason}
                            onChange={(e) =>
                              setReason(
                                e.target.value
                              )
                            }
                          />

                          <div className="edit-actions">

                            <button
                              className="save-button"
                              onClick={() =>
                                updateAttendance(
                                  attendanceId
                                )
                              }
                            >
                              Save
                            </button>

                            <button
                              className="cancel-button"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>

                          </div>

                        </div>

                      ) : (

                        <button
                          className="edit-button"
                          onClick={() =>
                            startEdit(
                              attendanceId,
                              status
                            )
                          }
                        >
                          Edit
                        </button>

                      )}

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= SESSION ACTIONS ================= */}

      <div className="session-actions-card">

        <div>

          <h3>
            Finish Attendance Session
          </h3>

          <p>
            Close the session when attendance collection
            is complete. Students will no longer be able
            to scan the QR code.
          </p>

        </div>

        <div className="action-buttons">

          <button
            className="back-button"
            onClick={() =>
              navigate("/lecturer")
            }
          >
            Back to Sessions
          </button>

          <button
            className="close-session-button"
            onClick={closeSession}
            disabled={closing}
          >
            {closing
              ? "Closing Session..."
              : "Close Session"}
          </button>

        </div>

      </div>

    </section>
  );
}

export default ShowQR;