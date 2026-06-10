const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors()); // erlaubt alle Domains

require("./scheduler");
const { exec } = require("child_process");

// 🔥 SOFORT-FETCH BEI START
console.log("🚀 Server startet – initialer Daten-Fetch...");
exec("node fetch-wm.js", (err) => {
  if (err) console.error("Initial Fetch Fehler:", err);
});

app.use("/data", express.static("data"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server läuft auf Port", PORT);
});
