import { Link, useNavigate } from "react-router-dom";
import { Trophy, LogOut, ShieldCheck, User, Radio } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getStored } from "../data/leagueStore";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const results = getStored("sl_results");
  const matches = getStored("sl_matches");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header-stack">
      <div className="broadcast-ticker">
        <span className="live-pill">
          <Radio size={13} /> LIVE FEED
        </span>
        <div className="ticker-track">
          <div className="ticker-content">
            {results.map((r) => (
              <span key={r.id} className="ticker-item">
                FINAL: <strong>{r.team1}</strong> ({r.score1}) vs <strong>{r.team2}</strong> ({r.score2}) — Winner: <em>{r.winner}</em>
              </span>
            ))}
            {matches.map((m) => (
              <span key={m.id} className="ticker-item">
                UPCOMING: <strong>{m.team1}</strong> vs <strong>{m.team2}</strong> • {m.date} @ {m.venue}
              </span>
            ))}
          </div>
        </div>
      </div>

      <nav className="navbar">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <Trophy size={20} color="#050f1e" />
          </div>
          <span>SPORTS <strong className="gold-text">LEAGUE</strong></span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/#fixtures">Fixtures</Link>
          <Link to="/#matches">Matches</Link>
          <Link to="/#standings">Standings</Link>
          <Link to={currentUser?.role === "admin" ? "/admin" : "/login?role=admin"}>
            Admin Module
          </Link>
          <Link to={currentUser?.role === "user" ? "/user" : "/login?role=user"}>
            User Module
          </Link>

          {!currentUser ? (
            <Link to="/signup" className="btn-gold">Sign Up</Link>
          ) : (
            <>
              <span className="role-badge">
                {currentUser.role === "admin" ? <ShieldCheck size={14} /> : <User size={14} />}
                {currentUser.name} ({currentUser.role})
              </span>
              <button onClick={handleLogout} className="btn-outline-sm">
                <LogOut size={14} /> Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}