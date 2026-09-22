import "./timetable.css";

function Timetable() {
  // TEMPORARY MOCK DATA
  // سيتم استبدالها ببيانات الـBackend لاحقًا
  const classes = [
    {
      day: "Saturday",
      subject: "Database",
      lecturer: "Dr. Ahmed",
      room: "A101",
      time: "10:00 AM - 12:00 PM",
      type: "Lecture",
    },
    {
      day: "Sunday",
      subject: "Web Development",
      lecturer: "Dr. Sara",
      room: "B204",
      time: "12:00 PM - 02:00 PM",
      type: "Lecture",
    },
    {
      day: "Monday",
      subject: "Artificial Intelligence",
      lecturer: "Dr. Mohamed",
      room: "C105",
      time: "02:00 PM - 04:00 PM",
      type: "Lecture",
    },
    {
      day: "Tuesday",
      subject: "Data Structures",
      lecturer: "Dr. Ali",
      room: "A203",
      time: "09:00 AM - 11:00 AM",
      type: "Lab",
    },
    {
      day: "Wednesday",
      subject: "Machine Learning",
      lecturer: "Dr. Hany",
      room: "C201",
      time: "11:00 AM - 01:00 PM",
      type: "Lecture",
    },
  ];

  return (
    <main className="dashboard-content">

      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">

        <div>
          <p className="page-small-title">
            Academic Schedule
          </p>

          <h1>Timetable</h1>

          <p className="page-description">
            View your weekly classes and lecture schedule.
          </p>
        </div>

        <div className="week-box">
          <span>Current Week</span>
          <strong>September 21 - 27, 2026</strong>
        </div>

      </div>


      {/* ================= SUMMARY ================= */}

      <div className="timetable-summary">

        <div className="summary-card">

          <div className="summary-icon blue">
            ▣
          </div>

          <div>
            <span>Total Classes</span>

            <strong>
              {classes.length}
            </strong>
          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon green">
            ✓
          </div>

          <div>
            <span>Lectures</span>

            <strong>
              {classes.filter(
                (item) => item.type === "Lecture"
              ).length}
            </strong>
          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon orange">
            ⌘
          </div>

          <div>
            <span>Labs</span>

            <strong>
              {classes.filter(
                (item) => item.type === "Lab"
              ).length}
            </strong>
          </div>

        </div>

      </div>


      {/* ================= TABLE ================= */}

      <div className="timetable-card">

        <div className="table-header">

          <div>
            <h2>Weekly Schedule</h2>

            <p>
              Your classes for this week
            </p>
          </div>

          <select className="week-select">
            <option>This Week</option>
            <option>Next Week</option>
          </select>

        </div>


        <div className="table-wrapper">

          <table className="timetable-table">

            <thead>
              <tr>
                <th>Day</th>
                <th>Course</th>
                <th>Lecturer</th>
                <th>Room</th>
                <th>Time</th>
                <th>Type</th>
              </tr>
            </thead>


            <tbody>

              {classes.map((item, index) => (

                <tr key={index}>

                  <td>
                    <span className="day-badge">
                      {item.day}
                    </span>
                  </td>

                  <td>
                    <strong className="course-name">
                      {item.subject}
                    </strong>
                  </td>

                  <td>
                    <span className="lecturer-name">
                      {item.lecturer}
                    </span>
                  </td>

                  <td>
                    <span className="room-badge">
                      {item.room}
                    </span>
                  </td>

                  <td>
                    <span className="time-text">
                      {item.time}
                    </span>
                  </td>

                  <td>

                    <span
                      className={`type-badge ${
                        item.type === "Lab"
                          ? "lab"
                          : "lecture"
                      }`}
                    >
                      {item.type}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}

export default Timetable;