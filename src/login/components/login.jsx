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
  const [messageType, setMessageType] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setMessage("");
    setMessageType("");

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
        email: email.trim(),
        password,
      });

      console.log("Token:", response.data.token);
      console.log("Role:", response.data.role);

      // Save authentication data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      setMessage("Login successful");
      setMessageType("success");

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
        setMessageType("error");
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

      setMessageType("error");
    }
  }

  return (
    <div className="login-container">
      <img
        className="login-logo"
        src={LogoBUA}
        alt="BUA Logo"
      />

      <h2 className="sign-in">
        Sign in to your account
      </h2>

      <p className="sign-in-p">
        Sign in to access your attendance profile and services
      </p>

      <form onSubmit={handleLogin}>
        <div className="login-field">
          <label htmlFor="email">
            Email Address
          </label>

          <input
            type="email"
            id="email"
            placeholder="admin@test.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
          />

          {emailError && (
            <p className="login-error">
              {emailError}
            </p>
          )}
        </div>

        <div className="login-field">
          <label htmlFor="password">
            Password
          </label>

          <div className="password-container">
            <input
              type={
                showPassword ? "text" : "password"
              }
              id="password"
              placeholder="Password:Admin@123"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
            />

            <button
              type="button"
              className="password-eye"
              onClick={() =>
                setShowPassword((previous) => !previous)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>

          {passwordError && (
            <p className="login-error">
              {passwordError}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="login-button"
        >
          Sign in
        </button>

        {message && (
          <p
            className={
              messageType === "success"
                ? "login-success"
                : "login-error"
            }
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;