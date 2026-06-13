const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

app.use(cors());
app.use(express.json({ limit: "15mb" }));

require("./scheduler");
const { exec } = require("child_process");

// 🔥 SOFORT-FETCH BEI START
console.log("🚀 Server startet – initialer Daten-Fetch...");
exec("node fetch-wm.js", (err) => {
  if (err) console.error("Initial Fetch Fehler:", err);
});

// 📦 STATIC DATA (BLEIBT UNVERÄNDERT)
app.use("/data", express.static("data"));

/* =========================================================
   🧪 RISIKOFREIER TEST: RUNTIME WRITE CHECK
   (beeinflusst dein System NICHT)
========================================================= */
app.get("/__test-write", (req, res) => {
  try {
    fs.writeFileSync(
      path.join(__dirname, "data", "__test.txt"),
      "ok " + new Date().toISOString()
    );
    res.send("WRITE OK");
  } catch (err) {
    console.error("WRITE FAILED:", err);
    res.status(500).send("WRITE FAILED");
  }
});

/* =========================================================
   🧪 TEST IMAGE WRITE (SAFE)
========================================================= */
app.get("/__test-image", (req, res) => {
  const fs = require("fs");
  const path = require("path");

  try {
    const filePath = path.join(__dirname, "data", "blitz.png");

    fs.writeFileSync(
      filePath,
      "TEST_IMAGE_" + new Date().toISOString()
    );

    res.send("IMAGE WRITE OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("IMAGE WRITE FAILED");
  }
});

/* =========================================================
   🖼️ IMAGE UPLOAD (noch NICHT im Einsatz)
   -> wird erst genutzt, wenn wir es aktiv einbauen
========================================================= */
app.get("/__write-blitz", (req, res) => {
  const fs = require("fs");
  const path = require("path");

  try {
    const filePath = path.join(__dirname, "data", "blitz.png");

    fs.writeFileSync(filePath, "TEST_OK_" + new Date().toISOString());

    console.log("🧪 blitz.png geschrieben");

    res.send("WRITE OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("WRITE FAILED");
  }
});

/* =========================================================
   SERVER START
========================================================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server läuft auf Port", PORT);
});
