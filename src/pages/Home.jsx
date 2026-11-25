import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Users, Calendar, Trophy, ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getStored, calculateStandings, getTeamColor } from "../data/leagueStore";

export default function Home() {
  const { currentUser } = useAuth();
  const { hash } = useLocation();

  const teams = getStored("sl_teams");
  const matches = getStored("sl_matches");
  const results = getStored("sl_results");
  const standings = calculateStandings(teams, results);

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  return (
    <div className="home-wrapper">
      <section className="hero arena-canvas">
        <div className="floodlight-left" />
        <div className="floodlight-right" />
        <div className="telemetry-grid" />

        <div className="hero-center">
          <div className="status-chip">
            <span className="pulse-dot" /> SEASON 2026 TOURNAMENT PORTAL
          </div>
          <h1>
            SPORTS LEAGUE <span>MANAGEMENT SYSTEM</span>
          </h1>
          <p className="hero-sub">
            Complete tournament platform with live fixtures, match scorecards, automated Net Run Rate standings, and dedicated Admin & User modules.
          </p>

          <div className="hero-actions center-actions">
            <Link
              to={currentUser?.role === "admin" ? "/admin" : "/login?role=admin"}
              className="btn-gold btn-lg"
            >
              <Shield size={18} /> Open Admin Module <ArrowRight size={17} />
            </Link>
            <Link
              to={currentUser?.role === "user" ? "/user" : "/login?role=user"}
              className="btn-outline btn-lg"
            >
              <Users size={18} /> Open User Module
            </Link>
          </div>
        </div>
      </section>

      <section className="section-container">
        <p className="eyebrow center">SYSTEM ARCHITECTURE</p>
        <h2 className="section-title">Project Modules</h2>

        <div className="module-grid">
          <div className="module-card">
            <div className="module-top">
              <div className="icon-box"><Shield size={24} color="#ffc83d" /></div>
              <span className="badge-mini">MODULE 01</span>
            </div>
            <h3>Admin Module</h3>
            <p>Full tournament management and live match control center:</p>
            <ul className="module-list">
              <li><CheckCircle2 size={15} color="#ffc83d" /> Register & delete franchises and players</li>
              <li><CheckCircle2 size={15} color="#ffc83d" /> Schedule upcoming fixtures & venues</li>
              <li><CheckCircle2 size={15} color="#ffc83d" /> Run 20-over live match simulator or enter scores</li>
              <li><CheckCircle2 size={15} color="#ffc83d" /> Auto-calculate points table, NRR & playoff bracket</li>
            </ul>
            <Link
              to={currentUser?.role === "admin" ? "/admin" : "/login?role=admin"}
              className="btn-gold full-width"
            >
              Launch Admin Module
            </Link>
          </div>

          <div className="module-card">
            <div className="module-top">
              <div className="icon-box"><Users size={24} color="#ffc83d" /></div>
              <span className="badge-mini">MODULE 02</span>
            </div>
            <h3>User Module</h3>
            <p>Interactive fan hub and live tournament analytics:</p>
            <ul className="module-list">
              <li><CheckCircle2 size={15} color="#ffc83d" /> View live points table, NRR bars & playoff qualifiers</li>
              <li><CheckCircle2 size={15} color="#ffc83d" /> Predict upcoming match winners & earn Fan XP</li>
              <li><CheckCircle2 size={15} color="#ffc83d" /> Search & filter squad players by role and MVP score</li>
              <li><CheckCircle2 size={15} color="#ffc83d" /> Track Orange Cap, Purple Cap & match scorecards</li>
            </ul>
            <Link
              to={currentUser?.role === "user" ? "/user" : "/login?role=user"}
              className="btn-gold full-width"
            >
              Launch User Module
            </Link>
          </div>
        </div>
      </section>

      <section id="fixtures" className="section-container">
        <p className="eyebrow center">TOURNAMENT SCHEDULE</p>
        <h2 className="section-title">Upcoming Fixtures ({matches.length})</h2>

        <div className="fixture-grid">
          {matches.length === 0 ? (
            <p className="center">All scheduled fixtures have been completed.</p>
          ) : (
            matches.map((m) => (
              <div key={m.id} className="fixture-card">
                <div className="fixture-meta">
                  <Calendar size={13} style={{ display: "inline", marginRight: "6px" }} />
                  {m.date}
                </div>
                <h4>
                  <span className="color-dot" style={{ background: getTeamColor(teams, m.team1) }} />
                  {m.team1} <span className="gold-text">vs</span>{" "}
                  <span className="color-dot" style={{ background: getTeamColor(teams, m.team2) }} />
                  {m.team2}
                </h4>
                <p className="venue-line">
                  <MapPin size={13} /> {m.venue}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section id="matches" className="section-container">
        <p className="eyebrow center">SCORECARDS</p>
        <h2 className="section-title">All Completed Matches ({results.length})</h2>

        <div className="panel">
          <table>
            <thead>
              <tr>
                <th>Match #</th>
                <th>Team 1</th>
                <th>Score</th>
                <th>Team 2</th>
                <th>Score</th>
                <th>Winner</th>
                <th>Player of the Match</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, index) => (
                <tr key={r.id}>
                  <td>M{index + 1}</td>
                  <td>
                    <span className="color-dot" style={{ background: getTeamColor(teams, r.team1) }} />
                    <strong>{r.team1}</strong>
                  </td>
                  <td><strong>{r.score1}</strong></td>
                  <td>
                    <span className="color-dot" style={{ background: getTeamColor(teams, r.team2) }} />
                    <strong>{r.team2}</strong>
                  </td>
                  <td><strong>{r.score2}</strong></td>
                  <td><span className="winner-pill">{r.winner}</span></td>
                  <td>{r.potm || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="standings" className="section-container">
        <p className="eyebrow center">POINTS TABLE</p>
        <h2 className="section-title">League Standings</h2>

        <div className="panel">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Franchise</th>
                <th>Played</th>
                <th>Won</th>
                <th>Lost</th>
                <th>Draw</th>
                <th>NRR</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s, idx) => (
                <tr key={s.name} className={idx < 4 ? "playoff-row" : ""}>
                  <td>#{idx + 1}</td>
                  <td>
                    <span className="color-dot" style={{ background: s.color }} />
                    <strong>{s.name}</strong> {idx < 4 && <span className="q-tag">Q</span>}
                  </td>
                  <td>{s.played}</td>
                  <td>{s.won}</td>
                  <td>{s.lost}</td>
                  <td>{s.draw}</td>
                  <td>{Number(s.nrr) >= 0 ? `+${s.nrr}` : s.nrr}</td>
                  <td><strong>{s.points}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="footer">
        <p><Trophy size={15} color="#ffc83d" /> Sports League Management System • Built with React + Vite</p>
      </footer>
    </div>
  );
}