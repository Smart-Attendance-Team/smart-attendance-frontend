import { BrowserRouter, Routes, Route } from "react-router-dom";

// Login
import Login from "../components/login";

// ================= STUDENT =================
import StudentLayout from "../student/studentLayout";

import Home from "../student/home/home";
import StudentTimetable from "../student/timetable/timetable";
import QRScanner from "../student/QR/qrscanner";
import History from "../student/history/history";
import Correction from "../student/correction/correction";
import MyCorrections from "../student/correction/myCorrection";

// ================= LECTURER / TA =================
import LecturerLayout from "../lecturer/lecturerLayout";
import OpenSession from "../lecturer/openSession/openSession";
import ShowQR from "../lecturer/showQR/showQR";
import PendingCorrections from "../lecturer/modifyCorrections/modifyCorrections";

// ================= ADMIN =================
import AdminLayout from "../admin/adminLayout";
import AdminDashboard from "../admin/dashboard/dashboard";
import Management from "../admin/management/management";
import AdminTimetable from "../admin/timetable/timetable";
import ReportApproval from "../admin/reportApproval/reportApproval";

// ================= AUDITOR =================
import AuditorLayout from "../auditor/auditorLayout";
import AuditorDashboard from "../auditor/dashboard/dashboard";
import AuditorHistory from "../auditor/history/history";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LOGIN ================= */}

        <Route path="/" element={<Login />} />


        {/* ================= STUDENT ================= */}

        <Route element={<StudentLayout />}>

          <Route
            path="/home"
            element={<Home />}
          />

          <Route
            path="/timetable"
            element={<StudentTimetable />}
          />

          <Route
            path="/qrscanner"
            element={<QRScanner />}
          />

          <Route
            path="/history"
            element={<History />}
          />

          <Route
            path="/correction"
            element={<Correction />}
          />

          <Route
            path="/corrections"
            element={<MyCorrections />}
          />

        </Route>


        {/* ================= LECTURER / TA ================= */}

        <Route
          path="/lecturer"
          element={<LecturerLayout />}
        >
          <Route
            index
            element={<OpenSession />}
          />

          <Route
            path="showqr"
            element={<ShowQR />}
          />

          <Route
            path="corrections"
            element={<PendingCorrections />}
          />
        </Route>


        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="management"
            element={<Management />}
          />

          <Route
            path="timetable"
            element={<AdminTimetable />}
          />

          <Route
            path="report-approval"
            element={<ReportApproval />}
          />
        </Route>


        {/* ================= AUDITOR ================= */}

        <Route
          path="/auditor"
          element={<AuditorLayout />}
        >
          <Route
            index
            element={<AuditorDashboard />}
          />

          <Route
            path="history"
            element={<AuditorHistory />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;