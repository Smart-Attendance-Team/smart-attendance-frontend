import { useEffect, useState } from "react";
import {
  MdEditNote,
  MdFactCheck,
  MdCheckCircle,
  MdPending,
  MdCancel,
} from "react-icons/md";

import api from "../../../api/axios";
import "./myCorrection.css";

function MyCorrections() {
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =========================
  // Get My Corrections
  // =========================
  async function getMyCorrections() {
    setLoading(true);
    setMessage("");

    try {
      const response = await api.get("/corrections/mine");

      console.log("My corrections:", response.data);

      setCorrections(response.data);
    } catch (error) {
      console.log("My corrections error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load your correction requests."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMyCorrections();
  }, []);

  // =========================
  // Stats
  // =========================

  const totalRequests = corrections.length;

  const pendingRequests = corrections.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedRequests = corrections.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedRequests = corrections.filter(
    (item) => item.status === "rejected"
  ).length;

  // =========================
  // Format Status
  // =========================

  function formatStatus(status) {
    if (!status) return "";

    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  // =========================
  // Format Date
  // =========================

  function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  return (
    <main className="dashboard-content">
      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">
        <div>
          <p className="page-small-title">
            ATTENDANCE MANAGEMENT
          </p>

          <h1>
            My Corrections
          </h1>

          <p className="page-description">
            Track the status of your attendance correction requests.
          </p>
        </div>
      </div>

      {/* ================= MESSAGE ================= */}

      {message && (
        <div className="correction-message error">
          {message}
        </div>
      )}

      {/* ================= STATS ================= */}

      <div className="correction-stats">
        <div className="correction-stat-card">
          <div className="correction-stat-icon blue">
            <MdFactCheck />
          </div>

          <div>
            <span>
              Total Requests
            </span>

            <strong>
              {totalRequests}
            </strong>
          </div>
        </div>

        <div className="correction-stat-card">
          <div className="correction-stat-icon orange">
            <MdPending />
          </div>

          <div>
            <span>
              Pending
            </span>

            <strong>
              {pendingRequests}
            </strong>
          </div>
        </div>

        <div className="correction-stat-card">
          <div className="correction-stat-icon green">
            <MdCheckCircle />
          </div>

          <div>
            <span>
              Approved
            </span>

            <strong>
              {approvedRequests}
            </strong>
          </div>
        </div>

        <div className="correction-stat-card">
          <div className="correction-stat-icon red">
            <MdCancel />
          </div>

          <div>
            <span>
              Rejected
            </span>

            <strong>
              {rejectedRequests}
            </strong>
          </div>
        </div>
      </div>

      {/* ================= CORRECTIONS CARD ================= */}

      <div className="corrections-card">
        <div className="corrections-card-header">
          <div>
            <h2>
              Correction Requests
            </h2>

            <p>
              View all attendance correction requests you have submitted.
            </p>
          </div>

          <a
            href="/correction"
            className="new-correction-button"
          >
            <MdEditNote />
            Request Correction
          </a>
        </div>

        {/* ================= TABLE ================= */}

        <div className="corrections-table-wrapper">
          {loading ? (
            <div className="empty-preview">
              <h3>
                Loading correction requests...
              </h3>

              <p>
                Please wait while your requests are being loaded.
              </p>
            </div>
          ) : corrections.length === 0 ? (
            <div className="empty-preview">
              <div className="empty-preview-icon">
                <MdFactCheck />
              </div>

              <h3>
                No Correction Requests
              </h3>

              <p>
                You have not submitted any attendance correction requests yet.
              </p>
            </div>
          ) : (
            <table className="corrections-table">
              <thead>
                <tr>
                  <th>
                    Course
                  </th>

                  <th>
                    Session Date
                  </th>

                  <th>
                    Current Status
                  </th>

                  <th>
                    Requested Status
                  </th>

                  <th>
                    Reason
                  </th>

                  <th>
                    Request Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {corrections.map((item) => (
                  <tr key={item.request_id}>
                    {/* Course */}

                    <td>
                      <div className="correction-course">
                        <div className="correction-course-icon">
                          <MdFactCheck />
                        </div>

                        <div>
                          <strong>
                            Attendance #{item.attendance_id}
                          </strong>

                          <span>
                            Correction Request
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date */}

                    <td>
                      <span className="correction-date">
                        {formatDate(item.created_at)}
                      </span>
                    </td>

                    {/* Current Status */}

                    <td>
                      <span className="status-badge">
                        Attendance
                      </span>
                    </td>

                    {/* Requested Status */}

                    <td>
                      <span
                        className={`status-badge ${item.requested_status}`}
                      >
                        {formatStatus(item.requested_status)}
                      </span>
                    </td>

                    {/* Reason */}

                    <td>
                      <div className="correction-reason">
                        {item.reason}
                      </div>
                    </td>

                    {/* Request Status */}

                    <td>
                      <span
                        className={`request-status ${item.status}`}
                      >
                        {item.status === "pending" && (
                          <MdPending />
                        )}

                        {item.status === "approved" && (
                          <MdCheckCircle />
                        )}

                        {item.status === "rejected" && (
                          <MdCancel />
                        )}

                        {formatStatus(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ================= INFORMATION ================= */}

      <div className="correction-info">
        <div className="info-icon">
          i
        </div>

        <div>
          <h3>
            About Correction Requests
          </h3>

          <p>
            Your correction requests are reviewed by the teaching staff.
            Once a request is reviewed, its status will be updated to
            Approved or Rejected.
          </p>
        </div>
      </div>
    </main>
  );
}

export default MyCorrections;