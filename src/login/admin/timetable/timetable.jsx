import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "./timetable.css";

function AdminTimetable() {
  const [slots, setSlots] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Add form
  const [courseId, setCourseId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Edit form
  const [editingSlot, setEditingSlot] = useState(null);
  const [editRoomId, setEditRoomId] = useState("");
  const [editDay, setEditDay] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");

  const [message, setMessage] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // =========================
  // Load Courses / Sections / Rooms
  // =========================

  async function loadData() {
    try {
      const [coursesResponse, sectionsResponse, roomsResponse] =
        await Promise.all([
          api.get("/admin/courses"),
          api.get("/admin/sections"),
          api.get("/admin/rooms"),
        ]);

      setCourses(coursesResponse.data || []);
      setSections(sectionsResponse.data || []);
      setRooms(roomsResponse.data || []);
    } catch (error) {
      console.log("Timetable data error:", error);
      console.log("Response:", error.response);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load timetable data."
      );
    }
  }

  // =========================
  // Load Timetable Slots
  // =========================

  async function getSlots() {
    try {
      const response = await api.get("/admin/timetable-slots");

      console.log("Timetable slots:", response.data);

      setSlots(response.data || []);
    } catch (error) {
      console.log("Timetable slots error:", error);
      console.log("Response:", error.response);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load timetable slots."
      );
    }
  }

  useEffect(() => {
    loadData();
    getSlots();
  }, []);

  // =========================
  // Sections filtered by Course
  // =========================

  const filteredSections = courseId
    ? sections.filter(
        (section) => Number(section.course_id) === Number(courseId)
      )
    : sections;

  // =========================
  // Add Timetable Slot
  // =========================

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");

    if (
      !courseId ||
      !sectionId ||
      !roomId ||
      !day ||
      !startTime ||
      !endTime
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (endTime <= startTime) {
      setMessage("End time must be later than start time.");
      return;
    }

    const selectedSection = sections.find(
      (section) => Number(section.section_id) === Number(sectionId)
    );

    if (
      selectedSection &&
      Number(selectedSection.course_id) !== Number(courseId)
    ) {
      setMessage("Selected section does not belong to the selected course.");
      return;
    }

    try {
      await api.post("/admin/timetable-slots", {
        section_id: Number(sectionId),
        room_id: Number(roomId),
        day_of_week: day,
        start_time: startTime,
        end_time: endTime,
      });

      setMessage("Timetable slot added successfully.");

      setCourseId("");
      setSectionId("");
      setRoomId("");
      setDay("");
      setStartTime("");
      setEndTime("");

      await getSlots();
    } catch (error) {
      console.log("Add timetable error:", error);
      console.log("Response:", error.response);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to add timetable slot."
      );
    }
  }

  // =========================
  // Start Editing
  // =========================

  function startEdit(slot) {
    setEditingSlot(slot);

    setEditRoomId(slot.room_id);
    setEditDay(slot.day_of_week);
    setEditStartTime(slot.start_time);
    setEditEndTime(slot.end_time);

    setMessage("");
  }

  // =========================
  // Cancel Editing
  // =========================

  function cancelEdit() {
    setEditingSlot(null);

    setEditRoomId("");
    setEditDay("");
    setEditStartTime("");
    setEditEndTime("");
  }

  // =========================
  // Update Timetable Slot
  // =========================

  async function handleUpdate(event) {
    event.preventDefault();

    setMessage("");

    if (!editingSlot) {
      return;
    }

    if (
      !editRoomId ||
      !editDay ||
      !editStartTime ||
      !editEndTime
    ) {
      setMessage("Please fill in all edit fields.");
      return;
    }

    if (editEndTime <= editStartTime) {
      setMessage("End time must be later than start time.");
      return;
    }

    try {
      setUpdateLoading(true);

      await api.patch(
        `/admin/timetable-slots/${editingSlot.slot_id}`,
        {
          room_id: Number(editRoomId),
          day_of_week: editDay,
          start_time: editStartTime,
          end_time: editEndTime,
        }
      );

      setMessage("Timetable slot updated successfully.");

      cancelEdit();

      await getSlots();
    } catch (error) {
      console.log("Update timetable error:", error);
      console.log("Response:", error.response);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update timetable slot."
      );
    } finally {
      setUpdateLoading(false);
    }
  }

  // =========================
  // Delete Timetable Slot
  // =========================

  async function handleDelete(slotId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this timetable slot?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(true);
      setMessage("");

      await api.delete(`/admin/timetable-slots/${slotId}`);

      setMessage("Timetable slot deleted successfully.");

      if (editingSlot?.slot_id === slotId) {
        cancelEdit();
      }

      await getSlots();
    } catch (error) {
      console.log("Delete timetable error:", error);
      console.log("Response:", error.response);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to delete timetable slot."
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  // =========================
  // Helpers
  // =========================

  function getSection(slot) {
    return sections.find(
      (section) => Number(section.section_id) === Number(slot.section_id)
    );
  }

  function getCourseLabel(courseId) {
    const course = courses.find(
      (item) => Number(item.course_id) === Number(courseId)
    );

    if (!course) {
      return "Unknown Course";
    }

    return `${course.course_code} - ${course.course_name}`;
  }

  function getSectionLabel(sectionId) {
    const section = sections.find(
      (item) => Number(item.section_id) === Number(sectionId)
    );

    if (!section) {
      return "Unknown Section";
    }

    return section.section_name;
  }

  function getRoomLabel(roomId) {
    const room = rooms.find(
      (item) => Number(item.room_id) === Number(roomId)
    );

    if (!room) {
      return "Unknown Room";
    }

    return `${room.room_name}${room.building ? ` - ${room.building}` : ""}`;
  }

  function formatTime(time) {
    if (!time) {
      return "";
    }

    return time.slice(0, 5);
  }

  return (
    <section className="timetable-content">
      {/* ================= HEADER ================= */}

      <div className="timetable-page-header">
        <div>
          <span className="timetable-small-title">ADMINISTRATION</span>

          <h1>Timetable</h1>

          <p>
            Create and manage timetable slots for courses, sections, and rooms.
          </p>
        </div>
      </div>

      {/* ================= MESSAGE ================= */}

      {message && (
        <div className="timetable-message">
          {message}
        </div>
      )}

      {/* ================= ADD SLOT ================= */}

      <section className="timetable-card">
        <div className="timetable-section-header">
          <div>
            <h2>Add Timetable Slot</h2>

            <p>
              Create a new scheduled slot for a section.
            </p>
          </div>
        </div>

        <form
          className="timetable-form-grid"
          onSubmit={handleSubmit}
        >
          {/* Course */}

          <div className="timetable-form-group">
            <label>Course</label>

            <select
              value={courseId}
              onChange={(event) => {
                setCourseId(event.target.value);
                setSectionId("");
              }}
            >
              <option value="">Select Course</option>

              {courses.map((course) => (
                <option
                  key={course.course_id}
                  value={course.course_id}
                >
                  {course.course_code} - {course.course_name}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}

          <div className="timetable-form-group">
            <label>Section</label>

            <select
              value={sectionId}
              onChange={(event) =>
                setSectionId(event.target.value)
              }
              disabled={!courseId}
            >
              <option value="">
                {courseId
                  ? "Select Section"
                  : "Select Course First"}
              </option>

              {filteredSections.map((section) => (
                <option
                  key={section.section_id}
                  value={section.section_id}
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
              onChange={(event) =>
                setRoomId(event.target.value)
              }
            >
              <option value="">Select Room</option>

              {rooms.map((room) => (
                <option
                  key={room.room_id}
                  value={room.room_id}
                >
                  {room.room_name}
                  {room.building
                    ? ` - ${room.building}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Day */}

          <div className="timetable-form-group">
            <label>Day</label>

            <select
              value={day}
              onChange={(event) =>
                setDay(event.target.value)
              }
            >
              <option value="">Select Day</option>

              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
          </div>

          {/* Start */}

          <div className="timetable-form-group">
            <label>Start Time</label>

            <input
              type="time"
              value={startTime}
              onChange={(event) =>
                setStartTime(event.target.value)
              }
            />
          </div>

          {/* End */}

          <div className="timetable-form-group">
            <label>End Time</label>

            <input
              type="time"
              value={endTime}
              onChange={(event) =>
                setEndTime(event.target.value)
              }
            />
          </div>

          <div className="timetable-form-actions">
            <button
              type="submit"
              className="timetable-primary-button"
            >
              Add Timetable Slot
            </button>
          </div>
        </form>
      </section>

      {/* ================= EDIT SLOT ================= */}

      {editingSlot && (
        <section className="timetable-card timetable-edit-card">
          <div className="timetable-section-header">
            <div>
              <span className="timetable-edit-label">
                EDIT TIMETABLE SLOT
              </span>

              <h2>Edit Slot</h2>

              <p>
                Update the room, day, or time of this timetable slot.
              </p>
            </div>

            <button
              type="button"
              className="timetable-cancel-button"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>

          <div className="timetable-edit-info">
            <div>
              <span>Course</span>

              <strong>
                {getCourseLabel(
                  getSection(editingSlot)?.course_id
                )}
              </strong>
            </div>

            <div>
              <span>Section</span>

              <strong>
                {getSectionLabel(editingSlot.section_id)}
              </strong>
            </div>
          </div>

          <form
            className="timetable-form-grid"
            onSubmit={handleUpdate}
          >
            {/* Room */}

            <div className="timetable-form-group">
              <label>Room / Lab</label>

              <select
                value={editRoomId}
                onChange={(event) =>
                  setEditRoomId(event.target.value)
                }
              >
                <option value="">Select Room</option>

                {rooms.map((room) => (
                  <option
                    key={room.room_id}
                    value={room.room_id}
                  >
                    {room.room_name}
                    {room.building
                      ? ` - ${room.building}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Day */}

            <div className="timetable-form-group">
              <label>Day</label>

              <select
                value={editDay}
                onChange={(event) =>
                  setEditDay(event.target.value)
                }
              >
                <option value="">Select Day</option>

                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>

            {/* Start */}

            <div className="timetable-form-group">
              <label>Start Time</label>

              <input
                type="time"
                value={formatTime(editStartTime)}
                onChange={(event) =>
                  setEditStartTime(event.target.value)
                }
              />
            </div>

            {/* End */}

            <div className="timetable-form-group">
              <label>End Time</label>

              <input
                type="time"
                value={formatTime(editEndTime)}
                onChange={(event) =>
                  setEditEndTime(event.target.value)
                }
              />
            </div>

            <div className="timetable-form-actions">
              <button
                type="submit"
                className="timetable-primary-button"
                disabled={updateLoading}
              >
                {updateLoading
                  ? "Updating..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ================= SLOTS ================= */}

      <section className="timetable-card">
        <div className="timetable-section-header">
          <div>
            <h2>Current Timetable</h2>

            <p>
              All scheduled timetable slots.
            </p>
          </div>

          <span className="timetable-count">
            {slots.length} slot{slots.length !== 1 ? "s" : ""}
          </span>
        </div>

        {slots.length === 0 ? (
          <div className="timetable-empty-state">
            <span>◷</span>

            <h3>No timetable slots yet</h3>

            <p>
              Add a timetable slot to start building the schedule.
            </p>
          </div>
        ) : (
          <div className="slots-grid">
            {slots.map((slot) => {
              const section = getSection(slot);

              return (
                <div
                  className="slot-card"
                  key={slot.slot_id}
                >
                  <div className="slot-card-top">
                    <span className="slot-day">
                      {slot.day_of_week}
                    </span>

                    <span className="slot-time">
                      {formatTime(slot.start_time)} -{" "}
                      {formatTime(slot.end_time)}
                    </span>
                  </div>

                  <div className="slot-course">
                    {getCourseLabel(section?.course_id)}
                  </div>

                  <div className="slot-details">
                    <div>
                      <span>Section</span>

                      <strong>
                        {getSectionLabel(slot.section_id)}
                      </strong>
                    </div>

                    <div>
                      <span>Room / Lab</span>

                      <strong>
                        {getRoomLabel(slot.room_id)}
                      </strong>
                    </div>
                  </div>

                  <div className="slot-actions">
                    <button
                      type="button"
                      className="timetable-edit-button"
                      onClick={() => startEdit(slot)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="timetable-delete-button"
                      onClick={() =>
                        handleDelete(slot.slot_id)
                      }
                      disabled={deleteLoading}
                    >
                      {deleteLoading
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}

export default AdminTimetable;