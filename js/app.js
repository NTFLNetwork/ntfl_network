import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY, APP_NAME, SEASON_LABEL, LEAGUE_LOGO, DEMO_EMAIL, DEMO_PASSWORD, DEMO_FLAG } from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const page = document.body.dataset.page || "index";
const app = document.getElementById("app");

const state = {
  teams: [],
  schedule: [],
  rankings: [],
  news: [],
  awards: [],
  history: [],
  settings: {},
  session: null,
  source: "supabase",
  league: null,
};

const DEFAULT_SETTINGS = {
  season_banner: { title: `${SEASON_LABEL} Week 1`, subtitle: APP_NAME },
  home_banner: { headline: "Where the NTFL collides", cta: "Commissioner Control Center" },
  rules: {
    title: "NTFL SEASON 3",
    body: `OFFICIAL RULES & POLICIES

JERSEYS & LOGOS

• The Home Team has first choice of uniform selection. If the Home Team elects to wear a colored jersey, the Away Team must wear white, and vice versa.

• Uniform selections must be submitted to the Commissioner before the weekly deadline. Failure to submit a request will result in the team's default Home/Away uniform being used.

• Available logos and uniform options are based on NFL uniforms worn during the 2024-25 and 2025-26 seasons. Uniforms not worn during those seasons will not be available at the launch of Season 3 but may be added in future updates.

• An official Uniform Directory will be provided listing all available Home, Away, Alternate, and Combo uniforms.

ALTERNATE UNIFORMS

• Alternate uniforms are intended to be used realistically and may not be excessively worn.

• Each franchise is limited to four (4) Alternate Uniform appearances per season.

• The four-use limit applies to all Alternate Uniforms combined, not each Alternate individually.

• Teams are responsible for monitoring and managing their Alternate Uniform usage.

UNIFORM COMBOS

• A Uniform Combo is a combination of approved jerseys, pants, and socks used by the real NFL franchise.

• Available Combo uniforms will be listed within the official Uniform Directory.

ACCOUNT POLICY

• Each franchise is permitted one (1) primary account and up to three (3) alternate accounts.

• Use of accounts beyond the league limit may result in penalties determined by league administration.

COMPETITIVE INTEGRITY

• The purchasing, botting, or artificial inflation of likes, votes, views, or engagement is strictly prohibited.

• Any engagement determined to be fraudulent will be removed from league records.

• Coaches found responsible for engagement manipulation will be subject to disciplinary action in accordance with league protocol.

• Fan accounts involved in engagement manipulation may face restrictions, removal, or other corrective actions as determined by league administration.

LEAGUE AUTHORITY

• NTFL Administration reserves the right to investigate suspicious activity, interpret league rules, and issue disciplinary action when necessary to preserve fairness, realism, and competitive integrity throughout the season.`
  },
};

const TEAM_META = {
  cardinals: { name: "Arizona Cardinals", abbr: "ARI", primary: "#97233F", secondary: "#000000" },
  falcons: { name: "Atlanta Falcons", abbr: "ATL", primary: "#A71930", secondary: "#000000" },
  ravens: { name: "Baltimore Ravens", abbr: "BAL", primary: "#241773", secondary: "#000000" },
  bills: { name: "Buffalo Bills", abbr: "BUF", primary: "#00338D", secondary: "#C60C30" },
  panthers: { name: "Carolina Panthers", abbr: "CAR", primary: "#0085CA", secondary: "#101820" },
  bears: { name: "Chicago Bears", abbr: "CHI", primary: "#0B162A", secondary: "#C83803" },
  bengals: { name: "Cincinnati Bengals", abbr: "CIN", primary: "#FB4F14", secondary: "#000000" },
  browns: { name: "Cleveland Browns", abbr: "CLE", primary: "#311D00", secondary: "#FF3C00" },
  cowboys: { name: "Dallas Cowboys", abbr: "DAL", primary: "#041E42", secondary: "#869397" },
  broncos: { name: "Denver Broncos", abbr: "DEN", primary: "#FB4F14", secondary: "#002244" },
  lions: { name: "Detroit Lions", abbr: "DET", primary: "#0076B6", secondary: "#B0B7BC" },
  packers: { name: "Green Bay Packers", abbr: "GB", primary: "#203731", secondary: "#FFB612" },
  texans: { name: "Houston Texans", abbr: "HOU", primary: "#03202F", secondary: "#A71930" },
  colts: { name: "Indianapolis Colts", abbr: "IND", primary: "#002C5F", secondary: "#A2AAAD" },
  jaguars: { name: "Jacksonville Jaguars", abbr: "JAX", primary: "#006778", secondary: "#9F792C" },
  chiefs: { name: "Kansas City Chiefs", abbr: "KC", primary: "#E31837", secondary: "#FFB81C" },
  raiders: { name: "Las Vegas Raiders", abbr: "LV", primary: "#000000", secondary: "#A5ACAF" },
  chargers: { name: "Los Angeles Chargers", abbr: "LAC", primary: "#0080C6", secondary: "#FFC20E" },
  rams: { name: "Los Angeles Rams", abbr: "LAR", primary: "#003594", secondary: "#FFA300" },
  dolphins: { name: "Miami Dolphins", abbr: "MIA", primary: "#008E97", secondary: "#FC4C02" },
  vikings: { name: "Minnesota Vikings", abbr: "MIN", primary: "#4F2683", secondary: "#FFC62F" },
  patriots: { name: "New England Patriots", abbr: "NE", primary: "#002244", secondary: "#C60C30" },
  saints: { name: "New Orleans Saints", abbr: "NO", primary: "#D3BC8D", secondary: "#101820" },
  giants: { name: "New York Giants", abbr: "NYG", primary: "#0B2265", secondary: "#A71930" },
  jets: { name: "New York Jets", abbr: "NYJ", primary: "#125740", secondary: "#000000" },
  eagles: { name: "Philadelphia Eagles", abbr: "PHI", primary: "#004C54", secondary: "#A5ACAF" },
  steelers: { name: "Pittsburgh Steelers", abbr: "PIT", primary: "#101820", secondary: "#FFB612" },
  "49ers": { name: "San Francisco 49ers", abbr: "SF", primary: "#AA0000", secondary: "#B3995D" },
  seahawks: { name: "Seattle Seahawks", abbr: "SEA", primary: "#002244", secondary: "#69BE28" },
  buccaneers: { name: "Tampa Bay Buccaneers", abbr: "TB", primary: "#D50A0A", secondary: "#34302B" },
  titans: { name: "Tennessee Titans", abbr: "TEN", primary: "#0C2340", secondary: "#4B92DB" },
  commanders: { name: "Washington Commanders", abbr: "WAS", primary: "#5A1414", secondary: "#FFB612" },
};


const LOCAL_RANKINGS = [
  { rank: 1, team_name: "Pittsburgh Steelers" },
  { rank: 2, team_name: "New York Giants" },
  { rank: 3, team_name: "Philadelphia Eagles" },
  { rank: 4, team_name: "Cincinnati Bengals" },
  { rank: 5, team_name: "Seattle Seahawks" },
  { rank: 6, team_name: "New Orleans Saints" },
  { rank: 7, team_name: "Denver Broncos" },
  { rank: 8, team_name: "Houston Texans" },
  { rank: 9, team_name: "Los Angeles Chargers" },
  { rank: 10, team_name: "Tennessee Titans" },
  { rank: 11, team_name: "Buffalo Bills" },
  { rank: 12, team_name: "Minnesota Vikings" },
  { rank: 13, team_name: "Miami Dolphins" },
  { rank: 14, team_name: "Kansas City Chiefs" },
  { rank: 15, team_name: "Washington Commanders" },
  { rank: 16, team_name: "Green Bay Packers" },
  { rank: 17, team_name: "Cleveland Browns" },
  { rank: 18, team_name: "Carolina Panthers" },
  { rank: 19, team_name: "New York Jets" },
  { rank: 20, team_name: "Arizona Cardinals" },
  { rank: 21, team_name: "Los Angeles Rams" },
  { rank: 22, team_name: "Dallas Cowboys" },
  { rank: 23, team_name: "Baltimore Ravens" },
  { rank: 24, team_name: "Tampa Bay Buccaneers" },
  { rank: 25, team_name: "Detroit Lions" },
  { rank: 26, team_name: "Jacksonville Jaguars" },
  { rank: 27, team_name: "San Francisco 49ers" },
  { rank: 28, team_name: "Las Vegas Raiders" },
  { rank: 29, team_name: "New England Patriots" },
  { rank: 30, team_name: "Atlanta Falcons" },
  { rank: 31, team_name: "Chicago Bears" },
  { rank: 32, team_name: "Indianapolis Colts" },
];


const CANONICAL_HISTORY = [
  {
    season: "Season 1",
    title: "Champion: Baltimore Ravens",
    champion: "Baltimore Ravens",
    runner_up: "New York Giants",
    body: "Baltimore defeated New York Giants in the NTFL Championship.",
  },
  {
    season: "Season 2",
    title: "Champion: Baltimore Ravens",
    champion: "Baltimore Ravens",
    runner_up: "Washington Commanders",
    body: "Baltimore defeated Washington in the NTFL Championship.",
  },
  {
    season: "Season 3",
    title: "Current Season",
    champion: "TBA",
    runner_up: "TBA",
    body: "Current season in progress.",
  },
];

const CANONICAL_HONORS = [
  { award_name: "MVP", icon: "🏆", winner: "TBA", team: "TBA", season: SEASON_LABEL, reason: "TBA" },
  { award_name: "Coach of the Year", icon: "🏆", winner: "TBA", team: "TBA", season: SEASON_LABEL, reason: "TBA" },
  { award_name: "Move The Chains Player of the Year", icon: "🏆", winner: "TBA", team: "TBA", season: SEASON_LABEL, reason: "TBA" },
  { award_name: "Assistant Coach of the Year", icon: "🏆", winner: "TBA", team: "TBA", season: SEASON_LABEL, reason: "TBA" },
  { award_name: "Improved Team of the Year", icon: "🏆", winner: "TBA", team: "TBA", season: SEASON_LABEL, reason: "TBA" },
  { award_name: "Game of the Year", icon: "🏆", winner: "TBA", team: "TBA", season: SEASON_LABEL, reason: "TBA" },
  { award_name: "Comeback Coach of the Year", icon: "🏆", winner: "TBA", team: "TBA", season: SEASON_LABEL, reason: "TBA" },
  { award_name: "Primetime King", icon: "🏆", winner: "TBA", team: "TBA", season: SEASON_LABEL, reason: "TBA" },
];

const ALIAS_MAP = {
  chiefs: "chiefs", broncos: "broncos", raiders: "raiders", chargers: "chargers", bengals: "bengals", ravens: "ravens",
  steelers: "steelers", browns: "browns", titans: "titans", colts: "colts", jaguars: "jaguars", texans: "texans",
  patriots: "patriots", jets: "jets", dolphins: "dolphins", bills: "bills", bears: "bears", lions: "lions",
  packers: "packers", vikings: "vikings", cowboys: "cowboys", giants: "giants", eagles: "eagles", commanders: "commanders",
  falcons: "falcons", panthers: "panthers", saints: "saints", buccaneers: "buccaneers", cardinals: "cardinals",
  rams: "rams", "49ers": "49ers", seahawks: "seahawks",
};

