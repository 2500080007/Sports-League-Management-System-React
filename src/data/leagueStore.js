const SEED_TEAMS = [
  { id: 1, name: "Mumbai Indians", short: "MI", city: "Mumbai", captain: "Rohit Sharma", color: "#3b82f6" },
  { id: 2, name: "Chennai Super Kings", short: "CSK", city: "Chennai", captain: "MS Dhoni", color: "#eab308" },
  { id: 3, name: "Royal Challengers", short: "RCB", city: "Bengaluru", captain: "Virat Kohli", color: "#ef4444" },
  { id: 4, name: "Kolkata Knight Riders", short: "KKR", city: "Kolkata", captain: "Shreyas Iyer", color: "#a855f7" }
];

const SEED_PLAYERS = [
  { id: 1, name: "Rohit Sharma", team: "Mumbai Indians", role: "Batsman", age: 37, runs: 485, wickets: 0 },
  { id: 2, name: "Jasprit Bumrah", team: "Mumbai Indians", role: "Bowler", age: 31, runs: 24, wickets: 21 },
  { id: 3, name: "Virat Kohli", team: "Royal Challengers", role: "Batsman", age: 36, runs: 540, wickets: 0 },
  { id: 4, name: "MS Dhoni", team: "Chennai Super Kings", role: "Wicket-Keeper", age: 43, runs: 265, wickets: 0 },
  { id: 5, name: "Ravindra Jadeja", team: "Chennai Super Kings", role: "All-Rounder", age: 36, runs: 290, wickets: 15 },
  { id: 6, name: "Sunil Narine", team: "Kolkata Knight Riders", role: "All-Rounder", age: 36, runs: 380, wickets: 18 }
];

const SEED_MATCHES = [
  { id: 101, team1: "Mumbai Indians", team2: "Chennai Super Kings", date: "2026-12-05", venue: "Wankhede Stadium" },
  { id: 102, team1: "Royal Challengers", team2: "Kolkata Knight Riders", date: "2026-12-08", venue: "M. Chinnaswamy Stadium" }
];

const SEED_RESULTS = [
  { id: 1, matchId: 91, team1: "Mumbai Indians", score1: 198, team2: "Royal Challengers", score2: 186, winner: "Mumbai Indians", potm: "Rohit Sharma" },
  { id: 2, matchId: 92, team1: "Chennai Super Kings", score1: 175, team2: "Kolkata Knight Riders", score2: 179, winner: "Kolkata Knight Riders", potm: "Sunil Narine" },
  { id: 3, matchId: 93, team1: "Mumbai Indians", score1: 204, team2: "Kolkata Knight Riders", score2: 190, winner: "Mumbai Indians", potm: "Jasprit Bumrah" }
];

export function initLeagueData() {
  if (!localStorage.getItem("sl_teams")) localStorage.setItem("sl_teams", JSON.stringify(SEED_TEAMS));
  if (!localStorage.getItem("sl_players")) localStorage.setItem("sl_players", JSON.stringify(SEED_PLAYERS));
  if (!localStorage.getItem("sl_matches")) localStorage.setItem("sl_matches", JSON.stringify(SEED_MATCHES));
  if (!localStorage.getItem("sl_results")) localStorage.setItem("sl_results", JSON.stringify(SEED_RESULTS));
}

export function resetLeagueData() {
  localStorage.setItem("sl_teams", JSON.stringify(SEED_TEAMS));
  localStorage.setItem("sl_players", JSON.stringify(SEED_PLAYERS));
  localStorage.setItem("sl_matches", JSON.stringify(SEED_MATCHES));
  localStorage.setItem("sl_results", JSON.stringify(SEED_RESULTS));
}

export function getStored(key) {
  initLeagueData();
  return JSON.parse(localStorage.getItem(key)) || [];
}

export function setStored(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getTeamColor(teams, teamName) {
  const found = teams.find((t) => t.name === teamName);
  return found ? found.color : "#ffc83d";
}

export function calculateStandings(teams, results) {
  const table = teams.map((t) => ({
    name: t.name,
    short: t.short || t.name.slice(0, 3).toUpperCase(),
    color: t.color || "#ffc83d",
    played: 0,
    won: 0,
    lost: 0,
    draw: 0,
    runsFor: 0,
    runsAgainst: 0,
    points: 0,
    nrr: 0
  }));

  results.forEach((r) => {
    const t1 = table.find((t) => t.name === r.team1);
    const t2 = table.find((t) => t.name === r.team2);
    if (!t1 || !t2) return;

    t1.played += 1;
    t2.played += 1;
    t1.runsFor += Number(r.score1);
    t1.runsAgainst += Number(r.score2);
    t2.runsFor += Number(r.score2);
    t2.runsAgainst += Number(r.score1);

    if (r.winner === "Draw") {
      t1.draw += 1;
      t2.draw += 1;
      t1.points += 1;
      t2.points += 1;
    } else if (r.winner === t1.name) {
      t1.won += 1;
      t2.lost += 1;
      t1.points += 2;
    } else if (r.winner === t2.name) {
      t2.won += 1;
      t1.lost += 1;
      t2.points += 2;
    }
  });

  table.forEach((t) => {
    t.nrr = t.played > 0 ? ((t.runsFor - t.runsAgainst) / (t.played * 20)).toFixed(3) : "0.000";
  });

  return table.sort((a, b) => b.points - a.points || Number(b.nrr) - Number(a.nrr));
}