import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import "./openSession.css";

function OpenSession() {
  const navigate = useNavigate();

  // ================= SLOTS =================

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  // ================= ACTIVE SESSION =================

  const [activeSession, setActiveSession] = useState(() => {
    const savedSession = localStorage.getItem(
      "lecturerActiveSession"
    );

    if (!savedSession) {
      return null;
    }

    try {
      return JSON.parse(savedSession);
    } catch (error) {
      console.log("Invalid saved session:", error);
      localStorage.removeItem("lecturerActiveSession");
      return null;
    }
  });

  // =====================================================
  // GET LECTURER / TA SLOTS
  // =====================================================

  async function getMySlots() {
    try {
      const response = await api.get("/sessions/my-slots");

      console.log("My slots:", response.data);

      const slotsData = response.data || [];

      setSlots(slotsData);

      // =================================================
      // FIND ACTIVE SESSION FROM BACKEND
      // =================================================

      const openedSlot = slotsData.find(
        (slot) =>
          slot.session_id &&
          (
            slot.session_status === "open" ||
            slot.session_status === "active"
          )
      );

      if (openedSlot) {
        const sessionData = {
          sessionId: openedSlot.session_id,
          slotId: openedSlot.slot_id,
          startedAt: openedSlot.opened_at || null,
          sessionDate: openedSlot.session_date || null,
          status: openedSlot.session_status,
          rosterCount: openedSlot.roster_count || 0,
        };

        console.log(
          "Active session found from backend:",
          sessionData
        );

        localStorage.setItem(
          "lecturerActiveSession",
          JSON.stringify(sessionData)
        );

        setActiveSession(sessionData);

        // Select the active slot automatically
        setSelectedSlot(String(openedSlot.slot_id));
      } else {
        console.log("No active session found from backend.");

        // لو الـBackend بيقول مفيش Session مفتوحة،
        // نمسح الـSession القديمة من localStorage
        localStorage.removeItem("lecturerActiveSession");

        setActiveSession(null);
      }
    } catch (error) {
      console.log("My slots error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load your scheduled slots."
      );
    }
  }

  useEffect(() => {
    getMySlots();
  }, []);

  // =====================================================
  // OPEN SESSION
  // =====================================================

  async function handleOpenSession(e) {
    e.preventDefault();

    setMessage("");

    if (!selectedSlot) {
      setMessage("Please select a scheduled slot.");
      return;
    }

    if (activeSession) {
      setMessage("There is already an active attendance session.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/sessions/open", {
        slot_id: Number(selectedSlot),
      });

      console.log("Open session response:", response.data);

      const sessionData = {
        sessionId: response.data.session_id,
        slotId: response.data.slot_id,
        startedAt: response.data.opened_at,
        sessionDate: response.data.session_date,
        status: response.data.status,
        rosterCount: response.data.roster_count,
      };

      console.log("Session data:", sessionData);

      localStorage.setItem(
        "lecturerActiveSession",
        JSON.stringify(sessionData)
      );

      setActiveSession(sessionData);

      setMessage("Attendance session opened successfully.");

      // =================================================
      // GO TO QR PAGE
      // =================================================

      navigate("/lecturer/showqr", {
        state: {
          sessionId: response.data.session_id,
        },
      });
    } catch (error) {
      console.log("Open session error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to open attendance session."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // CLOSE SESSION
  // =====================================================

  async function handleCloseSession() {
    setMessage("");

    if (!activeSession?.sessionId) {
      setMessage("There is no active attendance session.");
      return;
    }

    const confirmClose = window.confirm(
      "Are you sure you want to close the current attendance session?"
    );

    if (!confirmClose) {
      return;
    }

    setClosing(true);

    try {
      console.log(
        "Closing session:",
        activeSession.sessionId
      );

      const response = await api.post(
        `/sessions/${activeSession.sessionId}/close`
      );

      console.log("Close session response:", response.data);

      // Remove local active session
      localStorage.removeItem("lecturerActiveSession");

      setActiveSession(null);
      setSelectedSlot("");

      setMessage(
        "Attendance session closed successfully."
      );

      // Refresh slots so backend state appears immediately
      await getMySlots();
    } catch (error) {
      console.log("Close session error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to close attendance session."
      );
    } finally {
      setClosing(false);
    }
  }

  // =====================================================
  // SELECTED SLOT
  // =====================================================

  const selectedSlotData = slots.find(
    (slot) =>
      String(slot.slot_id) === String(selectedSlot)
  );

  const activeSlotData = activeSession
    ? slots.find(
        (slot) =>
          String(slot.slot_id) ===
          String(activeSession.slotId)
      )
    : null;

  // =====================================================
  // REVIEW CORRECTIONS
  // =====================================================

  function handleReviewRequests() {
    navigate("/lecturer/corrections");
  }

  return (
    <section className="dashboard-content">

      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">
        <p className="page-small-title">
          ATTENDANCE MANAGEMENT
        </p>

        <h1>Open Attendance Session</h1>

        <p className="page-description">
          Select a scheduled class to open an attendance session
          for students.
        </p>
      </div>

      {/* ================= ACTIVE SESSION ================= */}

      {activeSession && activeSlotData && (
        <div className="active-session-card">

          <div className="active-session-info">

            <div className="active-session-icon">
              ●
            </div>

            <div>
              <span className="active-session-label">
                ACTIVE SESSION
              </span>

              <h2>
                {activeSlotData.course_name}
              </h2>

              <p>
                {activeSlotData.course_code} •{" "}
                {activeSlotData.section_name} •{" "}
                {activeSlotData.room_name}
              </p>
            </div>

          </div>

          <div className="active-session-actions">

            <button
              type="button"
              className="view-roster-button"
              onClick={() =>
                navigate("/lecturer/roster")
              }
            >
              View Live Roster
            </button>

            <button
              type="button"
              className="close-session-button"
              onClick={handleCloseSession}
              disabled={closing}
            >
              {closing
                ? "Closing Session..."
                : "Close Session"}
            </button>

          </div>

        </div>
      )}

      {/* ================= MAIN GRID ================= */}

      <div className="session-layout">

        {/* ================= LEFT CARD ================= */}

        <div className="session-card">

          <div className="session-card-header">

            <div>
              <h2>Start a Session</h2>

              <p>
                Select one of your scheduled teaching slots.
              </p>
            </div>

            <div className="session-header-icon">
              ▶
            </div>

          </div>

          <form onSubmit={handleOpenSession}>

            <div className="form-group">

              <label>
                Select Scheduled Slot
              </label>

              <select
                value={selectedSlot}
                onChange={(e) => {
                  setSelectedSlot(e.target.value);
                  setMessage("");
                }}
                disabled={Boolean(activeSession)}
              >

                <option value="">
                  Select Slot
                </option>

                {slots.map((slot) => (
                  <option
                    key={slot.slot_id}
                    value={slot.slot_id}
                  >
                    {slot.course_code} -{" "}
                    {slot.course_name} |{" "}
                    {slot.section_name} |{" "}
                    {slot.room_name} |{" "}
                    {slot.day_of_week} |{" "}
                    {slot.start_time} -{" "}
                    {slot.end_time}
                    {slot.is_today ? " | Today" : ""}
                  </option>
                ))}

              </select>

            </div>

            {/* ================= SELECTED SLOT ================= */}

            {selectedSlotData && (
              <div className="selected-slot">

                <div className="selected-slot-title">
                  Selected Class
                </div>

                <div className="selected-course">

                  <div className="course-icon">
                    {selectedSlotData.course_code?.slice(0, 2)}
                  </div>

                  <div>

                    <strong>
                      {selectedSlotData.course_name}
                    </strong>

                    <span>
                      {selectedSlotData.course_code}
                    </span>

                  </div>

                </div>

                <div className="slot-details">

                  <div>
                    <span>Section</span>

                    <strong>
                      {selectedSlotData.section_name || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Room</span>

                    <strong>
                      {selectedSlotData.room_name || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Day</span>

                    <strong>
                      {selectedSlotData.day_of_week || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Time</span>

                    <strong>
                      {selectedSlotData.start_time} -{" "}
                      {selectedSlotData.end_time}
                    </strong>
                  </div>

                </div>

              </div>
            )}

            {/* ================= MESSAGE ================= */}

            {message && (
              <div
                className={
                  message.includes("successfully")
                    ? "session-message success"
                    : "session-message error"
                }
              >

                <span>
                  {message.includes("successfully")
                    ? "✓"
                    : "!"}
                </span>

                <p>{message}</p>

              </div>
            )}

            {/* ================= OPEN BUTTON ================= */}

            <button
              className="open-session-button"
              type="submit"
              disabled={
                loading || Boolean(activeSession)
              }
            >

              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Opening Session...
                </>
              ) : activeSession ? (
                <>
                  <span>✓</span>
                  Session Already Active
                </>
              ) : (
                <>
                  <span>▶</span>
                  Open Attendance Session
                </>
              )}

            </button>

          </form>

        </div>

        {/* ================= RIGHT CARD ================= */}

        <div className="session-info-card">

          <div className="info-icon">
            i
          </div>

          <h2>
            How it works
          </h2>

          <div className="info-step">

            <div className="step-number">
              1
            </div>

            <div>
              <strong>
                Select your class
              </strong>

              <p>
                Choose a scheduled teaching slot from the list.
              </p>
            </div>

          </div>

          <div className="info-step">

            <div className="step-number">
              2
            </div>

            <div>
              <strong>
                Open the session
              </strong>

              <p>
                Start the attendance session for the selected class.
              </p>
            </div>

          </div>

          <div className="info-step">

            <div className="step-number">
              3
            </div>

            <div>
              <strong>
                Display the QR code
              </strong>

              <p>
                Students scan the rotating QR code to record attendance.
              </p>
            </div>

          </div>

          <div className="info-step">

            <div className="step-number">
              4
            </div>

            <div>
              <strong>
                Close the session
              </strong>

              <p>
                Review the attendance roster and close the session when
                the class is finished.
              </p>
            </div>

          </div>

          <div className="security-note">

            <span>
              ✓
            </span>

            <p>
              Only one active attendance session can be open at a time.
            </p>

          </div>

        </div>

      </div>

      {/* ================= SCHEDULED SESSIONS ================= */}

      <div className="sessions-table-card">

        <div className="sessions-table-header">

          <div>

            <h2>
              Scheduled Sessions
            </h2>

            <p>
              Your assigned teaching slots
            </p>

          </div>

          <span className="slot-count">
            {slots.length}{" "}
            {slots.length === 1 ? "Slot" : "Slots"}
          </span>

        </div>

        {slots.length === 0 ? (

          <div className="sessions-empty">

            <div className="empty-icon">
              ▣
            </div>

            <h3>
              No scheduled slots
            </h3>

            <p>
              There are no teaching slots assigned to you at the moment.
            </p>

          </div>

        ) : (

          <div className="sessions-table-wrapper">

            <table className="sessions-table">

              <thead>
                <tr>
                  <th>Course</th>
                  <th>Section</th>
                  <th>Room</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {slots.map((slot) => (

                  <tr key={slot.slot_id}>

                    <td>

                      <div className="course-cell">

                        <div className="course-icon">
                          {slot.course_code?.slice(0, 2)}
                        </div>

                        <div>

                          <strong>
                            {slot.course_name}
                          </strong>

                          <span>
                            {slot.course_code}
                          </span>

                        </div>

                      </div>

                    </td>

                    <td>
                      {slot.section_name || "—"}
                    </td>

                    <td>
                      {slot.room_name || "—"}
                    </td>

                    <td>
                      {slot.day_of_week || "—"}
                    </td>

                    <td>
                      {slot.start_time} -{" "}
                      {slot.end_time}
                    </td>

                    <td>

                      {activeSession &&
                      String(activeSession.slotId) ===
                        String(slot.slot_id) ? (

                        <span className="active-badge">
                          <span></span>
                          Active
                        </span>

                      ) : slot.is_today ? (

                        <span className="today-badge">
                          <span></span>
                          Today
                        </span>

                      ) : (

                        <span className="scheduled-badge">
                          Scheduled
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ================= QUICK ACTION ================= */}

      <div className="quick-action-card">

        <div>

          <div className="quick-action-icon">
            ✓
          </div>

          <div>

            <h3>
              Pending Correction Requests
            </h3>

            <p>
              Review attendance correction requests submitted by students.
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={handleReviewRequests}
        >
          Review Requests
          <span>→</span>
        </button>

      </div>

    </section>
  );
}

export default OpenSession;