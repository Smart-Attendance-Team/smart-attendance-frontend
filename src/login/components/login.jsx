import { useState } from "react";
import api from "../../api/axios";
import "./login.css";
import LogoBUA from "../../Logo_BUA.jpeg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setMessage("");

    let valid = true;

    if (email.trim() === "") {
      setEmailError("Email is required");
      valid = false;
    }

    if (password.trim() === "") {
      setPasswordError("Password is required");
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      console.log("Token:", response.data.token);
      console.log("Role:", response.data.role);

      // Save authentication data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      setMessage("Login successful");

      // Navigate based on user role
      if (response.data.role === "student") {
        navigate("/home");
      } else if (
        response.data.role === "lecturer" ||
        response.data.role === "ta"
      ) {
        navigate("/lecturer");
      } else if (response.data.role === "admin") {
        navigate("/admin");
      } else if (response.data.role === "auditor") {
        navigate("/auditor");
      } else {
        setMessage("Unknown user role");
      }

    } catch (error) {
      console.log("ERROR:", error);
      console.log("RESPONSE:", error.response);
      console.log("DATA:", error.response?.data);

      setMessage(
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Login failed"
      );
    }
  }

  return (
    <div className="login-container">
      <img src={LogoBUA} alt="BUA Logo" />

      <h2 className="sign-in">
        Sign in to your account
      </h2>

      <p className="sign-in-p">
        Sign in to access your attendence profile and services
      </p>

      <form onSubmit={handleLogin}>

        <div>
          <label htmlFor="email">
            Email Address
          </label>

          <input
            type="email"
            id="email"
            placeholder="admin@test.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {emailError && (
            <p className="error-meg">
              {emailError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password">
            Password
          </label>

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password:Admin@123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="password-eye"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>
          </div>

          {passwordError && (
            <p className="error-meg">
              {passwordError}
            </p>
          )}
        </div>

        <button type="submit">
          Sign in
        </button>

        {message && (
          <p className="error-meg">
            {message}
          </p>
        )}

      </form>
    </div>
  );
}

export default Login;