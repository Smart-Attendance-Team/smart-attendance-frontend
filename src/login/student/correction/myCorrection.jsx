import React from "react";
import {
  MdEditNote,
  MdFactCheck,
  MdCheckCircle,
  MdPending,
  MdCancel,
} from "react-icons/md";

import "./myCorrection.css";

const corrections = [
  {
    id: 1,
    course: "Database",
    code: "CS301",
    date: "Sep 21, 2026",
    currentStatus: "Absent",
    requestedStatus: "Present",
    reason:
      "I attended the lecture but my attendance was not recorded.",
    status: "Pending",
  },
  {
    id: 2,
    course: "Web Development",
    code: "CS302",
    date: "Sep 18, 2026",
    currentStatus: "Late",
    requestedStatus: "Present",
    reason:
      "The QR scanner failed during the session.",
    status: "Approved",
  },
  {
    id: 3,
    course: "Artificial Intelligence",
    code: "AI301",
    date: "Sep 15, 2026",
    currentStatus: "Absent",
    requestedStatus: "Excused",
    reason:
      "I had an approved academic activity.",
    status: "Rejected",
  },
];

function MyCorrections() {
  const totalRequests = corrections.length;

  const pendingRequests = corrections.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedRequests = corrections.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedRequests = corrections.filter(
    (item) => item.status === "Rejected"
  ).length;

  return (
    <main className="dashboard-content">
      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">
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
                <tr key={item.id}>
                  {/* Course */}

                  <td>
                    <div className="correction-course">
                      <div className="correction-course-icon">
                        <MdFactCheck />
                      </div>

                      <div>
                        <strong>
                          {item.course}
                        </strong>

                        <span>
                          {item.code}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Date */}

                  <td>
                    <span className="correction-date">
                      {item.date}
                    </span>
                  </td>

                  {/* Current Status */}

                  <td>
                    <span
                      className={`status-badge ${item.currentStatus.toLowerCase()}`}
                    >
                      {item.currentStatus}
                    </span>
                  </td>

                  {/* Requested Status */}

                  <td>
                    <span
                      className={`status-badge ${item.requestedStatus.toLowerCase()}`}
                    >
                      {item.requestedStatus}
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
                      className={`request-status ${item.status.toLowerCase()}`}
                    >
                      {item.status === "Pending" && (
                        <MdPending />
                      )}

                      {item.status === "Approved" && (
                        <MdCheckCircle />
                      )}

                      {item.status === "Rejected" && (
                        <MdCancel />
                      )}

                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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