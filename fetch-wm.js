const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = "https://api.football-data.org/v4/competitions/WC";

async function fetchJSON(endpoint) {
  const res = await fetch(`${BASE_URL}/${endpoint}?season=2022`, {
    headers: { "X-Auth-Token": process.env.API_KEY }
  });
  return res.json();
}

(async () => {
  const matches = await fetchJSON("matches");
  const standings = await fetchJSON("standings");

  if (!fs.existsSync("data")) fs.mkdirSync("data");
  fs.writeFileSync("data/matches.json", JSON.stringify(matches, null, 2));
  fs.writeFileSync("data/standings.json", JSON.stringify(standings, null, 2));

  console.log("WM 2022 JSON updated!");
})();
