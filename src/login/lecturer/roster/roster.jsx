import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../api/axios";
import "./roster.css";

function Roster() {
  const location = useLocation();

  const savedSession = localStorage.getItem("lecturerActiveSession");
  const savedSessionData = savedSession ? JSON.parse(savedSession) : null;

  const sessionId =
    location.state?.sessionId ||
    savedSessionData?.sessionId ||
    null;

  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    late: 0,
    excused: 0,
    absent: 0,
  });

  const [sessionStatus, setSessionStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // ================= GET ROSTER =================

  async function getRoster() {
    if (!sessionId) {
      setMessage("No active session was found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.get(`/sessions/${sessionId}/roster`);

      console.log("Roster response:", response.data);

      setStudents(response.data.students || []);

      setSummary(
        response.data.summary || {
          total: 0,
          present: 0,
          late: 0,
          excused: 0,
          absent: 0,
        }
      );

      setSessionStatus(response.data.session_status || "");
    } catch (error) {
      console.log("Roster error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load attendance roster."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRoster();
  }, [sessionId]);

  // ================= OPEN CORRECTION =================

  function openCorrection(student, newStatus) {
    setSelectedStudent({
      ...student,
      newStatus,
    });

    setReason("");
    setMessage("");
    setShowModal(true);
  }

  // ================= CONFIRM CORRECTION =================

  async function confirmCorrection() {
    if (!selectedStudent) return;

    if (!reason.trim()) {
      setMessage("Reason is required for manual changes.");
      return;
    }

    if (!sessionId) {
      setMessage("No active session was found.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await api.patch(
        `/sessions/${sessionId}/attendance/${selectedStudent.attendance_id}`,
        {
          status: selectedStudent.newStatus.toLowerCase(),
          reason: reason.trim(),
        }
      );

      console.log("Correction response:", response.data);

      // Update the student locally using the backend result
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.attendance_id === selectedStudent.attendance_id
            ? {
                ...student,
                attendance_status:
                  response.data.after?.attendance_status ||
                  selectedStudent.newStatus.toLowerCase(),
                minutes_late:
                  response.data.after?.minutes_late ??
                  student.minutes_late,
              }
            : student
        )
      );

      // Refresh summary from backend
      await getRoster();

      setShowModal(false);
      setSelectedStudent(null);
      setReason("");

      setMessage("Attendance updated successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (error) {
      console.log("Correction error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update attendance."
      );
    } finally {
      setSaving(false);
    }
  }

  // ================= CLOSE MODAL =================

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    setSelectedStudent(null);
    setReason("");
    setMessage("");
  }

  // ================= STATUS CLASS =================

  function getStatusClass(status) {
    return `attendance-status ${status}`;
  }

  return (
    <div className="roster-page">

      {/* ================= HEADER ================= */}

      <div className="roster-header">
        <div>
          <h1>Live Roster</h1>

          <p>
            Monitor and manage student attendance for the current session.
          </p>
        </div>

        <div className="session-status">
          <span className="status-dot"></span>

          {sessionStatus === "open"
            ? "Session Active"
            : sessionStatus || "Session"}
        </div>
      </div>

      {/* ================= MESSAGE ================= */}

      {message && (
        <div className="roster-message">
          {message}
        </div>
      )}

      {/* ================= SESSION INFO ================= */}

      <div className="session-card">

        <div className="session-info">
          <span className="session-label">Session ID</span>
          <strong>{sessionId || "—"}</strong>
        </div>

        <div className="session-info">
          <span className="session-label">Status</span>
          <strong>
            {sessionStatus || "—"}
          </strong>
        </div>

        <div className="session-info">
          <span className="session-label">Students</span>
          <strong>{summary.total}</strong>
        </div>

        <div className="session-info">
          <span className="session-label">Session</span>
          <strong>Attendance Roster</strong>
        </div>

      </div>

      {/* ================= STATISTICS ================= */}

      <div className="roster-stats">

        <div className="roster-stat-card">
          <span>Total Students</span>
          <strong>{summary.total}</strong>
        </div>

        <div className="roster-stat-card present">
          <span>Present</span>
          <strong>{summary.present}</strong>
        </div>

        <div className="roster-stat-card absent">
          <span>Absent</span>
          <strong>{summary.absent}</strong>
        </div>

        <div className="roster-stat-card excused">
          <span>Excused</span>
          <strong>{summary.excused}</strong>
        </div>

      </div>

      {/* ================= ROSTER TABLE ================= */}

      <div className="roster-card">

        <div className="roster-card-header">

          <div>
            <h2>Attendance Roster</h2>

            <p>
              Students currently enrolled in this session.
            </p>
          </div>

        </div>

        <div className="table-wrapper">

          {loading ? (
            <div className="roster-loading">
              Loading attendance roster...
            </div>
          ) : students.length === 0 ? (
            <div className="roster-empty">
              No students found in this session.
            </div>
          ) : (
            <table>

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Status</th>
                  <th>Manual Correction</th>
                </tr>
              </thead>

              <tbody>

                {students.map((student) => (

                  <tr key={student.attendance_id}>

                    <td>
                      <div className="student-name">

                        <div className="student-avatar">
                          {student.student_name?.charAt(0)}
                        </div>

                        <span>
                          {student.student_name}
                        </span>

                      </div>
                    </td>

                    <td>
                      {student.student_code}
                    </td>

                    <td>

                      <span
                        className={getStatusClass(
                          student.attendance_status
                        )}
                      >
                        {student.attendance_status}
                      </span>

                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          type="button"
                          className="present-button"
                          onClick={() =>
                            openCorrection(student, "present")
                          }
                          disabled={saving}
                        >
                          Present
                        </button>

                        <button
                          type="button"
                          className="absent-button"
                          onClick={() =>
                            openCorrection(student, "absent")
                          }
                          disabled={saving}
                        >
                          Absent
                        </button>

                        <button
                          type="button"
                          className="excused-button"
                          onClick={() =>
                            openCorrection(student, "excused")
                          }
                          disabled={saving}
                        >
                          Excused
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          )}

        </div>

      </div>

      {/* ================= CORRECTION MODAL ================= */}

      {showModal && selectedStudent && (

        <div className="modal-overlay">

          <div className="correction-modal">

            <div className="modal-header">

              <h2>
                Manual Attendance Correction
              </h2>

              <button
                type="button"
                className="close-button"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>

            </div>

            <div className="modal-content">

              <p>
                You are changing the attendance status of:
              </p>

              <strong>
                {selectedStudent.student_name}
              </strong>

              <div className="new-status">

                New Status:

                <span>
                  {selectedStudent.newStatus}
                </span>

              </div>

              <label htmlFor="reason">
                Reason <span>*</span>
              </label>

              <textarea
                id="reason"
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                placeholder="Enter the reason for this correction..."
                rows="4"
                disabled={saving}
              />

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="confirm-button"
                  onClick={confirmCorrection}
                  disabled={saving}
                >
                  {saving
                    ? "Updating..."
                    : "Confirm Correction"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Roster;