import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../api/axios";
import "./roster.css";

function Roster() {
  const location = useLocation();

  const [sessionId, setSessionId] = useState(
    location.state?.sessionId || null
  );

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

  // =====================================================
  // FIND SESSION FOR ROSTER
  // =====================================================

  async function getRosterSession() {
    try {
      // =================================================
      // 1. SESSION FROM NAVIGATION
      // =================================================

      if (location.state?.sessionId) {
        console.log(
          "Using session from navigation:",
          location.state.sessionId
        );

        setSessionId(
          location.state.sessionId
        );

        return location.state.sessionId;
      }

      // =================================================
      // 2. CHECK BACKEND FOR ACTIVE SESSION
      // =================================================

      const response = await api.get(
        "/sessions/my-slots"
      );

      console.log(
        "My slots for roster:",
        response.data
      );

      const slots = Array.isArray(
        response.data
      )
        ? response.data
        : [];

      const activeSlot = slots.find(
        (slot) =>
          slot.session_id &&
          (
            slot.session_status === "open" ||
            slot.session_status === "active"
          )
      );

      if (activeSlot) {
        console.log(
          "Active session found:",
          activeSlot
        );

        setSessionId(
          activeSlot.session_id
        );

        setSessionStatus(
          activeSlot.session_status
        );

        return activeSlot.session_id;
      }

      // =================================================
      // 3. LAST SESSION
      // =================================================

      const savedLastSession =
        localStorage.getItem(
          "lecturerLastSession"
        );

      if (savedLastSession) {
        try {
          const lastSession =
            JSON.parse(
              savedLastSession
            );

          if (lastSession?.sessionId) {
            console.log(
              "Using last session for roster:",
              lastSession
            );

            setSessionId(
              lastSession.sessionId
            );

            setSessionStatus(
              lastSession.status ||
                "closed"
            );

            return lastSession.sessionId;
          }
        } catch (error) {
          console.log(
            "Invalid last session:",
            error
          );

          localStorage.removeItem(
            "lecturerLastSession"
          );
        }
      }

      // =================================================
      // 4. OLD ACTIVE SESSION FALLBACK
      // =================================================

      const savedActiveSession =
        localStorage.getItem(
          "lecturerActiveSession"
        );

      if (savedActiveSession) {
        try {
          const activeSession =
            JSON.parse(
              savedActiveSession
            );

          if (activeSession?.sessionId) {
            console.log(
              "Using saved active session:",
              activeSession
            );

            setSessionId(
              activeSession.sessionId
            );

            setSessionStatus(
              activeSession.status ||
                ""
            );

            return activeSession.sessionId;
          }
        } catch (error) {
          console.log(
            "Invalid saved active session:",
            error
          );

          localStorage.removeItem(
            "lecturerActiveSession"
          );
        }
      }

      // =================================================
      // NO SESSION
      // =================================================

      setSessionId(null);
      setSessionStatus("");

      return null;
    } catch (error) {
      console.log(
        "Get roster session error:",
        error
      );

      console.log(
        "Response:",
        error.response
      );

      console.log(
        "Data:",
        error.response?.data
      );

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to find attendance session."
      );

      return null;
    }
  }

  // =====================================================
  // GET ROSTER
  // =====================================================

  async function getRoster(
    currentSessionId
  ) {
    if (!currentSessionId) {
      setStudents([]);

      setSummary({
        total: 0,
        present: 0,
        late: 0,
        excused: 0,
        absent: 0,
      });

      setMessage(
        "No attendance session was found."
      );

      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.get(
        `/sessions/${currentSessionId}/roster`
      );

      console.log(
        "Roster response:",
        response.data
      );

      const data =
        response.data || {};

      // =================================================
      // STUDENTS
      // =================================================

      const rosterStudents =
        Array.isArray(data.students)
          ? data.students
          : Array.isArray(data.roster)
          ? data.roster
          : Array.isArray(data)
          ? data
          : [];

      setStudents(
        rosterStudents
      );

      // =================================================
      // SUMMARY
      // =================================================

      if (data.summary) {
        setSummary({
          total:
            data.summary.total ??
            rosterStudents.length,

          present:
            data.summary.present ??
            0,

          late:
            data.summary.late ??
            0,

          excused:
            data.summary.excused ??
            0,

          absent:
            data.summary.absent ??
            0,
        });
      } else {
        const calculatedSummary = {
          total:
            rosterStudents.length,

          present: 0,
          late: 0,
          excused: 0,
          absent: 0,
        };

        rosterStudents.forEach(
          (student) => {
            const status =
              String(
                student.attendance_status ||
                  ""
              ).toLowerCase();

            if (
              status === "present"
            ) {
              calculatedSummary.present++;
            } else if (
              status === "late"
            ) {
              calculatedSummary.late++;
            } else if (
              status === "excused"
            ) {
              calculatedSummary.excused++;
            } else if (
              status === "absent"
            ) {
              calculatedSummary.absent++;
            }
          }
        );

        setSummary(
          calculatedSummary
        );
      }

      // =================================================
      // SESSION STATUS
      // =================================================

      setSessionStatus(
        data.session_status ||
          data.status ||
          sessionStatus ||
          "closed"
      );
    } catch (error) {
      console.log(
        "Roster error:",
        error
      );

      console.log(
        "Response:",
        error.response
      );

      console.log(
        "Data:",
        error.response?.data
      );

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load attendance roster."
      );

      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // LOAD SESSION + ROSTER
  // =====================================================

  useEffect(() => {
    async function loadRoster() {
      setLoading(true);
      setMessage("");

      const currentSessionId =
        await getRosterSession();

      if (currentSessionId) {
        await getRoster(
          currentSessionId
        );
      } else {
        setLoading(false);
      }
    }

    loadRoster();
  }, [location.state?.sessionId]);

  // =====================================================
  // OPEN CORRECTION
  // =====================================================

  function openCorrection(
    student,
    newStatus
  ) {
    setSelectedStudent({
      ...student,
      newStatus,
    });

    setReason("");
    setMessage("");
    setShowModal(true);
  }

  // =====================================================
  // CONFIRM CORRECTION
  // =====================================================

  async function confirmCorrection() {
    if (!selectedStudent) {
      return;
    }

    if (!reason.trim()) {
      setMessage(
        "Reason is required for manual changes."
      );

      return;
    }

    if (!sessionId) {
      setMessage(
        "No attendance session was found."
      );

      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response =
        await api.patch(
          `/sessions/${sessionId}/attendance/${selectedStudent.attendance_id}`,
          {
            status:
              selectedStudent.newStatus.toLowerCase(),

            reason:
              reason.trim(),
          }
        );

      console.log(
        "Correction response:",
        response.data
      );

      // =================================================
      // UPDATE LOCALLY
      // =================================================

      setStudents(
        (currentStudents) =>
          currentStudents.map(
            (student) =>
              student.attendance_id ===
              selectedStudent.attendance_id
                ? {
                    ...student,

                    attendance_status:
                      response.data.after
                        ?.attendance_status ||
                      selectedStudent.newStatus.toLowerCase(),

                    minutes_late:
                      response.data.after
                        ?.minutes_late ??
                      student.minutes_late,
                  }
                : student
          )
      );

      // =================================================
      // REFRESH FROM BACKEND
      // =================================================

      await getRoster(
        sessionId
      );

      setShowModal(false);
      setSelectedStudent(null);
      setReason("");

      setMessage(
        "Attendance updated successfully."
      );

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (error) {
      console.log(
        "Correction error:",
        error
      );

      console.log(
        "Response:",
        error.response
      );

      console.log(
        "Data:",
        error.response?.data
      );

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update attendance."
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  function closeModal() {
    if (saving) {
      return;
    }

    setShowModal(false);
    setSelectedStudent(null);
    setReason("");
    setMessage("");
  }

  // =====================================================
  // STATUS CLASS
  // =====================================================

  function getStatusClass(
    status
  ) {
    return `attendance-status ${status}`;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="roster-page">

      {/* ================= HEADER ================= */}

      <div className="roster-header">

        <div>

          <h1>
            Live Roster
          </h1>

          <p>
            Monitor and manage student attendance
            for the current session.
          </p>

        </div>

        <div className="session-status">

          <span className="status-dot"></span>

          {sessionStatus ===
            "open" ||
          sessionStatus ===
            "active"
            ? "Session Active"
            : sessionStatus ||
              "Session"}

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

          <span className="session-label">
            Session ID
          </span>

          <strong>
            {sessionId || "—"}
          </strong>

        </div>

        <div className="session-info">

          <span className="session-label">
            Status
          </span>

          <strong>
            {sessionStatus || "—"}
          </strong>

        </div>

        <div className="session-info">

          <span className="session-label">
            Students
          </span>

          <strong>
            {summary.total}
          </strong>

        </div>

        <div className="session-info">

          <span className="session-label">
            Session
          </span>

          <strong>
            Attendance Roster
          </strong>

        </div>

      </div>

      {/* ================= STATISTICS ================= */}

      <div className="roster-stats">

        <div className="roster-stat-card">

          <span>
            Total Students
          </span>

          <strong>
            {summary.total}
          </strong>

        </div>

        <div className="roster-stat-card present">

          <span>
            Present
          </span>

          <strong>
            {summary.present}
          </strong>

        </div>

        <div className="roster-stat-card absent">

          <span>
            Absent
          </span>

          <strong>
            {summary.absent}
          </strong>

        </div>

        <div className="roster-stat-card excused">

          <span>
            Excused
          </span>

          <strong>
            {summary.excused}
          </strong>

        </div>

      </div>

      {/* ================= ROSTER TABLE ================= */}

      <div className="roster-card">

        <div className="roster-card-header">

          <div>

            <h2>
              Attendance Roster
            </h2>

            <p>
              Students currently enrolled in
              this session.
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

                  <th>
                    Student
                  </th>

                  <th>
                    Student ID
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Manual Correction
                  </th>

                </tr>

              </thead>

              <tbody>

                {students.map(
                  (student) => (

                    <tr
                      key={
                        student.attendance_id ||
                        student.student_id ||
                        student.student_code
                      }
                    >

                      <td>

                        <div className="student-name">

                          <div className="student-avatar">

                            {student.student_name
                              ?.charAt(0)
                              ?.toUpperCase()}

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
                              openCorrection(
                                student,
                                "present"
                              )
                            }
                            disabled={saving}
                          >
                            Present
                          </button>

                          <button
                            type="button"
                            className="absent-button"
                            onClick={() =>
                              openCorrection(
                                student,
                                "absent"
                              )
                            }
                            disabled={saving}
                          >
                            Absent
                          </button>

                          <button
                            type="button"
                            className="excused-button"
                            onClick={() =>
                              openCorrection(
                                student,
                                "excused"
                              )
                            }
                            disabled={saving}
                          >
                            Excused
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </div>

      </div>

      {/* ================= CORRECTION MODAL ================= */}

      {showModal &&
        selectedStudent && (

          <div className="modal-overlay">

            <div className="correction-modal">

              <div className="modal-header">

                <h2>
                  Manual Attendance Correction
                </h2>

                <button
                  type="button"
                  className="close-button"
                  onClick={
                    closeModal
                  }
                  disabled={saving}
                >
                  ×
                </button>

              </div>

              <div className="modal-content">

                <p>
                  You are changing the
                  attendance status of:
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

                  Reason{" "}

                  <span>
                    *
                  </span>

                </label>

                <textarea
                  id="reason"
                  value={reason}
                  onChange={(event) =>
                    setReason(
                      event.target.value
                    )
                  }
                  placeholder="Enter the reason for this correction..."
                  rows="4"
                  disabled={saving}
                />

                <div className="modal-actions">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={
                      closeModal
                    }
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="confirm-button"
                    onClick={
                      confirmCorrection
                    }
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