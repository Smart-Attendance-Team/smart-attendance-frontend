import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "./timetable.css";

function Timetable() {
  const token = localStorage.getItem("token");

  const [slots, setSlots] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [courseId, setCourseId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [roomId, setRoomId] = useState("");

  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        coursesResponse,
        sectionsResponse,
        roomsResponse,
      ] = await Promise.all([
        api.get("/admin/courses", { headers }),
        api.get("/admin/sections", { headers }),
        api.get("/admin/rooms", { headers }),
      ]);

      setCourses(coursesResponse.data);
      setSections(sectionsResponse.data);
      setRooms(roomsResponse.data);
    } catch (error) {
      console.log("Load timetable data error:", error);

      setMessage(
        error.response?.data?.error ||
          "Failed to load timetable data."
      );
    }
  }

  async function getSlots() {
    try {
      const response = await api.get(
        "/admin/timetable-slots",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Timetable:", response.data);

      setSlots(response.data);
    } catch (error) {
      console.log("Timetable error:", error);

      setMessage(
        error.response?.data?.error ||
          "Failed to load timetable."
      );
    }
  }

  useEffect(() => {
    loadData();
    getSlots();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");

    if (
      !courseId ||
      !sectionId ||
      !roomId ||
      !day ||
      !startTime ||
      !endTime
    ) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      const response = await api.post(
        "/admin/timetable-slots",
        {
          course_id: Number(courseId),
          section_id: Number(sectionId),
          room_id: Number(roomId),
          day_of_week: day,
          start_time: startTime,
          end_time: endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Created timetable:", response.data);

      setMessage(
        "Timetable slot created successfully."
      );

      setCourseId("");
      setSectionId("");
      setRoomId("");
      setDay("");
      setStartTime("");
      setEndTime("");

      getSlots();
    } catch (error) {
      console.log("Create timetable error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to create timetable slot."
      );
    }
  }

  return (
    <section className="timetable-content">
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="timetable-page-header">
        <div>
          <span className="timetable-small-title">
            ADMINISTRATION
          </span>

          <h1>Timetable</h1>

          <p>
            Create and manage timetable slots for
            courses and sections.
          </p>
        </div>
      </div>

      {/* =========================
          MESSAGE
      ========================= */}
      {message && (
        <div className="timetable-message">
          {message}
        </div>
      )}

      {/* =========================
          ADD SLOT
      ========================= */}
      <section className="timetable-card">
        <div className="timetable-card-header">
          <div>
            <h2>Add Timetable Slot</h2>

            <p>
              Assign a course, section, room, day,
              and time.
            </p>
          </div>
        </div>

        <form
          className="timetable-form"
          onSubmit={handleSubmit}
        >
          <div className="timetable-form-grid">
            {/* Course */}
            <div className="timetable-form-group">
              <label>Course</label>

              <select
                value={courseId}
                onChange={(e) =>
                  setCourseId(e.target.value)
                }
              >
                <option value="">
                  Select Course
                </option>

                {courses.map((course) => (
                  <option
                    key={course.id}
                    value={course.id}
                  >
                    {course.course_code} -{" "}
                    {course.course_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div className="timetable-form-group">
              <label>Section</label>

              <select
                value={sectionId}
                onChange={(e) =>
                  setSectionId(e.target.value)
                }
              >
                <option value="">
                  Select Section
                </option>

                {sections.map((section) => (
                  <option
                    key={section.id}
                    value={section.id}
                  >
                    {section.section_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Room */}
            <div className="timetable-form-group">
              <label>Room / Lab</label>

              <select
                value={roomId}
                onChange={(e) =>
                  setRoomId(e.target.value)
                }
              >
                <option value="">
                  Select Room
                </option>

                {rooms.map((room) => (
                  <option
                    key={room.id}
                    value={room.id}
                  >
                    {room.room_code} -{" "}
                    {room.room_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Day */}
            <div className="timetable-form-group">
              <label>Day</label>

              <select
                value={day}
                onChange={(e) =>
                  setDay(e.target.value)
                }
              >
                <option value="">
                  Select Day
                </option>

                <option value="Sunday">
                  Sunday
                </option>

                <option value="Monday">
                  Monday
                </option>

                <option value="Tuesday">
                  Tuesday
                </option>

                <option value="Wednesday">
                  Wednesday
                </option>

                <option value="Thursday">
                  Thursday
                </option>

                <option value="Saturday">
                  Saturday
                </option>
              </select>
            </div>

            {/* Start Time */}
            <div className="timetable-form-group">
              <label>Start Time</label>

              <input
                type="time"
                value={startTime}
                onChange={(e) =>
                  setStartTime(e.target.value)
                }
              />
            </div>

            {/* End Time */}
            <div className="timetable-form-group">
              <label>End Time</label>

              <input
                type="time"
                value={endTime}
                onChange={(e) =>
                  setEndTime(e.target.value)
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="timetable-button"
          >
            Add Timetable Slot
          </button>
        </form>
      </section>

      {/* =========================
          TIMETABLE SLOTS
      ========================= */}
      <section className="timetable-card">
        <div className="timetable-card-header">
          <div>
            <h2>Timetable Slots</h2>

            <p>
              Current scheduled timetable slots.
            </p>
          </div>

          <span className="slots-count">
            {slots.length}{" "}
            {slots.length === 1 ? "Slot" : "Slots"}
          </span>
        </div>

        {slots.length === 0 ? (
          <div className="timetable-empty">
            <span>▦</span>

            <p>No timetable slots found.</p>
          </div>
        ) : (
          <div className="slots-grid">
            {slots.map((slot) => (
              <div
                className="slot-card"
                key={slot.id}
              >
                <div className="slot-card-top">
                  <span className="slot-day">
                    {slot.day_of_week}
                  </span>

                  <span className="slot-time">
                    {slot.start_time} -{" "}
                    {slot.end_time}
                  </span>
                </div>

                <div className="slot-details">
                  <div className="slot-detail">
                    <span className="slot-label">
                      Course ID
                    </span>

                    <strong>
                      {slot.course_id}
                    </strong>
                  </div>

                  <div className="slot-detail">
                    <span className="slot-label">
                      Section ID
                    </span>

                    <strong>
                      {slot.section_id}
                    </strong>
                  </div>

                  <div className="slot-detail">
                    <span className="slot-label">
                      Room ID
                    </span>

                    <strong>
                      {slot.room_id}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default Timetable;