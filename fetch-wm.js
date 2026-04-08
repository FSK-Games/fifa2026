// fetch-wm.js
const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = "https://api.football-data.org/v4/competitions/WC";

// Alle 48 WM 2026 Teams in Deutsch
const teamNamesDE = {
  "Mexico": "Mexiko",
  "Canada": "Kanada",
  "United States": "USA",
  "Cape Verde Islands": "Kap Verde",
  "Czechia": "Tschechien",
  "Haiti": "Haiti",
  "Scotland": "Schottland",
  "Jordan": "Jordanien",
  "South Africa": "Südafrika",
  "Morocco": "Marokko",
  "Senegal": "Senegal",
  "Tunisia": "Tunesien",
  "Egypt": "Ägypten",
  "Croatia": "Kroatien",
  "Ivory Coast": "Elfenbeinküste",
  "Algeria": "Algerien",
  "Germany": "Deutschland",
  "France": "Frankreich",
  "Spain": "Spanien",
  "Bosnia-Herzegovina": "Bosnien-Herzegowina",
  "Portugal": "Portugal",
  "Belgium": "Belgien",
  "Netherlands": "Niederlande",
  "England": "England",
  "Switzerland": "Schweiz",
  "Austria": "Österreich",
  "Brazil": "Brasilien",
  "Argentina": "Argentinien",
  "Uruguay": "Uruguay",
  "Sweden": "Schweden",
  "Colombia": "Kolumbien",
  "Ecuador": "Ecuador",
  "Paraguay": "Paraguay",
  "Japan": "Japan",
  "South Korea": "Südkorea",
  "Congo DR": "DR Kongo",
  "Australia": "Australien",
  "Saudi Arabia": "Saudi-Arabien",
  "Iran": "Iran",
  "Qatar": "Katar",
  "Iraq": "Irak",
  "Uzbekistan": "Usbekistan",
  "Turkey": "Türkei",
  "Norway": "Norwegen",
  "New Zealand": "Neuseeland"
};

// Funktion zum Übersetzen eines Teams
function translateTeam(team) {
  if (!team) return team;
  return {
    ...team,
    name: teamNamesDE[team.name] || team.name
  };
}

// UTC → MESZ konvertieren und Wochentag in "So., 05.04.2026" Format
function convertToMESZWithWeekday(utcDateStr) {
  if (!utcDateStr) return { localDate: null, localTime: null };
  const date = new Date(utcDateStr);

  const optionsTime = { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hour12: false };
  const localTime = date.toLocaleTimeString('de-DE', optionsTime);

  // Wochentag deutsch
  const weekdays = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];
  const weekday = weekdays[date.getDay()];

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const localDate = `${weekday}, ${day}.${month}.${year}`;

  return { localDate, localTime };
}

// Funktion, um JSON von der API zu holen
async function fetchJSON(endpoint) {
  const url = `${BASE_URL}/${endpoint}`;
  console.log(`Fetching: ${url}`);

  try {
    const res = await fetch(url, { headers: { "X-Auth-Token": process.env.API_KEY } });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    return await res.json();
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error.message);
    process.exit(1);
  }
}

// Hauptprogramm
(async () => {
  try {
    console.log("🚀 Starting FIFA World Cup 2026 data fetch...");

    const matches = await fetchJSON("matches");
    const standings = await fetchJSON("standings");

    // Teams und MESZ-Datum mit Wochentag in matches
    matches.matches = matches.matches.map(m => {
      const { localDate, localTime } = convertToMESZWithWeekday(m.utcDate);
      return {
        ...m,
        homeTeam: translateTeam(m.homeTeam),
        awayTeam: translateTeam(m.awayTeam),
        localDate,
        localTime
      };
    });

    // Teams in standings übersetzen
    standings.standings.forEach(group => {
      group.table.forEach(team => {
        team.team = translateTeam(team.team);
      });
    });

    if (!fs.existsSync("data")) fs.mkdirSync("data");

    fs.writeFileSync("data/matches.json", JSON.stringify(matches, null, 2));
    fs.writeFileSync("data/standings.json", JSON.stringify(standings, null, 2));

    console.log("✅ Data successfully written with German team names and MESZ fields (including weekday).");
    console.log(`- matches.json (${matches.matches?.length || 0} matches)`);
    console.log(`- standings.json (${standings.standings?.length || 0} tables)`);

  } catch (error) {
    console.error("🔥 Fatal error:", error.message);
    process.exit(1);
  }
})();
