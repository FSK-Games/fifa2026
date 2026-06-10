const cron = require("node-cron");
const { exec } = require("child_process");

cron.schedule("* * * * *", () => {
  console.log("⏱️ Fetch gestartet...");

  exec("node fetch-wm.js", (err, stdout, stderr) => {
    if (err) console.error("❌ Fehler:", err);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  });
});
