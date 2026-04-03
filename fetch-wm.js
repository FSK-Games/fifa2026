const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = "https://api.football-data.org/v4/competitions/WC";

async function fetchJSON(endpoint) {
  const url = `${BASE_URL}/${endpoint}?season=2022`;
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

    if (!data) {
      throw new Error("Empty response from API");
    }

    return data;

  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error.message);
    process.exit(1); // bricht Action ab (wichtig!)
  }
}

(async () => {
  try {
    console.log("🚀 Starting WM 2022 data fetch...");

    // const matches = await fetchJSON("matches");
    // const standings = await fetchJSON("standings");

    const matches = require("./static/matches.json");
    const standings = require("./static/standings.json");

    if (!fs.existsSync("data")) {
      console.log("📁 Creating data folder...");
      fs.mkdirSync("data");
    }

    fs.writeFileSync("data/matches.json", JSON.stringify(matches, null, 2));
    fs.writeFileSync("data/standings.json", JSON.stringify(standings, null, 2));

    console.log("✅ Data successfully written:");
    console.log(`- matches.json (${matches.matches?.length || 0} matches)`);
    console.log(`- standings.json`);

  } catch (error) {
    console.error("🔥 Fatal error:", error.message);
    process.exit(1);
  }
})();
