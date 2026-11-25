import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [searchParams] = useSearchParams();
  const { login, registeredUsers } = useAuth();
  const navigate = useNavigate();

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState(() => {
    const justCreated = JSON.parse(localStorage.getItem("sl_last_signup"));
    if (justCreated) {
      return {
        email: justCreated.email,
        password: justCreated.password,
        role: justCreated.role
      };
    }

    const queryRole = searchParams.get("role");
    const lastLogin = JSON.parse(localStorage.getItem("sl_last_login"));
    if (lastLogin && (!queryRole || lastLogin.role === queryRole)) {
      return {
        email: lastLogin.email,
        password: lastLogin.password,
        role: lastLogin.role
      };
    }

    return {
      email: "",
      password: "",
      role: queryRole === "admin" ? "admin" : "user"
    };
  });

  useEffect(() => {
    const justCreated = JSON.parse(localStorage.getItem("sl_last_signup"));
    if (justCreated) {
      setNotice(`Account created for ${justCreated.name} (${justCreated.role}). Credentials saved below!`);
      localStorage.removeItem("sl_last_signup");
      return;
    }

    const r = searchParams.get("role");
    if (r === "admin" || r === "user") {
      const matchingSaved = [...registeredUsers].reverse().find((u) => u.role === r);
      if (matchingSaved) {
        setForm({
          email: matchingSaved.email,
          password: matchingSaved.password,
          role: matchingSaved.role
        });
      } else {
        setForm((prev) => ({ ...prev, role: r }));
      }
    }
  }, [searchParams, registeredUsers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(form);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    navigate(res.user.role === "admin" ? "/admin" : "/user");
  };

  const fillAccount = (acc) => {
    setError("");
    setNotice("");
    setForm({ email: acc.email, password: acc.password, role: acc.role });
  };

  return (
    <div className="auth-wrapper arena-canvas">
      <div className="floodlight-right" />
      <div className="telemetry-grid" />
      <div className="auth-card">
        <div className="auth-icon-ring">
          <ShieldCheck size={26} color="#050f1e" />
        </div>
        <p className="eyebrow center">SECURE ACCESS</p>
        <h2>{form.role === "admin" ? "Admin Module Login" : "User Module Login"}</h2>

        <div className="demo-autofill" style={{ flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() =>
              fillAccount({ email: "admin@gmail.com", password: "admin123", role: "admin" })
            }
            className="demo-chip"
          >
            <Sparkles size={13} /> Demo Admin
          </button>
          <button
            type="button"
            onClick={() =>
              fillAccount({ email: "fan@gmail.com", password: "fan123", role: "user" })
            }
            className="demo-chip"
          >
            <Sparkles size={13} /> Demo User
          </button>

          {registeredUsers.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => fillAccount(u)}
              className="demo-chip"
              style={{ borderColor: "#22c55e", color: "#4ade80" }}
            >
              <UserCheck size={13} /> {u.name} ({u.role})
            </button>
          ))}
        </div>

        {notice && (
          <div
            style={{
              background: "rgba(34, 197, 94, 0.16)",
              border: "1px solid rgba(34, 197, 94, 0.4)",
              color: "#4ade80",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "16px"
            }}
          >
            {notice}
          </div>
        )}

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
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
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <label>Login As</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="user">User (Fan Hub)</option>
            <option value="admin">Admin (Command Center)</option>
          </select>

          <button type="submit" className="btn-gold full-width">
            Enter {form.role === "admin" ? "Admin" : "User"} Module
          </button>
        </form>

        <p className="auth-footer">
          New to Sports League? <Link to="/signup">Create account</Link>
        </p>
      </div>
    </div>
  );
}