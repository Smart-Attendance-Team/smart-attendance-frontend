import { useMemo, useState } from "react";
import "./liveRoster.css";

const initialStudents = [
  {
    id: 1,
    studentId: "STU001",
    name: "Ahmed Ali",
    status: "Present",
    time: "10:03 AM",
  },
  {
    id: 2,
    studentId: "STU002",
    name: "Mariam Ahmed",
    status: "Present",
    time: "10:05 AM",
  },
  {
    id: 3,
    studentId: "STU003",
    name: "Omar Khaled",
    status: "Absent",
    time: "-",
  },
  {
    id: 4,
    studentId: "STU004",
    name: "Sara Mohamed",
    status: "Late",
    time: "10:14 AM",
  },
  {
    id: 5,
    studentId: "STU005",
    name: "Youssef Hassan",
    status: "Present",
    time: "10:07 AM",
  },
  {
    id: 6,
    studentId: "STU006",
    name: "Nour Ahmed",
    status: "Excused",
    time: "-",
  },
  {
    id: 7,
    studentId: "STU007",
    name: "Karim Mostafa",
    status: "Present",
    time: "10:09 AM",
  },
  {
    id: 8,
    studentId: "STU008",
    name: "Hana Adel",
    status: "Absent",
    time: "-",
  },
];

