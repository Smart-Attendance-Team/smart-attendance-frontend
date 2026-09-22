import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "./history.css";

function AuditorHistory() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  async function getAuditEvents() {
    try {
      setLoading(true);

      const response = await api.get(
        "/audit-events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Audit events:", response.data);

      if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else if (Array.isArray(response.data.events)) {
        setEvents(response.data.events);
      } else if (Array.isArray(response.data.rows)) {
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
            Review system actions and changes recorded
            in the audit log.
          </p>
        </div>
      </div>

      {/* =========================
          MESSAGE
      ========================= */}
      {message && (
        <div className="auditor-history-message">
          {message}
        </div>
      )}

      {/* =========================
          AUDIT TABLE
      ========================= */}
      <section className="auditor-history-card">
        <div className="auditor-history-card-header">
          <div>
            <h2>Audit Events</h2>

            <p>
              A record of actions performed in the
              system.
            </p>
          </div>

          <span className="audit-events-count">
            {events.length}{" "}
            {events.length === 1 ? "Event" : "Events"}
          </span>
        </div>

        {loading ? (
          <div className="auditor-history-loading">
            <div className="loading-icon">
              ◌
            </div>

            <p>Loading audit events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="auditor-history-empty">
            <span>▤</span>

            <h3>No audit events found</h3>

            <p>
              There are currently no audit events to
              display.
            </p>
          </div>
        ) : (
          <div className="audit-table-wrapper">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Action</th>
                  <th>User</th>
                  <th>Before</th>
                  <th>After</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event, index) => (
                  <tr key={event.id || index}>
                    <td className="audit-id">
                      {event.id || "-"}
                    </td>

                    <td>
                      <span className="audit-action">
                        {event.action ||
                          event.event_type ||
                          event.event ||
                          "-"}
                      </span>
                    </td>

                    <td>
                      {event.user_id ||
                        event.userId ||
                        event.actor_id ||
                        "-"}
                    </td>

                    <td>
                      <div className="audit-value">
                        {event.before_value ||
                          event.before ||
                          "-"}
                      </div>
                    </td>

                    <td>
                      <div className="audit-value">
                        {event.after_value ||
                          event.after ||
                          "-"}
                      </div>
                    </td>

                    <td className="audit-date">
                      {event.created_at ||
                        event.timestamp ||
                        "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}

export default AuditorHistory;