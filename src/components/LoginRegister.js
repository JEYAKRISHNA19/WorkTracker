import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/LoginRegister.css";

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [empid, setEmpid] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const resetForm = () => {
    setUsername("");
    setEmpid("");
    setEmail("");
    setPassword("");
    setRole("user");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // Handle login
      try {
        const response = await axios.post("http://localhost:8081/login", {
          empid,
          password,
        });

        // Log the entire response for debugging
        console.log("Login response:", response.data);

        if (response.data.success) {
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("empid", empid);

          if (response.data.role === "admin") {
            navigate("/admin-dashboard");
          } else if (response.data.role === "user") {
            navigate("/user-dashboard");
          } else {
            alert("Invalid role!");
          }
        } else {
          alert(
            response.data.Error ||
              "Login failed. Please check your credentials and try again."
          );
        }
      } catch (err) {
        console.error("Login failed:", err.response?.data || err.message);
        alert("Login failed. Please try again.");
      }
    } else {
      // Handle registration
      try {
        const response = await axios.post("http://localhost:8081/register", {
          username,
          empid,
          email,
          password,
          role,
        });

        // Log the entire response for debugging
        console.log("Registration response:", response.data);

        if (response.data.Status === "Success") {
          alert("Registration successful! You can now log in.");
          setIsLogin(true);
          resetForm();
        } else {
          alert(
            response.data.Error || "Registration failed. Please try again."
          );
        }
      } catch (err) {
        console.error(
          "Registration failed:",
          err.response?.data || err.message
        );
        alert("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button onClick={handleToggle}>
          {isLogin ? "Switch to Register" : "Switch to Login"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        {!isLogin && (
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              value={empid}
              onChange={(e) => setEmpid(e.target.value)}
              required
            />
          </div>
        )}
        {!isLogin && (
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

        {isLogin && (
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              value={empid}
              onChange={(e) => setEmpid(e.target.value)}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {!isLogin && (
          <div className="form-group">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}

        <button type="submit" className="btn1">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}

export default LoginRegister;
