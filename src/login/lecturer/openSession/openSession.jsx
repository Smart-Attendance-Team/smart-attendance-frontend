import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import api from "../../../api/axios";
import "./openSession.css";

function OpenSession() {
  // const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // ================= MOCK DATA =================

  const [slots, setSlots] = useState([
    {
      slot_id: 1,
      course_code: "CS301",
      course_name: "Database",
      section_name: "Section A",
      room_name: "Lab 1",
      day_of_week: "Saturday",
      start_time: "10:00 AM",
      end_time: "12:00 PM",
      is_today: true,
    },
    {
      slot_id: 2,
      course_code: "CS302",
      course_name: "Web Development",
      section_name: "Section B",
      room_name: "Lab 2",
      day_of_week: "Sunday",
      start_time: "12:00 PM",
      end_time: "02:00 PM",
      is_today: false,
    },
    {
      slot_id: 3,
      course_code: "AI301",
      course_name: "Artificial Intelligence",
      section_name: "Section A",
      room_name: "Room 204",
      day_of_week: "Monday",
      start_time: "10:00 AM",
      end_time: "12:00 PM",
      is_today: false,
    },
    {
      slot_id: 4,
      course_code: "CS201",
      course_name: "Data Structures",
      section_name: "Section C",
      room_name: "Lab 3",
      day_of_week: "Tuesday",
      start_time: "02:00 PM",
      end_time: "04:00 PM",
      is_today: false,
    },
  ]);

  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= ACTIVE SESSION =================

  const [activeSession, setActiveSession] = useState(() => {
    const savedSession = localStorage.getItem("lecturerActiveSession");

    return savedSession ? JSON.parse(savedSession) : null;
  });

  // =====================================================
  // BACKEND VERSION
  // =====================================================

  /*
  async function getMySlots() {
    try {
      const response = await api.get("/sessions/my-slots", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("My slots:", response.data);

      setSlots(response.data);
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
  */

  // =====================================================
  // TEMPORARY MOCK VERSION
  // =====================================================

  useEffect(() => {
    console.log("Mock slots:", slots);
  }, [slots]);

  // =====================================================
  // OPEN SESSION
  // =====================================================

  function handleOpenSession(e) {
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

    // ===================================================
    // BACKEND VERSION
    // ===================================================

    /*
    async function openSession() {
      try {
        const response = await api.post(
          "/sessions/open",
          {
            slot_id: Number(selectedSlot),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Opened session:", response.data);

        const sessionId = response.data.session_id;

        if (!sessionId) {
          setMessage("Session opened but no session ID was returned.");
          return;
        }

        setMessage("Attendance session opened successfully.");

        navigate("/lecturer/showqr", {
          state: {
            sessionId: sessionId,
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

    openSession();
    */

    // ===================================================
    // TEMPORARY MOCK VERSION
    // ===================================================

    setTimeout(() => {
      const mockSessionId = 12345;

      const sessionData = {
        sessionId: mockSessionId,
        slotId: selectedSlot,
        startedAt: new Date().toISOString(),
      };

      console.log("Mock session opened:", sessionData);

      localStorage.setItem(
        "lecturerActiveSession",
        JSON.stringify(sessionData)
      );

      setActiveSession(sessionData);

      setMessage("Attendance session opened successfully.");

      navigate("/lecturer/showqr", {
        state: {
          sessionId: mockSessionId,
        },
      });

      setLoading(false);
    }, 700);
  }

  // =====================================================
  // CLOSE SESSION
  // =====================================================

  function handleCloseSession() {
    setMessage("");

    if (!activeSession) {
      setMessage("There is no active attendance session.");
      return;
    }

    const confirmClose = window.confirm(
      "Are you sure you want to close the current attendance session?"
    );

    if (!confirmClose) {
      return;
    }

    // ===================================================
    // BACKEND VERSION
    // ===================================================

    /*
    async function closeSession() {
      try {
        await api.post(
          "/sessions/close",
          {
            session_id: activeSession.sessionId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        localStorage.removeItem("lecturerActiveSession");

        setActiveSession(null);

        setMessage("Attendance session closed successfully.");
      } catch (error) {
        console.log("Close session error:", error);

        setMessage(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Failed to close attendance session."
        );
      }
    }

    closeSession();
    */

    // ===================================================
    // TEMPORARY MOCK VERSION
    // ===================================================

    localStorage.removeItem("lecturerActiveSession");

    setActiveSession(null);

    setMessage("Attendance session closed successfully.");
  }

  const selectedSlotData = slots.find(
    (slot) => String(slot.slot_id) === String(selectedSlot)
  );

  const activeSlotData = activeSession
    ? slots.find(
        (slot) =>
          String(slot.slot_id) === String(activeSession.slotId)
      )
    : null;

  return (
    <section className="dashboard-content">

      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">
        <p className="page-small-title">
          ATTENDANCE MANAGEMENT
        </p>

        <h1>Open Attendance Session</h1>

        <p className="page-description">
          Select a scheduled class to open an attendance session for
          students.
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
              onClick={() => navigate("/lecturer/roster")}
            >
              View Live Roster
            </button>

            <button
              type="button"
              className="close-session-button"
              onClick={handleCloseSession}
            >
              Close Session
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
              disabled={loading || Boolean(activeSession)}
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
          onClick={() =>
            navigate("/lecturer/corrections")
          }
        >
          Review Requests

          <span>
            →
          </span>

        </button>

      </div>

    </section>
  );
}

export default OpenSession;