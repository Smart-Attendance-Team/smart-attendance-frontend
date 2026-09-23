import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "./management.css";

function Management() {
  // =========================
  // DATA
  // =========================
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [timetableSlots, setTimetableSlots] = useState([]);

  // =========================
  // GENERAL MESSAGE
  // =========================
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // DEPARTMENT FORM
  // =========================
  const [departmentName, setDepartmentName] = useState("");

  // =========================
  // COURSE FORM
  // =========================
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseDepartmentId, setCourseDepartmentId] = useState("");

  // =========================
  // ROOM FORM
  // =========================
  const [roomName, setRoomName] = useState("");
  const [building, setBuilding] = useState("");
  const [roomType, setRoomType] = useState("lecture");
  const [roomCapacity, setRoomCapacity] = useState("");

  // =========================
  // SECTION FORM
  // =========================
  const [sectionName, setSectionName] = useState("");
  const [sectionCourseId, setSectionCourseId] = useState("");
  const [sectionSemester, setSectionSemester] = useState("");
  const [sectionCapacity, setSectionCapacity] = useState("");

  // =========================
  // STUDENT FORM
  // =========================
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentLevel, setStudentLevel] = useState("");
  const [studentDepartmentId, setStudentDepartmentId] = useState("");

  // =========================
  // ENROLLMENT FORM
  // =========================
  const [enrollmentStudentId, setEnrollmentStudentId] = useState("");
  const [enrollmentSectionId, setEnrollmentSectionId] = useState("");

  // =========================
  // STAFF FORM
  // =========================
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffType, setStaffType] = useState("lecturer");
  const [staffDepartmentId, setStaffDepartmentId] = useState("");

  // =========================
  // ASSIGN STAFF FORM
  // =========================
  const [assignSectionId, setAssignSectionId] = useState("");
  const [assignStaffId, setAssignStaffId] = useState("");
  const [assignStaffRole, setAssignStaffRole] = useState("lecturer");

  // =========================
  // TIMETABLE FORM
  // =========================
  const [scheduleSectionId, setScheduleSectionId] = useState("");
  const [scheduleRoomId, setScheduleRoomId] = useState("");
  const [scheduleDay, setScheduleDay] = useState("Saturday");
  const [scheduleStartTime, setScheduleStartTime] = useState("");
  const [scheduleEndTime, setScheduleEndTime] = useState("");

  // =========================
  // TIMETABLE EDIT
  // =========================
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editRoomId, setEditRoomId] = useState("");
  const [editDay, setEditDay] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");

  // =========================
  // CSV IMPORT
  // =========================
  const [csvFile, setCsvFile] = useState(null);
  const [defaultPassword, setDefaultPassword] =
    useState("Student@123");
  const [importSectionId, setImportSectionId] = useState("");
  const [importDepartmentId, setImportDepartmentId] =
    useState("");
  const [importMessage, setImportMessage] = useState("");
  const [importResult, setImportResult] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  // =========================
  // DAYS
  // =========================
  const days = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  // =========================
  // LOAD ALL DATA
  // =========================
  const loadData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const [
        departmentsResponse,
        coursesResponse,
        roomsResponse,
        sectionsResponse,
        studentsResponse,
        staffResponse,
        enrollmentsResponse,
        timetableResponse,
      ] = await Promise.all([
        api.get("/admin/departments"),
        api.get("/admin/courses"),
        api.get("/admin/rooms"),
        api.get("/admin/sections"),
        api.get("/admin/students"),
        api.get("/admin/staff"),
        api.get("/admin/enrollments"),
        api.get("/admin/timetable-slots"),
      ]);

      const departmentsData = Array.isArray(
        departmentsResponse.data
      )
        ? departmentsResponse.data
        : [];

      const coursesData = Array.isArray(coursesResponse.data)
        ? coursesResponse.data
        : [];

      const roomsData = Array.isArray(roomsResponse.data)
        ? roomsResponse.data
        : [];

      const sectionsData = Array.isArray(
        sectionsResponse.data
      )
        ? sectionsResponse.data
        : [];

      const studentsData = Array.isArray(
        studentsResponse.data
      )
        ? studentsResponse.data
        : [];

      const staffData = Array.isArray(staffResponse.data)
        ? staffResponse.data
        : [];

      const enrollmentsData = Array.isArray(
        enrollmentsResponse.data
      )
        ? enrollmentsResponse.data
        : [];

      const timetableData = Array.isArray(
        timetableResponse.data
      )
        ? timetableResponse.data
        : [];

      setDepartments(departmentsData);
      setCourses(coursesData);
      setRooms(roomsData);
      setSections(sectionsData);
      setStudents(studentsData);
      setStaff(staffData);
      setEnrollments(enrollmentsData);
      setTimetableSlots(timetableData);

      // Set first department automatically
      if (departmentsData.length > 0) {
        const firstDepartmentId = String(
          departmentsData[0].department_id
        );

        if (!courseDepartmentId) {
          setCourseDepartmentId(firstDepartmentId);
        }

        if (!studentDepartmentId) {
          setStudentDepartmentId(firstDepartmentId);
        }

        if (!staffDepartmentId) {
          setStaffDepartmentId(firstDepartmentId);
        }

        if (!importDepartmentId) {
          setImportDepartmentId(firstDepartmentId);
        }
      }
    } catch (error) {
      console.log("Management loading error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load management data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // ERROR HELPER
  // =========================
  const getErrorMessage = (error, fallback) => {
    return (
      error.response?.data?.error ||
      error.response?.data?.message ||
      fallback
    );
  };

  // =========================
  // ADD DEPARTMENT
  // =========================
  const handleAddDepartment = async (e) => {
    e.preventDefault();

    if (!departmentName.trim()) {
      setMessage("Please enter department name.");
      return;
    }

    try {
      setMessage("");

      await api.post("/admin/departments", {
        department_name: departmentName.trim(),
      });

      setDepartmentName("");
      setMessage("Department created successfully.");

      await loadData();
    } catch (error) {
      console.log("Add department error:", error);

      setMessage(
        getErrorMessage(
          error,
          "Failed to create department."
        )
      );
    }
  };

  // =========================
  // ADD COURSE
  // =========================
  const handleAddCourse = async (e) => {
    e.preventDefault();

    if (
      !courseCode.trim() ||
      !courseName.trim() ||
      !courseDepartmentId
    ) {
      setMessage("Please fill all course fields.");
      return;
    }

    try {
      setMessage("");

      await api.post("/admin/courses", {
        course_code: courseCode.trim(),
        course_name: courseName.trim(),
        department_id: Number(courseDepartmentId),
      });

      setCourseCode("");
      setCourseName("");

      setMessage("Course created successfully.");

      await loadData();
    } catch (error) {
      console.log("Add course error:", error);

      setMessage(
        getErrorMessage(
          error,
          "Failed to create course."
        )
      );
    }
  };

  // =========================
  // ADD ROOM
  // =========================
  const handleAddRoom = async (e) => {
    e.preventDefault();

    if (
      !roomName.trim() ||
      !roomType ||
      !roomCapacity ||
      !building.trim()
    ) {
      setMessage("Please fill all room fields.");
      return;
    }

    try {
      setMessage("");

      await api.post("/admin/rooms", {
        room_name: roomName.trim(),
        building: building.trim(),
        room_type: roomType,
        capacity: Number(roomCapacity),
      });

      setRoomName("");
      setBuilding("");
      setRoomType("lecture");
      setRoomCapacity("");

      setMessage("Room/Lab created successfully.");

      await loadData();
    } catch (error) {
      console.log("Add room error:", error);

      setMessage(
        getErrorMessage(
          error,
          "Failed to create room/lab."
        )
      );
    }
  };

  // =========================
  // ADD SECTION
  // =========================
  const handleAddSection = async (e) => {
    e.preventDefault();

    if (
      !sectionCourseId ||
      !sectionName.trim() ||
      !sectionSemester.trim() ||
      !sectionCapacity
    ) {
      setMessage("Please fill all section fields.");
      return;
    }

    try {
      setMessage("");

      await api.post("/admin/sections", {
        course_id: Number(sectionCourseId),
        section_name: sectionName.trim(),
        semester: sectionSemester.trim(),
        capacity: Number(sectionCapacity),
      });

      setSectionName("");
      setSectionCourseId("");
      setSectionSemester("");
      setSectionCapacity("");

      setMessage("Section created successfully.");

      await loadData();
    } catch (error) {
      console.log("Add section error:", error);

      setMessage(
        getErrorMessage(
          error,
          "Failed to create section."
        )
      );
    }
  };

  // =========================
  // ADD STUDENT
  // =========================
  const handleAddStudent = async (e) => {
    e.preventDefault();

    if (
      !studentEmail.trim() ||
      !studentPassword ||
      !studentCode.trim() ||
      !studentName.trim() ||
      !studentLevel ||
      !studentDepartmentId
    ) {
      setMessage("Please fill all student fields.");
      return;
    }

    try {
      setMessage("");

      await api.post("/admin/students", {
        email: studentEmail.trim(),
        password: studentPassword,
        student_code: studentCode.trim(),
        student_name: studentName.trim(),
        level: Number(studentLevel),
        department_id: Number(studentDepartmentId),
      });

      setStudentEmail("");
      setStudentPassword("");
      setStudentCode("");
      setStudentName("");
      setStudentLevel("");

      setMessage("Student created successfully.");

      await loadData();
    } catch (error) {
      console.log("Add student error:", error);

      setMessage(
        getErrorMessage(
          error,
          "Failed to create student."
        )
      );
    }
  };

  // =========================
  // DELETE STUDENT
  // =========================
  const handleDeleteStudent = async (studentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      setMessage("");

      await api.delete(`/admin/students/${studentId}`);

      setMessage("Student deleted successfully.");

      await loadData();
    } catch (error) {
      console.log("Delete student error:", error);

      setMessage(
        getErrorMessage(
          error,
          "Failed to delete student."
        )
      );
    }
  };

  // =========================
  // ENROLL STUDENT
  // =========================
  const handleEnrollment = async (e) => {
    e.preventDefault();

    if (!enrollmentStudentId || !enrollmentSectionId) {
      setMessage("Please select student and section.");
      return;
    }

    try {
      setMessage("");

      await api.post("/admin/enrollments", {
        student_id: Number(enrollmentStudentId),
        section_id: Number(enrollmentSectionId),
      });

      setEnrollmentStudentId("");
      setEnrollmentSectionId("");

      setMessage("Student enrolled successfully.");

      await loadData();
    } catch (error) {
      console.log("Enrollment error:", error);

      setMessage(
        getErrorMessage(
          error,
          "Failed to enroll student."
        )
      );
    }
  };

  // =========================
  // ADD STAFF
  // =========================
  const handleAddStaff = async (e) => {
    e.preventDefault();

    if (
      !staffName.trim() ||
      !staffEmail.trim() ||
      !staffPassword ||
      !staffType ||
      !staffDepartmentId
    ) {
      setMessage("Please fill all staff fields.");
      return;
    }

    try {
      setMessage("");

      await api.post("/admin/staff", {
        email: staffEmail.trim(),
        password: staffPassword,
        staff_name: staffName.trim(),
        staff_type: staffType,
        department_id: Number(staffDepartmentId),
      });

      setStaffName("");
      setStaffEmail("");
      setStaffPassword("");
      setStaffType("lecturer");

      setMessage(
        "Teaching staff created successfully."
      );

      await loadData();
    } catch (error) {
      console.log("Add staff error:", error);

      setMessage(
        getErrorMessage(
          error,
          "Failed to create teaching staff."
        )
      );
    }
  };

  // =========================
  // ASSIGN STAFF TO SECTION
  // =========================
  const handleAssignStaff = async (e) => {
    e.preventDefault();

    if (
      !assignSectionId ||
      !assignStaffId ||
      !assignStaffRole
    ) {
      setMessage(
        "Please select section, staff and role."
      );
      return;
    }

    try {
      setMessage("");

      await api.post(
        `/admin/sections/${Number(
          assignSectionId
        )}/staff`,
        {
          staff_id: Number(assignStaffId),
          staff_role: assignStaffRole,
        }
      );

      setAssignSectionId("");
      setAssignStaffId("");
      setAssignStaffRole("lecturer");

      setMessage(
        "Staff assigned to section successfully."
      );

      await loadData();
    } catch (error) {
      console.log("Assign staff error:", error);

      setMessage(
        getErrorMessage(
          error,
          "Failed to assign staff to section."
        )
      );
    }
  };

  // =========================
  // ADD TIMETABLE SLOT
  // =========================
  const handleAddTimetableSlot = async (e) => {
    e.preventDefault();

    if (
      !scheduleSectionId ||
      !scheduleRoomId ||
      !scheduleDay ||
      !scheduleStartTime ||
      !scheduleEndTime
    ) {
      setMessage("Please fill all schedule fields.");
      return;
    }

    if (scheduleEndTime <= scheduleStartTime) {
      setMessage(
        "End time must be after start time."
      );
      return;
    }

    try {
      setMessage("");

      await api.post("/admin/timetable-slots", {
        section_id: Number(scheduleSectionId),
        room_id: Number(scheduleRoomId),
        day_of_week: scheduleDay,
        start_time: scheduleStartTime,
        end_time: scheduleEndTime,
      });

      setScheduleSectionId("");
      setScheduleRoomId("");
      setScheduleDay("Saturday");
      setScheduleStartTime("");
      setScheduleEndTime("");

      setMessage(
        "Timetable slot created successfully."
      );

      await loadData();
    } catch (error) {
      console.log(
        "Add timetable slot error:",
        error
      );

      setMessage(
        getErrorMessage(
          error,
          "Failed to create timetable slot."
        )
      );
    }
  };

  // =========================
  // START EDIT TIMETABLE
  // =========================
  const handleStartEditSlot = (slot) => {
    setEditingSlotId(slot.slot_id);
    setEditRoomId(String(slot.room_id));
    setEditDay(slot.day_of_week);

    setEditStartTime(
      slot.start_time
        ? String(slot.start_time).slice(0, 5)
        : ""
    );

    setEditEndTime(
      slot.end_time
        ? String(slot.end_time).slice(0, 5)
        : ""
    );

    setMessage("");
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancelEdit = () => {
    setEditingSlotId(null);
    setEditRoomId("");
    setEditDay("");
    setEditStartTime("");
    setEditEndTime("");
  };

  // =========================
  // UPDATE TIMETABLE SLOT
  // =========================
  const handleUpdateTimetableSlot = async (slotId) => {
    if (
      !editRoomId ||
      !editDay ||
      !editStartTime ||
      !editEndTime
    ) {
      setMessage("Please fill all edit fields.");
      return;
    }

    if (editEndTime <= editStartTime) {
      setMessage(
        "End time must be after start time."
      );
      return;
    }

    try {
      setMessage("");

      await api.patch(
        `/admin/timetable-slots/${slotId}`,
        {
          room_id: Number(editRoomId),
          day_of_week: editDay,
          start_time: editStartTime,
          end_time: editEndTime,
        }
      );

      handleCancelEdit();

      setMessage(
        "Timetable slot updated successfully."
      );

      await loadData();
    } catch (error) {
      console.log(
        "Update timetable slot error:",
        error
      );

      setMessage(
        getErrorMessage(
          error,
          "Failed to update timetable slot."
        )
      );
    }
  };

  // =========================
  // DELETE TIMETABLE SLOT
  // =========================
  const handleDeleteTimetableSlot = async (
    slotId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this timetable slot?"
    );

    if (!confirmed) return;

    try {
      setMessage("");

      await api.delete(
        `/admin/timetable-slots/${slotId}`
      );

      if (editingSlotId === slotId) {
        handleCancelEdit();
      }

      setMessage(
        "Timetable slot deleted successfully."
      );

      await loadData();
    } catch (error) {
      console.log(
        "Delete timetable slot error:",
        error
      );

      setMessage(
        getErrorMessage(
          error,
          "Failed to delete timetable slot."
        )
      );
    }
  };

  // =========================
  // CSV FILE CHANGE
  // =========================
  const handleCsvFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    setCsvFile(file);
    setImportMessage("");
    setImportResult(null);
  };

  // =========================
  // CSV IMPORT
  // =========================
  const handleImportStudents = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      setImportMessage(
        "Please select a CSV file."
      );
      return;
    }

    if (
      !defaultPassword ||
      defaultPassword.length < 8
    ) {
      setImportMessage(
        "Default password must be at least 8 characters."
      );
      return;
    }

    try {
      setImportLoading(true);
      setImportMessage("");
      setImportResult(null);

      const csvText = await csvFile.text();

      let url = `/admin/imports/students?default_password=${encodeURIComponent(
        defaultPassword
      )}`;

      if (importSectionId) {
        url += `&section_id=${Number(
          importSectionId
        )}`;
      }

      if (importDepartmentId) {
        url += `&department_id=${Number(
          importDepartmentId
        )}`;
      }

      const response = await api.post(
        url,
        csvText,
        {
          headers: {
            "Content-Type": "text/csv",
          },
        }
      );

      setImportResult(response.data);

      setImportMessage(
        `Import finished: ${response.data.created} created, ${response.data.rejected} rejected.`
      );

      setCsvFile(null);

      e.target.reset();

      await loadData();
    } catch (error) {
      console.log("CSV import error:", error);

      setImportMessage(
        getErrorMessage(
          error,
          "Failed to import students."
        )
      );
    } finally {
      setImportLoading(false);
    }
  };

  // =========================
  // FIND HELPERS
  // =========================
  const getDepartmentName = (departmentId) => {
    const department = departments.find(
      (item) =>
        Number(item.department_id) ===
        Number(departmentId)
    );

    return department?.department_name || "-";
  };

  const getCourseName = (courseId) => {
    const course = courses.find(
      (item) =>
        Number(item.course_id) ===
        Number(courseId)
    );

    if (!course) return "-";

    return `${course.course_code} - ${course.course_name}`;
  };

  const getSectionName = (sectionId) => {
    const section = sections.find(
      (item) =>
        Number(item.section_id) ===
        Number(sectionId)
    );

    if (!section) return "-";

    return `${getCourseName(
      section.course_id
    )} - ${section.section_name}`;
  };

  const getRoomName = (roomId) => {
    const room = rooms.find(
      (item) =>
        Number(item.room_id) ===
        Number(roomId)
    );

    if (!room) return "-";

    return `${room.room_name}${
      room.building
        ? ` - ${room.building}`
        : ""
    }`;
  };

  return (
    <section className="management-content">
      {/* =========================
          HEADER
      ========================= */}
      <div className="management-header">
        <div>
          <span className="management-small-title">
            ADMINISTRATION
          </span>

          <h1>Management</h1>

          <p>
            Manage departments, courses, rooms,
            sections, students, staff, enrollments
            and timetable.
          </p>
        </div>
      </div>

      {/* =========================
          MESSAGE
      ========================= */}
      {message && (
        <div className="management-message">
          {message}
        </div>
      )}

      {/* =========================
          LOADING
      ========================= */}
      {loading ? (
        <div className="management-card">
          <div className="management-empty-state">
            <span>◷</span>

            <h3>
              Loading management data...
            </h3>

            <p>
              Getting departments, courses, rooms,
              sections, students, staff and
              timetable.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* ==================================================
              DEPARTMENTS
          ================================================== */}
          <section className="management-card">
            <div className="management-section-header">
              <div>
                <h2>Departments</h2>

                <p>
                  Create and view departments.
                </p>
              </div>
            </div>

            <form
              className="management-form"
              onSubmit={handleAddDepartment}
            >
              <div className="management-form-group">
                <label>
                  Department Name
                </label>

                <input
                  type="text"
                  value={departmentName}
                  onChange={(e) =>
                    setDepartmentName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Computer Science"
                />
              </div>

              <button type="submit">
                Add Department
              </button>
            </form>

            <div className="management-table-wrapper">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>
                      Department Name
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {departments.length > 0 ? (
                    departments.map(
                      (department) => (
                        <tr
                          key={
                            department.department_id
                          }
                        >
                          <td>
                            {
                              department.department_id
                            }
                          </td>

                          <td>
                            {
                              department.department_name
                            }
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="2">
                        No departments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================================================
              COURSES
          ================================================== */}
          <section className="management-card">
            <div className="management-section-header">
              <div>
                <h2>Courses</h2>

                <p>
                  Create courses and assign
                  them to departments.
                </p>
              </div>
            </div>

            <form
              className="management-form"
              onSubmit={handleAddCourse}
            >
              <div className="management-form-group">
                <label>
                  Course Code
                </label>

                <input
                  type="text"
                  value={courseCode}
                  onChange={(e) =>
                    setCourseCode(
                      e.target.value
                    )
                  }
                  placeholder="CS101"
                />
              </div>

              <div className="management-form-group">
                <label>
                  Course Name
                </label>

                <input
                  type="text"
                  value={courseName}
                  onChange={(e) =>
                    setCourseName(
                      e.target.value
                    )
                  }
                  placeholder="Intro to Programming"
                />
              </div>

              <div className="management-form-group">
                <label>
                  Department
                </label>

                <select
                  value={courseDepartmentId}
                  onChange={(e) =>
                    setCourseDepartmentId(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Department
                  </option>

                  {departments.map(
                    (department) => (
                      <option
                        key={
                          department.department_id
                        }
                        value={
                          department.department_id
                        }
                      >
                        {
                          department.department_name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <button type="submit">
                Add Course
              </button>
            </form>

            <div className="management-table-wrapper">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>
                      Department
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <tr
                        key={
                          course.course_id
                        }
                      >
                        <td>
                          {course.course_id}
                        </td>

                        <td>
                          {course.course_code}
                        </td>

                        <td>
                          {course.course_name}
                        </td>

                        <td>
                          {getDepartmentName(
                            course.department_id
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">
                        No courses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================================================
              ROOMS
          ================================================== */}
          <section className="management-card">
            <div className="management-section-header">
              <div>
                <h2>Rooms & Labs</h2>

                <p>
                  Create lecture rooms and
                  labs.
                </p>
              </div>
            </div>

            <form
              className="management-form"
              onSubmit={handleAddRoom}
            >
              <div className="management-form-group">
                <label>Room Name</label>

                <input
                  type="text"
                  value={roomName}
                  onChange={(e) =>
                    setRoomName(
                      e.target.value
                    )
                  }
                  placeholder="Lab 1"
                />
              </div>

              <div className="management-form-group">
                <label>Building</label>

                <input
                  type="text"
                  value={building}
                  onChange={(e) =>
                    setBuilding(
                      e.target.value
                    )
                  }
                  placeholder="Building A"
                />
              </div>

              <div className="management-form-group">
                <label>Room Type</label>

                <select
                  value={roomType}
                  onChange={(e) =>
                    setRoomType(
                      e.target.value
                    )
                  }
                >
                  <option value="lecture">
                    Lecture
                  </option>

                  <option value="lab">
                    Lab
                  </option>
                </select>
              </div>

              <div className="management-form-group">
                <label>Capacity</label>

                <input
                  type="number"
                  min="1"
                  value={roomCapacity}
                  onChange={(e) =>
                    setRoomCapacity(
                      e.target.value
                    )
                  }
                  placeholder="30"
                />
              </div>

              <button type="submit">
                Add Room
              </button>
            </form>

            <div className="management-table-wrapper">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Room</th>
                    <th>Building</th>
                    <th>Type</th>
                    <th>Capacity</th>
                  </tr>
                </thead>

                <tbody>
                  {rooms.length > 0 ? (
                    rooms.map((room) => (
                      <tr
                        key={room.room_id}
                      >
                        <td>
                          {room.room_id}
                        </td>

                        <td>
                          {room.room_name}
                        </td>

                        <td>
                          {room.building ||
                            "-"}
                        </td>

                        <td>
                          {room.room_type}
                        </td>

                        <td>
                          {room.capacity}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">
                        No rooms found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================================================
              SECTIONS
          ================================================== */}
          <section className="management-card">
            <div className="management-section-header">
              <div>
                <h2>Sections</h2>

                <p>
                  Create sections for
                  courses.
                </p>
              </div>
            </div>

            <form
              className="management-form"
              onSubmit={handleAddSection}
            >
              <div className="management-form-group">
                <label>Course</label>

                <select
                  value={sectionCourseId}
                  onChange={(e) =>
                    setSectionCourseId(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Course
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course.course_id}
                      value={
                        course.course_id
                      }
                    >
                      {course.course_code} -{" "}
                      {course.course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="management-form-group">
                <label>
                  Section Name
                </label>

                <input
                  type="text"
                  value={sectionName}
                  onChange={(e) =>
                    setSectionName(
                      e.target.value
                    )
                  }
                  placeholder="Section 1"
                />
              </div>

              <div className="management-form-group">
                <label>Semester</label>

                <input
                  type="text"
                  value={sectionSemester}
                  onChange={(e) =>
                    setSectionSemester(
                      e.target.value
                    )
                  }
                  placeholder="Fall 2026"
                />
              </div>

              <div className="management-form-group">
                <label>Capacity</label>

                <input
                  type="number"
                  min="1"
                  value={sectionCapacity}
                  onChange={(e) =>
                    setSectionCapacity(
                      e.target.value
                    )
                  }
                  placeholder="30"
                />
              </div>

              <button type="submit">
                Add Section
              </button>
            </form>

            <div className="management-table-wrapper">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Course</th>
                    <th>Section</th>
                    <th>Semester</th>
                    <th>Capacity</th>
                  </tr>
                </thead>

                <tbody>
                  {sections.length > 0 ? (
                    sections.map(
                      (section) => (
                        <tr
                          key={
                            section.section_id
                          }
                        >
                          <td>
                            {
                              section.section_id
                            }
                          </td>

                          <td>
                            {getCourseName(
                              section.course_id
                            )}
                          </td>

                          <td>
                            {
                              section.section_name
                            }
                          </td>

                          <td>
                            {section.semester}
                          </td>

                          <td>
                            {section.capacity}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="5">
                        No sections found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================================================
              TIMETABLE
          ================================================== */}
          <section className="management-card">
            <div className="management-section-header">
              <div>
                <h2>Timetable</h2>

                <p>
                  Schedule sections in rooms
                  with specific days and
                  times.
                </p>
              </div>
            </div>

            {/* ADD SCHEDULE */}
            <form
              className="management-form"
              onSubmit={
                handleAddTimetableSlot
              }
            >
              <div className="management-form-group">
                <label>Section</label>

                <select
                  value={scheduleSectionId}
                  onChange={(e) =>
                    setScheduleSectionId(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Section
                  </option>

                  {sections.map((section) => (
                    <option
                      key={
                        section.section_id
                      }
                      value={
                        section.section_id
                      }
                    >
                      {getCourseName(
                        section.course_id
                      )}{" "}
                      -{" "}
                      {section.section_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="management-form-group">
                <label>Room</label>

                <select
                  value={scheduleRoomId}
                  onChange={(e) =>
                    setScheduleRoomId(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Room
                  </option>

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

              <div className="management-form-group">
                <label>Day</label>

                <select
                  value={scheduleDay}
                  onChange={(e) =>
                    setScheduleDay(
                      e.target.value
                    )
                  }
                >
                  {days.map((day) => (
                    <option
                      key={day}
                      value={day}
                    >
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="management-form-group">
                <label>
                  Start Time
                </label>

                <input
                  type="time"
                  value={
                    scheduleStartTime
                  }
                  onChange={(e) =>
                    setScheduleStartTime(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="management-form-group">
                <label>
                  End Time
                </label>

                <input
                  type="time"
                  value={scheduleEndTime}
                  onChange={(e) =>
                    setScheduleEndTime(
                      e.target.value
                    )
                  }
                />
              </div>

              <button type="submit">
                Add Schedule
              </button>
            </form>

            {/* TIMETABLE TABLE */}
            <div className="management-table-wrapper">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>
                      Course / Section
                    </th>
                    <th>Room</th>
                    <th>Day</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {timetableSlots.length >
                  0 ? (
                    timetableSlots.map(
                      (slot) => (
                        <tr
                          key={
                            slot.slot_id
                          }
                        >
                          <td>
                            {slot.slot_id}
                          </td>

                          <td>
                            {getSectionName(
                              slot.section_id
                            )}
                          </td>

                          {/* ROOM */}
                          <td>
                            {editingSlotId ===
                            slot.slot_id ? (
                              <select
                                value={
                                  editRoomId
                                }
                                onChange={(e) =>
                                  setEditRoomId(
                                    e.target
                                      .value
                                  )
                                }
                              >
                                <option value="">
                                  Select Room
                                </option>

                                {rooms.map(
                                  (room) => (
                                    <option
                                      key={
                                        room.room_id
                                      }
                                      value={
                                        room.room_id
                                      }
                                    >
                                      {
                                        room.room_name
                                      }
                                      {room.building
                                        ? ` - ${room.building}`
                                        : ""}
                                    </option>
                                  )
                                )}
                              </select>
                            ) : (
                              getRoomName(
                                slot.room_id
                              )
                            )}
                          </td>

                          {/* DAY */}
                          <td>
                            {editingSlotId ===
                            slot.slot_id ? (
                              <select
                                value={
                                  editDay
                                }
                                onChange={(e) =>
                                  setEditDay(
                                    e.target
                                      .value
                                  )
                                }
                              >
                                {days.map(
                                  (day) => (
                                    <option
                                      key={day}
                                      value={day}
                                    >
                                      {day}
                                    </option>
                                  )
                                )}
                              </select>
                            ) : (
                              slot.day_of_week
                            )}
                          </td>

                          {/* START */}
                          <td>
                            {editingSlotId ===
                            slot.slot_id ? (
                              <input
                                type="time"
                                value={
                                  editStartTime
                                }
                                onChange={(e) =>
                                  setEditStartTime(
                                    e.target
                                      .value
                                  )
                                }
                              />
                            ) : (
                              String(
                                slot.start_time ||
                                  ""
                              ).slice(
                                0,
                                5
                              )
                            )}
                          </td>

                          {/* END */}
                          <td>
                            {editingSlotId ===
                            slot.slot_id ? (
                              <input
                                type="time"
                                value={
                                  editEndTime
                                }
                                onChange={(e) =>
                                  setEditEndTime(
                                    e.target
                                      .value
                                  )
                                }
                              />
                            ) : (
                              String(
                                slot.end_time ||
                                  ""
                              ).slice(
                                0,
                                5
                              )
                            )}
                          </td>

                          {/* ACTIONS */}
                          <td>
                            {editingSlotId ===
                            slot.slot_id ? (
                              <div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateTimetableSlot(
                                      slot.slot_id
                                    )
                                  }
                                >
                                  Save
                                </button>

                                <button
                                  type="button"
                                  onClick={
                                    handleCancelEdit
                                  }
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStartEditSlot(
                                      slot
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteTimetableSlot(
                                      slot.slot_id
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="7">
                        No timetable slots
                        found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================================================
              STUDENTS
          ================================================== */}
          <section className="management-card">
            <div className="management-section-header">
              <div>
                <h2>Students</h2>

                <p>
                  Create, view and delete
                  student accounts.
                </p>
              </div>
            </div>

            {/* ADD STUDENT */}
            <form
              className="management-form"
              onSubmit={handleAddStudent}
            >
              <div className="management-form-group">
                <label>
                  Student Code
                </label>

                <input
                  type="text"
                  value={studentCode}
                  onChange={(e) =>
                    setStudentCode(
                      e.target.value
                    )
                  }
                  placeholder="S2001"
                />
              </div>

              <div className="management-form-group">
                <label>
                  Student Name
                </label>

                <input
                  type="text"
                  value={studentName}
                  onChange={(e) =>
                    setStudentName(
                      e.target.value
                    )
                  }
                  placeholder="Student Name"
                />
              </div>

              <div className="management-form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) =>
                    setStudentEmail(
                      e.target.value
                    )
                  }
                  placeholder="student@example.com"
                />
              </div>

              <div className="management-form-group">
                <label>
                  Password
                </label>

                <input
                  type="password"
                  value={studentPassword}
                  onChange={(e) =>
                    setStudentPassword(
                      e.target.value
                    )
                  }
                  placeholder="At least 8 characters"
                />
              </div>

              <div className="management-form-group">
                <label>Level</label>

                <input
                  type="number"
                  min="1"
                  max="8"
                  value={studentLevel}
                  onChange={(e) =>
                    setStudentLevel(
                      e.target.value
                    )
                  }
                  placeholder="1"
                />
              </div>

              <div className="management-form-group">
                <label>
                  Department
                </label>

                <select
                  value={
                    studentDepartmentId
                  }
                  onChange={(e) =>
                    setStudentDepartmentId(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Department
                  </option>

                  {departments.map(
                    (department) => (
                      <option
                        key={
                          department.department_id
                        }
                        value={
                          department.department_id
                        }
                      >
                        {
                          department.department_name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <button type="submit">
                Add Student
              </button>
            </form>

            {/* STUDENTS TABLE */}
            <div className="management-table-wrapper">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>
                      Student Code
                    </th>

                    <th>
                      Student Name
                    </th>

                    <th>Email</th>

                    <th>Level</th>

                    <th>
                      Department
                    </th>

                    <th>Status</th>

                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students.length > 0 ? (
                    students.map(
                      (student) => (
                        <tr
                          key={
                            student.student_id
                          }
                        >
                          <td>
                            {
                              student.student_code
                            }
                          </td>

                          <td>
                            {
                              student.student_name
                            }
                          </td>

                          <td>
                            {student.email}
                          </td>

                          <td>
                            {student.level}
                          </td>

                          <td>
                            {student.department_name ||
                              getDepartmentName(
                                student.department_id
                              )}
                          </td>

                          <td>
                            {student.is_active
                              ? "Active"
                              : "Inactive"}
                          </td>

                          <td>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteStudent(
                                  student.student_id
                                )
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="7">
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================================================
              ENROLLMENT
          ================================================== */}
          <section className="management-card">
            <div className="management-section-header">
              <div>
                <h2>Enrollments</h2>

                <p>
                  Enroll students in
                  sections.
                </p>
              </div>
            </div>

            <form
              className="management-form"
              onSubmit={handleEnrollment}
            >
              <div className="management-form-group">
                <label>Student</label>

                <select
                  value={
                    enrollmentStudentId
                  }
                  onChange={(e) =>
                    setEnrollmentStudentId(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Student
                  </option>

                  {students.map((student) => (
                    <option
                      key={
                        student.student_id
                      }
                      value={
                        student.student_id
                      }
                    >
                      {
                        student.student_code
                      }{" "}
                      -{" "}
                      {
                        student.student_name
                      }
                    </option>
                  ))}
                </select>
              </div>

              <div className="management-form-group">
                <label>Section</label>

                <select
                  value={
                    enrollmentSectionId
                  }
                  onChange={(e) =>
                    setEnrollmentSectionId(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Section
                  </option>

                  {sections.map((section) => (
                    <option
                      key={
                        section.section_id
                      }
                      value={
                        section.section_id
                      }
                    >
                      {getCourseName(
                        section.course_id
                      )}{" "}
                      -{" "}
                      {
                        section.section_name
                      }
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit">
                Enroll Student
              </button>
            </form>

            <div className="management-table-wrapper">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>
                      Student Code
                    </th>

                    <th>
                      Student Name
                    </th>

                    <th>Course</th>

                    <th>Section</th>

                    <th>Status</th>

                    <th>
                      Enrolled At
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {enrollments.length >
                  0 ? (
                    enrollments.map(
                      (enrollment) => (
                        <tr
                          key={
                            enrollment.enrollment_id
                          }
                        >
                          <td>
                            {
                              enrollment.student_code
                            }
                          </td>

                          <td>
                            {
                              enrollment.student_name
                            }
                          </td>

                          <td>
                            {
                              enrollment.course_code
                            }{" "}
                            -{" "}
                            {
                              enrollment.course_name
                            }
                          </td>

                          <td>
                            {
                              enrollment.section_name
                            }
                          </td>

                          <td>
                            {
                              enrollment.status
                            }
                          </td>

                          <td>
                            {enrollment.enrolled_at
                              ? new Date(
                                  enrollment.enrolled_at
                                ).toLocaleString()
                              : "-"}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="6">
                        No enrollments
                        found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================================================
              STAFF
          ================================================== */}
          <section className="management-card">
            <div className="management-section-header">
              <div>
                <h2>
                  Teaching Staff
                </h2>

                <p>
                  Create lecturers and TAs
                  and view staff accounts.
                </p>
              </div>
            </div>

            <form
              className="management-form"
              onSubmit={handleAddStaff}
            >
              <div className="management-form-group">
                <label>
                  Staff Name
                </label>

                <input
                  type="text"
                  value={staffName}
                  onChange={(e) =>
                    setStaffName(
                      e.target.value
                    )
                  }
                  placeholder="Dr Lecturer"
                />
              </div>

              <div className="management-form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) =>
                    setStaffEmail(
                      e.target.value
                    )
                  }
                  placeholder="lecturer@example.com"
                />
              </div>

              <div className="management-form-group">
                <label>
                  Password
                </label>

                <input
                  type="password"
                  value={staffPassword}
                  onChange={(e) =>
                    setStaffPassword(
                      e.target.value
                    )
                  }
                  placeholder="At least 8 characters"
                />
              </div>

              <div className="management-form-group">
                <label>
                  Staff Type
                </label>

                <select
                  value={staffType}
                  onChange={(e) =>
                    setStaffType(
                      e.target.value
                    )
                  }
                >
                  <option value="lecturer">
                    Lecturer
                  </option>

                  <option value="TA">
                    TA
                  </option>
                </select>
              </div>

              <div className="management-form-group">
                <label>
                  Department
                </label>

                <select
                  value={
                    staffDepartmentId
                  }
                  onChange={(e) =>
                    setStaffDepartmentId(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Department
                  </option>

                  {departments.map(
                    (department) => (
                      <option
                        key={
                          department.department_id
                        }
                        value={
                          department.department_id
                        }
                      >
                        {
                          department.department_name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <button type="submit">
                Add Staff
              </button>
            </form>

            <div className="management-table-wrapper">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>
                      Staff Name
                    </th>

                    <th>Email</th>

                    <th>
                      Staff Type
                    </th>

                    <th>
                      Department
                    </th>

                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {staff.length > 0 ? (
                    staff.map((member) => (
                      <tr
                        key={
                          member.staff_id
                        }
                      >
                        <td>
                          {
                            member.staff_name
                          }
                        </td>

                        <td>
                          {member.email}
                        </td>

                        <td>
                          {member.staff_type}
                        </td>

                        <td>
                          {member.department_name ||
                            getDepartmentName(
                              member.department_id
                            )}
                        </td>

                        <td>
                          {member.is_active
                            ? "Active"
                            : "Inactive"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">
                        No teaching staff
                        found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================================================
              ASSIGN STAFF TO SECTION
          ================================================== */}
          <section className="management-card">
            <div className="management-section-header">
              <div>
                <h2>
                  Assign Staff to
                  Section
                </h2>

                <p>
                  Assign a lecturer or TA
                  to a course section.
                </p>
              </div>
            </div>

            <form
              className="management-form"
              onSubmit={
                handleAssignStaff
              }
            >
              <div className="management-form-group">
                <label>Section</label>

                <select
                  value={
                    assignSectionId
                  }
                  onChange={(e) =>
                    setAssignSectionId(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Section
                  </option>

                  {sections.map((section) => (
                    <option
                      key={
                        section.section_id
                      }
                      value={
                        section.section_id
                      }
                    >
                      {getCourseName(
                        section.course_id
                      )}{" "}
                      -{" "}
                      {
                        section.section_name
                      }
                    </option>
                  ))}
                </select>
              </div>

              <div className="management-form-group">
                <label>Staff</label>

                <select
                  value={assignStaffId}
                  onChange={(e) =>
                    setAssignStaffId(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Staff
                  </option>

                  {staff.map((member) => (
                    <option
                      key={
                        member.staff_id
                      }
                      value={
                        member.staff_id
                      }
                    >
                      {
                        member.staff_name
                      }{" "}
                      -{" "}
                      {member.staff_type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="management-form-group">
                <label>
                  Staff Role
                </label>

                <select
                  value={
                    assignStaffRole
                  }
                  onChange={(e) =>
                    setAssignStaffRole(
                      e.target.value
                    )
                  }
                >
                  <option value="lecturer">
                    Lecturer
                  </option>

                  <option value="TA">
                    TA
                  </option>
                </select>
              </div>

              <button type="submit">
                Assign Staff
              </button>
            </form>
          </section>

          {/* ==================================================
              CSV IMPORT
          ================================================== */}
          <section className="management-card">
            <div className="management-section-header">
              <div>
                <h2>
                  Import Students
                </h2>

                <p>
                  Import student accounts
                  from a CSV file.
                </p>
              </div>
            </div>

            <form
              className="management-form"
              onSubmit={
                handleImportStudents
              }
            >
              <div className="management-form-group">
                <label>CSV File</label>

                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={
                    handleCsvFileChange
                  }
                />
              </div>

              <div className="management-form-group">
                <label>
                  Default Password
                </label>

                <input
                  type="text"
                  value={
                    defaultPassword
                  }
                  onChange={(e) =>
                    setDefaultPassword(
                      e.target.value
                    )
                  }
                  placeholder="Student@123"
                />
              </div>

              <div className="management-form-group">
                <label>
                  Department
                </label>

                <select
                  value={
                    importDepartmentId
                  }
                  onChange={(e) =>
                    setImportDepartmentId(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Department
                  </option>

                  {departments.map(
                    (department) => (
                      <option
                        key={
                          department.department_id
                        }
                        value={
                          department.department_id
                        }
                      >
                        {
                          department.department_name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="management-form-group">
                <label>
                  Section{" "}
                  <span>
                    (optional)
                  </span>
                </label>

                <select
                  value={
                    importSectionId
                  }
                  onChange={(e) =>
                    setImportSectionId(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    No Section
                  </option>

                  {sections.map((section) => (
                    <option
                      key={
                        section.section_id
                      }
                      value={
                        section.section_id
                      }
                    >
                      {getCourseName(
                        section.course_id
                      )}{" "}
                      -{" "}
                      {
                        section.section_name
                      }
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={importLoading}
              >
                {importLoading
                  ? "Importing..."
                  : "Import Students"}
              </button>
            </form>

            {importMessage && (
              <div className="management-import-message">
                {importMessage}
              </div>
            )}

            {importResult && (
              <div className="management-import-result">
                <div>
                  <strong>
                    Total:
                  </strong>{" "}
                  {importResult.total}
                </div>

                <div>
                  <strong>
                    Created:
                  </strong>{" "}
                  {importResult.created}
                </div>

                <div>
                  <strong>
                    Rejected:
                  </strong>{" "}
                  {importResult.rejected}
                </div>

                {importResult
                  .rejected_rows?.length >
                  0 && (
                  <div className="management-rejected-rows">
                    <h4>
                      Rejected Rows
                    </h4>

                    <div className="management-table-wrapper">
                      <table className="management-table">
                        <thead>
                          <tr>
                            <th>Row</th>
                            <th>
                              Student Code
                            </th>
                            <th>
                              Reason
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {importResult.rejected_rows.map(
                            (
                              row,
                              index
                            ) => (
                              <tr
                                key={
                                  index
                                }
                              >
                                <td>
                                  {row.row}
                                </td>

                                <td>
                                  {row.student_code ||
                                    "-"}
                                </td>

                                <td>
                                  {
                                    row.reason
                                  }
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="management-import-help">
              <p>
                <strong>
                  Required CSV columns:
                </strong>{" "}
                student_code,
                student_name, email
              </p>

              <p>
                <strong>
                  Optional:
                </strong>{" "}
                level
              </p>

              <p>
                Maximum allowed rows:
                1000
              </p>
            </div>
          </section>
        </>
      )}
    </section>
  );
}

export default Management;