const DEMO_SESSION_KEY = DEMO_FLAG;

const escapeHtml = (str = "") => String(str).replace(/[&<>"']/g, (s) => ({
  "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
}[s]));

const fmtNum = (n) => {
  if (n === null || n === undefined || n === "" || Number.isNaN(Number(n))) return "—";
  return Number(n).toLocaleString();
};
const fmtPct = (w = 0, l = 0, t = 0) => {
  const games = Number(w || 0) + Number(l || 0) + Number(t || 0);
  if (!games) return ".000";
  return (((Number(w || 0) + 0.5 * Number(t || 0)) / games).toFixed(3));
};
const calcPpg = (points, games) => {
  const p = Number(points || 0);
  const g = Number(games || 0);
  return g ? (p / g).toFixed(1) : null;
};

function teamKey(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function metaFromAny(value) {
  const key = teamKey(value);
  const lookup = ALIAS_MAP[key] || key;
  return TEAM_META[lookup] || TEAM_META[Object.keys(TEAM_META).find(k => teamKey(TEAM_META[k].name) === key)] || null;
}

function canonicalTeamName(value) {
  const meta = metaFromAny(value);
  return meta?.name || String(value || "").trim();
}

function teamAbbr(value) {
  const meta = metaFromAny(value);
  return meta?.abbr || "";
}

function teamLogo(value, supplied) {
  const meta = metaFromAny(value);
  const abbr = (supplied || meta?.abbr || "").toLowerCase();
  return `https://a.espncdn.com/i/teamlogos/nfl/500/${abbr}.png`;
}

function isDemoActive() {
  return sessionStorage.getItem(DEMO_SESSION_KEY) === "1";
}

function navActive() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href")?.replace("./", "");
    if (href === current) a.classList.add("active");
  });
}

function record(t) {
  return `${Number(t.wins || 0)}-${Number(t.losses || 0)}${Number(t.ties || 0) ? `-${Number(t.ties)}` : ""}`;
}
function ppgDisplay(team, field = "for") {
  const raw = field === "for" ? team.ppg_for : team.ppg_against;
  if (raw !== null && raw !== undefined && raw !== "") return Number(raw).toFixed(1);
  const games = Number(team.wins || 0) + Number(team.losses || 0) + Number(team.ties || 0);
  const points = field === "for" ? team.points_for : team.points_against;
  return calcPpg(points, games) || "—";
}
function diff(team) {
  return Number(team.points_for || 0) - Number(team.points_against || 0);
}

function normalizeTeamRow(row = {}) {
  const meta = metaFromAny(row.name || row.team || row.team_name || row.abbr) || {};
  const name = canonicalTeamName(row.name || row.team || row.team_name || meta.name);
  const abbr = (row.abbr || meta.abbr || teamAbbr(name)).toUpperCase();
  const wins = Number(row.wins || 0);
  const losses = Number(row.losses || 0);
  const ties = Number(row.ties || 0);
  const games = wins + losses + ties;
  return {
    ...row,
    name,
    abbr,
    coach_name: row.coach_name ?? row.coach ?? "",
    ac_name: row.ac_name ?? row.ac ?? "",
    conference: row.conference ?? "",
    division: row.division ?? "",
    logo_url: row.logo_url || teamLogo(name, abbr),
    primary_color: row.primary_color || meta.primary || "#0f172a",
    secondary_color: row.secondary_color || meta.secondary || "#38bdf8",
    wins,
    losses,
    ties,
    points_for: Number(row.points_for || 0),
    points_against: Number(row.points_against || 0),
    ppg_for: row.ppg_for ?? (games ? Number(row.points_for || 0) / games : null),
    ppg_against: row.ppg_against ?? (games ? Number(row.points_against || 0) / games : null),
    streak: row.streak || "",
    notes: row.notes || "",
  };
}

function normalizeGameRow(row = {}) {
  const home = canonicalTeamName(row.home_team_name || row.home_team);
  const away = canonicalTeamName(row.away_team_name || row.away_team);
  const homeScore = row.home_score === null || row.home_score === undefined || row.home_score === "" ? null : Number(row.home_score);
  const awayScore = row.away_score === null || row.away_score === undefined || row.away_score === "" ? null : Number(row.away_score);
  const inferredStatus = homeScore !== null && awayScore !== null ? "final" : "scheduled";
  return {
    ...row,
    home_team_name: home,
    away_team_name: away,
    week: row.week || `W${row.week_number || 1}`,
    week_number: Number(row.week_number || String(row.week || "1").replace(/\D/g, "") || 1),
    status: row.status && row.status !== "scheduled" ? row.status : inferredStatus,
    is_live: Boolean(row.is_live),
    home_score: homeScore,
    away_score: awayScore,
  };
}


function baseTeamStats() {
  return {
    wins: 0,
    losses: 0,
    ties: 0,
    points_for: 0,
    points_against: 0,
    games_played: 0,
    remaining_games: 0,
    ppg_for: null,
    ppg_against: null,
    conference_wins: 0,
    conference_losses: 0,
    conference_ties: 0,
    division_wins: 0,
    division_losses: 0,
    division_ties: 0,
    streak: "",
    streak_type: null,
    streak_count: 0,
    last_result: null,
  };
}

function applyStreak(stat, result) {
  if (stat.last_result !== result) {
    stat.streak_type = result;
    stat.streak_count = 1;
  } else {
    stat.streak_count += 1;
  }
  stat.last_result = result;
  stat.streak = `${stat.streak_type}${stat.streak_count}`;
}

function buildDerivedStats(scheduleRows = [], teamRows = []) {
  const stats = new Map();
  const h2h = new Map();
  const teamLookup = new Map();

  const ensure = (teamName) => {
    const key = canonicalTeamName(teamName);
    if (!stats.has(key)) stats.set(key, { ...baseTeamStats(), name: key });
    if (!h2h.has(key)) h2h.set(key, new Map());
    return stats.get(key);
  };

  teamRows.forEach((row) => {
    const key = canonicalTeamName(row?.name || row?.team_name || row?.abbr);
    teamLookup.set(key, row);
    ensure(key);
  });

  const orderedGames = [...scheduleRows].sort((a, b) => {
    const wk = Number(a.week_number || 0) - Number(b.week_number || 0);
    if (wk !== 0) return wk;
    return String(a.id || "").localeCompare(String(b.id || ""));
  });

  for (const game of orderedGames) {
    const homeScore = game.home_score === null || game.home_score === undefined ? null : Number(game.home_score);
    const awayScore = game.away_score === null || game.away_score === undefined ? null : Number(game.away_score);
    if (homeScore === null || awayScore === null) continue;

    const homeName = canonicalTeamName(game.home_team_name);
    const awayName = canonicalTeamName(game.away_team_name);
    const home = ensure(homeName);
    const away = ensure(awayName);
    const homeTeam = teamLookup.get(homeName) || {};
    const awayTeam = teamLookup.get(awayName) || {};
    const sameDivision = canonicalTeamName(homeTeam.division || "") && canonicalTeamName(homeTeam.division || "") === canonicalTeamName(awayTeam.division || "");
    const sameConference = canonicalTeamName(homeTeam.conference || "") && canonicalTeamName(homeTeam.conference || "") === canonicalTeamName(awayTeam.conference || "");

    home.games_played += 1;
    away.games_played += 1;
    home.points_for += homeScore;
    home.points_against += awayScore;
    away.points_for += awayScore;
    away.points_against += homeScore;

    if (homeScore > awayScore) {
      home.wins += 1;
      away.losses += 1;
      applyStreak(home, "W");
      applyStreak(away, "L");
    } else if (awayScore > homeScore) {
      home.losses += 1;
      away.wins += 1;
      applyStreak(home, "L");
      applyStreak(away, "W");
    } else {
      home.ties += 1;
      away.ties += 1;
      applyStreak(home, "T");
      applyStreak(away, "T");
    }

    const homeVsAway = h2h.get(homeName) || new Map();
    const awayVsHome = h2h.get(awayName) || new Map();
    const homeRec = homeVsAway.get(awayName) || { w: 0, l: 0, t: 0 };
    const awayRec = awayVsHome.get(homeName) || { w: 0, l: 0, t: 0 };
    if (homeScore > awayScore) {
      homeRec.w += 1;
      awayRec.l += 1;
    } else if (awayScore > homeScore) {
      homeRec.l += 1;
      awayRec.w += 1;
    } else {
      homeRec.t += 1;
      awayRec.t += 1;
    }
    homeVsAway.set(awayName, homeRec);
    awayVsHome.set(homeName, awayRec);
    h2h.set(homeName, homeVsAway);
    h2h.set(awayName, awayVsHome);

    if (sameDivision) {
      if (homeScore > awayScore) {
        home.division_wins += 1;
        away.division_losses += 1;
      } else if (awayScore > homeScore) {
        home.division_losses += 1;
        away.division_wins += 1;
      } else {
        home.division_ties += 1;
        away.division_ties += 1;
      }
    }

    if (sameConference) {
      if (homeScore > awayScore) {
        home.conference_wins += 1;
        away.conference_losses += 1;
      } else if (awayScore > homeScore) {
        home.conference_losses += 1;
        away.conference_wins += 1;
      } else {
        home.conference_ties += 1;
        away.conference_ties += 1;
      }
    }
  }

  for (const stat of stats.values()) {
    stat.ppg_for = stat.games_played ? Number((stat.points_for / stat.games_played).toFixed(2)) : null;
    stat.ppg_against = stat.games_played ? Number((stat.points_against / stat.games_played).toFixed(2)) : null;
  }

  return { stats, h2h, teamLookup };
}

function applyDerivedLeagueStats(teamRows = [], scheduleRows = []) {
  const derived = buildDerivedStats(scheduleRows, teamRows);
  const teamLookup = new Map(teamRows.map((row) => [canonicalTeamName(row.name || row.team_name || row.abbr), row]));
  state.league = derived;
  return teamRows.map((row) => {
    const key = canonicalTeamName(row.name || row.team_name || row.abbr);
    const stat = derived.stats.get(key) || baseTeamStats();
    const games = Number(stat.wins || 0) + Number(stat.losses || 0) + Number(stat.ties || 0);
    const remaining = scheduleRows.filter((g) => {
      const home = canonicalTeamName(g.home_team_name || g.home_team);
      const away = canonicalTeamName(g.away_team_name || g.away_team);
      const final = g.home_score !== null && g.home_score !== undefined && g.away_score !== null && g.away_score !== undefined;
      return (home === key || away === key) && !final;
    }).length;
    const team = teamLookup.get(key) || {};
    return {
      ...row,
      conference: row.conference || team.conference || "",
      division: row.division || team.division || "",
      wins: stat.wins,
      losses: stat.losses,
      ties: stat.ties,
      points_for: stat.points_for,
      points_against: stat.points_against,
      ppg_for: stat.ppg_for,
      ppg_against: stat.ppg_against,
      streak: stat.streak || row.streak || "",
      games_played: games,
      remaining_games: remaining,
      conference_wins: stat.conference_wins,
      conference_losses: stat.conference_losses,
      conference_ties: stat.conference_ties,
      division_wins: stat.division_wins,
      division_losses: stat.division_losses,
      division_ties: stat.division_ties,
      conference_record: `${stat.conference_wins}-${stat.conference_losses}${stat.conference_ties ? `-${stat.conference_ties}` : ""}`,
      division_record: `${stat.division_wins}-${stat.division_losses}${stat.division_ties ? `-${stat.division_ties}` : ""}`,
      max_wins: Number(stat.wins || 0) + remaining,
    };
  });
}

