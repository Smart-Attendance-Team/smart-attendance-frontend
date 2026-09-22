import { useState } from "react";
import api from "../../../api/axios";
import "./report.css";

function Reports() {
  const [courseCode, setCourseCode] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =====================================================
  // Report Parameters
  // =====================================================

  function getReportParams() {
    return {
      course_code: courseCode || undefined,
      section_id: sectionId || undefined,
      staff_id: staffId || undefined,
      student_code: studentCode || undefined,
      from: from || undefined,
      to: to || undefined,
    };
  }

  // =====================================================
  // Search Report
  // =====================================================

  async function handleSearch(event) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (from && to && from > to) {
      setMessage("The From date must be before the To date.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/reports/attendance", {
        params: getReportParams(),
      });

      console.log("Attendance Report:", response.data);

      setReport(response.data);

      if (
        !response.data?.rows ||
        response.data.rows.length === 0
      ) {
        setMessage("No attendance records found.");
        setMessageType("info");
      } else {
        setMessage("Report loaded successfully.");
        setMessageType("success");
      }
    } catch (error) {
      console.error("Report Error:", error);
      console.error("Response:", error.response);

      setReport(null);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load attendance report."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // Clear Filters
  // =====================================================

  function handleClearFilters() {
    setCourseCode("");
    setSectionId("");
    setStaffId("");
    setStudentCode("");
    setFrom("");
    setTo("");

    setReport(null);

    setMessage("");
    setMessageType("");
  }

  // =====================================================
  // Export CSV
  // =====================================================

  async function handleExportCSV() {
    setMessage("");
    setMessageType("");

    try {
      setCsvLoading(true);

      const response = await api.get(
        "/reports/attendance/export",
        {
          params: {
            format: "csv",
            ...getReportParams(),
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "text/csv",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "attendance-report.csv";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      setMessage("CSV report exported successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("CSV Export Error:", error);
      console.error("Response:", error.response);

      setMessage("Failed to export CSV report.");
      setMessageType("error");
    } finally {
      setCsvLoading(false);
    }
  }

  // =====================================================
  // Summary
  // =====================================================

  const summary = report?.summary || {};

  const total = summary.total ?? 0;
  const present = summary.present ?? 0;
  const late = summary.late ?? 0;
  const excused = summary.excused ?? 0;
  const absent = summary.absent ?? 0;

  const attendanceRate =
    summary.attendance_rate_percent ?? 0;

  const lateRate =
    summary.late_rate_percent ?? 0;

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="reports-content">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="reports-page-header">

        <div>
          <span className="reports-small-title">
            ADMINISTRATION
          </span>

          <h1>Attendance Reports</h1>

          <p>
            Search and review attendance records using
            the available filters.
          </p>
        </div>

      </div>


      {/* =================================================
          MESSAGE
      ================================================= */}

      {message && (
        <div
          className={`reports-message ${messageType}`}
        >
          {message}
        </div>
      )}


      {/* =================================================
          FILTERS
      ================================================= */}

      <section className="reports-card">

        <div className="reports-section-header">

          <div>
            <h2>Report Filters</h2>

            <p>
              Choose the filters you want to apply.
            </p>
          </div>

        </div>


        <form
          className="reports-filter-grid"
          onSubmit={handleSearch}
        >

          {/* Course */}

          <div className="reports-form-group">

            <label>
              Course Code
            </label>

            <input
              type="text"
              placeholder="CS101"
              value={courseCode}
              onChange={(event) =>
                setCourseCode(event.target.value)
              }
            />

          </div>


          {/* Section */}

          <div className="reports-form-group">

            <label>
              Section ID
            </label>

            <input
              type="number"
              placeholder="1"
              value={sectionId}
              onChange={(event) =>
                setSectionId(event.target.value)
              }
            />

          </div>


          {/* Staff */}

          <div className="reports-form-group">

            <label>
              Staff ID
            </label>

            <input
              type="number"
              placeholder="1"
              value={staffId}
              onChange={(event) =>
                setStaffId(event.target.value)
              }
            />

          </div>


          {/* Student */}

          <div className="reports-form-group">

            <label>
              Student Code
            </label>

            <input
              type="text"
              placeholder="S1001"
              value={studentCode}
              onChange={(event) =>
                setStudentCode(event.target.value)
              }
            />

          </div>


          {/* From */}

          <div className="reports-form-group">

            <label>
              From
            </label>

            <input
              type="date"
              value={from}
              onChange={(event) =>
                setFrom(event.target.value)
              }
            />

          </div>


          {/* To */}

          <div className="reports-form-group">

            <label>
              To
            </label>

            <input
              type="date"
              value={to}
              onChange={(event) =>
                setTo(event.target.value)
              }
            />

          </div>


          {/* Buttons */}

          <div className="reports-filter-actions">

            <button
              type="submit"
              className="reports-search-button"
              disabled={loading}
            >
              {loading
                ? "Searching..."
                : "Search Report"}
            </button>


            <button
              type="button"
              className="reports-clear-button"
              onClick={handleClearFilters}
            >
              Clear
            </button>

          </div>

        </form>

      </section>


      {/* =================================================
          SUMMARY
      ================================================= */}

      {report && (
        <section className="reports-card">

          <div className="reports-section-header">

            <div>
              <h2>Attendance Summary</h2>

              <p>
                Summary of attendance records matching
                the selected filters.
              </p>
            </div>

          </div>


          <div className="reports-summary-grid">

            <div className="summary-stat">
              <span>Total Attendance</span>
              <strong>{total}</strong>
            </div>


            <div className="summary-stat">
              <span>Present</span>
              <strong>{present}</strong>
            </div>


            <div className="summary-stat">
              <span>Late</span>
              <strong>{late}</strong>
            </div>


            <div className="summary-stat">
              <span>Excused</span>
              <strong>{excused}</strong>
            </div>


            <div className="summary-stat">
              <span>Absent</span>
              <strong>{absent}</strong>
            </div>


            <div className="summary-stat summary-highlight">
              <span>Attendance Rate</span>

              <strong>
                {attendanceRate}%
              </strong>
            </div>


            <div className="summary-stat">
              <span>Late Rate</span>

              <strong>
                {lateRate}%
              </strong>
            </div>

          </div>

        </section>
      )}


      {/* =================================================
          RECORDS
      ================================================= */}

      <section className="reports-card">

        <div className="reports-section-header">

          <div>
            <h2>Attendance Records</h2>

            <p>
              Detailed attendance records returned
              by the report.
            </p>
          </div>


          {report?.rows?.length > 0 && (
            <div className="reports-export-actions">

              <button
                type="button"
                className="reports-csv-button"
                onClick={handleExportCSV}
                disabled={csvLoading}
              >
                {csvLoading
                  ? "Exporting..."
                  : "Export CSV"}
              </button>

            </div>
          )}

        </div>


        {/* =================================================
            NO REPORT
        ================================================= */}

        {!report && (
          <div className="reports-empty">

            <span>▤</span>

            <h3>
              No report loaded
            </h3>

            <p>
              Use the filters above and search to
              generate an attendance report.
            </p>

          </div>
        )}


        {/* =================================================
            TABLE
        ================================================= */}

        {report?.rows?.length > 0 && (
          <div className="reports-table-wrapper">

            <table className="reports-table">

              <thead>

                <tr>
                  <th>Course</th>
                  <th>Course Name</th>
                  <th>Section</th>
                  <th>Date</th>
                  <th>Student Code</th>
                  <th>Student Name</th>
                  <th>Status</th>
                  <th>Minutes Late</th>
                  <th>Source</th>
                </tr>

              </thead>


              <tbody>

                {report.rows.map(
                  (item, index) => (
                    <tr key={index}>

                      <td className="report-course-code">
                        {item.course_code || "-"}
                      </td>

                      <td>
                        {item.course_name || "-"}
                      </td>

                      <td>
                        {item.section_name || "-"}
                      </td>

                      <td>
                        {item.session_date || "-"}
                      </td>

                      <td>
                        {item.student_code || "-"}
                      </td>

                      <td>
                        {item.student_name || "-"}
                      </td>

                      <td>

                        <span
                          className={`attendance-status status-${item.attendance_status}`}
                        >
                          {item.attendance_status || "-"}
                        </span>

                      </td>

                      <td>
                        {item.minutes_late ?? 0}
                      </td>

                      <td>
                        {item.source || "-"}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}


        {/* =================================================
            EMPTY RESULTS
        ================================================= */}

        {report &&
          (!report.rows ||
            report.rows.length === 0) && (
            <div className="reports-empty">

              <span>▤</span>

              <h3>
                No attendance records
              </h3>

              <p>
                No records match the selected
                filters.
              </p>

            </div>
          )}

      </section>

    </section>
  );
}

export default Reports;