import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/home">Home</Link>

      <Link to="/timetable">Timetable</Link>

      <Link to="/qrscanner">Scan QR</Link>

      <Link to="/history">History</Link>

      <Link to="/correction">Correction Request</Link>


    </nav>
  );
}

export default Navbar;