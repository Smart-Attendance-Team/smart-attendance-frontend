import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "./management.css";

function Management() {
  const token = localStorage.getItem("token");

  // =========================
  // Data
  // =========================
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [sections, setSections] = useState([]);
  const [staff, setStaff] = useState([]);

  // =========================
  // Course
  // =========================
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");

  // =========================
  // Room
  // =========================
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");

  // =========================
  // Section
  // =========================
  const [sectionName, setSectionName] = useState("");
  const [courseId, setCourseId] = useState("");

  
  const [studentId, setStudentId] = useState("");
  const [enrollmentSectionId, setEnrollmentSectionId] = useState("");

  
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffRole, setStaffRole] = useState("lecturer");

  
  const [csvFile, setCsvFile] = useState(null);
  const [defaultPassword, setDefaultPassword] = useState("");
  const [importSectionId, setImportSectionId] = useState("");
  const [importDepartmentId, setImportDepartmentId] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [importResult, setImportResult] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

 
  const [message, setMessage] = useState("");

  
  async function loadData() {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        coursesResponse,
        roomsResponse,
        sectionsResponse,
      ] = await Promise.all([
        api.get("/admin/courses", { headers }),
        api.get("/admin/rooms", { headers }),
        api.get("/admin/sections", { headers }),
      ]);

      const coursesData = Array.isArray(coursesResponse.data)
        ? coursesResponse.data
        : coursesResponse.data.courses || [];

      const roomsData = Array.isArray(roomsResponse.data)
        ? roomsResponse.data
        : roomsResponse.data.rooms || [];

      const sectionsData = Array.isArray(sectionsResponse.data)
        ? sectionsResponse.data
        : sectionsResponse.data.sections || [];

      console.log("COURSES:", coursesData);
      console.log("ROOMS:", roomsData);
      console.log("SECTIONS FROM BACKEND:", sectionsData);

      setCourses(coursesData);
      setRooms(roomsData);
      setSections(sectionsData);
    } catch (error) {
      console.log("Management load error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load management data."
      );
    }
  }

  
  async function loadStaff() {
    try {
      const response = await api.get("/admin/staff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Teaching staff:", response.data);

      if (Array.isArray(response.data)) {
        setStaff(response.data);
      } else if (Array.isArray(response.data.staff)) {
        setStaff(response.data.staff);
      } else {
        setStaff([]);
      }
    } catch (error) {
      console.log("Teaching staff error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setStaff([]);
    }
  }

  useEffect(() => {
    loadData();
    loadStaff();
  }, []);

  
  async function handleAddCourse(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await api.post(
        "/admin/courses",
        {
          course_code: courseCode,
          course_name: courseName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Course added:", response.data);

      setMessage("Course added successfully.");

      setCourseCode("");
      setCourseName("");

      loadData();
    } catch (error) {
      console.log("Add course error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to add course."
      );
    }
  }


  async function handleAddRoom(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await api.post(
        "/admin/rooms",
        {
          room_code: roomCode,
          room_name: roomName,
          capacity: Number(capacity),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Room added:", response.data);

      setMessage("Room / Lab added successfully.");

      setRoomCode("");
      setRoomName("");
      setCapacity("");

      loadData();
    } catch (error) {
      console.log("Add room error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to add room / lab."
      );
    }
  }


  async function handleAddSection(e) {
    e.preventDefault();
    setMessage("");

    if (!courseId) {
      setMessage("Please select a course.");
      return;
    }

    try {
      const response = await api.post(
        "/admin/sections",
        {
          section_name: sectionName,
          course_id: Number(courseId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Section added:", response.data);

      setMessage("Section added successfully.");

      setSectionName("");
      setCourseId("");

      loadData();
    } catch (error) {
      console.log("Add section error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to add section."
      );
    }
  }

  async function handleEnrollment(e) {
    e.preventDefault();
    setMessage("");

    if (!studentId || !enrollmentSectionId) {
      setMessage(
        "Please enter Student ID and select a section."
      );
      return;
    }

    try {
      const response = await api.post(
        "/admin/enrollments",
        {
          student_id: Number(studentId),
          section_id: Number(enrollmentSectionId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Enrollment:", response.data);

      setMessage("Student enrolled successfully.");

      setStudentId("");
      setEnrollmentSectionId("");
    } catch (error) {
      console.log("Enrollment error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to enroll student."
      );
    }
  }

  async function handleAddStaff(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await api.post(
        "/admin/staff",
        {
          name: staffName,
          email: staffEmail,
          role: staffRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Staff added:", response.data);

      setMessage("Teaching staff added successfully.");

      setStaffName("");
      setStaffEmail("");
      setStaffRole("lecturer");

      loadStaff();
    } catch (error) {
      console.log("Add staff error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to add teaching staff."
      );
    }
  }
  async function handleStudentImport(e) {
    e.preventDefault();

    setImportMessage("");
    setImportResult(null);

    if (!csvFile) {
      setImportMessage("Please select a CSV file.");
      return;
    }

    if (!defaultPassword.trim()) {
      setImportMessage("Please enter a default password.");
      return;
    }

    setImportLoading(true);

    try {
      const csvText = await csvFile.text();

      console.log("CSV file:", csvFile);
      console.log("CSV content:", csvText);
      console.log("CSV length:", csvText.length);

      if (!csvText.trim()) {
        setImportMessage("The CSV file is empty.");
        return;
      }

      const params = new URLSearchParams();

      params.append(
        "default_password",
        defaultPassword
      );

      if (importSectionId) {
        const selectedSection = sections.find((section) => {
          const id =
            section.id ??
            section.section_id ??
            section.sectionId;

          return String(id) === String(importSectionId);
        });

        console.log(
          "SELECTED SECTION OBJECT:",
          selectedSection
        );

        if (!selectedSection) {
          setImportMessage(
            "Could not find the selected section."
          );
          return;
        }

        const realSectionId =
          selectedSection.id ??
          selectedSection.section_id ??
          selectedSection.sectionId;

        console.log("REAL SECTION ID:", realSectionId);

        const sectionNumber = Number(realSectionId);

        console.log("SECTION NUMBER:", sectionNumber);
        console.log(
          "SECTION NUMBER TYPE:",
          typeof sectionNumber
        );

        if (!Number.isInteger(sectionNumber)) {
          setImportMessage(
            "The selected section does not have a valid numeric ID."
          );
          return;
        }

        params.append(
          "section_id",
          String(sectionNumber)
        );
      }

      if (importDepartmentId) {
        const departmentNumber = Number(
          importDepartmentId
        );

        if (!Number.isInteger(departmentNumber)) {
          setImportMessage(
            "Department ID must be a number."
          );
          return;
        }

        params.append(
          "department_id",
          String(departmentNumber)
        );
      }

      console.log(
        "FINAL IMPORT URL:",
        `/admin/imports/students?${params.toString()}`
      );

      const response = await api.post(
        `/admin/imports/students?${params.toString()}`,
        csvText,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/csv",
          },
        }
      );

      console.log(
        "STUDENT IMPORT RESPONSE:",
        response.data
      );

      setImportResult(response.data);
      setImportMessage(
        "Students imported successfully."
      );

      setCsvFile(null);
      setDefaultPassword("");
      setImportSectionId("");
      setImportDepartmentId("");
    } catch (error) {
      console.log(
        "Student import error:",
        error
      );

      console.log(
        "Response:",
        error.response
      );

      console.log(
        "Data:",
        error.response?.data
      );

      setImportMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to import students."
      );
    } finally {
      setImportLoading(false);
    }
  }

  return (
    <section className="management-content">
      
      <div className="management-page-header">
        <div>
          <span className="management-small-title">
            ADMINISTRATION
          </span>

          <h1>Management</h1>

          <p>
            Manage courses, rooms, sections, staff, and
            student enrollment.
          </p>
        </div>
      </div>

    
      {message && (
        <div className="management-message">
          {message}
        </div>
      )}
      <section className="management-card">
        <div className="management-card-header">
          <div>
            <h2>Courses</h2>
            <p>Add and manage courses.</p>
          </div>
        </div>

        <form
          className="management-form"
          onSubmit={handleAddCourse}
        >
          <div className="form-grid two-columns">
            <div className="form-group">
              <label>Course Code</label>

              <input
                type="text"
                value={courseCode}
                onChange={(e) =>
                  setCourseCode(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Course Name</label>

              <input
                type="text"
                value={courseName}
                onChange={(e) =>
                  setCourseName(e.target.value)
                }
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="management-button"
          >
            Add Course
          </button>
        </form>

        <div className="management-list">
          <h3>Courses List</h3>

          {courses.length === 0 ? (
            <p className="empty-message">
              No courses found.
            </p>
          ) : (
            <div className="management-table-wrapper">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                  </tr>
                </thead>

                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>
                        <strong>
                          {course.course_code}
                        </strong>
                      </td>

                      <td>
                        {course.course_name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* =========================
          ROOMS
      ========================= */}
      <section className="management-card">
        <div className="management-card-header">
          <div>
            <h2>Rooms & Labs</h2>
            <p>Add classrooms and labs.</p>
          </div>
        </div>

        <form
          className="management-form"
          onSubmit={handleAddRoom}
        >
          <div className="form-grid three-columns">
            <div className="form-group">
              <label>Room Code</label>

              <input
                type="text"
                value={roomCode}
                onChange={(e) =>
                  setRoomCode(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Room Name</label>

              <input
                type="text"
                value={roomName}
                onChange={(e) =>
                  setRoomName(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Capacity</label>

              <input
                type="number"
                value={capacity}
                onChange={(e) =>
                  setCapacity(e.target.value)
                }
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="management-button"
          >
            Add Room / Lab
          </button>
        </form>

        <div className="management-list">
          <h3>Rooms List</h3>

          {rooms.length === 0 ? (
            <p className="empty-message">
              No rooms found.
            </p>
          ) : (
            <div className="management-table-wrapper">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>Room Code</th>
                    <th>Room Name</th>
                    <th>Capacity</th>
                  </tr>
                </thead>

                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td>
                        <strong>
                          {room.room_code}
                        </strong>
                      </td>

                      <td>{room.room_name}</td>

                      <td>
                        {room.capacity ?? ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* =========================
          SECTIONS
      ========================= */}
      <section className="management-card">
        <div className="management-card-header">
          <div>
            <h2>Sections</h2>
            <p>Create sections and assign them to courses.</p>
          </div>
        </div>

        <form
          className="management-form"
          onSubmit={handleAddSection}
        >
          <div className="form-grid two-columns">
            <div className="form-group">
              <label>Section Name</label>

              <input
                type="text"
                value={sectionName}
                onChange={(e) =>
                  setSectionName(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Course</label>

              <select
                value={courseId}
                onChange={(e) =>
                  setCourseId(e.target.value)
                }
                required
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
          </div>

          <button
            type="submit"
            className="management-button"
          >
            Add Section
          </button>
        </form>

        <div className="management-list">
          <h3>Sections List</h3>

          {sections.length === 0 ? (
            <p className="empty-message">
              No sections found.
            </p>
          ) : (
            <div className="management-table-wrapper">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>Section</th>
                  </tr>
                </thead>

                <tbody>
                  {sections.map((section) => {
                    const sectionId =
                      section.id ??
                      section.section_id ??
                      section.sectionId;

                    return (
                      <tr key={sectionId}>
                        <td>
                          <strong>
                            {section.section_name}
                          </strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* =========================
          ENROLLMENT
      ========================= */}
      <section className="management-card">
        <div className="management-card-header">
          <div>
            <h2>Enrollment</h2>
            <p>Enroll a student into a section.</p>
          </div>
        </div>

        <form
          className="management-form"
          onSubmit={handleEnrollment}
        >
          <div className="form-grid two-columns">
            <div className="form-group">
              <label>Student ID</label>

              <input
                type="number"
                value={studentId}
                onChange={(e) =>
                  setStudentId(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Section</label>

              <select
                value={enrollmentSectionId}
                onChange={(e) =>
                  setEnrollmentSectionId(
                    e.target.value
                  )
                }
                required
              >
                <option value="">
                  Select Section
                </option>

                {sections.map((section) => {
                  const sectionId =
                    section.id ??
                    section.section_id ??
                    section.sectionId;

                  return (
                    <option
                      key={sectionId}
                      value={sectionId}
                    >
                      {section.section_name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="management-button"
          >
            Enroll Student
          </button>
        </form>
      </section>

      {/* =========================
          TEACHING STAFF
      ========================= */}
      <section className="management-card">
        <div className="management-card-header">
          <div>
            <h2>Teaching Staff</h2>
            <p>Add lecturers and teaching assistants.</p>
          </div>
        </div>

        <form
          className="management-form"
          onSubmit={handleAddStaff}
        >
          <div className="form-grid three-columns">
            <div className="form-group">
              <label>Staff Name</label>

              <input
                type="text"
                value={staffName}
                onChange={(e) =>
                  setStaffName(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                value={staffEmail}
                onChange={(e) =>
                  setStaffEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>

              <select
                value={staffRole}
                onChange={(e) =>
                  setStaffRole(e.target.value)
                }
              >
                <option value="lecturer">
                  Lecturer
                </option>

                <option value="ta">
                  TA
                </option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="management-button"
          >
            Add Teaching Staff
          </button>
        </form>

        <div className="management-list">
          <h3>Teaching Staff List</h3>

          {staff.length === 0 ? (
            <p className="empty-message">
              No teaching staff found.
            </p>
          ) : (
            <div className="management-table-wrapper">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>

                <tbody>
                  {staff.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <strong>
                          {member.name}
                        </strong>
                      </td>

                      <td>{member.email}</td>

                      <td>
                        <span className="role-badge">
                          {member.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* =========================
          CSV IMPORT
      ========================= */}
      <section className="management-card">
        <div className="management-card-header">
          <div>
            <h2>Import Students from CSV</h2>

            <p>
              Required columns: student_code,
              student_name, email
              <br />
              Optional column: level
            </p>
          </div>
        </div>

        <form
          className="management-form"
          onSubmit={handleStudentImport}
        >
          <div className="form-grid two-columns">
            <div className="form-group">
              <label>CSV File</label>

              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => {
                  const file =
                    e.target.files[0] || null;

                  console.log(
                    "Selected CSV file:",
                    file
                  );

                  setCsvFile(file);
                }}
              />
            </div>

            <div className="form-group">
              <label>Default Password</label>

              <input
                type="password"
                value={defaultPassword}
                onChange={(e) =>
                  setDefaultPassword(
                    e.target.value
                  )
                }
                placeholder="Default password"
                required
              />
            </div>

            <div className="form-group">
              <label>Section (Optional)</label>

              <select
                value={importSectionId}
                onChange={(e) => {
                  const value = e.target.value;

                  console.log(
                    "Selected section value:",
                    value
                  );

                  setImportSectionId(value);
                }}
              >
                <option value="">
                  No Section
                </option>

                {sections.map((section) => {
                  const sectionId =
                    section.id ??
                    section.section_id ??
                    section.sectionId;

                  return (
                    <option
                      key={sectionId}
                      value={String(
                        sectionId ?? ""
                      )}
                    >
                      {section.section_name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <label>
                Department ID (Optional)
              </label>

              <input
                type="number"
                value={importDepartmentId}
                onChange={(e) =>
                  setImportDepartmentId(
                    e.target.value
                  )
                }
                placeholder="Department ID"
              />
            </div>
          </div>

          <button
            type="submit"
            className="management-button"
            disabled={importLoading}
          >
            {importLoading
              ? "Importing..."
              : "Import Students"}
          </button>
        </form>

        {importMessage && (
          <div className="import-message">
            {importMessage}
          </div>
        )}

        {importResult && (
          <div className="import-result">
            <h3>Import Result</h3>

            <pre>
              {JSON.stringify(
                importResult,
                null,
                2
              )}
            </pre>
          </div>
        )}
      </section>
    </section>
  );
}

export default Management;