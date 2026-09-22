import { useState } from "react";
import "./reportApproval.css";

function ReportApproval() {
  // BACKEND:
  // هنجيب الـreports من الـBackend لما نحدد endpoint الخاص بالـreport approval.
  // حاليًا البيانات تبدأ كـempty array بدل ما نحط mock reports.

  const [reports, setReports] = useState([]);

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [rejectReason, setRejectReason] =
    useState("");

  const [message, setMessage] = useState("");

  // =========================
  // Approve Report
  // =========================
  function handleApprove(id) {
    // BACKEND:
    // هنا هنستبدل الـlocal state بطلب للـBackend
    // مثل approve endpoint حسب الـAPI contract.

    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === id
          ? {
              ...report,
              status: "approved",
            }
          : report
      )
    );

    setSelectedReport(null);

    setMessage(
      "Report approved successfully."
    );
  }

  // =========================
  // Reject Report
  // =========================
  function handleReject(id) {
    if (!rejectReason.trim()) {
      setMessage(
        "Please enter a rejection reason."
      );
      return;
    }

    // BACKEND:
    // الـrejection reason لازم يتسجل مع الـreport
    // ويتم تسجيل الـaction في الـaudit trail.

    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === id
          ? {
              ...report,
              status: "rejected",
              rejection_reason:
                rejectReason.trim(),
            }
          : report
      )
    );

    setRejectReason("");
    setSelectedReport(null);

    setMessage("Report rejected.");
  }

  // =========================
  // Open Report Details
  // =========================
  function handleViewReport(report) {
    setRejectReason("");
    setMessage("");
    setSelectedReport(report);
  }

  // =========================
  // Close Details
  // =========================
  function handleCloseDetails() {
    setSelectedReport(null);
    setRejectReason("");
  }

  return (
    <section className="report-approval-content">
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="report-approval-page-header">
        <div>
          <span className="report-approval-small-title">
            ADMINISTRATION
          </span>

          <h1>Report Approval</h1>

          <p>
            Review and approve reports submitted by
            teaching assistants.
          </p>
        </div>
      </div>

      {/* =========================
          MESSAGE
      ========================= */}
      {message && (
        <div className="report-approval-message">
          {message}
        </div>
      )}

      {/* =========================
          REPORTS
      ========================= */}
      <section className="report-approval-card">
        <div className="report-approval-card-header">
          <div>
            <h2>Submitted Reports</h2>

            <p>
              Review reports and take the
              appropriate action.
            </p>
          </div>

          <span className="reports-count">
            {reports.length}{" "}
            {reports.length === 1
              ? "Report"
              : "Reports"}
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="report-approval-empty">
            <span>▤</span>

            <h3>No pending reports</h3>

            <p>
              There are currently no reports
              waiting for approval.
            </p>
          </div>
        ) : (
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Course</th>
                  <th>Section</th>
                  <th>Submitted By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="report-id">
                      #{report.id}
                    </td>

                    <td>
                      {report.course || "--"}
                    </td>

                    <td>
                      {report.section || "--"}
                    </td>

                    <td>
                      {report.submitted_by || "--"}
                    </td>

                    <td>
                      <span
                        className={`report-status status-${report.status}`}
                      >
                        {report.status}
                      </span>
                    </td>

                    <td>
                      <div className="report-actions">
                        <button
                          type="button"
                          className="report-view-button"
                          onClick={() =>
                            handleViewReport(
                              report
                            )
                          }
                        >
                          View
                        </button>

                        {report.status ===
                          "pending" && (
                          <>
                            <button
                              type="button"
                              className="report-approve-button"
                              onClick={() =>
                                handleApprove(
                                  report.id
                                )
                              }
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              className="report-reject-button"
                              onClick={() =>
                                handleViewReport(
                                  report
                                )
                              }
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =========================
          REPORT DETAILS
      ========================= */}
      {selectedReport && (
        <section className="report-details-card">
          <div className="report-details-header">
            <div>
              <span className="report-details-label">
                REPORT DETAILS
              </span>

              <h2>
                Report #{selectedReport.id}
              </h2>
            </div>

            <button
              type="button"
              className="report-close-button"
              onClick={handleCloseDetails}
            >
              ×
            </button>
          </div>

          {/* =========================
              DETAILS
          ========================= */}
          <div className="report-details-grid">
            <div className="report-detail-item">
              <span>Report ID</span>

              <strong>
                #{selectedReport.id}
              </strong>
            </div>

            <div className="report-detail-item">
              <span>Course</span>

              <strong>
                {selectedReport.course || "--"}
              </strong>
            </div>

            <div className="report-detail-item">
              <span>Section</span>

              <strong>
                {selectedReport.section || "--"}
              </strong>
            </div>

            <div className="report-detail-item">
              <span>Submitted By</span>

              <strong>
                {selectedReport.submitted_by ||
                  "--"}
              </strong>
            </div>

            <div className="report-detail-item">
              <span>Status</span>

              <span
                className={`report-status status-${selectedReport.status}`}
              >
                {selectedReport.status}
              </span>
            </div>
          </div>

          {/* =========================
              PENDING ACTIONS
          ========================= */}
          {selectedReport.status === "pending" && (
            <div className="report-pending-actions">
              <button
                type="button"
                className="report-details-approve-button"
                onClick={() =>
                  handleApprove(
                    selectedReport.id
                  )
                }
              >
                Approve Report
              </button>

              <div className="rejection-section">
                <label htmlFor="rejectReason">
                  Rejection Reason
                </label>

                <textarea
                  id="rejectReason"
                  placeholder="Enter the reason for rejecting this report..."
                  value={rejectReason}
                  onChange={(e) =>
                    setRejectReason(
                      e.target.value
                    )
                  }
                  rows="4"
                />

                <button
                  type="button"
                  className="reject-report-button"
                  onClick={() =>
                    handleReject(
                      selectedReport.id
                    )
                  }
                >
                  Reject Report
                </button>
              </div>
            </div>
          )}

          {/* =========================
              EXISTING REJECTION
          ========================= */}
          {selectedReport.rejection_reason && (
            <div className="existing-rejection">
              <span>
                Rejection Reason
              </span>

              <p>
                {selectedReport.rejection_reason}
              </p>
            </div>
          )}

          {/* =========================
              FOOTER
          ========================= */}
          <div className="report-details-footer">
            <button
              type="button"
              className="close-details-button"
              onClick={handleCloseDetails}
            >
              Close
            </button>
          </div>
        </section>
      )}
    </section>
  );
}

export default ReportApproval;