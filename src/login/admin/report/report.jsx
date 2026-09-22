import { useState } from "react";
import api from "../../../api/axios";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Reports() {
  const token = localStorage.getItem("token");

  const [courseCode, setCourseCode] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [report, setReport] = useState(null);
  const [message, setMessage] = useState("");

  // =========================
  // Search Report
  // =========================
  async function handleSearch(e) {
    e.preventDefault();

    setMessage("");

    try {
      const response = await api.get("/reports/attendance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        params: {
          course_code: courseCode || undefined,
          section_id: sectionId || undefined,
          staff_id: staffId || undefined,
          student_code: studentCode || undefined,
          from: from || undefined,
          to: to || undefined,
        },
      });

      console.log("Report:", response.data);

      setReport(response.data);

      if (
        !response.data.rows ||
        response.data.rows.length === 0
      ) {
        setMessage("No attendance records found.");
      }
    } catch (error) {
      console.log("Report error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load report."
      );
    }
  }

  // =========================
  // Export CSV
  // =========================
  async function handleExportCSV() {
    try {
      const response = await api.get(
        "/reports/attendance/export",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          params: {
            format: "csv",
            course_code: courseCode || undefined,
            section_id: sectionId || undefined,
            staff_id: staffId || undefined,
            student_code: studentCode || undefined,
            from: from || undefined,
            to: to || undefined,
          },

          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "text/csv",
        })
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "attendance-report.csv"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("CSV Export error:", error);
      console.log("Response:", error.response);

      setMessage("Failed to export CSV report.");
    }
  }

  // =========================
  // Export PDF
  // =========================
  function handleExportPDF() {
    setMessage("");

    if (
      !report ||
      !Array.isArray(report.rows) ||
      report.rows.length === 0
    ) {
      setMessage(
        "Search for a report before exporting PDF."
      );

      return;
    }

    try {
      console.log("Starting PDF export...");

      // Create PDF
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // =========================
      // Title
      // =========================
      doc.setFontSize(18);

      doc.text(
        "Attendance Report",
        14,
        15
      );

      // =========================
      // Filters
      // =========================
      doc.setFontSize(9);

      const filters = [];

      if (courseCode) {
        filters.push(`Course: ${courseCode}`);
      }

      if (sectionId) {
        filters.push(`Section: ${sectionId}`);
      }

      if (staffId) {
        filters.push(`Staff: ${staffId}`);
      }

      if (studentCode) {
        filters.push(`Student: ${studentCode}`);
      }

      if (from) {
        filters.push(`From: ${from}`);
      }

      if (to) {
        filters.push(`To: ${to}`);
      }

      const filterText =
        filters.length > 0
          ? `Filters: ${filters.join(" | ")}`
          : "Filters: All";

      doc.text(
        filterText,
        14,
        22
      );

      // =========================
      // Summary
      // =========================
      if (report.summary) {
        doc.setFontSize(11);

        doc.text(
          "Summary",
          14,
          31
        );

        doc.setFontSize(9);

        const summaryText =
          `Total: ${report.summary.total}    ` +
          `Present: ${report.summary.present}    ` +
          `Late: ${report.summary.late}    ` +
          `Excused: ${report.summary.excused}    ` +
          `Absent: ${report.summary.absent}    ` +
          `Attendance Rate: ${report.summary.attendance_rate_percent}%    ` +
          `Late Rate: ${report.summary.late_rate_percent}%`;

        doc.text(
          summaryText,
          14,
          37
        );
      }

      // =========================
      // Table Data
      // =========================
      const tableRows = report.rows.map((item) => [
        item.course_code || "-",
        item.course_name || "-",
        item.section_name || "-",
        item.session_date || "-",
        item.student_code || "-",
        item.student_name || "-",
        item.attendance_status || "-",
        item.minutes_late ?? 0,
        item.source || "-",
      ]);

      console.log(
        "PDF table rows:",
        tableRows
      );

      // =========================
      // Create Table
      // =========================
      autoTable(doc, {
        startY: 44,

        head: [
          [
            "Course",
            "Course Name",
            "Section",
            "Date",
            "Student Code",
            "Student Name",
            "Status",
            "Late",
            "Source",
          ],
        ],

        body: tableRows,

        theme: "grid",

        styles: {
          fontSize: 7,
          cellPadding: 2,
          overflow: "linebreak",
        },

        headStyles: {
          fontSize: 7,
        },

        columnStyles: {
          0: {
            cellWidth: 20,
          },

          1: {
            cellWidth: 38,
          },

          2: {
            cellWidth: 25,
          },

          3: {
            cellWidth: 25,
          },

          4: {
            cellWidth: 25,
          },

          5: {
            cellWidth: 40,
          },

          6: {
            cellWidth: 25,
          },

          7: {
            cellWidth: 15,
          },

          8: {
            cellWidth: 20,
          },
        },

        margin: {
          top: 44,
          left: 10,
          right: 10,
          bottom: 15,
        },
      });

      // =========================
      // Page Numbers
      // =========================
      const pageCount =
        doc.internal.getNumberOfPages();

      for (
        let i = 1;
        i <= pageCount;
        i++
      ) {
        doc.setPage(i);

        doc.setFontSize(8);

        doc.text(
          `Page ${i} of ${pageCount}`,
          260,
          200
        );
      }

      // =========================
      // Save PDF
      // =========================
      doc.save(
        "attendance-report.pdf"
      );

      console.log(
        "PDF exported successfully."
      );

      setMessage(
        "PDF report exported successfully."
      );
    } catch (error) {
      console.error(
        "PDF Export Error:",
        error
      );

      setMessage(
        "Failed to export PDF report. Check the browser console."
      );
    }
  }

  return (
    <div>
      <h1>Attendance Reports</h1>

      {message && (
        <p>{message}</p>
      )}

      <hr />

      <h2>Filters</h2>

      <form onSubmit={handleSearch}>
        <div>
          <label>Course Code</label>
          <br />

          <input
            type="text"
            placeholder="CS101"
            value={courseCode}
            onChange={(e) =>
              setCourseCode(e.target.value)
            }
          />
        </div>

        <br />

        <div>
          <label>Section ID</label>
          <br />

          <input
            type="number"
            placeholder="1"
            value={sectionId}
            onChange={(e) =>
              setSectionId(e.target.value)
            }
          />
        </div>

        <br />

        <div>
          <label>Staff ID</label>
          <br />

          <input
            type="number"
            placeholder="1"
            value={staffId}
            onChange={(e) =>
              setStaffId(e.target.value)
            }
          />
        </div>

        <br />

        <div>
          <label>Student Code</label>
          <br />

          <input
            type="text"
            placeholder="S1001"
            value={studentCode}
            onChange={(e) =>
              setStudentCode(e.target.value)
            }
          />
        </div>

        <br />

        <div>
          <label>From</label>
          <br />

          <input
            type="date"
            value={from}
            onChange={(e) =>
              setFrom(e.target.value)
            }
          />
        </div>

        <br />

        <div>
          <label>To</label>
          <br />

          <input
            type="date"
            value={to}
            onChange={(e) =>
              setTo(e.target.value)
            }
          />
        </div>

        <br />

        <button type="submit">
          Search
        </button>

        {" "}

        <button
          type="button"
          onClick={handleExportCSV}
        >
          Export CSV
        </button>

        {" "}

        <button
          type="button"
          onClick={handleExportPDF}
        >
          Export PDF
        </button>
      </form>

      <hr />

      {/* =========================
          Summary
      ========================= */}

      {report &&
        report.summary && (
          <div>
            <h2>Summary</h2>

            <p>
              Total:{" "}
              {report.summary.total}
            </p>

            <p>
              Present:{" "}
              {report.summary.present}
            </p>

            <p>
              Late:{" "}
              {report.summary.late}
            </p>

            <p>
              Excused:{" "}
              {report.summary.excused}
            </p>

            <p>
              Absent:{" "}
              {report.summary.absent}
            </p>

            <p>
              Attendance Rate:{" "}
              {
                report.summary
                  .attendance_rate_percent
              }
              %
            </p>

            <p>
              Late Rate:{" "}
              {
                report.summary
                  .late_rate_percent
              }
              %
            </p>
          </div>
        )}

      <hr />

      <h2>Attendance Report</h2>

      {report &&
      report.rows &&
      report.rows.length > 0 ? (
        <table
          border="1"
          cellPadding="8"
        >
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
                  <td>
                    {item.course_code}
                  </td>

                  <td>
                    {item.course_name}
                  </td>

                  <td>
                    {item.section_name}
                  </td>

                  <td>
                    {item.session_date}
                  </td>

                  <td>
                    {item.student_code}
                  </td>

                  <td>
                    {item.student_name}
                  </td>

                  <td>
                    {item.attendance_status}
                  </td>

                  <td>
                    {item.minutes_late}
                  </td>

                  <td>
                    {item.source}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      ) : (
        <p>
          No data to display.
        </p>
      )}
    </div>
  );
}

export default Reports;