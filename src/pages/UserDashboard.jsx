import { useState } from "react";
import { Award, CheckCircle2, Search, Flame, Trophy } from "lucide-react";
import { getStored, calculateStandings, getTeamColor } from "../data/leagueStore";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const [tab, setTab] = useState("standings");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [predictions, setPredictions] = useState(() => {
    return JSON.parse(localStorage.getItem(`sl_preds_${currentUser?.email}`)) || {};
  });

  const teams = getStored("sl_teams");
  const players = getStored("sl_players");
  const matches = getStored("sl_matches");
  const results = getStored("sl_results");
  const standings = calculateStandings(teams, results);

  const predictWinner = (matchId, teamName) => {
    const updated = { ...predictions, [matchId]: teamName };
    setPredictions(updated);
    localStorage.setItem(`sl_preds_${currentUser?.email}`, JSON.stringify(updated));
  };

  const correctPicks = results.filter((r) => r.matchId && predictions[r.matchId] === r.winner).length;
  const fanXP = Object.keys(predictions).length * 25 + correctPicks * 100;

  const orangeCap = [...players].sort((a, b) => b.runs - a.runs)[0];
  const purpleCap = [...players].sort((a, b) => b.wickets - a.wickets)[0];
  const maxPoints = Math.max(...standings.map((s) => s.points), 2);

  const filteredPlayers = players.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.team.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">USER FAN HUB</p>
          <h1>Welcome, {currentUser?.name}</h1>
        </div>
        <div className="xp-pill">
          <Flame size={16} color="#ffc83d" />
          <span>FAN XP: <strong>{fanXP}</strong> ({correctPicks} Won Calls)</span>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span>Table Leader</span>
          <strong>{standings[0]?.name || "TBD"}</strong>
        </div>
        <div className="kpi-card">
          <span>Orange Cap</span>
          <strong>{orangeCap ? `${orangeCap.name} (${orangeCap.runs})` : "N/A"}</strong>
        </div>
        <div className="kpi-card">
          <span>Purple Cap</span>
          <strong>{purpleCap ? `${purpleCap.name} (${purpleCap.wickets}W)` : "N/A"}</strong>
        </div>
        <div className="kpi-card">
          <span>Active Predictions</span>
          <strong>{Object.keys(predictions).length}</strong>
        </div>
      </div>

      <div className="tab-bar">
        {["standings", "fixtures", "players", "playoffs", "results"].map((t) => (
          <button key={t} className={tab === t ? "tab active" : "tab"} onClick={() => setTab(t)}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === "standings" && (
        <div className="panel">
          <h3>Points Telemetry & League Table</h3>

          <div className="telemetry-bars">
            {standings.map((s) => (
              <div key={s.name} className="t-bar-row">
                <div className="t-bar-label">
                  <span>{s.short}</span>
                  <small>{s.points} PTS • NRR {Number(s.nrr) >= 0 ? `+${s.nrr}` : s.nrr}</small>
                </div>
                <div className="t-bar-track">
                  <div
                    className="t-bar-fill"
                    style={{
                      width: `${Math.max((s.points / maxPoints) * 100, 8)}%`,
                      background: s.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <table>
            <thead>
              <tr><th>Pos</th><th>Franchise</th><th>P</th><th>W</th><th>L</th><th>D</th><th>NRR</th><th>Points</th></tr>
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
      )}

      {tab === "fixtures" && (
        <div className="panel">
          <h3>Upcoming Matches & Fan Predictor (+100 XP per Correct Call)</h3>
          <div className="fixture-grid">
            {matches.length === 0 ? (
              <p>All scheduled fixtures have been simulated or completed.</p>
            ) : (
              matches.map((m) => (
                <div key={m.id} className="fixture-card">
                  <div className="fixture-meta">{m.date} • {m.venue}</div>
                  <h4>
                    <span className="color-dot" style={{ background: getTeamColor(teams, m.team1) }} />
                    {m.team1} vs{" "}
                    <span className="color-dot" style={{ background: getTeamColor(teams, m.team2) }} />
                    {m.team2}
                  </h4>
                  <p className="poll-label">Tap to Lock Match Prediction:</p>
                  <div className="poll-buttons">
                    {[m.team1, m.team2].map((team) => (
                      <button
                        key={team}
                        className={predictions[m.id] === team ? "poll-btn selected" : "poll-btn"}
                        onClick={() => predictWinner(m.id, team)}
                      >
                        {predictions[m.id] === team && <CheckCircle2 size={14} />} {team}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "players" && (
        <div className="panel">
          <div className="panel-top">
            <h3>Squad Telemetry & MVP Index</h3>
            <div className="filter-cluster">
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="role-filter">
                <option value="ALL">All Roles</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-Rounder">All-Rounder</option>
                <option value="Wicket-Keeper">Wicket-Keeper</option>
              </select>
              <div className="search-box">
                <Search size={15} />
                <input
                  placeholder="Search player or team..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr><th>Player</th><th>Franchise</th><th>Role</th><th>Runs</th><th>Wickets</th><th>MVP Score</th></tr>
            </thead>
            <tbody>
              {filteredPlayers.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td><span className="color-dot" style={{ background: getTeamColor(teams, p.team) }} />{p.team}</td>
                  <td>{p.role}</td>
                  <td>{p.runs}</td>
                  <td>{p.wickets}</td>
                  <td><Award size={14} color="#ffc83d" /> {p.runs + p.wickets * 25}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "playoffs" && (
        <div className="panel">
          <h3>Live Knockout Qualification Bracket</h3>
          <div className="bracket-grid">
            <div className="bracket-col">
              <div className="bracket-card">
                <span className="badge-mini">QUALIFIER 1 (#1 vs #2)</span>
                <p><strong>1. {standings[0]?.name || "TBD"}</strong></p>
                <p><strong>2. {standings[1]?.name || "TBD"}</strong></p>
              </div>
              <div className="bracket-card">
                <span className="badge-mini">ELIMINATOR (#3 vs #4)</span>
                <p><strong>3. {standings[2]?.name || "TBD"}</strong></p>
                <p><strong>4. {standings[3]?.name || "TBD"}</strong></p>
              </div>
            </div>
            <div className="bracket-col center-col">
              <div className="bracket-card final-card">
                <Trophy size={24} color="#ffc83d" />
                <span className="badge-mini">CHAMPIONSHIP FINAL</span>
                <p>Winner Q1 vs Winner Eliminator</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "results" && (
        <div className="panel">
          <h3>Completed Match Scorecards</h3>
          <table>
            <thead>
              <tr><th>Matchup</th><th>Scorecard</th><th>Winner</th><th>Player of Match</th></tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r.team1} vs {r.team2}</td>
                  <td><strong>{r.score1}</strong> - <strong>{r.score2}</strong></td>
                  <td><span className="winner-pill">{r.winner}</span></td>
                  <td>{r.potm || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}