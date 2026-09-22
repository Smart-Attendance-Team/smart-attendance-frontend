import { useEffect, useState } from "react";
import "./correction.css";

function Correction() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState("");
  const [requestedStatus, setRequestedStatus] = useState("present");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // MOCK DATA
  // Replace with Backend API later
  // =========================
  useEffect(() => {
    const mockAttendanceRecords = [
      {
        attendance_id: 1,
        course_name: "Database",
        course_code: "CS301",
        session_date: "2026-09-21",
        attendance_status: "absent",
        attendance_timestamp: "-",
      },
      {
        attendance_id: 2,
        course_name: "Web Development",
        course_code: "CS302",
        session_date: "2026-09-20",
        attendance_status: "late",
        attendance_timestamp: "12:02 PM",
      },
      {
        attendance_id: 3,
        course_name: "Artificial Intelligence",
        course_code: "AI301",
        session_date: "2026-09-19",
        attendance_status: "absent",
        attendance_timestamp: "-",
      },
      {
        attendance_id: 4,
        course_name: "Data Structures",
        course_code: "CS201",
        session_date: "2026-09-18",
        attendance_status: "absent",
        attendance_timestamp: "-",
      },
    ];

    setAttendanceRecords(mockAttendanceRecords);
  }, []);

  const selectedAttendance = attendanceRecords.find(
    (record) => record.attendance_id === Number(selectedRecord)
  );

  // =========================
  // Submit Correction
  // =========================
  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!selectedRecord) {
      setMessage("Please select an attendance record.");
      return;
    }

    if (!reason.trim()) {
      setMessage("Please enter a reason for your correction request.");
      return;
    }

    setSubmitting(true);

    // =========================
    // BACKEND LATER
    // POST /corrections
    // =========================
    setTimeout(() => {
      setMessage("Correction request submitted successfully.");
      setSelectedRecord("");
      setRequestedStatus("present");
      setReason("");
      setSubmitting(false);
    }, 800);
  }

  return (
    <main className="dashboard-content">
      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">
        <div>
          <p className="page-eyebrow">Attendance Management</p>

          <h1>Request Attendance Correction</h1>

          <p>
            Submit a correction request if your attendance record
            is incorrect.
          </p>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}

      <div className="correction-grid">
        {/* ================= FORM CARD ================= */}

        <div className="correction-card">
          <div className="card-header">
            <div>
              <h2>Correction Request</h2>

              <p>
                Provide the attendance record and explain the issue.
              </p>
            </div>

            <div className="card-icon">
              ✎
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Attendance Record */}

            <div className="form-group">
              <label htmlFor="attendance">
                Attendance Record
              </label>

              <select
                id="attendance"
                value={selectedRecord}
                onChange={(event) =>
                  setSelectedRecord(event.target.value)
                }
              >
                <option value="">
                  Select an attendance record
                </option>

                {attendanceRecords.map((record) => (
                  <option
                    key={record.attendance_id}
                    value={record.attendance_id}
                  >
                    {record.course_name} -{" "}
                    {record.session_date} -{" "}
                    {record.attendance_status}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Status */}

            {selectedAttendance && (
              <div className="current-record">
                <div>
                  <span>Course</span>

                  <strong>
                    {selectedAttendance.course_name}
                  </strong>
                </div>

                <div>
                  <span>Date</span>

                  <strong>
                    {selectedAttendance.session_date}
                  </strong>
                </div>

                <div>
                  <span>Current Status</span>

                  <span
                    className={`status-badge ${selectedAttendance.attendance_status}`}
                  >
                    {selectedAttendance.attendance_status}
                  </span>
                </div>
              </div>
            )}

            {/* Requested Status */}

            <div className="form-group">
              <label htmlFor="status">
                Requested Status
              </label>

              <select
                id="status"
                value={requestedStatus}
                onChange={(event) =>
                  setRequestedStatus(event.target.value)
                }
              >
                <option value="present">
                  Present
                </option>

                <option value="excused">
                  Excused
                </option>
              </select>
            </div>

            {/* Reason */}

            <div className="form-group">
              <label htmlFor="reason">
                Reason
              </label>

              <textarea
                id="reason"
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                placeholder="Explain why you believe this attendance record should be corrected..."
                rows="5"
              />

              <small>
                Please provide a clear reason for your request.
              </small>
            </div>

            {/* Message */}

            {message && (
              <div
                className={`correction-message ${
                  message.includes("successfully")
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              className="submit-correction-btn"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Correction Request"}
            </button>
          </form>
        </div>

        {/* ================= PREVIEW ================= */}

        <div className="correction-card preview-card">
          <div className="card-header">
            <div>
              <h2>Request Preview</h2>

              <p>
                Review your request before submitting.
              </p>
            </div>

            <div className="card-icon">
              ◉
            </div>
          </div>

          {selectedAttendance ? (
            <div className="preview-content">
              <div className="preview-course">
                <div className="course-icon">
                  DB
                </div>

                <div>
                  <h3>
                    {selectedAttendance.course_name}
                  </h3>

                  <span>
                    {selectedAttendance.course_code}
                  </span>
                </div>
              </div>

              <div className="preview-row">
                <span>Date</span>

                <strong>
                  {selectedAttendance.session_date}
                </strong>
              </div>

              <div className="preview-row">
                <span>Current Status</span>

                <span
                  className={`status-badge ${selectedAttendance.attendance_status}`}
                >
                  {selectedAttendance.attendance_status}
                </span>
              </div>

              <div className="preview-row">
                <span>Requested Status</span>

                <span
                  className={`status-badge ${requestedStatus}`}
                >
                  {requestedStatus}
                </span>
              </div>

              <div className="preview-row">
                <span>Attendance Time</span>

                <strong>
                  {selectedAttendance.attendance_timestamp}
                </strong>
              </div>

              <div className="preview-reason">
                <span>Reason</span>

                <p>
                  {reason.trim()
                    ? reason
                    : "Your reason will appear here."}
                </p>
              </div>
            </div>
          ) : (
            <div className="empty-preview">
              <div className="empty-preview-icon">
                ✎
              </div>

              <h3>No Record Selected</h3>

              <p>
                Select an attendance record from the form
                to preview your correction request.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= INFORMATION ================= */}

      <div className="correction-info">
        <div className="info-icon">
          !
        </div>

        <div>
          <h3>Important</h3>

          <p>
            Correction requests are reviewed by the
            authorized teaching staff. Your request will
            remain pending until it is approved or rejected.
          </p>
        </div>
      </div>
    </main>
  );
}

export default Correction;