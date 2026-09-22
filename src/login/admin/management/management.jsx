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

  // =========================
  // Enrollment
  // =========================
  const [studentId, setStudentId] = useState("");
  const [enrollmentSectionId, setEnrollmentSectionId] =
    useState("");

  // =========================
  // Teaching Staff
  // =========================
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffRole, setStaffRole] = useState("lecturer");

  // =========================
  // CSV Import
  // =========================
  const [csvFile, setCsvFile] = useState(null);
  const [defaultPassword, setDefaultPassword] = useState("");
  const [importSectionId, setImportSectionId] = useState("");
  const [importDepartmentId, setImportDepartmentId] =
    useState("");
  const [importMessage, setImportMessage] = useState("");
  const [importResult, setImportResult] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  // =========================
  // General Message
  // =========================
  const [message, setMessage] = useState("");

  // =========================
  // Load Courses / Rooms / Sections
  // =========================
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

      const sectionsData = Array.isArray(
        sectionsResponse.data
      )
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

  // =========================
  // Load Teaching Staff
  // =========================
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

  // =========================
  // Initial Load
  // =========================
  useEffect(() => {
    loadData();
    loadStaff();
  }, []);

  // =========================
  // Add Course
  // =========================
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

  // =========================
  // Add Room
  // =========================
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

  // =========================
  // Add Section
  // =========================
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

  // =========================
  // Enrollment
  // =========================
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

  // =========================
  // Add Teaching Staff
  // =========================
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

      setMessage(
        "Teaching staff added successfully."
      );

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

  // =========================
  // Get Rejected Rows
  // =========================
  function getRejectedRows(result) {
    if (!result) {
      return [];
    }

    if (Array.isArray(result.rejected_rows)) {
      return result.rejected_rows;
    }

    if (Array.isArray(result.rejectedRows)) {
      return result.rejectedRows;
    }

    if (Array.isArray(result.rejected)) {
      return result.rejected;
    }

    if (Array.isArray(result.errors)) {
      return result.errors;
    }

    return [];
  }

  // =========================
  // Download Rejected Rows
  // =========================
  function handleDownloadRejectedRows() {
    const rejectedRows = getRejectedRows(importResult);

    if (rejectedRows.length === 0) {
      return;
    }

    const headers = [
      "row",
      "student_code",
      "student_name",
      "email",
      "reason",
    ];

    const csvRows = [
      headers.join(","),
      ...rejectedRows.map((row) => {
        return headers
          .map((header) => {
            const value =
              row?.[header] ??
              row?.data?.[header] ??
              "";

            return `"${String(value)
              .replace(/"/g, '""')
              .replace(/\n/g, " ")}"`;
          })
          .join(",");
      }),
    ];

    const blob = new Blob(
      [csvRows.join("\n")],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "rejected-students.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // =========================
  // Student CSV Import
  // =========================
  async function handleStudentImport(e) {
    e.preventDefault();

    setImportMessage("");
    setImportResult(null);

    if (!csvFile) {
      setImportMessage("Please select a CSV file.");
      return;
    }

    if (!defaultPassword.trim()) {
      setImportMessage(
        "Please enter a default password."
      );
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

      // =========================
      // Section
      // =========================
      if (importSectionId) {
        const selectedSection = sections.find(
          (section) => {
            const id =
              section.id ??
              section.section_id ??
              section.sectionId;

            return (
              String(id) ===
              String(importSectionId)
            );
          }
        );

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

        const sectionNumber = Number(
          realSectionId
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

      // =========================
      // Department
      // =========================
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

      const rejectedRows = getRejectedRows(
        response.data
      );

      if (rejectedRows.length > 0) {
        setImportMessage(
          `Import completed with ${rejectedRows.length} rejected row(s).`
        );
      } else {
        setImportMessage(
          "Students imported successfully."
        );
      }

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

  const rejectedRows = getRejectedRows(importResult);

  return (
    <section className="management-content">
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="management-page-header">
        <div>
          <span className="management-small-title">
            ADMINISTRATION
          </span>

          <h1>Management</h1>

          <p>
            Manage courses, rooms, sections, staff,
            and student enrollment.
          </p>
        </div>
      </div>

      {/* =========================
          GENERAL MESSAGE
      ========================= */}
      {message && (
        <div className="management-message">
          {message}
        </div>
      )}

      {/* =========================
          COURSES
      ========================= */}
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
                min="1"
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
            <p>
              Create sections and assign them to
              courses.
            </p>
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
                    <th>Course</th>
                  </tr>
                </thead>

                <tbody>
                  {sections.map((section) => {
                    const sectionId =
                      section.id ??
                      section.section_id ??
                      section.sectionId;

                    const sectionCourseId =
                      section.course_id ??
                      section.courseId;

                    const course = courses.find(
                      (item) =>
                        String(item.id) ===
                        String(sectionCourseId)
                    );

                    return (
                      <tr key={sectionId}>
                        <td>
                          <strong>
                            {section.section_name}
                          </strong>
                        </td>

                        <td>
                          {course
                            ? `${course.course_code} - ${course.course_name}`
                            : sectionCourseId ??
                              "—"}
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
            <p>
              Enroll a student into a section.
            </p>
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
                min="1"
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
            <p>
              Add lecturers and teaching assistants.
            </p>
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

                  setCsvFile(file);
                }}
              />

              {csvFile && (
                <span className="file-name">
                  Selected: {csvFile.name}
                </span>
              )}
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
                onChange={(e) =>
                  setImportSectionId(e.target.value)
                }
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

        {/* =========================
            IMPORT SUMMARY
        ========================= */}
        {importResult && (
          <div className="import-result">
            <div className="import-result-header">
              <h3>Import Result</h3>

              {rejectedRows.length > 0 && (
                <button
                  type="button"
                  className="download-rejected-button"
                  onClick={
                    handleDownloadRejectedRows
                  }
                >
                  Download Rejected Rows
                </button>
              )}
            </div>

            <div className="import-summary">
              <div className="import-summary-item">
                <span>Total</span>
                <strong>
                  {importResult.total ??
                    importResult.total_rows ??
                    importResult.totalRows ??
                    "—"}
                </strong>
              </div>

              <div className="import-summary-item success">
                <span>Imported</span>
                <strong>
                  {importResult.imported ??
                    importResult.imported_rows ??
                    importResult.importedRows ??
                    importResult.successful ??
                    "—"}
                </strong>
              </div>

              <div className="import-summary-item rejected">
                <span>Rejected</span>
                <strong>
                  {rejectedRows.length}
                </strong>
              </div>
            </div>

            {/* =========================
                Rejected Rows
            ========================= */}
            {rejectedRows.length > 0 && (
              <div className="rejected-section">
                <h4>Rejected Rows</h4>

                <div className="management-table-wrapper">
                  <table className="management-table rejected-table">
                    <thead>
                      <tr>
                        <th>Row</th>
                        <th>Student Code</th>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Reason</th>
                      </tr>
                    </thead>

                    <tbody>
                      {rejectedRows.map(
                        (row, index) => {
                          const data =
                            row?.data || row;

                          return (
                            <tr
                              key={
                                row?.row ??
                                row?.row_number ??
                                index
                              }
                            >
                              <td>
                                {row?.row ??
                                  row?.row_number ??
                                  index + 1}
                              </td>

                              <td>
                                {data?.student_code ??
                                  "—"}
                              </td>

                              <td>
                                {data?.student_name ??
                                  "—"}
                              </td>

                              <td>
                                {data?.email ?? "—"}
                              </td>

                              <td className="rejected-reason">
                                {row?.reason ??
                                  row?.error ??
                                  row?.message ??
                                  "Invalid row"}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =========================
                Raw Response
            ========================= */}
            <details className="raw-import-response">
              <summary>
                View raw import response
              </summary>

              <pre>
                {JSON.stringify(
                  importResult,
                  null,
                  2
                )}
              </pre>
            </details>
          </div>
        )}
      </section>
    </section>
  );
}

export default Management;