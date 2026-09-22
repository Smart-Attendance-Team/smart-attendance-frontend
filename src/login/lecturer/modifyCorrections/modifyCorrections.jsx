import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import "./modifyCorrections.css";

function PendingCorrections() {
  const navigate = useNavigate();

  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewReason, setReviewReason] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // ================= GET PENDING CORRECTIONS =================

  async function getPendingCorrections() {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/corrections/pending");

      console.log("Pending corrections response:", response.data);

      const formattedCorrections = (response.data || []).map((item) => ({
        id: item.request_id,
        requestId: item.request_id,
        attendanceId: item.attendance_id,
        student_name: item.student_name,
        student_code: item.student_code,
        course: item.course_code,
        code: item.course_code,
        date: item.session_date,
        currentStatus: item.current_status,
        requestedStatus: item.requested_status,
        reason: item.reason,
        evidence_url: item.evidence_url,
        createdAt: item.created_at,
        status: "Pending",
      }));

      setCorrections(formattedCorrections);
    } catch (error) {
      console.log("Pending corrections error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load correction requests."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPendingCorrections();
  }, []);

  // ================= REVIEW =================

  async function handleReview(requestId, decision) {
    if (!reviewReason.trim()) {
      setMessage("Review reason is required.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await api.patch(
        `/corrections/${requestId}`,
        {
          decision,
          review_reason: reviewReason.trim(),
        }
      );

      console.log("Review response:", response.data);

      const newStatus =
        decision === "approved"
          ? "Approved"
          : "Rejected";

      setCorrections((previousCorrections) =>
        previousCorrections.map((item) =>
          item.requestId === requestId
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

      setMessage(
        `Correction ${
          decision === "approved"
            ? "approved"
            : "rejected"
        } successfully.`
      );

      setReviewingId(null);
      setReviewReason("");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (error) {
      console.log("Review correction error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to review correction request."
      );
    } finally {
      setSaving(false);
    }
  }

  // ================= COUNTS =================

  const pendingCorrections = corrections.filter(
    (item) => item.status === "Pending"
  );

  const approvedCount = corrections.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = corrections.filter(
    (item) => item.status === "Rejected"
  ).length;

  // ================= HELPERS =================

  function formatStatus(status) {
    if (!status) return "—";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  }

  function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <section className="dashboard-content">

      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">

        <div>
          <span className="page-small-title">
            ATTENDANCE MANAGEMENT
          </span>

          <h1>Pending Corrections</h1>

          <p className="page-description">
            Review and manage student attendance correction requests.
          </p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/lecturer")}
        >
          ← Back to Session
        </button>

      </div>

      {/* ================= MESSAGE ================= */}

      {message && (
        <div className="system-message success">
          <span>✓</span>
          <p>{message}</p>
        </div>
      )}

      {/* ================= STATS ================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon orange">!</div>

          <div>
            <span>Pending</span>
            <strong>{pendingCorrections.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">✓</div>

          <div>
            <span>Approved</span>
            <strong>{approvedCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">×</div>

          <div>
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">↗</div>

          <div>
            <span>Total Requests</span>
            <strong>{corrections.length}</strong>
          </div>
        </div>

      </div>

      {/* ================= CORRECTIONS CARD ================= */}

      <div className="corrections-card">

        <div className="card-header">

          <div>
            <h2>Correction Requests</h2>

            <p>
              Student requests waiting for lecturer review
            </p>
          </div>

          <span className="pending-count">
            {pendingCorrections.length} Pending
          </span>

        </div>

        {loading ? (
          <div className="empty-state">
            <h3>Loading correction requests...</h3>
          </div>
        ) : corrections.length === 0 ? (
          <div className="empty-state">

            <div className="empty-icon">✓</div>

            <h3>No correction requests</h3>

            <p>
              There are currently no attendance correction requests.
            </p>

          </div>
        ) : (
          <div className="table-wrapper">

            <table className="corrections-table">

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Current</th>
                  <th>Requested</th>
                  <th>Reason</th>
                  <th>Evidence</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {corrections.map((item) => {

                  const initials = item.student_name
                    ? item.student_name
                        .split(" ")
                        .map((name) => name[0])
                        .slice(0, 2)
                        .join("")
                    : "?";

                  return (
                    <tr key={item.requestId}>

                      {/* STUDENT */}

                      <td>

                        <div className="student-cell">

                          <div className="student-avatar">
                            {initials}
                          </div>

                          <div>

                            <strong>
                              {item.student_name}
                            </strong>

                            <span>
                              {item.student_code}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* COURSE */}

                      <td>

                        <div className="course-cell">

                          <strong>
                            {item.course}
                          </strong>

                          <span>
                            {item.code}
                          </span>

                        </div>

                      </td>

                      {/* DATE */}

                      <td>

                        <span className="date-text">
                          {formatDate(item.date)}
                        </span>

                      </td>

                      {/* CURRENT STATUS */}

                      <td>

                        <span
                          className={`status-badge ${item.currentStatus}`}
                        >
                          {formatStatus(item.currentStatus)}
                        </span>

                      </td>

                      {/* REQUESTED STATUS */}

                      <td>

                        <span
                          className={`status-badge requested ${item.requestedStatus}`}
                        >
                          {formatStatus(item.requestedStatus)}
                        </span>

                      </td>

                      {/* REASON */}

                      <td>

                        <div className="reason-cell">
                          {item.reason || "—"}
                        </div>

                      </td>

                      {/* EVIDENCE */}

                      <td>

                        {item.evidence_url ? (
                          <a
                            href={item.evidence_url}
                            target="_blank"
                            rel="noreferrer"
                            className="evidence-link"
                          >
                            View Evidence
                          </a>
                        ) : (
                          <span>-</span>
                        )}

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`request-status ${item.status.toLowerCase()}`}
                        >

                          <span className="status-dot"></span>

                          {item.status}

                        </span>

                      </td>

                      {/* ACTION */}

                      <td>

                        {item.status === "Pending" ? (

                          reviewingId === item.requestId ? (

                            <div className="review-box">

                              <input
                                type="text"
                                placeholder="Review reason"
                                value={reviewReason}
                                onChange={(event) =>
                                  setReviewReason(
                                    event.target.value
                                  )
                                }
                                disabled={saving}
                              />

                              <div className="review-actions">

                                <button
                                  type="button"
                                  className="approve-button"
                                  onClick={() =>
                                    handleReview(
                                      item.requestId,
                                      "approved"
                                    )
                                  }
                                  disabled={saving}
                                >
                                  {saving
                                    ? "..."
                                    : "Approve"}
                                </button>

                                <button
                                  type="button"
                                  className="reject-button"
                                  onClick={() =>
                                    handleReview(
                                      item.requestId,
                                      "rejected"
                                    )
                                  }
                                  disabled={saving}
                                >
                                  {saving
                                    ? "..."
                                    : "Reject"}
                                </button>

                                <button
                                  type="button"
                                  className="cancel-button"
                                  onClick={() => {
                                    if (saving) return;

                                    setReviewingId(null);
                                    setReviewReason("");
                                    setMessage("");
                                  }}
                                  disabled={saving}
                                >
                                  Cancel
                                </button>

                              </div>

                            </div>

                          ) : (

                            <button
                              type="button"
                              className="review-button"
                              onClick={() => {
                                setReviewingId(
                                  item.requestId
                                );
                                setReviewReason("");
                                setMessage("");
                              }}
                            >
                              Review
                            </button>

                          )

                        ) : (

                          <span className="reviewed-text">
                            Reviewed
                          </span>

                        )}

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ================= REVIEW INFO ================= */}

      <div className="review-info">

        <div className="info-icon">i</div>

        <div>

          <strong>Review Guidelines</strong>

          <p>
            A review reason is required when approving or
            rejecting a correction request. Approved requests
            will update the student's attendance record.
          </p>

        </div>

      </div>

    </section>
  );
}

export default PendingCorrections;