function pctRecord(w = 0, l = 0, t = 0) {
  const games = Number(w || 0) + Number(l || 0) + Number(t || 0);
  if (!games) return 0;
  return (Number(w || 0) + 0.5 * Number(t || 0)) / games;
}

function teamPct(team) {
  return pctRecord(team.wins, team.losses, team.ties);
}

function teamRecordPct(team, prefix) {
  if (prefix === "division") return pctRecord(team.division_wins, team.division_losses, team.division_ties);
  if (prefix === "conference") return pctRecord(team.conference_wins, team.conference_losses, team.conference_ties);
  return teamPct(team);
}

function h2hPct(team, groupTeams = []) {
  const groupNames = (groupTeams || []).map((t) => canonicalTeamName(t.name || t.team_name || t));
  const teamName = canonicalTeamName(team.name || team.team_name || team);
  const teamMap = state.league?.h2h?.get(teamName) || new Map();
  let w = 0;
  let l = 0;
  let t = 0;
  for (const otherName of groupNames) {
    if (!otherName || otherName === teamName) continue;
    const rec = teamMap.get(otherName);
    if (!rec) continue;
    w += Number(rec.w || 0);
    l += Number(rec.l || 0);
    t += Number(rec.t || 0);
  }
  return pctRecord(w, l, t);
}

function compareTeams(a, b, groupTeams = []) {
  const ap = teamPct(a);
  const bp = teamPct(b);
  if (bp !== ap) return bp - ap;

  const ah = h2hPct(a, groupTeams);
  const bh = h2hPct(b, groupTeams);
  if (bh !== ah) return bh - ah;

  const ad = teamRecordPct(a, "division");
  const bd = teamRecordPct(b, "division");
  if (bd !== ad) return bd - ad;

  const ac = teamRecordPct(a, "conference");
  const bc = teamRecordPct(b, "conference");
  if (bc !== ac) return bc - ac;

  const appg = Number(a.ppg_for || 0);
  const bppg = Number(b.ppg_for || 0);
  if (bppg !== appg) return bppg - appg;

  const adiff = Number(a.points_for || 0) - Number(a.points_against || 0);
  const bdiff = Number(b.points_for || 0) - Number(b.points_against || 0);
  if (bdiff !== adiff) return bdiff - adiff;

  const af = Number(a.points_for || 0);
  const bf = Number(b.points_for || 0);
  if (bf !== af) return bf - af;

  return canonicalTeamName(a.name).localeCompare(canonicalTeamName(b.name));
}

function sortTeamsForContext(teams = [], groupTeams = teams) {
  return [...teams].sort((a, b) => compareTeams(a, b, groupTeams));
}

function teamRemainingGames(teamName) {
  const key = canonicalTeamName(teamName);
  return state.schedule.filter((g) => {
    const home = canonicalTeamName(g.home_team_name || g.home_team);
    const away = canonicalTeamName(g.away_team_name || g.away_team);
    const final = g.home_score !== null && g.home_score !== undefined && g.away_score !== null && g.away_score !== undefined;
    return (home === key || away === key) && !final;
  }).length;
}

function conferencePlayoffSnapshot(conf) {
  const conferenceTeams = sortTeamsForContext(state.teams.filter((t) => t.conference === conf), state.teams.filter((t) => t.conference === conf));
  const divisions = [...new Set(conferenceTeams.map((t) => t.division))];
  const divisionWinners = divisions.map((div) => {
    const divisionTeams = conferenceTeams.filter((t) => t.division === div);
    return sortTeamsForContext(divisionTeams, divisionTeams)[0] || null;
  }).filter(Boolean);
  const winnerNames = new Set(divisionWinners.map((t) => t.name));
  const nonWinners = conferenceTeams.filter((t) => !winnerNames.has(t.name));
  const seeds = [...sortTeamsForContext(divisionWinners, conferenceTeams), ...sortTeamsForContext(nonWinners, conferenceTeams).slice(0, 3)].slice(0, 7);
  const seedMap = new Map(seeds.map((t, idx) => [t.name, idx + 1]));
  const eighth = sortTeamsForContext(nonWinners.filter((t) => !seeds.some((s) => s.name === t.name)), conferenceTeams)[0] || null;
  const seventh = seeds[6] || null;
  const eighthMax = eighth ? Number(eighth.wins || 0) + Number(eighth.remaining_games || 0) : -1;
  const seventhWins = seventh ? Number(seventh.wins || 0) : 0;
  const teamStatus = new Map();
  for (const team of conferenceTeams) {
    const seed = seedMap.get(team.name) || null;
    const maxWins = Number(team.wins || 0) + Number(team.remaining_games || 0);
    let label = "🟡 In The Hunt";
    let cls = "warn";
    if (seed && seed <= 4) {
      label = "🏆 Division Champion";
      cls = "good";
    } else if (seed && seed <= 7) {
      label = Number(team.wins || 0) > eighthMax ? "⭐ Clinched" : "🟢 Wild Card";
      cls = Number(team.wins || 0) > eighthMax ? "good" : "scheduled";
    } else if (maxWins < seventhWins) {
      label = "🔴 Eliminated";
      cls = "danger";
    }
    teamStatus.set(team.name, { seed, label, cls, maxWins, eliminated: maxWins < seventhWins });
  }
  return { conference: conf, teams: conferenceTeams, divisions, divisionWinners, seeds, seedMap, teamStatus, eighthMax, seventhWins };
}

function playoffPicture() {
  return { AFC: conferencePlayoffSnapshot("AFC"), NFC: conferencePlayoffSnapshot("NFC") };
}

function playoffStatus(team, snapshot = playoffPicture()[team.conference]) {
  return snapshot?.teamStatus.get(team.name) || { seed: null, label: "🟡 In The Hunt", cls: "warn", maxWins: Number(team.wins || 0) + Number(team.remaining_games || 0), eliminated: false };
}

function mergedHonors() {
  const byKey = new Map((state.awards || []).map((a) => [teamKey(a.award_name), a]));
  const merged = CANONICAL_HONORS.map((base) => {
    const existing = byKey.get(teamKey(base.award_name)) || {};
    return {
      ...base,
      ...existing,
      season: existing.season || base.season,
      icon: existing.icon || base.icon,
      winner: existing.winner || base.winner,
      team: existing.team || base.team || "TBA",
      reason: existing.reason || existing.note || base.reason,
    };
  });
  const extras = (state.awards || []).filter((a) => !CANONICAL_HONORS.some((b) => teamKey(b.award_name) === teamKey(a.award_name)));
  return [...merged, ...extras.map((a) => ({
    season: a.season || SEASON_LABEL,
    award_name: a.award_name || a.title || "Award",
    icon: a.icon || "🏆",
    winner: a.winner || "TBA",
    team: a.team || "TBA",
    reason: a.reason || a.note || "",
  }))];
}

