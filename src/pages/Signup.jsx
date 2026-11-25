import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = signup(form);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    navigate("/login");
  };

  return (
    <div className="auth-wrapper arena-canvas">
      <div className="floodlight-left" />
      <div className="telemetry-grid" />
      <div className="auth-card">
        <div className="auth-icon-ring">
          <Trophy size={24} color="#050f1e" />
        </div>
        <p className="eyebrow center">REGISTRATION PORTAL</p>
        <h2>Create Account</h2>
        <p className="auth-sub">Select your role for Sports League Management System.</p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Enter your name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Create password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <label>Select Account Role</label>
          <div className="role-selector-grid">
            <button
              type="button"
              className={form.role === "user" ? "role-choice active" : "role-choice"}
              onClick={() => setForm({ ...form, role: "user" })}
            >
              <strong>User / Fan</strong>
              <span>Predict & Track Stats</span>
            </button>
            <button
              type="button"
              className={form.role === "admin" ? "role-choice active" : "role-choice"}
              onClick={() => setForm({ ...form, role: "admin" })}
            >
              <strong>Admin</strong>
              <span>Manage & Simulate</span>
            </button>
          </div>

          <button type="submit" className="btn-gold full-width">
            Create {form.role.toUpperCase()} Account
          </button>
        </form>

        <p className="auth-footer">
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}