function LiveRoster() {
  const [students, setStudents] = useState(initialStudents);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStatus, setNewStatus] = useState("Present");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const [sessionOpen, setSessionOpen] = useState(true);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        student.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, searchTerm, statusFilter]);

  const totalStudents = students.length;

  const presentCount = students.filter(
    (student) => student.status === "Present"
  ).length;

  const lateCount = students.filter(
    (student) => student.status === "Late"
  ).length;

  const absentCount = students.filter(
    (student) => student.status === "Absent"
  ).length;

  const excusedCount = students.filter(
    (student) => student.status === "Excused"
  ).length;

  function openEditModal(student) {
    setSelectedStudent(student);
    setNewStatus(student.status);
    setReason("");
    setMessage("");
  }

  function closeEditModal() {
    setSelectedStudent(null);
    setReason("");
    setMessage("");
  }

  function handleSaveAttendance() {
    if (!reason.trim()) {
      setMessage("Please provide a reason for this manual change.");
      return;
    }

    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === selectedStudent.id
          ? {
              ...student,
              status: newStatus,
              time:
                newStatus === "Absent" || newStatus === "Excused"
                  ? "-"
                  : student.time === "-"
                  ? "Manual"
                  : student.time,
            }
          : student
      )
    );

    closeEditModal();
  }

  function handleCloseSession() {
    setSessionOpen(false);
  }

  return (
    <main className="dashboard-content">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Attendance Management</p>

          <h1>Live Attendance</h1>

          <p className="page-description">
            Monitor attendance and manage student attendance
            records for the active session.
          </p>
        </div>

        <div className="session-status-box">
          <span
            className={`session-status-dot ${
              sessionOpen ? "open" : "closed"
            }`}
          ></span>

          <div>
            <strong>
              {sessionOpen ? "Session Open" : "Session Closed"}
            </strong>

            <span>
              {sessionOpen
                ? "Attendance is being recorded"
                : "Attendance recording has ended"}
            </span>
          </div>
        </div>
      </div>

      {/* Session Information */}
      <div className="session-info-card">
        <div className="session-info-item">
          <span>Course</span>
          <strong>Database Systems</strong>
        </div>

        <div className="session-info-item">
          <span>Section</span>
          <strong>CS301 - A</strong>
        </div>

        <div className="session-info-item">
          <span>Room</span>
          <strong>Lab 3</strong>
        </div>

        <div className="session-info-item">
          <span>Time</span>
          <strong>10:00 AM - 11:30 AM</strong>
        </div>

        {sessionOpen && (
          <button
            type="button"
            className="close-session-button"
            onClick={handleCloseSession}
          >
            Close Session
          </button>
        )}
      </div>

      {/* Statistics */}
      <div className="roster-stats">
        <div className="roster-stat-card">
          <div className="roster-stat-icon blue">👥</div>

          <div>
            <span>Total Students</span>
            <strong>{totalStudents}</strong>
          </div>
        </div>

        <div className="roster-stat-card">
          <div className="roster-stat-icon green">✓</div>

          <div>
            <span>Present</span>
            <strong>{presentCount}</strong>
          </div>
        </div>

        <div className="roster-stat-card">
          <div className="roster-stat-icon orange">◷</div>

          <div>
            <span>Late</span>
            <strong>{lateCount}</strong>
          </div>
        </div>

        <div className="roster-stat-card">
          <div className="roster-stat-icon red">!</div>

          <div>
            <span>Absent</span>
            <strong>{absentCount}</strong>
          </div>
        </div>

        <div className="roster-stat-card">
          <div className="roster-stat-icon purple">✓</div>

          <div>
            <span>Excused</span>
            <strong>{excusedCount}</strong>
          </div>
        </div>
      </div>

      {/* Roster */}
      <div className="roster-card">
        <div className="roster-card-header">
          <div>
            <h2>Student Roster</h2>

            <p>
              Review attendance and make manual corrections when
              necessary.
            </p>
          </div>

          <div className="roster-filters">
            <div className="search-wrapper">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search student..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
              <option value="Excused">Excused</option>
            </select>
          </div>
        </div>

        <div className="roster-table-wrapper">
          <table className="roster-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Status</th>
                <th>Attendance Time</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar">
                          {student.name.charAt(0)}
                        </div>

                        <div>
                          <strong>{student.name}</strong>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="student-id">
                        {student.studentId}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`attendance-status ${student.status.toLowerCase()}`}
                      >
                        <span className="status-dot"></span>
                        {student.status}
                      </span>
                    </td>

                    <td>
                      <span className="attendance-time">
                        {student.time}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="edit-attendance-button"
                        onClick={() => openEditModal(student)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <div className="empty-roster">
                      <div className="empty-roster-icon">⌕</div>

                      <h3>No students found</h3>

                      <p>
                        Try changing the search or status filter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedStudent && (
        <div className="roster-modal-overlay">
          <div className="roster-modal">
            <div className="modal-header">
              <div>
                <p>Manual Attendance Change</p>

                <h2>Change Attendance</h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeEditModal}
              >
                ×
              </button>
            </div>

            <div className="selected-student-box">
              <div className="student-avatar large">
                {selectedStudent.name.charAt(0)}
              </div>

              <div>
                <strong>{selectedStudent.name}</strong>

                <span>{selectedStudent.studentId}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Attendance Status</label>

              <div className="status-options">
                <label
                  className={`status-option ${
                    newStatus === "Present" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance-status"
                    value="Present"
                    checked={newStatus === "Present"}
                    onChange={(event) =>
                      setNewStatus(event.target.value)
                    }
                  />

                  <span>Present</span>
                </label>

                <label
                  className={`status-option ${
                    newStatus === "Absent" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance-status"
                    value="Absent"
                    checked={newStatus === "Absent"}
                    onChange={(event) =>
                      setNewStatus(event.target.value)
                    }
                  />

                  <span>Absent</span>
                </label>

                <label
                  className={`status-option ${
                    newStatus === "Excused" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance-status"
                    value="Excused"
                    checked={newStatus === "Excused"}
                    onChange={(event) =>
                      setNewStatus(event.target.value)
                    }
                  />

                  <span>Excused</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="change-reason">
                Reason <span>*</span>
              </label>

              <textarea
                id="change-reason"
                rows="4"
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                placeholder="Explain why this attendance record is being changed..."
              />

              <small>
                A reason is required for every manual attendance
                change.
              </small>
            </div>

            {message && (
              <div className="modal-error">
                {message}
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={closeEditModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="save-attendance-button"
                onClick={handleSaveAttendance}
              >
                Save Change
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default LiveRoster;