function mergedHistory() {
  const seen = new Set();
  const items = [];
  for (const item of [...CANONICAL_HISTORY, ...(state.history || [])]) {
    const key = `${item.season || ""}::${item.title || item.champion || ""}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({
      season: item.season || SEASON_LABEL,
      title: item.title || item.champion || "",
      champion: item.champion || "",
      runner_up: item.runner_up || "",
      body: item.body || "",
      image_url: item.image_url || "",
    });
  }
  return items;
}

async function saveSiteSetting(key, value) {
  const { error } = await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;
}

function buildPlayoffSnapshotPayload() {
  const picture = playoffPicture();
  const bracketFor = (snap) => ({
    conference: snap.conference,
    seeds: snap.seeds.map((t, idx) => ({ seed: idx + 1, team_name: t.name, record: record(t), status: playoffStatus(t, snap).label })),
    wild_card: [
      { matchup: "2 vs 7", teams: [snap.seeds[1]?.name || "TBA", snap.seeds[6]?.name || "TBA"] },
      { matchup: "3 vs 6", teams: [snap.seeds[2]?.name || "TBA", snap.seeds[5]?.name || "TBA"] },
      { matchup: "4 vs 5", teams: [snap.seeds[3]?.name || "TBA", snap.seeds[4]?.name || "TBA"] },
    ],
    divisional: [
      { matchup: "1 vs lowest remaining", note: "NFL-style reseeding after Wild Card round" },
      { matchup: "highest remaining vs next remaining", note: "Reseeded by seed" },
    ],
    conference_championship: { note: "Highest remaining seed hosts" },
  });
  return {
    generated_at: new Date().toISOString(),
    AFC: bracketFor(picture.AFC),
    NFC: bracketFor(picture.NFC),
    super_bowl: { teams: [picture.AFC.seeds[0]?.name || "AFC Champion", picture.NFC.seeds[0]?.name || "NFC Champion"] },
  };
}
async function readJson(path) {
  try {
    const r = await fetch(path, { cache: "no-store" });
    if (!r.ok) throw new Error(`Failed to fetch ${path}`);
    return await r.json();
  } catch {
    return [];
  }
}

async function loadAll() {
  const [teamRes, scheduleRes, rankingsRes, newsRes, awardsRes, historyRes, settingsRes, sessionRes, localTeams, localSchedule] = await Promise.all([
    supabase.from("teams").select("*").order("name", { ascending: true }),
    supabase.from("schedule_games").select("*").order("week_number", { ascending: true }).order("home_team_name", { ascending: true }),
    supabase.from("rankings").select("*").order("week", { ascending: false }).order("rank", { ascending: true }),
    supabase.from("news").select("*").order("published_at", { ascending: false }),
    supabase.from("awards").select("*").order("updated_at", { ascending: false }),
    supabase.from("history_items").select("*").order("updated_at", { ascending: false }),
    supabase.from("site_settings").select("*"),
    supabase.auth.getSession(),
    readJson("./data/teams.seed.json"),
    readJson("./data/schedule.seed.json"),
  ]);

  const teams = teamRes?.data || [];
  const schedule = scheduleRes?.data || [];
  const normalizedSchedule = (schedule.length ? schedule : localSchedule).map(normalizeGameRow);
  const baseTeams = (teams.length ? teams : localTeams).map(normalizeTeamRow);

  state.schedule = normalizedSchedule;
  state.teams = applyDerivedLeagueStats(baseTeams, normalizedSchedule);
  state.rankings = (rankingsRes?.data || []).map((r) => ({ ...r, team_name: canonicalTeamName(r.team_name), abbr: teamAbbr(r.team_name) }));
  if (!state.rankings.length) {
    state.rankings = LOCAL_RANKINGS.map((r) => ({
      id: `fallback-${r.rank}`,
      week: 3,
      rank: r.rank,
      team_name: r.team_name,
      previous_rank: null,
      note: "",
    }));
  }
  state.news = newsRes?.data?.length ? newsRes.data : [{
    id: "fallback-news",
    title: "NTFL dashboard is live",
    body: "Use the commissioner dashboard to publish league updates, scores, and weekly notes.",
    category: "League",
    published_at: new Date().toISOString(),
  }];
  state.awards = awardsRes?.data?.length ? awardsRes.data : [{
    id: "fallback-award",
    season: SEASON_LABEL,
    award_name: "Sample Award Slot",
    winner: "Add a winner in the dashboard",
    note: "Placeholder card until awards are added.",
    icon: "🏆",
  }];
  state.history = historyRes?.data?.length ? historyRes.data : [{
    id: "fallback-history",
    season: SEASON_LABEL,
    title: "League archive placeholder",
    body: "Add historical notes and champions in the commissioner dashboard.",
  }];
  state.settings = Object.fromEntries((settingsRes?.data || []).map((row) => [row.key, row.value]));
  state.session = sessionRes?.data?.session || null;
  state.source = teams.length ? "supabase" : "fallback";
}

function liveGames() { return state.schedule.filter((g) => g.is_live || g.status === "live"); }
function upcomingGames() { return state.schedule.filter((g) => g.status === "scheduled").slice(0, 8); }
function featuredGame() { return liveGames()[0] || upcomingGames()[0] || state.schedule[0] || null; }
function latestNews() { return state.news.slice(0, 3); }
function standingsRows() {
  return sortTeamsForContext(state.teams, state.teams);
}
function divisionGroups() {
  const groups = {};
  for (const t of state.teams) {
    const key = `${t.conference || ""} ${t.division || ""}`.trim() || "League";
    (groups[key] ||= []).push(t);
  }
  Object.values(groups).forEach((list) => list.sort((a, b) => compareTeams(a, b, list)));
  return groups;
}
function rankingsTop(n = 5) {
  const week = Math.max(1, ...state.rankings.map((r) => Number(r.week) || 0));
  return state.rankings.filter((r) => Number(r.week) === week).sort((a, b) => Number(a.rank) - Number(b.rank)).slice(0, n);
}
function currentRankWeek() { return Math.max(1, ...state.rankings.map((r) => Number(r.week) || 0)); }
function findTeam(query) {
  const key = teamKey(query);
  return state.teams.find((t) => teamKey(t.name) === key || teamKey(t.abbr) === key || teamKey(t.coach_name) === key || teamKey(t.ac_name) === key) || null;
}
function teamGames(teamName) {
  const key = canonicalTeamName(teamName);
  return state.schedule.filter((g) => g.home_team_name === key || g.away_team_name === key);
}

function logoMarkup(team, size = "56px") {
  const url = team?.logo_url || teamLogo(team?.name, team?.abbr);
  return `<div class="logo" style="width:${size};height:${size};border-color:${team?.secondary_color || "#38bdf8"}55;background:linear-gradient(135deg, ${team?.primary_color || "#0b1628"}, rgba(255,255,255,.02))"><img src="${escapeHtml(url)}" alt="${escapeHtml(team?.name || "Team")}" onerror="this.style.display='none';this.parentElement.classList.add('initials');this.parentElement.textContent='${escapeHtml((team?.abbr || "NT").slice(0,2))}'"/></div>`;
}

function renderGameCard(g) {
  if (!g) return `<div class="empty">No featured game.</div>`;
  const ht = findTeam(g.home_team_name) || normalizeTeamRow({ name: g.home_team_name });
  const at = findTeam(g.away_team_name) || normalizeTeamRow({ name: g.away_team_name });
  const live = g.is_live || g.status === "live";
  return `
    <div class="team-card">
      <div class="team-main">
        ${logoMarkup(at, "54px")}
        <div>
          <div class="team-name">${escapeHtml(at.abbr || teamAbbr(at.name) || "")} ${escapeHtml(at.name)}</div>
          <div class="small muted">${escapeHtml(at.coach_name || "")}</div>
        </div>
      </div>
      <div class="pill ${live ? "live" : g.status}">${live ? "LIVE" : escapeHtml(g.week)}</div>
      <div class="team-main" style="justify-content:flex-end;text-align:right">
        <div>
          <div class="team-name">${escapeHtml(ht.abbr || teamAbbr(ht.name) || "")} ${escapeHtml(ht.name)}</div>
          <div class="small muted">${escapeHtml(ht.coach_name || "")}</div>
        </div>
        ${logoMarkup(ht, "54px")}
      </div>
    </div>
    <div class="subtle" style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap">
      <div><b>${escapeHtml(g.away_team_name)}</b> ${fmtNum(g.away_score)} · ${fmtNum(g.home_score)} <b>${escapeHtml(g.home_team_name)}</b></div>
      <a class="btn" href="./game.html?week=${encodeURIComponent(g.week)}&home=${encodeURIComponent(g.home_team_name)}&away=${encodeURIComponent(g.away_team_name)}">Open Game Center</a>
    </div>
  `;
}

function baseHero() {
  const banner = state.settings.season_banner || DEFAULT_SETTINGS.season_banner;
  const home = state.settings.home_banner || DEFAULT_SETTINGS.home_banner;
  const live = liveGames();
  const featured = featuredGame();
  const topTeams = standingsRows().slice(0, 5);
  app.innerHTML = `
    <section class="hero">
      <div class="hero-grid">
        <div class="panel">
          <div class="lg-hero">
            <img src="${LEAGUE_LOGO}" alt="NTFL logo"/>
            <div>
              <div class="eyebrow">${escapeHtml(banner.title)}</div>
              <h1>${escapeHtml(home.headline)}</h1>
            </div>
          </div>
          <p>Teams, coaches, standings, rankings, schedule, news, awards, and history are all wired to Supabase, with a local fallback so the site never opens blank.</p>
          <div class="actions">
            <a class="btn primary" href="./schedule.html">View schedule</a>
            <a class="btn" href="./standings.html">Standings</a>
            <a class="btn" href="./admin.html">Commissioner dashboard</a>
          </div>
          <div class="grid grid-4" style="margin-top:18px">
            <div class="stat"><b>${state.teams.length}</b><span>Teams</span></div>
            <div class="stat"><b>${state.schedule.length}</b><span>Games loaded</span></div>
            <div class="stat"><b>${state.news.length}</b><span>News items</span></div>
            <div class="stat"><b>${state.rankings.length}</b><span>Ranking rows</span></div>
          </div>
        </div>
        <div class="panel">
          <div class="kicker">Live Now</div>
          <h2>${live.length ? `${live.length} game(s) active` : "No live games right now"}</h2>
          <div class="ticker">
            ${(live.length ? live : upcomingGames().slice(0, 4)).map((g) => `
              <div class="ticker-item">
                <div style="display:flex;justify-content:space-between;gap:10px;align-items:center">
                  <span class="badge ${g.is_live || g.status === "live" ? "live" : "scheduled"}">${g.is_live || g.status === "live" ? "LIVE" : "Scheduled"}</span>
                  <span class="muted">${escapeHtml(g.week)}</span>
                </div>
                <div style="margin-top:10px;font-weight:800">${escapeHtml(g.away_team_name)} at ${escapeHtml(g.home_team_name)}</div>
                <div class="muted small">${g.away_score ?? "—"} - ${g.home_score ?? "—"}</div>
              </div>
            `).join("") || `<div class="empty">No games yet.</div>`}
          </div>
          <div class="card" style="margin-top:12px">
            <div class="kicker">Featured Game</div>
            ${renderGameCard(featured)}
          </div>
        </div>
      </div>
    </section>
    <section class="section split">
      <div>
        <div class="section-head"><div><div class="kicker">Latest News</div><h2>League updates</h2></div><a class="pill" href="./news.html">See all</a></div>
        <div class="grid">
          ${latestNews().map((n) => `
            <article class="card">
              <div class="pill">${escapeHtml(n.category || "League")}</div>
              <h3 style="margin-top:10px">${escapeHtml(n.title)}</h3>
              <p>${escapeHtml(n.body || "").slice(0, 180)}${(n.body || "").length > 180 ? "…" : ""}</p>
            </article>
          `).join("") || `<div class="empty">Add news posts in the commissioner dashboard.</div>`}
        </div>
      </div>
      <div class="stack">
        <div class="section-head"><div><div class="kicker">Top 5</div><h2>Power rankings</h2></div><a class="pill" href="./rankings.html">Full board</a></div>
        <div class="card">
          ${rankingsTop(5).map((r) => {
            const t = findTeam(r.team_name) || normalizeTeamRow({ name: r.team_name });
            return `
              <div class="team-card" style="margin-bottom:12px">
                <div class="team-main">
                  ${logoMarkup(t, "52px")}
                  <div>
                    <div class="team-name">#${r.rank} ${escapeHtml(canonicalTeamName(r.team_name))}</div>
                    <div class="small muted">${escapeHtml(r.note || "")}</div>
                  </div>
                </div>
                <div class="pill">${r.previous_rank ? `Prev ${r.previous_rank}` : "new"}</div>
              </div>
            `;
          }).join("") || `<div class="empty">Add weekly rankings in the dashboard.</div>`}
        </div>
        <div class="section-head" style="margin-top:10px"><div><div class="kicker">Standings</div><h2>Top records</h2></div><a class="pill" href="./standings.html">All teams</a></div>
        <div class="card">
          ${topTeams.map((t) => `
            <div class="team-card" style="margin-bottom:12px">
              <div class="team-main">
                ${logoMarkup(t, "52px")}
                <div>
                  <div class="team-name">${escapeHtml(t.name)}</div>
                  <div class="small muted">${escapeHtml(t.conference)} · ${escapeHtml(t.division)} · ${record(t)} · Win% ${fmtPct(t.wins, t.losses, t.ties)}</div>
                </div>
              </div>
              <div class="pill">${fmtPct(t.wins, t.losses, t.ties)}</div>
            </div>
          `).join("") || `<div class="empty">No standings data yet.</div>`}
        </div>
      </div>
    </section>
  `;
}

function renderTeams() {
  app.innerHTML = `
    <section class="section">
      <div class="section-head">
        <div><div class="kicker">Teams</div><h2>Coaches, divisions, records, PPG, PAPG</h2></div>
        <div class="searchbar"><input id="teamSearch" class="input" placeholder="Search team or coach"/></div>
      </div>
      <div id="teamsGrid" class="grid grid-2"></div>
    </section>
  `;
  const grid = document.getElementById("teamsGrid");
  const search = document.getElementById("teamSearch");
  const draw = () => {
    const term = search.value.toLowerCase().trim();
    const filtered = state.teams.filter((t) => [t.name, t.abbr, t.coach_name, t.ac_name, t.division, t.conference].join(" ").toLowerCase().includes(term));
    grid.innerHTML = filtered.map((t) => `
      <article class="card team-card">
        <div class="team-main">
          ${logoMarkup(t, "62px")}
          <div>
            <div class="team-name">${escapeHtml(t.abbr)} ${escapeHtml(t.name)}</div>
            <div class="small muted">${escapeHtml(t.coach_name || "")}${t.ac_name ? ` · AC ${escapeHtml(t.ac_name)}` : ""}</div>
            <div class="small muted">${escapeHtml(t.conference)} · ${escapeHtml(t.division)} · ${record(t)} · Win% ${fmtPct(t.wins, t.losses, t.ties)}</div>
            <div class="small muted">PPG ${ppgDisplay(t, "for")} · PAPG ${ppgDisplay(t, "against")}</div>
            <div class="small muted">Colors <span style="display:inline-block;width:10px;height:10px;border-radius:999px;background:${escapeHtml(t.primary_color || '#0f172a')};margin:0 4px -1px 8px"></span>${escapeHtml(t.primary_color || '')} <span style="display:inline-block;width:10px;height:10px;border-radius:999px;background:${escapeHtml(t.secondary_color || '#38bdf8')};margin:0 4px -1px 8px"></span>${escapeHtml(t.secondary_color || '')}</div>
          </div>
        </div>
        <a class="pill" href="./team.html?team=${encodeURIComponent(t.abbr || t.name)}">Team page</a>
      </article>
    `).join("") || `<div class="empty">No matching teams.</div>`;
  };
  search.addEventListener("input", draw);
  draw();
}


function renderTeamPage() {
  const params = new URLSearchParams(location.search);
  const q = params.get("team") || params.get("id") || params.get("abbr") || "";
  const team = findTeam(q) || state.teams[0];
  if (!team) {
    app.innerHTML = `<section class="section"><div class="empty">No team data loaded.</div></section>`;
    return;
  }
  const games = teamGames(team.name);
  const recent = [...games].filter((g) => g.home_score !== null && g.away_score !== null).slice(-4).reverse();
  const remaining = games.filter((g) => g.home_score === null || g.away_score === null);
  const upcoming = remaining.slice(0, 6);
  const status = playoffStatus(team);
  app.innerHTML = `
    <section class="section">
      <div class="panel">
        <div class="lg-hero">
          ${logoMarkup(team, "96px")}
          <div>
            <div class="kicker">${escapeHtml(team.conference)} · ${escapeHtml(team.division)} · ${escapeHtml(team.abbr)}</div>
            <h1 class="page-title">${escapeHtml(team.name)}</h1>
            <div class="small muted">${escapeHtml(team.coach_name || "")}${team.ac_name ? ` · AC ${escapeHtml(team.ac_name)}` : ""}</div>
            <div style="margin-top:10px"><span class="badge ${status.cls}">${escapeHtml(status.label)}</span>${status.seed ? ` <span class="pill">Seed ${status.seed}</span>` : ""}</div>
          </div>
        </div>
        <div class="detail-grid" style="margin-top:18px">
          <div class="detail-card"><b>Record</b><span>${record(team)}</span></div>
          <div class="detail-card"><b>Win%</b><span>${fmtPct(team.wins, team.losses, team.ties)}</span></div>
          <div class="detail-card"><b>PPG For</b><span>${ppgDisplay(team, "for")}</span></div>
          <div class="detail-card"><b>PAPG</b><span>${ppgDisplay(team, "against")}</span></div>
          <div class="detail-card"><b>Points For</b><span>${fmtNum(team.points_for)}</span></div>
          <div class="detail-card"><b>Points Against</b><span>${fmtNum(team.points_against)}</span></div>
          <div class="detail-card"><b>Point Differential</b><span>${diff(team)}</span></div>
          <div class="detail-card"><b>Streak</b><span>${escapeHtml(team.streak || "—")}</span></div>
          <div class="detail-card"><b>Team Colors</b><span><span style="display:inline-block;width:12px;height:12px;border-radius:999px;background:${escapeHtml(team.primary_color || '#0f172a')};margin-right:6px"></span>${escapeHtml(team.primary_color || '—')} <span style="display:inline-block;width:12px;height:12px;border-radius:999px;background:${escapeHtml(team.secondary_color || '#38bdf8')};margin:0 6px 0 14px"></span>${escapeHtml(team.secondary_color || '—')}</span></div>
        </div>
      </div>
    </section>
    <section class="section split">
      <div>
        <div class="section-head"><div><div class="kicker">Recent Form</div><h2>Last results</h2></div></div>
        <div class="stack">
          ${recent.length ? recent.map((g) => `
            <article class="card">
              <div class="pill ${g.is_live || g.status === "live" ? "live" : g.status}">${g.is_live || g.status === "live" ? "LIVE" : escapeHtml(g.week)}</div>
              <h3 style="margin-top:10px">${escapeHtml(g.away_team_name)} at ${escapeHtml(g.home_team_name)}</h3>
              <p class="small muted">${fmtNum(g.away_score)} - ${fmtNum(g.home_score)}</p>
              <a class="btn" href="./game.html?week=${encodeURIComponent(g.week)}&home=${encodeURIComponent(g.home_team_name)}&away=${encodeURIComponent(g.away_team_name)}">Open Game Center</a>
            </article>
          `).join("") : `<div class="empty">No completed games yet.</div>`}
        </div>
      </div>
      <div class="stack">
        <div class="section-head"><div><div class="kicker">Remaining Schedule</div><h2>Upcoming games</h2></div></div>
        <div class="stack">
          ${upcoming.length ? upcoming.map((g) => `
            <article class="card">
              <div class="pill ${g.is_live || g.status === "live" ? "live" : g.status}">${g.is_live || g.status === "live" ? "LIVE" : escapeHtml(g.week)}</div>
              <h3 style="margin-top:10px">${escapeHtml(g.away_team_name)} at ${escapeHtml(g.home_team_name)}</h3>
              <p class="small muted">${g.source_sheet ? escapeHtml(g.source_sheet) : ""}${g.note ? ` · ${escapeHtml(g.note)}` : ""}</p>
            </article>
          `).join("") : `<div class="empty">All games for this team are completed.</div>`}
        </div>
        <div class="card">
          <div class="kicker">At a glance</div>
          <p class="small muted" style="margin-bottom:0">${remaining.length} games remain on the schedule.</p>
        </div>
      </div>
    </section>
  `;
}
function renderSchedule() {
  const weeks = ["All", ...new Set(state.schedule.map((g) => g.week))].sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return Number(String(a).replace(/\D/g, "")) - Number(String(b).replace(/\D/g, ""));
  });
  app.innerHTML = `
    <section class="section">
      <div class="section-head">
        <div><div class="kicker">Schedule</div><h2>Weekly games and live statuses</h2></div>
        <select id="weekFilter" class="select" style="max-width:240px">${weeks.map((w) => `<option value="${escapeHtml(w)}">${escapeHtml(w)}</option>`).join("")}</select>
      </div>
      <div id="scheduleList" class="stack"></div>
    </section>
  `;
  const filter = document.getElementById("weekFilter");
  const list = document.getElementById("scheduleList");
  const draw = () => {
    const rows = (filter.value === "All" ? state.schedule : state.schedule.filter((g) => g.week === filter.value)).slice(0, 200);
    list.innerHTML = rows.map((g) => `
      <article class="card">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap">
          <div>
            <div class="pill ${g.is_live || g.status === "live" ? "live" : g.status}">${String(g.status || "scheduled").toUpperCase()}</div>
            <h3 style="margin-top:10px">${escapeHtml(g.week)} · ${escapeHtml(g.away_team_name)} at ${escapeHtml(g.home_team_name)}</h3>
            <p class="small muted">${escapeHtml(g.source_sheet || "")}</p>
          </div>
          <div style="text-align:right">
            <div style="font-size:1.4rem;font-weight:900">${fmtNum(g.away_score)} - ${fmtNum(g.home_score)}</div>
            <a class="btn" href="./game.html?week=${encodeURIComponent(g.week)}&home=${encodeURIComponent(g.home_team_name)}&away=${encodeURIComponent(g.away_team_name)}">Open Game Center</a>
          </div>
        </div>
      </article>
    `).join("") || `<div class="empty">No games found.</div>`;
  };
  filter.addEventListener("change", draw);
  draw();
}


