import { useState, useEffect } from "react";
import { Trash2, Play, RotateCcw, Plus, Radio, Trophy, FastForward } from "lucide-react";
import { getStored, setStored, calculateStandings, resetLeagueData, getTeamColor } from "../data/leagueStore";

export default function AdminDashboard() {
  const [tab, setTab] = useState("matches");
  const [teams, setTeams] = useState(() => getStored("sl_teams"));
  const [players, setPlayers] = useState(() => getStored("sl_players"));
  const [matches, setMatches] = useState(() => getStored("sl_matches"));
  const [results, setResults] = useState(() => getStored("sl_results"));

  const [teamForm, setTeamForm] = useState({ name: "", short: "", city: "", captain: "", color: "#38bdf8" });
  const [playerForm, setPlayerForm] = useState({ name: "", team: "", role: "Batsman", age: "", runs: 0, wickets: 0 });
  const [matchForm, setMatchForm] = useState({ team1: "", team2: "", date: "", venue: "" });
  const [resultForm, setResultForm] = useState({ team1: "", score1: "", team2: "", score2: "", potm: "" });

  const [liveSim, setLiveSim] = useState(null);

  useEffect(() => setStored("sl_teams", teams), [teams]);
  useEffect(() => setStored("sl_players", players), [players]);
  useEffect(() => setStored("sl_matches", matches), [matches]);
  useEffect(() => setStored("sl_results", results), [results]);

  useEffect(() => {
    if (!liveSim || liveSim.completed) return;
    const timer = setTimeout(() => {
      setLiveSim((prev) => {
        if (!prev) return null;
        if (prev.over < 20) {
          const nextOver = prev.over + 4;
          const s1 = prev.score1 + Math.floor(Math.random() * 24) + 26;
          const s2 = prev.score2 + Math.floor(Math.random() * 25) + 25;
          return { ...prev, over: nextOver, score1: s1, score2: s2 };
        }
        return { ...prev, completed: true };
      });
    }, 650);
    return () => clearTimeout(timer);
  }, [liveSim]);

  const startLiveSim = (match) => {
    setLiveSim({
      match,
      over: 4,
      score1: Math.floor(Math.random() * 20) + 30,
      score2: Math.floor(Math.random() * 20) + 28,
      completed: false
    });
  };

  const commitSimResult = () => {
    if (!liveSim) return;
    const { match, score1, score2 } = liveSim;
    const winner = score1 > score2 ? match.team1 : score2 > score1 ? match.team2 : "Draw";
    const winRoster = players.filter((p) => p.team === winner);
    const potm = winRoster.length > 0 ? winRoster[Math.floor(Math.random() * winRoster.length)].name : "Team Effort";

    setResults([
      {
        id: Date.now(),
        matchId: match.id,
        team1: match.team1,
        score1,
        team2: match.team2,
        score2,
        winner,
        potm
      },
      ...results
    ]);
    setMatches(matches.filter((m) => m.id !== match.id));
    setLiveSim(null);
    setTab("standings");
  };

  const addTeam = (e) => {
    e.preventDefault();
    if (!teamForm.name.trim()) return;
    setTeams([
      ...teams,
      {
        id: Date.now(),
        name: teamForm.name.trim(),
        short: teamForm.short.trim().toUpperCase() || teamForm.name.slice(0, 3).toUpperCase(),
        city: teamForm.city.trim(),
        captain: teamForm.captain.trim(),
        color: teamForm.color
      }
    ]);
    setTeamForm({ name: "", short: "", city: "", captain: "", color: "#38bdf8" });
  };

  const addPlayer = (e) => {
    e.preventDefault();
    if (!playerForm.name.trim() || !playerForm.team) return;
    setPlayers([
      ...players,
      {
        id: Date.now(),
        ...playerForm,
        age: Number(playerForm.age),
        runs: Number(playerForm.runs),
        wickets: Number(playerForm.wickets)
      }
    ]);
    setPlayerForm({ name: "", team: "", role: "Batsman", age: "", runs: 0, wickets: 0 });
  };

  const addMatch = (e) => {
    e.preventDefault();
    if (!matchForm.team1 || !matchForm.team2 || matchForm.team1 === matchForm.team2) {
      alert("Select two different teams.");
      return;
    }
    setMatches([...matches, { id: Date.now(), ...matchForm }]);
    setMatchForm({ team1: "", team2: "", date: "", venue: "" });
  };

  const addResult = (e) => {
    e.preventDefault();
    if (!resultForm.team1 || !resultForm.team2 || resultForm.team1 === resultForm.team2) {
      alert("Select two different teams.");
      return;
    }
    const s1 = Number(resultForm.score1);
    const s2 = Number(resultForm.score2);
    const winner = s1 > s2 ? resultForm.team1 : s2 > s1 ? resultForm.team2 : "Draw";
    setResults([
      {
        id: Date.now(),
        team1: resultForm.team1,
        score1: s1,
        team2: resultForm.team2,
        score2: s2,
        winner,
        potm: resultForm.potm || "Captain Pick"
      },
      ...results
    ]);
    setResultForm({ team1: "", score1: "", team2: "", score2: "", potm: "" });
  };

  const handleReset = () => {
    resetLeagueData();
    setTeams(getStored("sl_teams"));
    setPlayers(getStored("sl_players"));
    setMatches(getStored("sl_matches"));
    setResults(getStored("sl_results"));
    setLiveSim(null);
  };

  const standings = calculateStandings(teams, results);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">ADMIN COMMAND CENTER</p>
          <h1>Tournament Operations</h1>
        </div>
        <button onClick={handleReset} className="btn-outline-sm">
          <RotateCcw size={15} /> Reset Season Data
        </button>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card"><span>Franchises</span><strong>{teams.length}</strong></div>
        <div className="kpi-card"><span>Active Squads</span><strong>{players.length} Players</strong></div>
        <div className="kpi-card"><span>Scheduled Fixtures</span><strong>{matches.length}</strong></div>
        <div className="kpi-card"><span>Completed Games</span><strong>{results.length}</strong></div>
      </div>

      <div className="tab-bar">
        {["matches", "teams", "players", "results", "standings", "playoffs"].map((t) => (
          <button key={t} className={tab === t ? "tab active" : "tab"} onClick={() => setTab(t)}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === "matches" && (
        <div className="panel">
          {liveSim && (
            <div className="live-sim-box">
              <div className="sim-top">
                <span className="live-pill"><Radio size={13} /> LIVE BROADCAST SIMULATION</span>
                <span>OVERS: {liveSim.over}.0 / 20.0</span>
              </div>
              <div className="sim-scoreboard">
                <div className="sim-team">
                  <span className="color-dot" style={{ background: getTeamColor(teams, liveSim.match.team1) }} />
                  <strong>{liveSim.match.team1}</strong>
                  <h2>{liveSim.score1}</h2>
                </div>
                <div className="sim-vs">VS</div>
                <div className="sim-team">
                  <span className="color-dot" style={{ background: getTeamColor(teams, liveSim.match.team2) }} />
                  <strong>{liveSim.match.team2}</strong>
                  <h2>{liveSim.score2}</h2>
                </div>
              </div>
              <div className="sim-progress-bg">
                <div className="sim-progress-fill" style={{ width: `${(liveSim.over / 20) * 100}%` }} />
              </div>
              <div className="sim-actions">
                {!liveSim.completed ? (
                  <button
                    className="btn-outline-sm"
                    onClick={() =>
                      setLiveSim({
                        ...liveSim,
                        over: 20,
                        score1: liveSim.score1 + 38,
                        score2: liveSim.score2 + 41,
                        completed: true
                      })
                    }
                  >
                    <FastForward size={14} /> Instant Finish
                  </button>
                ) : (
                  <button className="btn-gold" onClick={commitSimResult}>
                    Publish Official Result & Update Table
                  </button>
                )}
              </div>
            </div>
          )}

          <h3>Schedule New Fixture</h3>
          <form className="inline-form" onSubmit={addMatch}>
            <select required value={matchForm.team1} onChange={(e) => setMatchForm({ ...matchForm, team1: e.target.value })}>
              <option value="">Home Franchise</option>
              {teams.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
            <select required value={matchForm.team2} onChange={(e) => setMatchForm({ ...matchForm, team2: e.target.value })}>
              <option value="">Away Franchise</option>
              {teams.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
            <input type="date" required value={matchForm.date} onChange={(e) => setMatchForm({ ...matchForm, date: e.target.value })} />
            <input placeholder="Stadium Venue" required value={matchForm.venue} onChange={(e) => setMatchForm({ ...matchForm, venue: e.target.value })} />
            <button type="submit" className="btn-gold"><Plus size={16} /> Schedule</button>
          </form>

          <table>
            <thead>
              <tr><th>Fixture</th><th>Date</th><th>Venue</th><th>Broadcast Engine</th></tr>
            </thead>
            <tbody>
              {matches.map((m) => (
                <tr key={m.id}>
                  <td>
                    <span className="color-dot" style={{ background: getTeamColor(teams, m.team1) }} />
                    <strong>{m.team1}</strong> vs{" "}
                    <span className="color-dot" style={{ background: getTeamColor(teams, m.team2) }} />
                    <strong>{m.team2}</strong>
                  </td>
                  <td>{m.date}</td>
                  <td>{m.venue}</td>
                  <td className="action-cell">
                    <button className="btn-gold-sm" onClick={() => startLiveSim(m)}>
                      <Play size={13} /> Simulate Live
                    </button>
                    <button className="btn-danger-sm" onClick={() => setMatches(matches.filter((x) => x.id !== m.id))}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "teams" && (
        <div className="panel">
          <h3>Register Franchise</h3>
          <form className="inline-form" onSubmit={addTeam}>
            <input placeholder="Franchise Name" required value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} />
            <input placeholder="Code (e.g. SRH)" maxLength={4} required value={teamForm.short} onChange={(e) => setTeamForm({ ...teamForm, short: e.target.value })} />
            <input placeholder="Home City" required value={teamForm.city} onChange={(e) => setTeamForm({ ...teamForm, city: e.target.value })} />
            <input placeholder="Captain" required value={teamForm.captain} onChange={(e) => setTeamForm({ ...teamForm, captain: e.target.value })} />
            <input type="color" title="Jersey Accent Color" value={teamForm.color} onChange={(e) => setTeamForm({ ...teamForm, color: e.target.value })} className="color-picker" />
            <button type="submit" className="btn-gold"><Plus size={16} /> Add Franchise</button>
          </form>

          <table>
            <thead>
              <tr><th>Color</th><th>Code</th><th>Franchise</th><th>City</th><th>Captain</th><th>Action</th></tr>
            </thead>
            <tbody>
              {teams.map((t) => (
                <tr key={t.id}>
                  <td><span className="color-swatch" style={{ background: t.color }} /></td>
                  <td><strong>{t.short}</strong></td>
                  <td>{t.name}</td>
                  <td>{t.city}</td>
                  <td>{t.captain}</td>
                  <td>
                    <button className="btn-danger-sm" onClick={() => setTeams(teams.filter((x) => x.id !== t.id))}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "players" && (
        <div className="panel">
          <h3>Add Squad Member</h3>
          <form className="inline-form" onSubmit={addPlayer}>
            <input placeholder="Player Name" required value={playerForm.name} onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })} />
            <select required value={playerForm.team} onChange={(e) => setPlayerForm({ ...playerForm, team: e.target.value })}>
              <option value="">Select Franchise</option>
              {teams.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
            <select value={playerForm.role} onChange={(e) => setPlayerForm({ ...playerForm, role: e.target.value })}>
              <option>Batsman</option>
              <option>Bowler</option>
              <option>All-Rounder</option>
              <option>Wicket-Keeper</option>
            </select>
            <input type="number" placeholder="Age" required value={playerForm.age} onChange={(e) => setPlayerForm({ ...playerForm, age: e.target.value })} />
            <input type="number" placeholder="Runs" value={playerForm.runs} onChange={(e) => setPlayerForm({ ...playerForm, runs: e.target.value })} />
            <input type="number" placeholder="Wickets" value={playerForm.wickets} onChange={(e) => setPlayerForm({ ...playerForm, wickets: e.target.value })} />
            <button type="submit" className="btn-gold"><Plus size={16} /> Add Player</button>
          </form>

          <table>
            <thead>
              <tr><th>Player</th><th>Franchise</th><th>Role</th><th>Age</th><th>Runs</th><th>Wickets</th><th>Action</th></tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td><span className="color-dot" style={{ background: getTeamColor(teams, p.team) }} />{p.team}</td>
                  <td>{p.role}</td>
                  <td>{p.age}</td>
                  <td>{p.runs}</td>
                  <td>{p.wickets}</td>
                  <td>
                    <button className="btn-danger-sm" onClick={() => setPlayers(players.filter((x) => x.id !== p.id))}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "results" && (
        <div className="panel">
          <h3>Manual Scorecard Entry</h3>
          <form className="inline-form" onSubmit={addResult}>
            <select required value={resultForm.team1} onChange={(e) => setResultForm({ ...resultForm, team1: e.target.value })}>
              <option value="">Team 1</option>
              {teams.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
            <input type="number" placeholder="Score 1" required value={resultForm.score1} onChange={(e) => setResultForm({ ...resultForm, score1: e.target.value })} />
            <select required value={resultForm.team2} onChange={(e) => setResultForm({ ...resultForm, team2: e.target.value })}>
              <option value="">Team 2</option>
              {teams.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
            <input type="number" placeholder="Score 2" required value={resultForm.score2} onChange={(e) => setResultForm({ ...resultForm, score2: e.target.value })} />
            <input placeholder="Player of the Match" value={resultForm.potm} onChange={(e) => setResultForm({ ...resultForm, potm: e.target.value })} />
            <button type="submit" className="btn-gold"><Plus size={16} /> Post Result</button>
          </form>

          <table>
            <thead>
              <tr><th>Matchup</th><th>Scorecard</th><th>Winner</th><th>Player of Match</th><th>Action</th></tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r.team1} vs {r.team2}</td>
                  <td><strong>{r.score1}</strong> - <strong>{r.score2}</strong></td>
                  <td><span className="winner-pill">{r.winner}</span></td>
                  <td>{r.potm || "—"}</td>
                  <td>
                    <button className="btn-danger-sm" onClick={() => setResults(results.filter((x) => x.id !== r.id))}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "standings" && (
        <div className="panel">
          <h3>Official Points & NRR Telemetry</h3>
          <table>
            <thead>
              <tr><th>Pos</th><th>Franchise</th><th>P</th><th>W</th><th>L</th><th>D</th><th>NRR</th><th>Pts</th></tr>
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

      {tab === "playoffs" && (
        <div className="panel">
          <h3>Auto-Seeded Knockout Bracket (Top 4)</h3>
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
    </div>
  );
}