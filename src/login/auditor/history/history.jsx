import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "./history.css";

function AuditorHistory() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function getAuditEvents() {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/audit-events");

      console.log("Audit events:", response.data);

      if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else if (Array.isArray(response.data?.events)) {
        setEvents(response.data.events);
      } else if (Array.isArray(response.data?.rows)) {
        setEvents(response.data.rows);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.log("Audit error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load audit history."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAuditEvents();
  }, []);

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString();
  }

  return (
    <section className="auditor-history-content">
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="auditor-history-page-header">
        <div>
          <span className="auditor-history-small-title">
            AUDIT
          </span>

          <h1>Audit History</h1>

          <p>
            Review system actions and changes recorded in the audit log.
          </p>
        </div>
      </div>

      {/* =========================
          MESSAGE
      ========================= */}
      {message && (
        <div className="auditor-history-message">
          <span>!</span>
          {message}
        </div>
      )}

      {/* =========================
          AUDIT CARD
      ========================= */}
      <section className="auditor-history-card">
        <div className="auditor-history-card-header">
          <div>
            <span className="auditor-history-section-label">
              SYSTEM ACTIVITY
            </span>

            <h2>Audit Events</h2>

            <p>
              A record of actions performed across the system.
            </p>
          </div>

          <div className="audit-events-count">
            <strong>{events.length}</strong>

            <span>
              {events.length === 1 ? " Event" : " Events"}
            </span>
          </div>
        </div>

        {/* =========================
            LOADING
        ========================= */}
        {loading ? (
          <div className="auditor-history-loading">
            <div className="loading-icon">◌</div>

            <h3>Loading audit events...</h3>

            <p>
              Getting the latest activity from the system.
            </p>
          </div>
        ) : events.length === 0 ? (
          /* =========================
             EMPTY
          ========================= */
          <div className="auditor-history-empty">
            <span>▤</span>

            <h3>No audit events found</h3>

            <p>
              There are currently no audit events to display.
            </p>
          </div>
        ) : (
          /* =========================
             TABLE
          ========================= */
          <div className="audit-table-wrapper">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>User</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event, index) => {
                  const entity =
                    event.entity_type && event.entity_id
                      ? `${event.entity_type} #${event.entity_id}`
                      : event.entity_type || "-";

                  return (
                    <tr key={event.audit_id || index}>
                      {/* ID */}
                      <td className="audit-id">
                        #{event.audit_id || "-"}
                      </td>

                      {/* ACTION */}
                      <td>
                        <span className="audit-action">
                          {event.action || "-"}
                        </span>
                      </td>

                      {/* ENTITY */}
                      <td>
                        <span className="audit-entity">
                          {entity}
                        </span>
                      </td>

                      {/* USER */}
                      <td>
                        <div className="audit-user">
                          <span className="audit-user-email">
                            {event.actor_email || "-"}
                          </span>

                          {event.actor_role && (
                            <span className="audit-user-role">
                              {event.actor_role}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="audit-date">
                        {formatDate(event.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}

export default AuditorHistory;