function renderStandings() {
  const snapshots = playoffPicture();
  const conferenceOrder = ["AFC", "NFC"];
  app.innerHTML = `
    <section class="section">
      <div class="section-head">
        <div><div class="kicker">Standings</div><h2>Conference and division tables</h2></div>
        <div class="pill">Automatic tiebreakers</div>
      </div>
      <div class="grid grid-2">
        ${conferenceOrder.map((conf) => {
          const snapshot = snapshots[conf];
          return `
            <article class="card">
              <div class="section-head" style="margin-bottom:12px">
                <div>
                  <div class="kicker">${conf}</div>
                  <h3 style="margin-top:6px">${conf} Playoff Picture</h3>
                </div>
                <div class="pill">${snapshot.seeds.length}/7 Seeds Set</div>
              </div>
              <table class="table">
                <thead>
                  <tr>
                    <th>Team</th><th>Record</th><th>Win%</th><th>Seed</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${snapshot.teams.map((t) => {
                    const status = playoffStatus(t, snapshot);
                    const seed = status.seed ? `#${status.seed}` : '—';
                    return `
                      <tr>
                        <td>
                          <div class="team-main">
                            ${logoMarkup(t, "38px")}
                            <div>
                              <div class="team-name">${escapeHtml(t.abbr)} ${escapeHtml(t.name)}</div>
                              <div class="small muted">${escapeHtml(t.division)}</div>
                            </div>
                          </div>
                        </td>
                        <td>${record(t)}</td>
                        <td>${fmtPct(t.wins, t.losses, t.ties)}</td>
                        <td>${seed}</td>
                        <td><span class="badge ${status.cls}">${escapeHtml(status.label)}</span></td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </article>
          `;
        }).join('')}
      </div>
      <div class="section" style="margin-top:18px">
        <div class="section-head"><div><div class="kicker">Divisions</div><h2>Division tables</h2></div></div>
        <div class="stack">
          ${Object.entries({
            'AFC East': snapshotForDivision('AFC East'),
            'AFC North': snapshotForDivision('AFC North'),
            'AFC South': snapshotForDivision('AFC South'),
            'AFC West': snapshotForDivision('AFC West'),
            'NFC East': snapshotForDivision('NFC East'),
            'NFC North': snapshotForDivision('NFC North'),
            'NFC South': snapshotForDivision('NFC South'),
            'NFC West': snapshotForDivision('NFC West'),
          }).map(([division, rows]) => `
            <article class="card">
              <h3>${escapeHtml(division)}</h3>
              <table class="table">
                <thead>
                  <tr>
                    <th>Team</th><th>Coach</th><th>REC</th><th>Win%</th><th>PF</th><th>PA</th><th>PPG</th><th>PAPG</th><th>Indicator</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.map((t) => {
                    const status = playoffStatus(t, snapshots[t.conference]);
                    return `
                      <tr>
                        <td>
                          <div class="team-main">
                            ${logoMarkup(t, "38px")}
                            <div>
                              <div class="team-name">${escapeHtml(t.abbr)} ${escapeHtml(t.name)}</div>
                              <div class="small muted">${escapeHtml(t.division)}</div>
                            </div>
                          </div>
                        </td>
                        <td>${escapeHtml(t.coach_name || '')}</td>
                        <td>${record(t)}</td>
                        <td>${fmtPct(t.wins, t.losses, t.ties)}</td>
                        <td>${fmtNum(t.points_for)}</td>
                        <td>${fmtNum(t.points_against)}</td>
                        <td>${ppgDisplay(t, 'for')}</td>
                        <td>${ppgDisplay(t, 'against')}</td>
                        <td><span class="badge ${status.cls}">${escapeHtml(status.label)}</span></td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function snapshotForDivision(division) {
  const conf = division.split(' ')[0];
  return sortTeamsForContext(state.teams.filter((t) => t.division === division), state.teams.filter((t) => t.division === division));
}

function renderPlayoffs() {
  const snapshots = playoffPicture();
  const locked = Boolean(state.settings.playoff_seeds_locked?.locked ?? state.settings.playoff_seeds_locked);
  const buildConferenceCard = (snapshot) => `
    <article class="card">
      <div class="section-head">
        <div>
          <div class="kicker">${escapeHtml(snapshot.conference)}</div>
          <h2>${escapeHtml(snapshot.conference)} Playoff Bracket</h2>
        </div>
        <div class="pill">${locked ? 'Seeds Locked' : 'Live Projection'}</div>
      </div>
      <div class="stack">
        <div class="card" style="padding:14px">
          <div class="kicker">Seeds 1-7</div>
          <div class="stack" style="margin-top:10px">
            ${snapshot.seeds.map((t, idx) => {
              const status = playoffStatus(t, snapshot);
              return `
                <div class="team-card">
                  <div class="team-main">
                    ${logoMarkup(t, '42px')}
                    <div>
                      <div class="team-name">#${idx + 1} ${escapeHtml(t.abbr)} ${escapeHtml(t.name)}</div>
                      <div class="small muted">${record(t)} · ${escapeHtml(t.division)}</div>
                    </div>
                  </div>
                  <span class="badge ${status.cls}">${escapeHtml(status.label)}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        <div class="grid grid-3">
          <div class="card">
            <div class="kicker">Wild Card</div>
            <p class="small muted">2 vs 7<br/>3 vs 6<br/>4 vs 5</p>
          </div>
          <div class="card">
            <div class="kicker">Divisional</div>
            <p class="small muted">1 vs lowest remaining<br/>Reseed after Wild Card</p>
          </div>
          <div class="card">
            <div class="kicker">Conference Championship</div>
            <p class="small muted">Highest remaining seed hosts</p>
          </div>
        </div>
      </div>
    </article>
  `;
  app.innerHTML = `
    <section class="section">
      <div class="panel">
        <div class="section-head">
          <div>
            <div class="kicker">Playoffs</div>
            <h1 class="page-title">NFL-style postseason bracket</h1>
          </div>
          <div class="pill">Reseeds after every round</div>
        </div>
        <p class="small muted">Division winners become seeds 1-4, the next three teams become wild cards, and the bracket reseeds exactly like the NFL after every round.</p>
      </div>
    </section>
    <section class="section grid grid-2">
      ${buildConferenceCard(snapshots.AFC)}
      ${buildConferenceCard(snapshots.NFC)}
    </section>
    <section class="section">
      <article class="card">
        <div class="section-head">
          <div><div class="kicker">Super Bowl</div><h2>Projected matchup</h2></div>
        </div>
        <div class="team-card">
          <div class="team-main">
            ${logoMarkup(snapshots.AFC.seeds[0] || normalizeTeamRow({ name: 'AFC Champion' }), '54px')}
            <div>
              <div class="team-name">${escapeHtml(snapshots.AFC.seeds[0]?.name || 'AFC Champion')}</div>
              <div class="small muted">AFC representative</div>
            </div>
          </div>
          <div class="pill">vs</div>
          <div class="team-main" style="justify-content:flex-end;text-align:right">
            <div>
              <div class="team-name">${escapeHtml(snapshots.NFC.seeds[0]?.name || 'NFC Champion')}</div>
              <div class="small muted">NFC representative</div>
            </div>
            ${logoMarkup(snapshots.NFC.seeds[0] || normalizeTeamRow({ name: 'NFC Champion' }), '54px')}
          </div>
        </div>
      </article>
    </section>
  `;
}
function renderRankings() {
  const weekOptions = [...new Set(state.rankings.map((r) => Number(r.week) || 1))].sort((a, b) => b - a);
  const currentWeek = currentRankWeek();
  app.innerHTML = `
    <section class="section">
      <div class="section-head">
        <div><div class="kicker">Rankings</div><h2>Weekly power rankings</h2></div>
        <select id="rankWeek" class="select" style="max-width:180px">${weekOptions.map((w) => `<option value="${w}" ${w === currentWeek ? "selected" : ""}>Week ${w}</option>`).join("")}</select>
      </div>
      <div id="rankGrid" class="grid grid-2"></div>
    </section>
  `;
  const sel = document.getElementById("rankWeek");
  const grid = document.getElementById("rankGrid");
  const draw = () => {
    const week = Number(sel.value);
    const list = state.rankings.filter((r) => Number(r.week) === week).sort((a, b) => Number(a.rank) - Number(b.rank));
    grid.innerHTML = list.map((r) => {
      const t = findTeam(r.team_name) || normalizeTeamRow({ name: r.team_name });
      return `
        <article class="card team-card">
          <div class="team-main">
            ${logoMarkup(t, "62px")}
            <div>
              <div class="team-name">#${r.rank} ${escapeHtml(canonicalTeamName(r.team_name))}</div>
              <div class="small muted">${escapeHtml(r.note || "")}</div>
              <div class="small muted">${escapeHtml(t.conference || "")} · ${escapeHtml(t.division || "")}</div>
            </div>
          </div>
          <div class="pill">${r.previous_rank ? `Prev ${r.previous_rank}` : "new"}</div>
        </article>
      `;
    }).join("") || `<div class="empty">No rankings loaded yet.</div>`;
  };
  sel.addEventListener("change", draw);
  draw();
}

function renderNews() {
  app.innerHTML = `
    <section class="section">
      <div class="section-head">
        <div><div class="kicker">News</div><h2>League updates and announcements</h2></div>
      </div>
      <div class="stack">
        ${state.news.map((n) => `
          <article class="card">
            <div class="pill">${escapeHtml(n.category || "League")}</div>
            <h3 style="margin-top:10px">${escapeHtml(n.title)}</h3>
            <p>${escapeHtml(n.body || "")}</p>
            <div class="small muted">${n.published_at ? new Date(n.published_at).toLocaleString() : ""}</div>
          </article>
        `).join("") || `<div class="empty">No news yet.</div>`}
      </div>
    </section>
  `;
}


function renderAwards() {
  const honors = mergedHonors();
  app.innerHTML = `
    <section class="section">
      <div class="section-head">
        <div>
          <div class="kicker">NTFL Honors</div>
          <h2>Displayed before the Super Bowl</h2>
        </div>
        <div class="pill">Season ${escapeHtml(SEASON_LABEL)}</div>
      </div>
      <div class="grid grid-2">
        ${honors.map((a) => `
          <article class="card">
            <div class="pill">${escapeHtml(a.season || SEASON_LABEL)}</div>
            <h3 style="margin-top:10px">${escapeHtml(a.icon || '🏆')} ${escapeHtml(a.award_name || '')}</h3>
            <div class="detail-grid" style="margin-top:12px;grid-template-columns:repeat(2,minmax(0,1fr))">
              <div class="detail-card"><b>Winner</b><span>${escapeHtml(a.winner || 'TBA')}</span></div>
              <div class="detail-card"><b>Team</b><span>${escapeHtml(a.team || 'TBA')}</span></div>
              <div class="detail-card"><b>Season</b><span>${escapeHtml(a.season || SEASON_LABEL)}</span></div>
              <div class="detail-card"><b>Reason</b><span>${escapeHtml(a.reason || a.note || 'TBA')}</span></div>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderHistory() {
  const items = mergedHistory();
  app.innerHTML = `
    <section class="section">
      <div class="section-head">
        <div><div class="kicker">History</div><h2>League archive</h2></div>
      </div>
      <div class="stack">
        ${items.map((h) => `
          <article class="card">
            <div class="pill">${escapeHtml(h.season || '')}</div>
            <h3 style="margin-top:10px">${escapeHtml(h.title || '')}</h3>
            <div class="detail-grid" style="margin-top:12px">
              <div class="detail-card"><b>Champion</b><span>${escapeHtml(h.champion || 'TBA')}</span></div>
              <div class="detail-card"><b>Runner-up</b><span>${escapeHtml(h.runner_up || 'TBA')}</span></div>
            </div>
            <p style="margin-top:12px">${escapeHtml(h.body || '')}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}
function renderRules() {
  const rules = state.settings.rules || DEFAULT_SETTINGS.rules;
  const body = escapeHtml(rules.body || "Add rules in the commissioner dashboard.").replace(/\n/g, "<br/>");
  app.innerHTML = `
    <section class="section">
      <article class="card" style="padding:28px">
        <div class="section-head" style="margin-bottom:18px">
          <div>
            <div class="kicker">Rules</div>
            <h2>${escapeHtml(rules.title || "Rules")}</h2>
          </div>
          <img src="./assets/league-logo.jpeg" alt="NTFL logo" style="width:74px;height:74px;object-fit:contain;filter:drop-shadow(0 6px 20px rgba(0,0,0,.25));"/>
        </div>
        <div style="white-space:pre-line;line-height:1.7;max-width:980px;font-size:1rem">${body}</div>
      </article>
    </section>
  `;
}

function renderGame() {
  const params = new URLSearchParams(location.search);
  const week = params.get("week");
  const home = params.get("home");
  const away = params.get("away");
  const teamParam = params.get("team");
  let game = null;

  if (week && home && away) {
    game = state.schedule.find((g) => g.week === week && g.home_team_name === canonicalTeamName(home) && g.away_team_name === canonicalTeamName(away));
  } else if (teamParam) {
    const team = findTeam(teamParam);
    const name = team?.name || canonicalTeamName(teamParam);
    game = teamGames(name)[0] || featuredGame();
  } else {
    game = featuredGame();
  }
  if (!game) {
    app.innerHTML = `<section class="section"><div class="empty">No game data loaded.</div></section>`;
    return;
  }
  const ht = findTeam(game.home_team_name) || normalizeTeamRow({ name: game.home_team_name });
  const at = findTeam(game.away_team_name) || normalizeTeamRow({ name: game.away_team_name });
  app.innerHTML = `
    <section class="section">
      <div class="panel">
        <div class="kicker">Game Center</div>
        <h2>${escapeHtml(game.week)} · ${escapeHtml(game.away_team_name)} at ${escapeHtml(game.home_team_name)}</h2>
        <div class="grid grid-2" style="margin-top:16px">
          <article class="card">
            <div style="display:flex;gap:12px;align-items:center">
              ${logoMarkup(at, "72px")}
              <div>
                <div class="team-name">${escapeHtml(at.abbr)} ${escapeHtml(at.name)}</div>
                <div class="small muted">${escapeHtml(at.coach_name || "")}</div>
              </div>
            </div>
          </article>
          <article class="card">
            <div style="display:flex;gap:12px;align-items:center;justify-content:flex-end">
              <div style="text-align:right">
                <div class="team-name">${escapeHtml(ht.abbr)} ${escapeHtml(ht.name)}</div>
                <div class="small muted">${escapeHtml(ht.coach_name || "")}</div>
              </div>
              ${logoMarkup(ht, "72px")}
            </div>
          </article>
        </div>
        <div class="card" style="margin-top:14px">
          <div class="kicker">Scoreboard</div>
          <div style="font-size:2.4rem;font-weight:900;margin-top:8px">${fmtNum(game.away_score)} - ${fmtNum(game.home_score)}</div>
          <div class="pill ${game.is_live || game.status === "live" ? "live" : game.status}">${game.is_live || game.status === "live" ? "LIVE" : escapeHtml(game.status)}</div>
        </div>
      </div>
    </section>
  `;
}

function renderLoginBox(message = "") {
  app.innerHTML = `
    <section class="section">
      <div class="panel login-box">
        <div class="lg-hero" style="margin-bottom:16px">
          <img src="${LEAGUE_LOGO}" alt="NTFL logo"/>
          <div>
            <div class="kicker">Commissioner dashboard</div>
            <h2>Sign in</h2>
          </div>
        </div>
        <div class="stack">
          <input id="email" class="input" placeholder="Email"/>
          <input id="password" type="password" class="input" placeholder="Password"/>
          <button id="loginBtn" class="btn primary">Log in</button>
          <div id="loginMsg" class="small muted">${escapeHtml(message)}</div>
        </div>
      </div>
    </section>
  `;
  document.getElementById("loginBtn").onclick = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const loginMsg = document.getElementById("loginMsg");

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      sessionStorage.setItem(DEMO_SESSION_KEY, "1");
      loginMsg.textContent = "Signed in. Reloading…";
      location.reload();
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      loginMsg.textContent = error.message;
      return;
    }
    loginMsg.textContent = "Signed in. Reloading…";
    location.reload();
  };
}

function adminTeamEditor() {
  const rows = state.teams.slice().sort((a, b) => a.name.localeCompare(b.name));
  return `
    <article class="card">
      <div class="section-head">
        <div><div class="kicker">Teams</div><h2>Edit coaches, colors, and PPG/PAPG</h2></div>
        <button id="seedBtn" class="btn warn">Seed Supabase</button>
      </div>
      <div class="editor-list">
        ${rows.map((t) => `
          <div class="editor-item" data-team="${escapeHtml(t.name)}">
            <div class="form-row">
              <input class="input" data-field="name" value="${escapeHtml(t.name)}" placeholder="Team name"/>
              <input class="input" data-field="abbr" value="${escapeHtml(t.abbr || "")}" placeholder="Abbr"/>
              <input class="input" data-field="coach_name" value="${escapeHtml(t.coach_name || "")}" placeholder="Coach"/>
              <input class="input" data-field="ac_name" value="${escapeHtml(t.ac_name || "")}" placeholder="AC"/>
            </div>
            <div class="form-row" style="margin-top:10px">
              <input class="input" data-field="conference" value="${escapeHtml(t.conference || "")}" placeholder="Conference"/>
              <input class="input" data-field="division" value="${escapeHtml(t.division || "")}" placeholder="Division"/>
              <input class="input" data-field="logo_url" value="${escapeHtml(t.logo_url || "")}" placeholder="Logo URL"/>
              <button class="btn primary save-team">Save team</button>
            </div>
            <div class="form-row" style="margin-top:10px">
              <input class="input" data-field="primary_color" value="${escapeHtml(t.primary_color || "")}" placeholder="Primary color"/>
              <input class="input" data-field="secondary_color" value="${escapeHtml(t.secondary_color || "")}" placeholder="Secondary color"/>
              <input class="input" data-field="wins" type="number" value="${Number(t.wins || 0)}" placeholder="Wins"/>
              <input class="input" data-field="losses" type="number" value="${Number(t.losses || 0)}" placeholder="Losses"/>
            </div>
            <div class="form-row" style="margin-top:10px">
              <input class="input" data-field="ties" type="number" value="${Number(t.ties || 0)}" placeholder="Ties"/>
              <input class="input" data-field="points_for" type="number" value="${Number(t.points_for || 0)}" placeholder="Points For"/>
              <input class="input" data-field="points_against" type="number" value="${Number(t.points_against || 0)}" placeholder="Points Against"/>
              <input class="input" data-field="streak" value="${escapeHtml(t.streak || "")}" placeholder="Streak"/>
            </div>
            <div class="form-row" style="margin-top:10px">
              <input class="input" data-field="ppg_for" type="number" step="0.1" value="${t.ppg_for ?? ""}" placeholder="PPG For"/>
              <input class="input" data-field="ppg_against" type="number" step="0.1" value="${t.ppg_against ?? ""}" placeholder="PAPG"/>
              <input class="input" data-field="notes" value="${escapeHtml(t.notes || "")}" placeholder="Notes"/>
              <div></div>
            </div>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function adminScheduleEditor() {
  const rows = state.schedule.slice(0, 120);
  return `
    <article class="card">
      <div class="section-head">
        <div><div class="kicker">Schedule</div><h2>Edit scores and LIVE status</h2></div>
      </div>
      <div class="editor-list">
        ${rows.map((g) => `
          <div class="editor-item" data-game="${escapeHtml(g.id)}">
            <div class="form-row two">
              <input class="input" data-field="week" value="${escapeHtml(g.week)}" />
              <input class="input" data-field="week_number" type="number" value="${Number(g.week_number || 1)}" />
            </div>
            <div class="form-row" style="margin-top:10px">
              <input class="input" data-field="away_team_name" value="${escapeHtml(g.away_team_name)}" />
              <input class="input" data-field="home_team_name" value="${escapeHtml(g.home_team_name)}" />
              <input class="input" data-field="away_score" type="number" value="${g.away_score ?? ""}" placeholder="Away score"/>
              <input class="input" data-field="home_score" type="number" value="${g.home_score ?? ""}" placeholder="Home score"/>
            </div>
            <div class="form-row" style="margin-top:10px">
              <select class="select" data-field="status">
                ${["scheduled","live","final","postponed","cancelled"].map((s) => `<option value="${s}" ${g.status === s ? "selected" : ""}>${s}</option>`).join("")}
              </select>
              <label class="pill" style="justify-content:flex-start"><input type="checkbox" data-field="is_live" ${g.is_live ? "checked" : ""}/> LIVE</label>
              <input class="input" data-field="source_sheet" value="${escapeHtml(g.source_sheet || "")}" />
              <button class="btn primary save-game">Save game</button>
            </div>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function adminRankingsEditor() {
  const rows = state.rankings.slice(0, 40);
  return `
    <article class="card">
      <div class="section-head">
        <div><div class="kicker">Rankings</div><h2>Weekly power rankings</h2></div>
      </div>
      <div class="editor-list">
        ${rows.map((r) => `
          <div class="editor-item" data-ranking="${escapeHtml(r.id)}">
            <div class="form-row">
              <input class="input" data-field="week" type="number" value="${Number(r.week || 1)}" />
              <input class="input" data-field="rank" type="number" value="${Number(r.rank || 1)}" />
              <input class="input" data-field="team_name" value="${escapeHtml(r.team_name)}" />
              <input class="input" data-field="previous_rank" type="number" value="${r.previous_rank ?? ""}" />
            </div>
            <div class="form-row" style="margin-top:10px">
              <input class="input" data-field="note" value="${escapeHtml(r.note || "")}" placeholder="Note"/>
              <button class="btn primary save-ranking">Save ranking</button>
            </div>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}


function adminPlayoffTools() {
  const picture = playoffPicture();
  const locked = Boolean(state.settings.playoff_seeds_locked?.locked ?? state.settings.playoff_seeds_locked);
  return `
    <section class="section">
      <article class="card">
        <div class="section-head">
          <div>
            <div class="kicker">Playoff Controls</div>
            <h2>Generate and lock postseason assets</h2>
          </div>
          <div class="pill">${locked ? 'Locked' : 'Live Projection'}</div>
        </div>
        <div class="grid grid-3">
          <button class="btn primary" type="button" data-site-action="update-awards">Update Awards</button>
          <button class="btn good" type="button" data-site-action="generate-playoff-picture">Generate Playoff Picture</button>
          <button class="btn warn" type="button" data-site-action="generate-bracket">Generate Bracket</button>
          <button class="btn primary" type="button" data-site-action="publish-awards">Publish Awards</button>
          <button class="btn" type="button" data-site-action="lock-seeds">Lock Playoff Seeds</button>
        </div>
        <div class="subtle small">Snapshot status: ${locked ? 'Seeds are locked in site settings.' : 'Seeds are live and auto-recalculate from the schedule.'}</div>
        <div class="subtle small">Current AFC seed 1: ${escapeHtml(picture.AFC.seeds[0]?.name || 'TBA')} · Current NFC seed 1: ${escapeHtml(picture.NFC.seeds[0]?.name || 'TBA')}</div>
      </article>
    </section>
  `;
}

function adminPublishers() {
  const banner = state.settings.season_banner || DEFAULT_SETTINGS.season_banner;
  const home = state.settings.home_banner || DEFAULT_SETTINGS.home_banner;
  const rules = state.settings.rules || DEFAULT_SETTINGS.rules;
  return `
    <article class="card">
      <div class="section-head">
        <div><div class="kicker">Content</div><h2>News, awards, history, and rules</h2></div>
      </div>
      <div class="grid grid-2">
        <form id="newsForm" class="stack">
          <input class="input" name="title" placeholder="News title"/>
          <input class="input" name="category" placeholder="Category" value="League"/>
          <textarea class="textarea" name="body" placeholder="News body"></textarea>
          <input class="input" name="image_url" placeholder="Image URL"/>
          <button class="btn good" type="submit">Publish news</button>
        </form>
        <form id="rulesForm" class="stack">
          <input class="input" name="title" placeholder="Rules title" value="${escapeHtml(rules.title)}"/>
          <textarea class="textarea" name="body" placeholder="Rules text">${escapeHtml(rules.body)}</textarea>
          <button class="btn primary" type="submit">Save rules</button>
        </form>
      </div>
      <div class="grid grid-3" style="margin-top:14px">
        <form id="awardForm" class="stack">
          <input class="input" name="season" placeholder="Season" value="${escapeHtml(SEASON_LABEL)}"/>
          <input class="input" name="award_name" placeholder="Award name"/>
          <input class="input" name="winner" placeholder="Winner"/>
          <button class="btn primary" type="submit">Add award</button>
        </form>
        <form id="historyForm" class="stack">
          <input class="input" name="season" placeholder="Season" value="${escapeHtml(SEASON_LABEL)}"/>
          <input class="input" name="title" placeholder="History title"/>
          <textarea class="textarea" name="body" placeholder="History note"></textarea>
          <button class="btn primary" type="submit">Add history</button>
        </form>
        <form id="settingsForm" class="stack">
          <input class="input" name="season_banner" placeholder="Banner title" value="${escapeHtml(banner.title)}"/>
          <input class="input" name="home_headline" placeholder="Home headline" value="${escapeHtml(home.headline)}"/>
          <button class="btn primary" type="submit">Save site settings</button>
        </form>
      </div>
      <div class="subtle small">PPG = points per game for. PAPG = points per game against.</div>
    </article>
  `;
}

async function seedSupabase() {
  const [teamsSeed, scheduleSeed] = await Promise.all([readJson("./data/teams.seed.json"), readJson("./data/schedule.seed.json")]);
  if (!teamsSeed.length || !scheduleSeed.length) {
    alert("Seed files could not be loaded.");
    return;
  }
  const teamPayload = teamsSeed.map((t) => ({
    name: canonicalTeamName(t.name || t.team),
    abbr: (t.abbr || teamAbbr(t.name || t.team)).toUpperCase(),
    coach_name: t.coach_name || t.coach || "",
    ac_name: t.ac_name || t.ac || "",
    conference: t.conference || "",
    division: t.division || "",
    logo_url: t.logo_url || teamLogo(t.name || t.team, t.abbr),
    primary_color: t.primary_color || "#0f172a",
    secondary_color: t.secondary_color || "#38bdf8",
    wins: Number(t.wins || 0),
    losses: Number(t.losses || 0),
    ties: Number(t.ties || 0),
    points_for: Number(t.points_for || 0),
    points_against: Number(t.points_against || 0),
    ppg_for: t.ppg_for ?? null,
    ppg_against: t.ppg_against ?? null,
    streak: t.streak || "",
    notes: t.notes || "",
  }));
  const schedulePayload = scheduleSeed.map((g) => ({
    id: g.id,
    week: g.week || `W${g.week_number || 1}`,
    week_number: Number(g.week_number || 1),
    game_date: g.game_date || null,
    kickoff_time: g.kickoff_time || null,
    home_team_name: canonicalTeamName(g.home_team_name || g.home_team),
    away_team_name: canonicalTeamName(g.away_team_name || g.away_team),
    home_score: g.home_score ?? null,
    away_score: g.away_score ?? null,
    status: g.status || ((g.home_score !== null && g.home_score !== undefined && g.away_score !== null && g.away_score !== undefined) ? "final" : "scheduled"),
    is_live: Boolean(g.is_live),
    spotlight: Boolean(g.spotlight),
    source_sheet: g.source_sheet || "",
    note: g.note || "",
  }));
  const [{ error: teamErr }, { error: schedErr }] = await Promise.all([
    supabase.from("teams").upsert(teamPayload, { onConflict: "name" }),
    supabase.from("schedule_games").upsert(schedulePayload, { onConflict: "id" }),
  ]);
  if (teamErr || schedErr) {
    alert(teamErr?.message || schedErr?.message || "Seed failed.");
    return;
  }
  alert("Seeded Supabase successfully.");
  location.reload();
}


function bindAdminActions() {
  document.querySelectorAll(".save-team").forEach((btn) => btn.addEventListener("click", async (e) => {
    const row = e.target.closest("[data-team]");
    const original = row.getAttribute("data-team");
    const data = { name: original };
    row.querySelectorAll("[data-field]").forEach((el) => {
      data[el.dataset.field] = el.type === "checkbox" ? el.checked : (el.type === "number" ? (el.value === "" ? null : Number(el.value)) : el.value);
    });
    data.name = canonicalTeamName(data.name);
    data.abbr = (data.abbr || teamAbbr(data.name)).toUpperCase();
    data.coach_name = data.coach_name || "";
    data.ac_name = data.ac_name || "";
    data.wins = Number(data.wins || 0);
    data.losses = Number(data.losses || 0);
    data.ties = Number(data.ties || 0);
    data.points_for = Number(data.points_for || 0);
    data.points_against = Number(data.points_against || 0);
    data.ppg_for = data.ppg_for === "" || data.ppg_for === null ? null : Number(data.ppg_for);
    data.ppg_against = data.ppg_against === "" || data.ppg_against === null ? null : Number(data.ppg_against);
    const { error } = await supabase.from("teams").upsert(data, { onConflict: "name" });
    if (error) return alert(error.message);
    location.reload();
  }));

  document.querySelectorAll(".save-game").forEach((btn) => btn.addEventListener("click", async (e) => {
    const row = e.target.closest("[data-game]");
    const id = row.getAttribute("data-game");
    const data = { id };
    row.querySelectorAll("[data-field]").forEach((el) => {
      data[el.dataset.field] = el.type === "checkbox" ? el.checked : (el.type === "number" ? (el.value === "" ? null : Number(el.value)) : el.value);
    });
    data.home_team_name = canonicalTeamName(data.home_team_name);
    data.away_team_name = canonicalTeamName(data.away_team_name);
    if (data.home_score !== null && data.home_score !== undefined && data.away_score !== null && data.away_score !== undefined && data.status !== "postponed" && data.status !== "cancelled") {
      data.status = "final";
      data.is_live = false;
    }
    const { error } = await supabase.from("schedule_games").upsert(data, { onConflict: "id" });
    if (error) return alert(error.message);
    location.reload();
  }));

  document.querySelectorAll(".save-ranking").forEach((btn) => btn.addEventListener("click", async (e) => {
    const row = e.target.closest("[data-ranking]");
    const id = row.getAttribute("data-ranking");
    const data = { id };
    row.querySelectorAll("[data-field]").forEach((el) => {
      data[el.dataset.field] = el.type === "number" ? (el.value === "" ? null : Number(el.value)) : el.value;
    });
    data.team_name = canonicalTeamName(data.team_name);
    const { error } = await supabase.from("rankings").upsert(data, { onConflict: "id" });
    if (error) return alert(error.message);
    location.reload();
  }));

  document.querySelectorAll('[data-site-action]').forEach((btn) => btn.addEventListener('click', async () => {
    const action = btn.dataset.siteAction;
    try {
      if (action === 'update-awards') {
        await saveSiteSetting('honors_snapshot', mergedHonors());
        await saveSiteSetting('honors_updated_at', new Date().toISOString());
      } else if (action === 'generate-playoff-picture') {
        await saveSiteSetting('playoff_picture', playoffPicture());
        await saveSiteSetting('playoff_picture_updated_at', new Date().toISOString());
      } else if (action === 'generate-bracket') {
        await saveSiteSetting('playoff_bracket', buildPlayoffSnapshotPayload());
        await saveSiteSetting('playoff_bracket_updated_at', new Date().toISOString());
      } else if (action === 'publish-awards') {
        await saveSiteSetting('honors_published', { published: true, published_at: new Date().toISOString() });
      } else if (action === 'lock-seeds') {
        await saveSiteSetting('playoff_seeds_locked', { locked: true, locked_at: new Date().toISOString(), seeds: playoffPicture() });
      }
      location.reload();
    } catch (err) {
      alert(err?.message || 'Action failed.');
    }
  }));

  const newsForm = document.getElementById("newsForm");
  if (newsForm) newsForm.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(newsForm);
    const { error } = await supabase.from("news").insert({
      title: fd.get("title"),
      body: fd.get("body"),
      category: fd.get("category") || "League",
      image_url: fd.get("image_url") || "",
      is_featured: true,
    });
    if (error) return alert(error.message);
    location.reload();
  };

  const rulesForm = document.getElementById("rulesForm");
  if (rulesForm) rulesForm.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(rulesForm);
    await supabase.from("site_settings").upsert({ key: 'rules', value: { title: fd.get('title'), body: fd.get('body') } }, { onConflict: 'key' });
    location.reload();
  };

  const awardForm = document.getElementById("awardForm");
  if (awardForm) awardForm.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(awardForm);
    const { error } = await supabase.from("awards").insert({
      season: fd.get("season") || SEASON_LABEL,
      award_name: fd.get("award_name"),
      winner: fd.get("winner") || "TBA",
      note: fd.get("note") || "",
      icon: "🏆",
    });
    if (error) return alert(error.message);
    location.reload();
  };

  const historyForm = document.getElementById("historyForm");
  if (historyForm) historyForm.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(historyForm);
    const { error } = await supabase.from("history_items").insert({
      season: fd.get("season") || SEASON_LABEL,
      title: fd.get("title"),
      body: fd.get("body"),
    });
    if (error) return alert(error.message);
    location.reload();
  };

  const settingsForm = document.getElementById("settingsForm");
  if (settingsForm) settingsForm.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(settingsForm);
    const payload = {
      season_banner: { title: fd.get("season_banner") || `${SEASON_LABEL} Week 1`, subtitle: APP_NAME },
      home_banner: { headline: fd.get("home_headline") || "Where the NTFL collides", cta: "Commissioner Control Center" },
    };
    await supabase.from("site_settings").upsert([{ key: 'season_banner', value: payload.season_banner }, { key: 'home_banner', value: payload.home_banner }], { onConflict: 'key' });
    location.reload();
  };
}

async function renderAdmin() {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData?.session;
  if (!session && !isDemoActive()) {
    renderLoginBox("Use your Supabase auth email and password.");
    return;
  }
  app.innerHTML = `
    <section class="section">
      <div class="panel">
        <div class="section-head">
          <div>
            <div class="kicker">Commissioner Dashboard</div>
            <h2>Manage the whole league from Supabase</h2>
          </div>
          <button class="btn" id="logoutBtn">Sign out</button>
        </div>
        <div class="grid grid-4">
          <div class="stat"><b>${state.teams.length}</b><span>Teams</span></div>
          <div class="stat"><b>${state.schedule.length}</b><span>Games</span></div>
          <div class="stat"><b>${state.news.length}</b><span>News posts</span></div>
          <div class="stat"><b>${state.rankings.length}</b><span>Rankings</span></div>
        </div>
        <div class="subtle small">The hidden demo login exists in code, but nothing about it is shown on the site.</div>
      </div>
    </section>
    ${adminPlayoffTools()}
    <section class="section">${adminTeamEditor()}</section>
    <section class="section">${adminScheduleEditor()}</section>
    <section class="section">${adminRankingsEditor()}</section>
    <section class="section">${adminPublishers()}</section>
  `;
  document.getElementById("logoutBtn").onclick = async () => {
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    await supabase.auth.signOut();
    location.reload();
  };
  bindAdminActions();
}
function renderLoginPage() {
  renderLoginBox("Commissioner access only.");
}

async function boot() {
  await loadAll();
  navActive();
  const map = {
    index: baseHero,
    teams: renderTeams,
    team: renderTeamPage,
    schedule: renderSchedule,
    standings: renderStandings,
    playoffs: renderPlayoffs,
    rankings: renderRankings,
    news: renderNews,
    awards: renderAwards,
    history: renderHistory,
    rules: renderRules,
    game: renderGame,
    login: renderLoginPage,
    admin: renderAdmin,
  };
  (map[page] || baseHero)();
}

boot();
