import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "./correction.css";

function Correction() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRecord, setSelectedRecord] = useState("");
  const [requestedStatus, setRequestedStatus] = useState("present");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // =====================================================
  // GET ATTENDANCE RECORDS FROM BACKEND
  // =====================================================

  useEffect(() => {
    async function getAttendanceRecords() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/attendance/me");

        console.log(
          "Attendance records:",
          response.data
        );

        setAttendanceRecords(response.data);
      } catch (error) {
        console.log(
          "Attendance records error:",
          error
        );
        console.log("Response:", error.response);
        console.log("Data:", error.response?.data);

        setError(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Failed to load attendance records."
        );
      } finally {
        setLoading(false);
      }
    }

    getAttendanceRecords();
  }, []);

  // =====================================================
  // SELECTED ATTENDANCE
  // =====================================================

  const selectedAttendance = attendanceRecords.find(
    (record) =>
      record.attendance_id === Number(selectedRecord)
  );

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

  // =====================================================
  // Submit Correction
  // =====================================================

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!selectedRecord) {
      setMessage(
        "Please select an attendance record."
      );
      return;
    }

    if (!reason.trim()) {
      setMessage(
        "Please enter a reason for your correction request."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post("/corrections", {
        attendance_id: Number(selectedRecord),
        requested_status: requestedStatus,
        reason: reason.trim(),
        evidence_url: null,
      });

      console.log(
        "Correction request response:",
        response.data
      );

      setMessage(
        "Correction request submitted successfully."
      );

      setSelectedRecord("");
      setRequestedStatus("present");
      setReason("");
    } catch (error) {
      console.log(
        "Correction request error:",
        error
      );
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to submit correction request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="dashboard-content">
      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">
        <div>
          <p className="page-eyebrow">
            Attendance Management
          </p>

          <h1>Request Attendance Correction</h1>

          <p>
            Submit a correction request if your attendance
            record is incorrect.
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
                Provide the attendance record and explain
                the issue.
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

              {loading ? (
                <p>
                  Loading attendance records...
                </p>
              ) : error ? (
                <p className="correction-message error">
                  {error}
                </p>
              ) : (
                <select
                  id="attendance"
                  value={selectedRecord}
                  onChange={(event) =>
                    setSelectedRecord(
                      event.target.value
                    )
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
                      {getStatusLabel(
                        record.attendance_status
                      )}
                    </option>
                  ))}
                </select>
              )}
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
                    className={`status-badge ${selectedAttendance.attendance_status.toLowerCase()}`}
                  >
                    {getStatusLabel(
                      selectedAttendance.attendance_status
                    )}
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
                  setRequestedStatus(
                    event.target.value
                  )
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
                Please provide a clear reason for your
                request.
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
              disabled={
                submitting ||
                loading ||
                !!error
              }
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
                  {selectedAttendance.course_code
                    ?.slice(0, 2)
                    .toUpperCase() || "CR"}
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
                  className={`status-badge ${selectedAttendance.attendance_status.toLowerCase()}`}
                >
                  {getStatusLabel(
                    selectedAttendance.attendance_status
                  )}
                </span>
              </div>

              <div className="preview-row">
                <span>Requested Status</span>

                <span
                  className={`status-badge ${requestedStatus}`}
                >
                  {getStatusLabel(requestedStatus)}
                </span>
              </div>

              <div className="preview-row">
                <span>Attendance Time</span>

                <strong>
                  {formatAttendanceTime(
                    selectedAttendance.attendance_timestamp
                  )}
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