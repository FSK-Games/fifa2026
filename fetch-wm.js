// fetch-wm.js
const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = "https://api.football-data.org/v4/competitions/WC";

// Alle 48 WM 2026 Teams in Deutsch
const teamNamesDE = {
  "Mexico": "Mexiko",
  "Canada": "Kanada",
  "USA": "USA",
  "Cape Verde Islands": "Kapverdische Inseln",
  "Panama": "Panama",
  "Haiti": "Haiti",
  "Jamaica": "Jamaika",
  "Jordan": "Jordanien",
  "South Africa": "Südafrika",
  "Morocco": "Marokko",
  "Senegal": "Senegal",
  "Tunisia": "Tunesien",
  "Egypt": "Ägypten",
  "Ghana": "Ghana",
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
  "Thailand": "Thailand",
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

// Funktion, um JSON von der API zu holen
async function fetchJSON(endpoint) {
  const url = `${BASE_URL}/${endpoint}`;
  console.log(`Fetching: ${url}`);

  try {
    const res = await fetch(url, {
      headers: { "X-Auth-Token": process.env.API_KEY }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
    if (!data) throw new Error("Empty response from API");

    return data;

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

    // Teams in matches übersetzen
    matches.matches = matches.matches.map(m => ({
      ...m,
      homeTeam: translateTeam(m.homeTeam),
      awayTeam: translateTeam(m.awayTeam)
    }));

    // Teams in standings übersetzen
    standings.standings.forEach(group => {
      group.table.forEach(team => {
        team.team = translateTeam(team.team);
      });
    });

    if (!fs.existsSync("data")) {
      console.log("📁 Creating data folder...");
      fs.mkdirSync("data");
    }

    fs.writeFileSync("data/matches.json", JSON.stringify(matches, null, 2));
    fs.writeFileSync("data/standings.json", JSON.stringify(standings, null, 2));

    console.log("✅ Data successfully written with German team names:");
    console.log(`- matches.json (${matches.matches?.length || 0} matches)`);
    console.log(`- standings.json (${standings.standings?.length || 0} tables)`);

  } catch (error) {
    console.error("🔥 Fatal error:", error.message);
    process.exit(1);
  }
})();
