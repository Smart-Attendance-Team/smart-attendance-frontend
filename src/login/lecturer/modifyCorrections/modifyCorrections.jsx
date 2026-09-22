import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./modifyCorrections.css";

// Backend
// import api from "../../../api/axios";

function PendingCorrections() {
  const navigate = useNavigate();

  const [corrections, setCorrections] = useState([
    {
      id: 1,
      student_name: "Ahmed Mohamed",
      student_code: "20230101",
      course: "Database",
      code: "CS301",
      date: "Sep 21, 2026",
      currentStatus: "Absent",
      requestedStatus: "Present",
      reason:
        "I attended the lecture but my attendance was not recorded.",
      evidence_url: "",
      status: "Pending",
    },
    {
      id: 2,
      student_name: "Sara Ahmed",
      student_code: "20230115",
      course: "Web Development",
      code: "CS302",
      date: "Sep 20, 2026",
      currentStatus: "Late",
      requestedStatus: "Present",
      reason: "The QR scanner failed during the session.",
      evidence_url: "",
      status: "Pending",
    },
    {
      id: 3,
      student_name: "Omar Khaled",
      student_code: "20230128",
      course: "Artificial Intelligence",
      code: "AI301",
      date: "Sep 19, 2026",
      currentStatus: "Absent",
      requestedStatus: "Excused",
      reason: "I had an approved academic activity.",
      evidence_url: "https://example.com/evidence",
      status: "Pending",
    },
    {
      id: 4,
      student_name: "Mariam Ali",
      student_code: "20230204",
      course: "Data Structures",
      code: "CS201",
      date: "Sep 18, 2026",
      currentStatus: "Absent",
      requestedStatus: "Present",
      reason:
        "I attended the lab session but forgot to scan the QR code.",
      evidence_url: "",
      status: "Pending",
    },
  ]);

  const [reviewingId, setReviewingId] = useState(null);
  const [reviewReason, setReviewReason] = useState("");
  const [message, setMessage] = useState("");

  const pendingCorrections = corrections.filter(
    (item) => item.status === "Pending"
  );

  const approvedCount = corrections.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = corrections.filter(
    (item) => item.status === "Rejected"
  ).length;

  function handleReview(id, decision) {
    if (!reviewReason.trim()) {
      setMessage("Review reason is required.");
      return;
    }

    setCorrections((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                decision === "approved"
                  ? "Approved"
                  : "Rejected",
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

        {corrections.length === 0 ? (
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
                    .split(" ")
                    .map((name) => name[0])
                    .slice(0, 2)
                    .join("");

                  return (
                    <tr key={item.id}>
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

                      <td>
                        <div className="course-cell">
                          <strong>{item.course}</strong>

                          <span>{item.code}</span>
                        </div>
                      </td>

                      <td>
                        <span className="date-text">
                          {item.date}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${item.currentStatus.toLowerCase()}`}
                        >
                          {item.currentStatus}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge requested ${item.requestedStatus.toLowerCase()}`}
                        >
                          {item.requestedStatus}
                        </span>
                      </td>

                      <td>
                        <div className="reason-cell">
                          {item.reason}
                        </div>
                      </td>

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

                      <td>
                        <span
                          className={`request-status ${item.status.toLowerCase()}`}
                        >
                          <span className="status-dot"></span>
                          {item.status}
                        </span>
                      </td>

                      <td>
                        {item.status === "Pending" ? (
                          reviewingId === item.id ? (
                            <div className="review-box">
                              <input
                                type="text"
                                placeholder="Review reason"
                                value={reviewReason}
                                onChange={(e) =>
                                  setReviewReason(
                                    e.target.value
                                  )
                                }
                              />

                              <div className="review-actions">
                                <button
                                  className="approve-button"
                                  onClick={() =>
                                    handleReview(
                                      item.id,
                                      "approved"
                                    )
                                  }
                                >
                                  Approve
                                </button>

                                <button
                                  className="reject-button"
                                  onClick={() =>
                                    handleReview(
                                      item.id,
                                      "rejected"
                                    )
                                  }
                                >
                                  Reject
                                </button>

                                <button
                                  className="cancel-button"
                                  onClick={() => {
                                    setReviewingId(null);
                                    setReviewReason("");
                                    setMessage("");
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              className="review-button"
                              onClick={() => {
                                setReviewingId(item.id);
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
            A review reason is required when approving or rejecting
            a correction request. Approved requests will update the
            student's attendance record.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PendingCorrections;