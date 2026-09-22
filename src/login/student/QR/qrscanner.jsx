import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { MdQrCodeScanner } from "react-icons/md";
import api from "../../../api/axios";
import "./qrscanner.css";

function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // START QR SCANNER
  // =====================================================

  useEffect(() => {
    if (!scanning) {
      return;
    }

    console.log("Scanner is starting...");

    const scanner = new Html5Qrcode("qr-reader");

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          console.log("🔥 QR DETECTED:", decodedText);

          setResult(decodedText);

          try {
            await scanner.stop();
            scanner.clear();
          } catch (error) {
            console.log("Scanner stop error:", error);
          }

          setScanning(false);

          await scanAttendance(decodedText);
        },
        (errorMessage) => {
          console.log("QR scanning:", errorMessage);
        }
      )
      .catch((error) => {
        console.log("Camera error:", error);

        setMessage("Could not access the camera.");
        setScanning(false);
      });

    return () => {
      if (scanner.isScanning) {
        scanner.stop().catch(() => {});
      }
    };
  }, [scanning]);

  // =====================================================
  // SEND QR TOKEN TO BACKEND
  // =====================================================

  async function scanAttendance(qrToken) {
    console.log("Sending token to backend...");

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/attendance/scan",
        {
          token: qrToken,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Scan response:", response.data);

      if (response.data.accepted) {
        if (response.data.duplicate) {
          setMessage("Attendance already recorded.");
        } else {
          setMessage(
            `Attendance recorded successfully. Status: ${response.data.attendance_status}`
          );
        }
      } else {
        setMessage(`Attendance rejected: ${response.data.reason}`);
      }
    } catch (error) {
      console.log("Scan error:", error);

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.reason ||
          "Failed to record attendance."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // START SCANNER BUTTON
  // =====================================================

  function startScanner() {
    console.log("Start Scanner button clicked");

    setResult("");
    setMessage("");
    setScanning(true);
  }

  // =====================================================
  // STOP SCANNER
  // =====================================================

  async function stopScanner() {
    setScanning(false);
    setResult("");
    setMessage("");
  }

  return (
    <main className="dashboard-content">
      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">
        <div>
          <p className="page-small-title">Attendance</p>

          <h1>Scan QR Code</h1>

          <p className="page-description">
            Scan the QR code displayed by your lecturer to record your
            attendance.
          </p>
        </div>
      </div>

      {/* ================= SCANNER LAYOUT ================= */}

      <div className="scanner-layout">
        {/* ================= SCANNER CARD ================= */}

        <div className="scanner-card">
          <div className="scanner-card-header">
            <div>
              <h2>Attendance Scanner</h2>

              <p>
                Make sure the QR code is clearly visible inside the scanning
                area.
              </p>
            </div>

            <div className="scanner-header-icon">
              <MdQrCodeScanner size={25} />
            </div>
          </div>

          {/* ================= CAMERA / PLACEHOLDER ================= */}

          <div className="scanner-area">
            {!scanning ? (
              <div className="scanner-placeholder">
                <div className="scanner-frame">
                  <MdQrCodeScanner size={95} className="qr-icon" />
                </div>

                <h3>Ready to Scan</h3>

                <p>
                  Click the button below to activate your camera.
                </p>
              </div>
            ) : (
              <div className="scanner-video">
                <div id="qr-reader"></div>
              </div>
            )}
          </div>

          {/* ================= ACTION BUTTON ================= */}

          <div className="scanner-actions">
            {!scanning ? (
              <button
                className="scan-button"
                onClick={startScanner}
                disabled={loading}
              >
                <MdQrCodeScanner size={20} />

                {loading ? "Processing..." : "Start Scanner"}
              </button>
            ) : (
              <button className="stop-button" onClick={stopScanner}>
                Stop Scanner
              </button>
            )}
          </div>

          {/* ================= QR RESULT ================= */}

          {result && (
            <div className="scan-result success">
              <div className="result-icon">✓</div>

              <div>
                <strong>QR Code Detected</strong>

                <p>{result}</p>
              </div>
            </div>
          )}

          {/* ================= ATTENDANCE MESSAGE ================= */}

          {message && (
            <div
              className={`scan-result ${
                message.toLowerCase().includes("success")
                  ? "success"
                  : "error"
              }`}
            >
              <div className="result-icon">
                {message.toLowerCase().includes("success") ? "✓" : "!"}
              </div>

              <div>
                <strong>
                  {message.toLowerCase().includes("success")
                    ? "Attendance Status"
                    : "Scan Status"}
                </strong>

                <p>{message}</p>
              </div>
            </div>
          )}
        </div>

        {/* ================= INSTRUCTIONS ================= */}

        <div className="instructions-card">
          <div className="instructions-header">
            <div className="instructions-icon">?</div>

            <div>
              <h2>How to Scan</h2>

              <p>Follow these steps</p>
            </div>
          </div>

          {/* ================= STEPS ================= */}

          <div className="instruction-list">
            <div className="instruction-item">
              <div className="instruction-number">1</div>

              <div>
                <strong>Ask your lecturer to display the QR</strong>

                <p>
                  The lecturer will generate a QR code for the current
                  attendance session.
                </p>
              </div>
            </div>

            <div className="instruction-item">
              <div className="instruction-number">2</div>

              <div>
                <strong>Start the scanner</strong>

                <p>
                  Click "Start Scanner" and allow camera access when requested.
                </p>
              </div>
            </div>

            <div className="instruction-item">
              <div className="instruction-number">3</div>

              <div>
                <strong>Scan the QR code</strong>

                <p>Place the QR code inside the scanning frame.</p>
              </div>
            </div>

            <div className="instruction-item">
              <div className="instruction-number">4</div>

              <div>
                <strong>Check your attendance</strong>

                <p>
                  Your attendance status will appear after the scan is
                  completed.
                </p>
              </div>
            </div>
          </div>

          {/* ================= SECURITY NOTE ================= */}

          <div className="security-note">
            <span>🔒</span>

            <p>
              Your attendance is securely recorded after successful
              verification.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default QRScanner;