import { useState } from "react";
import "./roster.css";

function Roster() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Ahmed Mohamed",
      studentId: "20230001",
      status: "Present",
    },
    {
      id: 2,
      name: "Sara Ali",
      studentId: "20230002",
      status: "Present",
    },
    {
      id: 3,
      name: "Omar Hassan",
      studentId: "20230003",
      status: "Absent",
    },
    {
      id: 4,
      name: "Mariam Ahmed",
      studentId: "20230004",
      status: "Present",
    },
    {
      id: 5,
      name: "Youssef Ali",
      studentId: "20230005",
      status: "Excused",
    },
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);

  const presentCount = students.filter(
    (student) => student.status === "Present"
  ).length;

  const absentCount = students.filter(
    (student) => student.status === "Absent"
  ).length;

  const excusedCount = students.filter(
    (student) => student.status === "Excused"
  ).length;

  function openCorrection(student, newStatus) {
    setSelectedStudent({
      ...student,
      newStatus,
    });

    setReason("");
    setShowModal(true);
  }

  function confirmCorrection() {
    if (!reason.trim()) {
      return;
    }

    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === selectedStudent.id
          ? {
              ...student,
              status: selectedStudent.newStatus,
            }
          : student
      )
    );

    setShowModal(false);
    setSelectedStudent(null);
    setReason("");
  }

  function closeModal() {
    setShowModal(false);
    setSelectedStudent(null);
    setReason("");
  }

  return (
    <div className="roster-page">

      {/* ================= HEADER ================= */}

      <div className="roster-header">
        <div>
          <h1>Live Roster</h1>

          <p>
            Monitor and manage student attendance for the current session.
          </p>
        </div>

        <div className="session-status">
          <span className="status-dot"></span>
          Session Active
        </div>
      </div>


      {/* ================= SESSION INFO ================= */}

      <div className="session-card">

        <div className="session-info">
          <span className="session-label">Course</span>
          <strong>Web Development</strong>
        </div>

        <div className="session-info">
          <span className="session-label">Section</span>
          <strong>Section 1</strong>
        </div>

        <div className="session-info">
          <span className="session-label">Room</span>
          <strong>B204</strong>
        </div>

        <div className="session-info">
          <span className="session-label">Time</span>
          <strong>12:00 - 14:00</strong>
        </div>

      </div>


      {/* ================= STATISTICS ================= */}

      <div className="roster-stats">

        <div className="roster-stat-card">
          <span>Total Students</span>
          <strong>{students.length}</strong>
        </div>

        <div className="roster-stat-card present">
          <span>Present</span>
          <strong>{presentCount}</strong>
        </div>

        <div className="roster-stat-card absent">
          <span>Absent</span>
          <strong>{absentCount}</strong>
        </div>

        <div className="roster-stat-card excused">
          <span>Excused</span>
          <strong>{excusedCount}</strong>
        </div>

      </div>


      {/* ================= ROSTER TABLE ================= */}

      <div className="roster-card">

        <div className="roster-card-header">

          <div>
            <h2>Attendance Roster</h2>

            <p>
              Students currently enrolled in this session.
            </p>
          </div>

        </div>


        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Status</th>
                <th>Manual Correction</th>
              </tr>
            </thead>


            <tbody>

              {students.map((student) => (

                <tr key={student.id}>

                  <td>
                    <div className="student-name">

                      <div className="student-avatar">
                        {student.name.charAt(0)}
                      </div>

                      <span>{student.name}</span>

                    </div>
                  </td>


                  <td>
                    {student.studentId}
                  </td>


                  <td>

                    <span
                      className={`attendance-status ${student.status.toLowerCase()}`}
                    >
                      {student.status}
                    </span>

                  </td>


                  <td>

                    <div className="action-buttons">

                      <button
                        type="button"
                        className="present-button"
                        onClick={() =>
                          openCorrection(student, "Present")
                        }
                      >
                        Present
                      </button>


                      <button
                        type="button"
                        className="absent-button"
                        onClick={() =>
                          openCorrection(student, "Absent")
                        }
                      >
                        Absent
                      </button>


                      <button
                        type="button"
                        className="excused-button"
                        onClick={() =>
                          openCorrection(student, "Excused")
                        }
                      >
                        Excused
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* ================= CORRECTION MODAL ================= */}

      {showModal && selectedStudent && (

        <div className="modal-overlay">

          <div className="correction-modal">

            <div className="modal-header">

              <h2>
                Manual Attendance Correction
              </h2>

              <button
                type="button"
                className="close-button"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            <div className="modal-content">

              <p>
                You are changing the attendance status of:
              </p>

              <strong>
                {selectedStudent.name}
              </strong>


              <div className="new-status">

                New Status:

                <span>
                  {selectedStudent.newStatus}
                </span>

              </div>


              <label htmlFor="reason">
                Reason <span>*</span>
              </label>


              <textarea
                id="reason"
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                placeholder="Enter the reason for this correction..."
                rows="4"
              />


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="confirm-button"
                  onClick={confirmCorrection}
                >
                  Confirm Correction
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Roster;